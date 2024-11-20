"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const sortingtype = [
  {
    value: "sort-by-newest",
    label: "Paling Baru",
  },
  {
    value: "sort-by-oldest",
    label: "Paling Lama",
  },
  {
    value: "sort-by-name-ascending",
    label: "Berdasarkan Nama (A-Z)",
  },
  {
    value: "sort-by-name-descending",
    label: "Berdasarkan Nama (Z-A)",
  },
]

export function ComboboxSortContact({
  onSortChange,
}: {
  onSortChange: (sortType: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? sortingtype.find((sortingtype) => sortingtype.value === value)?.label
            : "Pilih Metode Pengurutan..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Ga Nemu.</CommandEmpty>
            <CommandGroup>
              {sortingtype.map((sortingtype) => (
                <CommandItem
                  key={sortingtype.value}
                  value={sortingtype.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    onSortChange(newValue); // Notify parent about sorting change
                    setOpen(false);
                  }}
                >
                  {sortingtype.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === sortingtype.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
