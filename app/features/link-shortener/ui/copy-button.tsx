import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'

interface CopyButtonProps {
	value: string
	label?: string
	variant?: 'default' | 'outline' | 'ghost'
	size?: 'default' | 'sm' | 'xs' | 'icon' | 'icon-sm'
	className?: string
}

export function CopyButton({
	value,
	label = 'Copy',
	variant = 'outline',
	size = 'sm',
	className,
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			toast.success('Copied to clipboard')
			setTimeout(() => setCopied(false), 1500)
		} catch {
			toast.error('Could not copy')
		}
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleCopy}
			className={className}
			aria-label={label}
		>
			{copied ? (
				<CheckIcon data-icon="inline-start" />
			) : (
				<CopyIcon data-icon="inline-start" />
			)}
			<span className="hidden md:inline">{copied ? 'Copied' : label}</span>
		</Button>
	)
}
