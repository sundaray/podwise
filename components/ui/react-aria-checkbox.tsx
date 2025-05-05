"use client";

import { Check } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps,
} from "react-aria-components";

export function ReactAriaCheckbox(props: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      slot="selection" // required when used in GridList / GridListItem
      // className as function so we get RAC state flags
      className={({ isSelected, isFocusVisible }) =>
        [
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
          isSelected ? "border-sky-600 bg-white" : "border-gray-300",
          isFocusVisible ? "ring-2 ring-sky-600 ring-offset-2" : "",
        ].join(" ")
      } 
    >
      {({ isSelected }) =>
        isSelected && <Check className="size-3 text-sky-600" strokeWidth={3} />
      }
    </AriaCheckbox>
  );
}
