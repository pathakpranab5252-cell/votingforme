'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  className,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-content-muted">{label}</span>}
          {showPercentage && (
            <span className="text-content-muted font-medium">{clampedProgress.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 relative">
        <motion.div
          className="h-full bg-gradient-primary rounded-full absolute left-0 top-0"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
