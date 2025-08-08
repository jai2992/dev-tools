'use client';

import React, { ReactNode } from 'react';
import { combineAnimationClasses } from '@/utils/animations';

export interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
}

export interface GridItemProps {
  children: ReactNode;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 'md',
  responsive,
  className = ''
}) => {
  // Base grid columns classes
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  // Responsive grid columns classes
  const responsiveColsClasses = {
    sm: {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
      5: 'sm:grid-cols-5',
      6: 'sm:grid-cols-6',
      12: 'sm:grid-cols-12'
    },
    md: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
      12: 'md:grid-cols-12'
    },
    lg: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
      12: 'lg:grid-cols-12'
    },
    xl: {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
      5: 'xl:grid-cols-5',
      6: 'xl:grid-cols-6',
      12: 'xl:grid-cols-12'
    }
  };

  // Gap classes
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  // Build responsive classes
  const responsiveClasses = responsive ? Object.entries(responsive)
    .map(([breakpoint, cols]) => 
      responsiveColsClasses[breakpoint as keyof typeof responsiveColsClasses][cols]
    )
    .join(' ') : '';

  const gridClasses = combineAnimationClasses(
    'grid',
    colsClasses[cols],
    responsiveClasses,
    gapClasses[gap],
    className
  ).trim();

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

const GridItem: React.FC<GridItemProps> = ({
  children,
  span = 1,
  responsive,
  className = ''
}) => {
  // Base span classes
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    12: 'col-span-12'
  };

  // Responsive span classes
  const responsiveSpanClasses = {
    sm: {
      1: 'sm:col-span-1',
      2: 'sm:col-span-2',
      3: 'sm:col-span-3',
      4: 'sm:col-span-4',
      5: 'sm:col-span-5',
      6: 'sm:col-span-6',
      12: 'sm:col-span-12'
    },
    md: {
      1: 'md:col-span-1',
      2: 'md:col-span-2',
      3: 'md:col-span-3',
      4: 'md:col-span-4',
      5: 'md:col-span-5',
      6: 'md:col-span-6',
      12: 'md:col-span-12'
    },
    lg: {
      1: 'lg:col-span-1',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      5: 'lg:col-span-5',
      6: 'lg:col-span-6',
      12: 'lg:col-span-12'
    },
    xl: {
      1: 'xl:col-span-1',
      2: 'xl:col-span-2',
      3: 'xl:col-span-3',
      4: 'xl:col-span-4',
      5: 'xl:col-span-5',
      6: 'xl:col-span-6',
      12: 'xl:col-span-12'
    }
  };

  // Build responsive classes
  const responsiveClasses = responsive ? Object.entries(responsive)
    .map(([breakpoint, span]) => 
      responsiveSpanClasses[breakpoint as keyof typeof responsiveSpanClasses][span]
    )
    .join(' ') : '';

  const itemClasses = combineAnimationClasses(
    spanClasses[span],
    responsiveClasses,
    className
  ).trim();

  return (
    <div className={itemClasses}>
      {children}
    </div>
  );
};

export { Grid, GridItem };
export default Grid;