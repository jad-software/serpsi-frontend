import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
    	extend: {
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    			'login': 'url(\'/src/app/login/login-bg.png\')',
    			'gradiente-vidro': 'linear-gradient(90.14deg, rgba(0, 153, 216, 0.22) 32.76%, rgba(224, 243, 254, 0.2) 61.12%)'
    		},        
    		colors: {
    			vidro: '#E0F3FE',
    			'primary-950': '#07324A',
    			'primary-900': '#0B4F6F',
    			'primary-800': '#065F86',
    			'primary-700': '#0171A3',
    			'primary-600': '#0099D8',
    			'primary-500': '#0CB1EB',
    			'primary-400': '#36C7FA',
    			'primary-300': '#7CD9FD',
    			'primary-200': '#B9E9FE',
    			'primary-100': '#E0F3FE',
    			'primary-50' : '#F0FAFF',
				'secondary-pink-950': '#54005E',
    			'secondary-pink-900': '#7C0788',
    			'secondary-pink-800': '#9600AA',
    			'secondary-pink-700': '#B300CE',
    			'secondary-pink-600': '#D301F8',
    			'secondary-pink-500': '#EA22FF',
    			'secondary-pink-400': '#F55EFF',
    			'secondary-pink-300': '#F89AFF',
    			'secondary-pink-200': '#F9C6FF',
    			'secondary-pink-100': '#FCE3FF',
    			'secondary-pink-50' : '#FDF2FF',
    			// 'primary-50': '#F0FAFF',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderColor: {
    			'primary-500': '#0CB1EB'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")]
};
export default config;
