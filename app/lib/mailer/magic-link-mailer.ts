import { emailService } from './email.service'

export async function sendMagicLinkEmail(to: string, link: string) {
	await emailService.sendEmail({
		subject: 'Tu enlace mágico para iniciar sesión',
		to,
		variables: {
			link,
		},
		templateName: 'magic-link.template',
	})
}

export async function sendSignInCodeEmail(to: string, code: string) {
	const digits = code.split('')
	await emailService.sendEmail({
		subject: 'Tu código de verificación',
		to,
		variables: {
			n1: digits[0] ?? '',
			n2: digits[1] ?? '',
			n3: digits[2] ?? '',
			n4: digits[3] ?? '',
			n5: digits[4] ?? '',
			n6: digits[5] ?? '',
		},
		templateName: 'sign-in-code.template',
	})
}
