import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer, { type SentMessageInfo, type Transporter } from 'nodemailer'
import { env } from '~/config/env'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export interface SendEmailOptions {
	to: string
	subject: string
	templateName: string
	variables?: Record<string, string>
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

class EmailService {
	private transporter: Transporter | null = null

	async initialize(): Promise<void> {
		const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = env

		try {
			this.transporter = nodemailer.createTransport({
				host: EMAIL_HOST,
				port: Number(EMAIL_PORT),
				secure: Number(EMAIL_PORT) === 465,
				auth: {
					user: EMAIL_USER!,
					pass: EMAIL_PASS,
				},
			})

			await this.transporter.verify()
			console.log('✅ EmailService inicializado')
		} catch (error) {
			this.transporter = null
			throw new Error(
				`No se pudo inicializar EmailService: ${(error as Error).message}`,
			)
		}
	}

	async sendEmail({
		to,
		subject,
		templateName,
		variables = {},
	}: SendEmailOptions): Promise<SentMessageInfo> {
		if (!this.transporter) {
			await this.initialize()
		}

		const templatePath = join(__dirname, 'templates', `${templateName}.html`)

		let htmlContent: string
		try {
			htmlContent = await readFile(templatePath, 'utf-8')
		} catch {
			throw new Error(`Template de email no encontrado: ${templateName}`)
		}

		Object.keys(variables).forEach((key) => {
			const value = variables[key]
			htmlContent = htmlContent.replace(
				new RegExp(`{{${key}}}`, 'g'),
				escapeHtml(value ?? ''),
			)
		})

		try {
			const info = await this.transporter!.sendMail({
				from: `"${env.EMAIL_FROM}" <${env.EMAIL_FROM}>`,
				to,
				subject,
				html: htmlContent,
			})
			return info
		} catch (error) {
			throw new Error(`Error al enviar email: ${(error as Error).message}`)
		}
	}
}

export default EmailService
export const emailService = new EmailService()
