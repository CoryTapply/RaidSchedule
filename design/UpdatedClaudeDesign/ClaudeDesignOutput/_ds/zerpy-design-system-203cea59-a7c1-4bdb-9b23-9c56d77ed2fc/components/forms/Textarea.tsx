import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid = false, className = '', ...rest }: TextareaProps) {
  return <textarea className={['zp-in', 'zp-ta', invalid ? 'zp-in-err' : '', className].filter(Boolean).join(' ')} {...rest} />;
}
