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
        aa: {
          orange: {
            DEFAULT: '#FF6B00',
            glow: 'rgba(255, 107, 0, 0.5)',
            dim: 'rgba(255, 107, 0, 0.1)',
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
            DEFAULT: '#050505', // Deep black
            secondary: '#0A0A0A',
            tertiary: '#121212',
            400: '#2d2d2d',
            500: '#1a1a1a', 
          },
          gold: {
            DEFAULT: '#FFD700',
            dim: 'rgba(255, 215, 0, 0.1)',
          },
          success: '#00C853',
          error: '#FF4444',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'aa-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FFD700 100%)',
        'aa-gradient-dark': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
        'radial-glow': 'radial-gradient(circle at center, rgba(255, 107, 0, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'aa-glow': '0 0 40px rgba(255, 107, 0, 0.15)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
