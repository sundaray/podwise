import { cn } from "@/lib/utils";

type SuccessMessageProps = {
  id: string;
  message?: string | null;
  className?: string;
};

export function SuccessMessage({
  id,
  message,
  className,
}: SuccessMessageProps) {
  // Define base classes that will always be applied
  const baseClasses =
    "min-h-[20px] duration-200 text-sm text-green-600 ease-out animate-in fade-in-0 slide-in-from-left-1";

  // If no message, just render an empty container with the minimum height
  if (!message) {
    return <div id={id} className={cn(baseClasses, className)}></div>;
  }

  // Return the success message
  return (
    <p id={id} className={cn(baseClasses, className)}>
      {message}
    </p>
  );
}
