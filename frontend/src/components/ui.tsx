import React from "react";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline";
    size?: "default" | "lg";
    asChild?: boolean;
  }
>(({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
  const variants = {
    default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    outline:
      "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
  };
  const sizes = { default: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };
  const cls = cn(base, variants[variant], sizes[size], className);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(cls, (children.props as any).className),
    });
  }
  return (
    <button ref={ref} className={cls} {...props}>
      {children}
    </button>
  );
});
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-sm",
        className
      )}
      {...props}
    />
  );
}
