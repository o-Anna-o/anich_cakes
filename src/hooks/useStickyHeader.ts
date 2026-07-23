import { useCallback, useEffect, useRef } from 'react';

export function useStickyHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const bannerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const banner = bannerRef.current;
    if (!header || !banner) return;

    const handleScroll = () => {
      const bannerBottom = banner.offsetTop + banner.offsetHeight;
      if (window.scrollY >= bannerBottom) {
        header.classList.add('banner__header--sticky');
      } else {
        header.classList.remove('banner__header--sticky');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const setHeaderRef = useCallback((node: HTMLElement | null) => {
    headerRef.current = node;
  }, []);

  const setBannerRef = useCallback((node: HTMLElement | null) => {
    bannerRef.current = node;
  }, []);

  return { setHeaderRef, setBannerRef };
}