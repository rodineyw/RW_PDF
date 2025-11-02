import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  state,
  saveScrollPosition,
  restoreScrollPosition,
  clearScrollPosition,
} from '@/js/state';

// Helpers para ajustar viewport em testes
function setViewportSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
  window.dispatchEvent(new Event('resize'));
}

describe('Scroll Restoration', () => {
  let scrollToSpy: ReturnType<typeof vi.fn>;
  let rafSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset estado e DOM entre testes
    state.savedScrollPosition = 0;
    document.body.innerHTML = '<div style="height:2000px"></div>';

    // Mock scrollTo e requestAnimationFrame
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1 as any;
      });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('saveScrollPosition deve usar window.scrollY quando disponível', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 450,
      configurable: true,
      writable: true,
    });

    saveScrollPosition();
    expect(state.savedScrollPosition).toBe(450);
  });

  it('saveScrollPosition deve usar document.documentElement.scrollTop como fallback', () => {
    // Remove scrollY e usa scrollTop
    Object.defineProperty(window, 'scrollY', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    document.documentElement.scrollTop = 300;

    saveScrollPosition();
    expect(state.savedScrollPosition).toBe(300);
  });

  it('restoreScrollPosition deve chamar window.scrollTo com smooth', () => {
    state.savedScrollPosition = 600;

    restoreScrollPosition();

    expect(rafSpy).toHaveBeenCalled();
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 600,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('restoreScrollPosition não deve chamar scrollTo quando posição é 0', () => {
    state.savedScrollPosition = 0;
    restoreScrollPosition();
    expect(scrollToSpy).not.toHaveBeenCalled();
  });

  it('clearScrollPosition deve zerar posição salva', () => {
    state.savedScrollPosition = 999;
    clearScrollPosition();
    expect(state.savedScrollPosition).toBe(0);
  });

  // Viewports comuns: Desktop, Tablet, Mobile (incluindo iPhone/Android)
  const viewports = [
    { name: 'Desktop 1440x900', w: 1440, h: 900 },
    { name: 'Tablet 1024x768', w: 1024, h: 768 },
    { name: 'Tablet Portrait 768x1024', w: 768, h: 1024 },
    { name: 'iPhone 12 390x844', w: 390, h: 844 },
    { name: 'Android 360x800', w: 360, h: 800 },
    { name: 'Small Phone 320x568', w: 320, h: 568 },
  ];

  it.each(viewports)('restoreScrollPosition deve funcionar em %s', (vp) => {
    setViewportSize(vp.w, vp.h);

    // Simula uma posição de scroll alta que pode exceder o viewport
    state.savedScrollPosition = 1200;

    restoreScrollPosition();

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 1200,
      left: 0,
      behavior: 'smooth',
    });
  });
});