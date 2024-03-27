import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Credit to @shadcn/ui for this utility function.
 *
 * A utility function to merge Tailwind CSS classes conflict free.
 * @param classes The classes to merge. Can be a string or an array, or an object.
 * @returns The merged classes.
 *
 * @example
 * ```tsx
 *  const baseClassName = "bg-red-500";
 *  const className = "bg-blue-500";
 *
 *  const isPending = true;
 *
 *  <div className={cn(baseClasses, className, { "bg-blue-400": isPending })}>
 *    Hello, world!
 *  </div>
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}
