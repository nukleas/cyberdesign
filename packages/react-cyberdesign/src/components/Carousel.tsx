import { useRef, useState, Children, isValidElement } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Uncontrolled initial slide index. */
  defaultIndex?: number;
  showDots?: boolean;
  showControls?: boolean;
}

/**
 * Simple horizontal carousel with prev/next and dots.
 *
 * Keyboard (WAI-ARIA Carousel): previous / next and every dot are buttons — Tab
 * reaches them and Enter / Space activate. With focus anywhere inside, Left /
 * Right show the previous / next slide, wrapping (form fields in a slide keep
 * their own arrow keys). Only the visible slide's content can be reached with
 * Tab. Name the carousel with `aria-label`.
 */
export function Carousel({
  children,
  defaultIndex = 0,
  showDots = true,
  showControls = true,
  className = '',
  onKeyDown,
  ...rest
}: CarouselProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const [index, setIndex] = useState(defaultIndex);
  const viewport = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const count = slides.length;
  const wrap = (i: number) => ((i % count) + count) % count;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable]')) return;
    event.preventDefault();
    const next = wrap(index + (event.key === 'ArrowRight' ? 1 : -1));
    // Keep focus inside: follow the active dot, and step out of a slide before it is hidden.
    if (dots.current?.contains(target)) (dots.current.children[next] as HTMLElement).focus();
    else if (viewport.current?.contains(target)) viewport.current.focus();
    setIndex(next);
  };

  return (
    <div
      className={cn('cd-carousel', className)}
      role="group"
      aria-roledescription="carousel"
      {...rest}
      onKeyDown={handleKeyDown}
    >
      <div ref={viewport} className="cd-carousel__viewport" tabIndex={-1}>
        <div
          className="cd-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="cd-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              <div className="cd-carousel__slide-inner">{slide}</div>
            </div>
          ))}
        </div>
      </div>
      {(showControls || showDots) && (
        <div className="cd-carousel__controls">
          {showControls && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIndex(wrap(index - 1))}
              aria-label="Previous slide"
            >
              ‹
            </Button>
          )}
          {showDots && (
            <div ref={dots} className="cd-carousel__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn('cd-carousel__dot', i === index && 'is-active')}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
          {showControls && (
            <Button
              type="button"
              size="sm"
              onClick={() => setIndex(wrap(index + 1))}
              aria-label="Next slide"
            >
              ›
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
