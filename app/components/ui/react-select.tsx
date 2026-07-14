import { useState, useEffect } from "react"
import ReactSelectBase, { type Props as ReactSelectProps } from "react-select"
import { cn } from "~/lib/utils"

function ReactSelect(props: ReactSelectProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex w-full items-center rounded-md border border-input bg-background",
          "py-2 px-2.5 text-sm shadow-xs h-10"
        )}
      >
        {props.value && "label" in (props.value as object)
          ? (props.value as { label: string }).label
          : props.placeholder ?? ""}
      </div>
    )
  }

  return (
    <ReactSelectBase
      classNamePrefix="react-select"
      classNames={{
        control: (state) =>
          cn(
            "!flex !w-full !items-center !justify-between !gap-1.5",
            "!rounded-md !border !border-input !bg-background",
            "!py-2 !px-2.5 !text-sm",
            "!shadow-xs !transition-colors",
            "!outline-none",
            state.isFocused &&
              "!border-ring !ring-2 !ring-ring/20",
            state.isDisabled &&
              "!cursor-not-allowed !opacity-50"
          ),
        menu: () =>
          cn(
            "!absolute !z-50 !mt-1 !w-full !overflow-hidden",
            "!rounded-md !border !border-border",
            "!bg-background !shadow-md"
          ),
        menuList: () =>
          cn("!max-h-60 !overflow-y-auto !p-1"),
        option: (state) =>
          cn(
            "!relative !flex !w-full !cursor-default !items-center",
            "!gap-2 !rounded-sm !py-1.5 !px-2 !text-sm",
            "!outline-none !select-none",
            state.isFocused &&
              "!bg-accent !text-accent-foreground",
            state.isSelected &&
              "!bg-primary !text-primary-foreground"
          ),
        singleValue: () =>
          cn("!flex !flex-1 !gap-1.5 !truncate !text-foreground"),
        valueContainer: () =>
          cn("!flex !flex-1 !flex-wrap !gap-1"),
        placeholder: () =>
          cn("!text-muted-foreground"),
        input: () =>
          cn("!text-sm !text-foreground !m-0 !p-0"),
        indicatorSeparator: () =>
          cn("!hidden"),
        dropdownIndicator: () =>
          cn("!text-muted-foreground"),
        noOptionsMessage: () =>
          cn("!text-muted-foreground !text-sm"),
        multiValue: () =>
          cn("!flex !items-center !gap-1 !rounded !bg-secondary !px-1.5 !py-0.5 !text-sm"),
        multiValueLabel: () =>
          cn("!text-secondary-foreground"),
        multiValueRemove: () =>
          cn("!cursor-pointer !rounded-sm !text-muted-foreground hover:!bg-destructive/10 hover:!text-destructive"),
        ...props.classNames,
      }}
      className={cn("w-full", props.className)}
      {...props}
    />
  )
}

export { ReactSelect }
export type { ReactSelectProps }
