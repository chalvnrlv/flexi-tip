/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./backend/**/*.{js,ts,jsx,tsx}", // Just in case, though usually backend doesn't have UI
        "./*.{js,ts,jsx,tsx}", // For App.tsx, index.tsx in root
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                brand: {
                    light: '#FAFF09',
                    medium: '#159946',
                    dark: '#06373B',
                    darkest: '#1a1a1a',
                }
            }
        },
    },
    plugins: [],
}
