/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			boxShadow: {
				centered: '0 0 10px -5px rgba(0, 0, 0, 0.4)',
				card: '0 2px 10px 0 rgba(0, 0, 0, 0.1)'
			},
			colors: {
				'primary-main': '#4EA40F',
				'primary-click': '#3F830D',
				'primary-2': '#1B5F04',
				'primary-3': '#297607',
				'primary-border': '#AAE367',
				'primary-surface': '#EAFACC',
				'danger-main': '#DB303E',
				'danger-surface': '#FDE0D5',
				'neutral-stroke': '#898989',
				'neutral-main': '#212121',
				'neutral-1': '#212121',
				'neutral-2': '#323232',
				'neutral-3': '#505050',
				'neutral-4': '#656565',
				'neutral-6': '#B0B0B0',
				'neutral-border': '#D2D2D2',
				'neutral-8': '#E7E7E7',
				'background': '#F8F8F8',
				'info-main': '#1766D6',
				'info-6': '#4C92E6',
				'info-border': '#70B1F2',
				'warning-main': '#F9C004',
				'warning-surface': '#FFF9F2',
				'warning-hover': '#D69F02',
				'warning-6': '#FBD441',
				'cool-gray-1': '#4D5358',
				'cool-gray-2': '#637381',
				'cool-gray-3': '#DADFE4',
				'success-main': '#3DBF2B',
				'success-hover': '#25A41F'
			},
			fontSize: {
				xxs: ['0.625rem', '0.75rem'],
				'2.5xl': ['1.75rem', '2rem']
			}
		}
	},

	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class'
		}),
		require('@tailwindcss/typography')
	]
};
