'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  variant?: 'glass' | 'solid';
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'glass', className, header, footer, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          'rounded-2xl overflow-hidden',
          variant === 'glass' ? 'glass' : 'bg-surface border border-white/10',
          className
        )}
        {...props}
      >
        {header && <div className="px-6 py-4 border-b border-white/10">{header}</div>}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-white/10 bg-black/20">{footer}</div>}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
