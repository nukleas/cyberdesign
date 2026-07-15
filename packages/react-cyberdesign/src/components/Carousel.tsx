import { useState, Children, isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Uncontrolled initial slide index. */
  defaultIndex?: number;
  showDots?: boolean;
  showControls?: boolean;
}

/** Simple horizontal carousel with prev/next and dots. */
export function Carousel({
  children,
  defaultIndex = 0,
  showDots = true,
  showControls = true,
  className = '',
  ...rest
}: CarouselProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const [index, setIndex] = useState(defaultIndex);
  const count = slides.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  return (
    <div className={cn('cd-carousel', className)} {...rest}>
      <div className="cd-carousel__viewport">
        <div
          className="cd-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="cd-carousel__slide">
              <div className="cd-carousel__slide-inner">{slide}</div>
            </div>
          ))}
        </div>
      </div>
      {(showControls || showDots) && (
        <div className="cd-carousel__controls">
          {showControls && (
            <Button type="button" size="sm" onClick={() => go(index - 1)} aria-label="Previous">
              ‹
            </Button>
          )}
          {showDots && (
            <div className="cd-carousel__dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn('cd-carousel__dot', i === index && 'is-active')}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          )}
          {showControls && (
            <Button type="button" size="sm" onClick={() => go(index + 1)} aria-label="Next">
              ›
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
