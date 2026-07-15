import type {
  HTMLAttributes,
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';

export function H1({ className = '', ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn('cd-h1', className)} {...rest} />;
}
export function H2({ className = '', ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('cd-h2', className)} {...rest} />;
}
export function H3({ className = '', ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('cd-h3', className)} {...rest} />;
}
export function H4({ className = '', ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('cd-h4', className)} {...rest} />;
}
export function P({ className = '', ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('cd-p', className)} {...rest} />;
}
export function Lead({ className = '', ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('cd-lead', className)} {...rest} />;
}
export function Muted({ className = '', ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('cd-muted', className)} {...rest} />;
}
export function Small({ className = '', ...rest }: HTMLAttributes<HTMLElement>) {
  return <small className={cn('cd-small', className)} {...rest} />;
}
export function InlineCode({ className = '', ...rest }: HTMLAttributes<HTMLElement>) {
  return <code className={cn('cd-code', className)} {...rest} />;
}
export function Pre({ className = '', ...rest }: HTMLAttributes<HTMLPreElement>) {
  return <pre className={cn('cd-pre', className)} {...rest} />;
}
export function Blockquote({ className = '', ...rest }: BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className={cn('cd-blockquote', className)} {...rest} />;
}
export function List({ className = '', ...rest }: OlHTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('cd-list', className)} {...rest} />;
}
export function InlineLink({ className = '', ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn('cd-inline-link', className)} {...rest} />;
}

export interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Optional wrapper applying base typography font. */
export function Typography({ className = '', children, ...rest }: TypographyProps) {
  return (
    <div className={cn('cd-typography', className)} {...rest}>
      {children}
    </div>
  );
}
