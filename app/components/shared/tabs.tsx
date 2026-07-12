import type { ReactNode } from 'react'
import { parseAsString, useQueryState } from 'nuqs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

interface Tab {
	key: string
	label: string
	icon?: ReactNode
	content: ReactNode
}

interface TabsUrlProps {
	tabs: Tab[]
	defaultTab?: string
	paramName?: string
}

export function TabsUrl({
	tabs,
	defaultTab = tabs[0]?.key,
	paramName = 'tab'
}: TabsUrlProps) {
	const [activeTab, setActiveTab] = useQueryState(
		paramName,
		parseAsString.withDefault(defaultTab)
	)

	return (
		<Tabs
			value={activeTab ?? defaultTab}
			onValueChange={(value) => setActiveTab(value)}
		>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.key} value={tab.key}>
						{tab.icon}
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.key} value={tab.key}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	)
}
