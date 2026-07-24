// hooks/useScrollToSection.ts
// hooks/useScrollToSection.ts
import type { RefObject } from 'react';

export const useScrollToSection = () => {
  const scrollTo = (ref: RefObject<HTMLElement | null>, offset: number = 0) => {
    if (ref.current) {
      const elementTop = ref.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth',
      });
    }
  };

  return scrollTo;
};
