/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './app/**/*.{vue,js,ts}',
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: {
                    950: '#000000',
                    900: '#050505',
                    800: '#0a0a0a',
                    700: '#111111',
                    600: '#161616',
                    500: '#1c1c1c',
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
            },
        },
    },
    plugins: [],
}
