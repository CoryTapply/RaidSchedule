import * as React from 'react';

/**
 * Confirmation of something that already happened. Past tense and specific:
 * "Event published", "20 members notified" — never "Success!".
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title: React.ReactNode;
  body?: React.ReactNode;
  onDismiss?: () => void;
}
export function Toast(props: ToastProps): JSX.Element;

/** Fixed bottom-right stack. One per app, rendered at the root. */
export interface ToastStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export function ToastStack(props: ToastStackProps): JSX.Element;
