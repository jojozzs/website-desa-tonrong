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

                // DESA TONRONG COLORS - menggunakan CSS variables
                'primary-orange': 'var(--primary-orange)',        // Main orange brand color
                'primary-green': 'var(--primary-green)',          // Main green brand color
                
                // BUTTON STATES
                'button-orange': 'var(--button-orange)',          // Default orange button
                'button-orange-hover': 'var(--button-orange-hover)', // Orange button hover
                'button-orange-active': 'var(--button-orange-active)', // Orange button active/pressed
                'button-green': 'var(--button-green)',            // Default green button
                'button-green-hover': 'var(--button-green-hover)', // Green button hover
                'button-green-active': 'var(--button-green-active)', // Green button active/pressed
                
                // BACKGROUND COLORS
                'bg-orange-light': 'var(--bg-orange-light)',      // Very light orange background
                'bg-orange-soft': 'var(--bg-orange-soft)',        // Light orange background
                'bg-green-light': 'var(--bg-green-light)',        // Very light green background
                'bg-green-soft': 'var(--bg-green-soft)',          // Light green background
                'bg-gray-light': 'var(--bg-gray-light)',          // Very light gray background
                'bg-gray-soft': 'var(--bg-gray-soft)',            // Light gray background
                
                // TEXT COLORS
                'text-primary': 'var(--text-primary)',            // Primary heading text (dark)
                'text-secondary': 'var(--text-secondary)',        // Secondary text
                'text-muted': 'var(--text-muted)',                // Muted/disabled text
                'text-light': 'var(--text-light)',                // Light text for placeholders
                
                // NAVIGATION COLORS
                'nav-active': 'var(--nav-active)',                // Active navigation item
                'nav-hover': 'var(--nav-hover)',                  // Navigation hover state
                'nav-default': 'var(--nav-default)',              // Default navigation text
                'nav-bg': 'var(--nav-bg)',                        // Navigation background
                'nav-border': 'var(--nav-border)',                // Navigation border
                
                // BORDER COLORS
                'border-light': 'var(--border-light)',            // Light border
                'border-medium': 'var(--border-medium)',          // Medium border
                'border-dark': 'var(--border-dark)',              // Dark border
                
                // ACCENT COLORS
                'accent-orange': 'var(--accent-orange)',          // Accent orange
                'accent-green': 'var(--accent-green)',            // Accent green
                
                // DROPDOWN COLORS
                'dropdown-bg': 'var(--dropdown-bg)',              // Dropdown background
                'dropdown-hover': 'var(--dropdown-hover)',        // Dropdown item hover
                'dropdown-active': 'var(--dropdown-active)',      // Dropdown active item
                'dropdown-border': 'var(--dropdown-border)',      // Dropdown border
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
            maxWidth: {
                '8xl': 'var(--max-w-8xl)',
            },
            minWidth: {
                '8xl': 'var(--min-w-8xl)',
            },
        },
    },
    plugins: [],
};
export default config;