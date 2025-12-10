/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Affiliate Automated Brand Colors
        aa: {
          orange: {
            DEFAULT: '#FF6B00',
            50: '#FFF4EB',
            100: '#FFE4CC',
            200: '#FFC999',
            300: '#FFAD66',
            400: '#FF8C33',
            500: '#FF6B00',
            600: '#CC5500',
            700: '#994000',
            800: '#662B00',
            900: '#331500',
          },
          dark: {
            DEFAULT: '#1a1a1a',
            50: '#f5f5f5',
            100: '#e0e0e0',
            200: '#b3b3b3',
            300: '#808080',
            400: '#4d4d4d',
            500: '#2d2d2d',
            600: '#1a1a1a',
            700: '#141414',
            800: '#0d0d0d',
            900: '#000000',
          },
          gold: {
            DEFAULT: '#FFD700',
            50: '#FFFBE5',
            100: '#FFF7CC',
            200: '#FFEF99',
            300: '#FFE766',
            400: '#FFDF33',
            500: '#FFD700',
            600: '#CCAC00',
            700: '#998100',
            800: '#665600',
            900: '#332B00',
          },
          success: {
            DEFAULT: '#00C853',
            50: '#E5FFF0',
            100: '#CCFFE0',
            200: '#99FFC2',
            300: '#66FFA3',
            400: '#33FF85',
            500: '#00C853',
            600: '#00A042',
            700: '#007832',
            800: '#005021',
            900: '#002811',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-cabinet)', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aa-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FFD700 100%)',
        'aa-gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 0, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255, 107, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'aa': '0 4px 14px 0 rgba(255, 107, 0, 0.25)',
        'aa-lg': '0 10px 40px 0 rgba(255, 107, 0, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
