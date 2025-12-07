
const API_URL = 'http://localhost:5000/api';

export const generateAssistantResponse = async (
  query: string,
  context: 'local' | 'global'
): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return "Please login to chat with the assistant.";
    }

    const response = await fetch(`${API_URL}/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: query })
    });

    const data = await response.json();

    if (data.success) {
      return data.data.content;
    } else {
      return "Sorry, I am having trouble responding right now.";
    }

  } catch (error) {
    console.error("Backend Chat Error:", error);
    return "Network error. Please try again.";
  }
};