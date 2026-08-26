import { ImageOffIcon, Link2Icon } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'

interface OgPreviewCardProps {
	imageUrl: string | null
	destinationUrl: string
}

export function OgPreviewCard({ imageUrl, destinationUrl }: OgPreviewCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Destination preview</CardTitle>
				<CardDescription className="flex items-center gap-1 truncate">
					<Link2Icon className="size-3 shrink-0" />
					<span className="truncate">{destinationUrl}</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				{imageUrl ? (
					<div className="overflow-hidden rounded-lg border bg-muted">
						<img
							src={imageUrl}
							alt="Destination preview"
							className="aspect-video w-full object-cover"
						/>
					</div>
				) : (
					<div className="flex aspect-video w-full items-center justify-center gap-2 rounded-lg border bg-muted text-muted-foreground">
						<ImageOffIcon />
						<span className="text-sm">No preview available</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
