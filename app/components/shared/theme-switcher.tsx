import { LaptopMinimal, Moon, Sun } from "lucide-react"

import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { useTheme } from "../providers/theme-provider"

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const options = [
    {
      key: "dark" as const,
      icon: Moon,
    },
    {
      key: "light" as const,
      icon: Sun,
    },
    {
      key: "system" as const,
      icon: LaptopMinimal,
    },
  ]

  return (
    <ButtonGroup className="w-full [&>button]:flex-1">
      {options.map((item) => {
        return (
          <Button
            key={item.key}
            variant={theme === item.key ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(item.key)}
          >
            <item.icon />
          </Button>
        )
      })}
    </ButtonGroup>
  )
}
