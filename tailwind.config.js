/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // PRIMARY – Curry Leaf Green (Nature, Fresh, Vegetarian)
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // PRIMARY - Main brand color
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // SECONDARY – Ocean Blue (Trust, Calm, Professional)
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // SECONDARY - Main secondary color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // HIGHLIGHT – Saffron Gold (Warmth, Appetite, Cultural)
        saffron: {
          50: '#fff8e7',
          100: '#ffefc4',
          200: '#ffe4a0',
          300: '#ffd670',
          400: '#ffc940',
          500: '#f4c430', // HIGHLIGHT - Accent color
          600: '#e0a820',
          700: '#c08810',
          800: '#9a6d08',
          900: '#6b4c05',
          950: '#4a3403',
        },
        // Neutrals – Warm Cream (Comfort & Cleanliness)
        neutral: {
          0: '#ffffff',
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f1eb',
          300: '#e8e2d8',
          400: '#d4c9b8',
          500: '#b8a890',
          600: '#9a8a72',
          700: '#7a6d5a',
          800: '#5a5045',
          900: '#3d3630',
          950: '#2a241f',
        },
        // Semantic colors with WCAG AA compliant contrast ratios
        primary: {
          DEFAULT: '#16a34a', // Darker green for better contrast (was #22c55e)
          foreground: '#ffffff', // White text on green background
        },
        secondary: {
          DEFAULT: '#1d4ed8', // Darker blue for better contrast (was #2563eb)
          foreground: '#ffffff', // White text on blue background
        },
        accent: {
          DEFAULT: '#c08810', // Darker saffron for better contrast (was #f4c430)
          foreground: '#ffffff', // White text on saffron background
        },
        muted: {
          DEFAULT: '#f5f1eb', // Light neutral background
          foreground: '#5a5045', // Dark text for high contrast (was #9a8a72)
        },
        destructive: {
          DEFAULT: '#dc2626', // Darker red for better contrast (was #ef4444)
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#16a34a', // Green for success states
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#d97706', // Amber for warnings
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#0284c7', // Cyan for info
          foreground: '#ffffff',
        },
        // Background and foreground with proper contrast
        background: '#fdfcfb', // Light warm cream
        foreground: '#2a241f', // Very dark neutral for maximum contrast (was #3d3630)

        // Card colors
        card: {
          DEFAULT: '#ffffff', // Pure white cards
          foreground: '#2a241f', // Very dark text on cards
        },

        // Border and input colors
        border: '#d4c9b8', // More visible border (was #f5f1eb)
        input: '#f5f1eb', // Light input background
        ring: '#16a34a', // Focus ring color

        // Text color utilities for different backgrounds
        'text-on-light': '#2a241f', // Dark text on light backgrounds
        'text-on-dark': '#fdfcfb', // Light text on dark backgrounds
        'text-on-primary': '#ffffff', // White text on primary green
        'text-on-secondary': '#ffffff', // White text on secondary blue
        'text-on-accent': '#ffffff', // White text on accent saffron
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '40px',
        full: '9999px',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'Lato', 'sans-serif'],
      },
      fontSize: {
        // Ensure readable font sizes on mobile
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
  presets: [require('nativewind/preset')],
};
