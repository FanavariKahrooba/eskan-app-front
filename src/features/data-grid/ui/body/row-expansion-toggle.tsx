'use client';
import { motion } from 'framer-motion';
import { DataGridIcon } from '../shared';

export interface RowExpansionToggleProps {
  expanded?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  onToggle?: () => void;
}

export function RowExpansionToggle({
  expanded = false,
  disabled,
  label = 'نمایش جزئیات',
  className = '',
  onToggle,
}: RowExpansionToggleProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.08 } : undefined}
      whileTap={!disabled ? { scale: 0.9 } : undefined}
      onClick={(event) => {
        event.stopPropagation();
        onToggle?.();
      }}
      className={[
        'grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition',
        'hover:bg-indigo-50 hover:text-indigo-700',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/15',
        'disabled:pointer-events-none disabled:opacity-40',
        className,
      ].join(' ')}
    >
      <motion.span
        animate={{ rotate: expanded ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      >
        <DataGridIcon name="chevronRight" size={16} />
      </motion.span>
    </motion.button>
  );
}
