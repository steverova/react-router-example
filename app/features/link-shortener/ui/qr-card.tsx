import { QRCodeSVG } from 'qrcode.react'
import { DownloadIcon } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'

interface QrCardProps {
	shortUrl: string
	slug: string
}

export function QrCard({ shortUrl, slug }: QrCardProps) {
	const handleDownload = () => {
		const svg = document.getElementById(`qr-${slug}`)
		if (!svg) return
		const serializer = new XMLSerializer()
		const svgString = serializer.serializeToString(svg)
		const blob = new Blob([svgString], { type: 'image/svg+xml' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${slug}.svg`
		link.click()
		URL.revokeObjectURL(url)
	}

	const handleDownloadPng = () => {
		const svg = document.getElementById(`qr-${slug}`)
		if (!svg) return
		const svgData = new XMLSerializer().serializeToString(svg)
		const canvas = document.createElement('canvas')
		const size = 1024
		canvas.width = size
		canvas.height = size
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const img = new Image()
		img.onload = () => {
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, size, size)
			ctx.drawImage(img, 0, 0, size, size)
			canvas.toBlob((blob) => {
				if (!blob) return
				const url = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = url
				link.download = `${slug}.png`
				link.click()
				URL.revokeObjectURL(url)
			}, 'image/png')
		}
		img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>QR Code</CardTitle>
				<CardDescription>Scan to open the short URL.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center gap-4">
				<div className="rounded-lg border bg-background p-4">
					<QRCodeSVG
						id={`qr-${slug}`}
						value={shortUrl}
						size={180}
						level="M"
						includeMargin={false}
					/>
				</div>
				<div className="flex w-full gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={handleDownloadPng}
					>
						<DownloadIcon data-icon="inline-start" />
						PNG
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={handleDownload}
					>
						<DownloadIcon data-icon="inline-start" />
						SVG
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
