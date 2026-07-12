import { randomBytes, randomInt, randomUUID } from 'node:crypto'

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{}<>?'

export function uuid(): string {
	return randomUUID()
}

export function randomDigits(length: number): string {
	if (!Number.isInteger(length) || length < 1 || length > 15) {
		throw new Error('length debe ser un entero entre 1 y 15')
	}

	const min = length === 1 ? 0 : 10 ** (length - 1)
	const max = 10 ** length

	return randomInt(min, max).toString()
}

export function randomString(length = 21): string {
	if (!Number.isInteger(length) || length < 1) {
		throw new Error('length debe ser un entero mayor a 0')
	}

	const bytes = Math.ceil((length * 3) / 4)

	return randomBytes(bytes).toString('base64url').slice(0, length)
}

export function generatePassword({
	length = 16,
	uppercase = true,
	lowercase = true,
	numbers = true,
	symbols = true
}: {
	length?: number
	uppercase?: boolean
	lowercase?: boolean
	numbers?: boolean
	symbols?: boolean
} = {}): string {
	if (length < 4) {
		throw new Error('length debe ser al menos 4')
	}

	let pool = ''
	const password: string[] = []

	if (uppercase) {
		pool += UPPERCASE
		password.push(randomChar(UPPERCASE))
	}

	if (lowercase) {
		pool += LOWERCASE
		password.push(randomChar(LOWERCASE))
	}

	if (numbers) {
		pool += NUMBERS
		password.push(randomChar(NUMBERS))
	}

	if (symbols) {
		pool += SYMBOLS
		password.push(randomChar(SYMBOLS))
	}

	if (!pool) {
		throw new Error('Debe habilitar al menos un tipo de carácter')
	}

	while (password.length < length) {
		password.push(randomChar(pool))
	}

	for (let i = password.length - 1; i > 0; i--) {
		const j = randomInt(i + 1)
		const tmp = password[i] ?? ''
		password[i] = password[j] ?? ''
		password[j] = tmp
	}

	return password.join('')
}

function randomChar(chars: string): string {
	return chars[randomInt(chars.length)] ?? ''
}
