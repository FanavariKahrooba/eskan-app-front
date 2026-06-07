// src/features/data-grid/core/theme/tokens.ts

export const tableTheme = {
    root: `
    bg-white text-gray-900 border border-gray-200
    dark:bg-neutral-950 dark:text-neutral-100 dark:border-neutral-800
  `,
    toolbar: `
    bg-white border-b border-gray-200
    dark:bg-neutral-950 dark:border-neutral-800
  `,
    table: `
    bg-white
    dark:bg-neutral-950
  `,
    header: `
    bg-gray-50 text-gray-900
    dark:bg-neutral-900 dark:text-neutral-100
  `,
    headerCell: `
    border-b border-gray-200 text-gray-900
    dark:border-neutral-800 dark:text-neutral-100
  `,
    row: `
    bg-white hover:bg-gray-50
    dark:bg-neutral-950 dark:hover:bg-neutral-900
  `,
    cell: `
    border-b border-gray-200 text-gray-800
    dark:border-neutral-800 dark:text-neutral-200
  `,
    empty: `
    text-gray-500
    dark:text-neutral-400
  `,
    input: `
    border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400
    focus:border-gray-400 focus:ring-2 focus:ring-gray-200
    dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-800
  `,
    pagination: `
    border-t border-gray-200 bg-white text-gray-700
    dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300
  `,
    button: `
    border border-gray-300 bg-white text-gray-800
    dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
  `,
    resizeHandle: `
    bg-transparent hover:bg-blue-500/20
    dark:hover:bg-blue-400/20
  `,
    dragOverlay: `
    bg-white shadow-lg border border-gray-200
    dark:bg-neutral-900 dark:border-neutral-700
  `,
}
