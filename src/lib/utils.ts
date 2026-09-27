import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge v2 (Tailwind v3) taught Denly's named type sizes, so `text-body` merges as a
 * font size and does not knock out a colour like `text-foreground`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'large-title',
            'title-1',
            'title-2',
            'title-3',
            'body',
            'callout',
            'subhead',
            'footnote',
            'caption',
            'caption-2',
          ],
        },
      ],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
