import type { SelectHTMLAttributes } from 'react';

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>;

export function Select(props: SelectProps) {
  return <select className="zp-in" {...props} />;
}
