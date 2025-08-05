import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'dark-green': 'var(--dark-green)',
                'dark-blue': 'var(--dark-blue)',
                'light-blue': 'var(--light-blue)',
                'turquoise': 'var(--turquoise)',
                'red-maroon': 'var(--red-maroon)',
                'yellow-gold': 'var(--yellow-gold)',
                'lightGreen': 'var(--lightGreen)',
                'steelBlue': 'var(--steelBlue)',
            },
            height: {
                '70': '18rem',
                '75': '20rem',
                '80': '22rem',
                '85': '24rem',
                '100': '26rem',
                '105': '28rem',
                '128': '32rem',
            },
            borderRadius: {
                '5xl': 'var(--radius-5xl)',
                '6xl': 'var(--radius-6xl)',
                '9xl': 'var(--radius-9xl)',
            },
        },
    },
    plugins: [],
};
export default config;