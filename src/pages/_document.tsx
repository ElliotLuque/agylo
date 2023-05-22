import { Head, Html, Main, NextScript } from 'next/document'

const NextDocument = () => {
	return (
		<Html>
			<Head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' />
				<link
					href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&display=swap'
					rel='stylesheet'
				></link>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

export default NextDocument
