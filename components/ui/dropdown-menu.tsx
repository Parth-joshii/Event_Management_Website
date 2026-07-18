"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/** Renders the floating dropdown menu content surface. */
export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/** Renders a standard dropdown menu item. */
export function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  readonly inset?: boolean;
  readonly variant?: "default" | "destructive";
}): React.ReactElement {
  return (
    <DropdownMenuPrimitive.Item
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        "focus:bg-accent/12 focus:text-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset=true]:pl-8 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

/** Renders a checkbox dropdown menu item. */
export function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  ...props
}: React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent/12 focus:text-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/** Renders a radio dropdown menu item. */
export function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent/12 focus:text-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle aria-hidden="true" className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/** Renders a dropdown label row. */
export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  readonly inset?: boolean;
}): React.ReactElement {
  return (
    <DropdownMenuPrimitive.Label
      data-inset={inset}
      data-slot="dropdown-menu-label"
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8",
        className
      )}
      {...props}
    />
  );
}

/** Renders a visual separator inside a dropdown. */
export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

/** Renders a keyboard shortcut hint inside dropdown items. */
export function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
}

/** Renders nested dropdown content. */
export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

/** Renders the trigger row for nested dropdowns. */
export function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  readonly inset?: boolean;
}): React.ReactElement {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "focus:bg-accent/12 focus:text-foreground data-[state=open]:bg-accent/12 flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset=true]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}
