import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Neon border/glow treatment. */
  glow?: boolean;
  children?: ReactNode;
}

/** Structured surface card — compose with Card.Header/Title/Description/Content/Footer. */
export function Card({ glow = false, className = '', children, ...rest }: CardProps) {
  return (
    <div className={cn('cd-card', glow && 'cd-card--glow', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Row layout: title left, actions right. */
  row?: boolean;
  children?: ReactNode;
}

export function CardHeader({ row = false, className = '', children, ...rest }: CardHeaderProps) {
  return (
    <div className={cn('cd-card__header', row && 'cd-card__header--row', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('cd-card__title', className)} {...rest}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = '', children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('cd-card__description', className)} {...rest}>
      {children}
    </p>
  );
}

export function CardContent({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('cd-card__content', className)} {...rest}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Right-align footer actions. */
  end?: boolean;
  children?: ReactNode;
}

export function CardFooter({ end = false, className = '', children, ...rest }: CardFooterProps) {
  return (
    <div className={cn('cd-card__footer', end && 'cd-card__footer--end', className)} {...rest}>
      {children}
    </div>
  );
}

Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
