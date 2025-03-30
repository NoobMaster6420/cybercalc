import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export function Latex({ formula, displayMode = true, className = '' }: LatexProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        throwOnError: false,
        displayMode,
      });
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={className} />;
}
