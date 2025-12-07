
import { MOCK_PRODUCTS, filterProducts } from '../src/mockData';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateAssistantResponse = async (
  query: string,
  context: 'local' | 'global'
): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      return "API Key Gemini belum dikonfigurasi. Silakan tambahkan VITE_GEMINI_API_KEY di file .env";
    }

    // Filter produk berdasarkan context
    const products = filterProducts({ type: context });

    // Buat context untuk Gemini tentang produk yang tersedia
    const productContext = products.slice(0, 10).map(p =>
      `- ${p.name} (${p.brand}) dari ${p.asalProduk} ke ${p.tujuanProduk}, Rp ${p.price.toLocaleString('id-ID')}`
    ).join('\n');

    const systemPrompt = `Kamu adalah asisten FlexiTip, platform jastip Indonesia. 
    
Kamu membantu customer menemukan produk ${context === 'local' ? 'lokal dari berbagai kota di Indonesia' : 'global dari luar negeri'}.

Berikut beberapa produk yang tersedia:
${productContext}

Berikan rekomendasi produk, informasi jastiper, atau tips belanja jastip dengan ramah dan informatif dalam bahasa Indonesia.
Fokus pada produk ${context === 'local' ? 'lokal Indonesia' : 'dari luar negeri'} yang sesuai pertanyaan user.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nPertanyaan user: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error Response:", data.error);
      return `Maaf, terjadi kesalahan: ${data.error.message} (Code: ${data.error.code})`;
    }

    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn("Gemini Debug: Candidates empty. Safety ratings might be blocking. Response:", data);
      return "Maaf, saya tidak dapat memproses pertanyaan ini (Safety Block atau Empty Response).";
    }

  } catch (error) {
    console.error("Gemini API Network/System Error:", error);
    return "Terjadi kesalahan koneksi ke asisten AI.";
  }
};
