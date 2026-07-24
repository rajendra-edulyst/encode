/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: 'jit',
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		'./safelist.txt'
	],
	safelist: [
		'bg-[#BCECFF]',
		'bg-[#FFB3D9]',
		'bg-[#FFF7DA]',
		'bg-[#E6FFCC]'
	],
	darkMode: ['class'],
	theme: {
    	fontFamily: {
    		sans: [
    			'Inter',
    			'ui-sans-serif',
    			'system-ui',
    			'-apple-system',
    			'BlinkMacSystemFont',
    			'Segoe UI',
    			'Roboto',
    			'Helvetica Neue',
    			'Arial',
    			'Noto Sans',
    			'sans-serif',
    			'Apple Color Emoji',
    			'Segoe UI Emoji',
    			'Segoe UI Symbol',
    			'Noto Color Emoji'
    		],
    		jacques: [
    			'Jacques Pro',
    			'ui-sans-serif',
    			'system-ui',
    			'sans-serif'
    		],
    		creative: [
    			'Creative Ligatures',
    			'cursive',
    			'ui-serif',
    			'serif'
    		],
    		serif: [
    			'ui-serif',
    			'Georgia',
    			'Cambria',
    			'Times New Roman',
    			'Times',
    			'serif'
    		],
    		mono: [
    			'ui-monospace',
    			'SFMono-Regular',
    			'Menlo',
    			'Monaco',
    			'Consolas',
    			'Liberation Mono',
    			'Courier New',
    			'monospace'
    		],
    		poppins: [
    			'Poppins',
    			'sans-serif'
    		],
    		'jacques-pro': [
    			'Jacques Pro',
    			'sans-serif'
    		],
    		'creative-ligatures-demo': [
    			'Creative Ligatures Demo',
    			'cursive'
    		]
    	},
    	screens: {
    		xs: '576px',
    		sm: '640px',
    		md: '768px',
    		lg: '1024px',
    		xl: '1280px',
    		'2xl': '1536px'
    	},
    	extend: {
    		colors: {
    			codeblue: '#009BD8',
    			codepink: '#E60086',
    			codegreen: '#7FBC42',
    			codeyellow: '#FFEC00',
    			dimgray: {
    				'100': '#696969',
    				'200': '#606060',
    				'300': '#5a5a5a'
    			},
    			yellow: {
    				'100': '#ffec00',
    				'200': 'rgba(255, 236, 0, 0.2)'
    			},
    			goldenrod: '#ffc531',
    			darkslategray: '#273454',
    			gold: '#e6d400',
    			primary: {
    				DEFAULT: 'var(--primary)',
    				foreground: 'var(--primary-foreground)'
    			},
    			'primary-deep': 'var(--primary-deep)',
    			'primary-mild': 'var(--primary-mild)',
    			'primary-subtle': 'var(--primary-subtle)',
    			error: 'var(--error)',
    			'error-subtle': 'var(--error-subtle)',
    			success: 'var(--success)',
    			'success-subtle': 'var(--success-subtle)',
    			info: 'var(--info)',
    			'info-subtle': 'var(--info-subtle)',
    			warning: 'var(--warning)',
    			'warning-subtle': 'var(--warning-subtle)',
    			neutral: 'var(--neutral)',
    			'gray-50': 'var(--gray-50)',
    			'gray-100': 'var(--gray-100)',
    			'gray-200': 'var(--gray-200)',
    			'gray-300': 'var(--gray-300)',
    			'gray-400': 'var(--gray-400)',
    			'gray-500': 'var(--gray-500)',
    			'gray-600': 'var(--gray-600)',
    			'gray-700': 'var(--gray-700)',
    			'gray-800': 'var(--gray-800)',
    			'gray-900': 'var(--gray-900)',
    			'gray-950': 'var(--gray-950)',
    			background: 'var(--background)',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'var(--card)',
    				foreground: 'var(--card-foreground)'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
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
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		spacing: {
    			'num-30': '30px',
    			'num-53': '53px',
    			'num-30_7': '30.7px',
    			'num-118': '118px',
    			'num-307': '307px'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)',
    			'num-6': '6px',
    			'num-20': '20px',
    			'num-50': '50%',
    			'num-10': '10px',
    			'num-15_3': '15.3px'
    		},
    		padding: {
    			'num-0': '0',
    			'num-8': '8px',
    			'num-10': '10px',
    			'num-20': '20px',
    			'num-22': '22px',
    			'num-3': '3px',
    			'num-01': '0px',
    			'num-1': '1px',
    			'num-21': '21px',
    			'num-30': '30px',
    			'num-26': '26px'
    		},
    		fontSize: {
    			'num-14': '14px',
    			'num-24': '24px',
    			'num-16': '16px',
    			'num-20': '20px',
    			'num-19': '19px',
    			'num-32': '32px',
    			'num-26': '26px'
    		},
    		lineHeight: {
    			'num-20': '20px'
    		},
    		package: {
    			blue: 'hsl(var(--package-blue))',
    			magenta: 'hsl(var(--package-magenta))',
    			green: 'hsl(var(--package-green))',
    			yellow: 'hsl(var(--package-yellow))'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [
		require('@tailwindcss/typography'),
		require("tailwindcss-animate")
	],
};