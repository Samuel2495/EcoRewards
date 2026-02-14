/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10B981', // Emerald 500
                secondary: '#059669', // Emerald 600
                dark: '#1F2937', // Gray 800
                light: '#F3F4F6', // Gray 100
                'd-black': '#191414',
                'd-sec-black': '#121212',
                'd-green': '#00a86b',
            }
        },
    },
    plugins: [],
}
