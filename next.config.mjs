// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'))

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	images: {
		domains: [
			'images.unsplash.com',
			'avatars.githubusercontent.com',
			'lh3.googleusercontent.com',
			'cdn-icons-png.flaticon.com',
			'images-image-uploader.up.railway.app',
		],
	},
}
export default config
