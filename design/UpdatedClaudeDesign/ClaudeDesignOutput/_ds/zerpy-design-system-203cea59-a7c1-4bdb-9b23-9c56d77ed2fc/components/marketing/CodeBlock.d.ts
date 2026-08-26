import * as React from 'react';

/**
 * A code sample with an optional filename bar and a copy button. Highlighting
 * is a five-rule regex pass, not a parser — five token colors drawn from the
 * data-viz categorical ramp, so code never introduces a new palette.
 *
 * An intentional addition: the docs surface needs it and the source system had
 * no equivalent.
 *
 * @startingPoint section="Docs" subtitle="Code sample with filename bar and copy" viewport="700x260"
 */
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  /** Shown in the header bar as a mono micro-label. */
  filename?: string;
  /** Used as the header label when there is no filename. */
  language?: string;
  lineNumbers?: boolean;
}
export function CodeBlock(props: CodeBlockProps): JSX.Element;
