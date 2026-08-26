import * as React from 'react';

/**
 * One number with its micro-label and an optional delta. The unit of a
 * dashboard row.
 *
 * @startingPoint section="Data" subtitle="Stat cards, progress and skeletons" viewport="700x190"
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  /** Always name the baseline: "+4 vs last tier", not "+4". */
  delta?: React.ReactNode;
  deltaTone?: 'up' | 'down' | 'neutral';
  /** Skeletons sized to the widest plausible value, not the current one. */
  loading?: boolean;
}
export function StatCard(props: StatCardProps): JSX.Element;
