export const state = {
  activeTool: null,
  files: [],
  pdfDoc: null,
  pdfPages: [],
  currentPdfUrl: null,
  // Scroll restoration para melhorar UX
  savedScrollPosition: 0,
};

// Resets the state when switching views or completing an operation.
export function resetState() {
  state.activeTool = null;
  state.files = [];
  state.pdfDoc = null;
  state.pdfPages = [];
  state.currentPdfUrl = null;
  document.getElementById('tool-content').innerHTML = '';
}

// Scroll Restoration Functions para melhorar UX de navegação
export function saveScrollPosition() {
  state.savedScrollPosition = window.scrollY || document.documentElement.scrollTop;
  console.log(`[ScrollRestore] Posição salva: ${state.savedScrollPosition}px`);
}

export function restoreScrollPosition() {
  if (state.savedScrollPosition > 0) {
    console.log(`[ScrollRestore] Restaurando posição: ${state.savedScrollPosition}px`);
    // Usar requestAnimationFrame para garantir que o DOM foi renderizado
    requestAnimationFrame(() => {
      window.scrollTo({
        top: state.savedScrollPosition,
        left: 0,
        behavior: 'smooth'
      });
    });
  }
}

export function clearScrollPosition() {
  state.savedScrollPosition = 0;
  console.log('[ScrollRestore] Posição limpa');
}
