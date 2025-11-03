import { resetState, restoreScrollPosition } from './state.js';
import { formatBytes } from './utils/helpers.js';
import { tesseractLanguages } from './config/tesseract-languages.js';
import { tTitle, tMessage, tProgress, tInterface, tConsole, tComment } from './i18n.js';
import { icons, createIcons } from 'lucide';
import Sortable from 'sortablejs';

// Centralizando seleção de elementos DOM
export const dom = {
  gridView: document.getElementById('grid-view'),
  toolGrid: document.getElementById('tool-grid'),
  toolInterface: document.getElementById('tool-interface'),
  toolContent: document.getElementById('tool-content'),
  backToGridBtn: document.getElementById('back-to-grid'),
  loaderModal: document.getElementById('loader-modal'),
  loaderText: document.getElementById('loader-text'),
  alertModal: document.getElementById('alert-modal'),
  alertTitle: document.getElementById('alert-title'),
  alertMessage: document.getElementById('alert-message'),
  alertOkBtn: document.getElementById('alert-ok'),
  heroSection: document.getElementById('hero-section'),
  featuresSection: document.getElementById('features-section'),
  toolsHeader: document.getElementById('tools-header'),
  dividers: document.querySelectorAll('.section-divider'),
  hideSections: document.querySelectorAll('.hide-section'),
};

export const showLoader = (text = 'Processando...') => {
  dom.loaderText.textContent = tProgress(text);
  dom.loaderModal.classList.remove('hidden');
};

export const hideLoader = () => dom.loaderModal.classList.add('hidden');

// Mapeamento simples de tradução de títulos para UI PT-BR sem alterar testes
// i18n tratado via tTitle/tMessage/tProgress

// Mapeamento de tradução de mensagens (apenas UI), mantém testes estáveis
// (removido: usar i18n)

// (removido: usar i18n)

export const showAlert = (title: any, message: any) => {
  const displayTitle = tTitle(title);
  dom.alertTitle.textContent = displayTitle;
  dom.alertMessage.textContent = tMessage(message);
  dom.alertModal.classList.remove('hidden');
};

export const hideAlert = () => dom.alertModal.classList.add('hidden');

export const switchView = (view: any) => {
  if (view === 'grid') {
    dom.gridView.classList.remove('hidden');
    dom.toolInterface.classList.add('hidden');
    // mostrar hero, recursos e cabeçalho
    dom.heroSection.classList.remove('hidden');
    dom.featuresSection.classList.remove('hidden');
    dom.toolsHeader.classList.remove('hidden');
    // mostrar divisores
    dom.dividers.forEach((divider) => {
      divider.classList.remove('hidden');
    });
    // mostrar seções ocultas
    dom.hideSections.forEach((section) => {
      section.classList.remove('hidden');
    });

    resetState();
    
    // Restaurar posição do scroll após resetar o estado
    restoreScrollPosition();
  } else {
    dom.gridView.classList.add('hidden');
    dom.toolInterface.classList.remove('hidden');
    dom.featuresSection.classList.add('hidden');
    dom.heroSection.classList.add('hidden');
    dom.toolsHeader.classList.add('hidden');
    dom.dividers.forEach((divider) => {
      divider.classList.add('hidden');
    });
    dom.hideSections.forEach((section) => {
      section.classList.add('hidden');
    });
  }
};

const thumbnailState = {
  sortableInstances: {},
};

function initializeOrganizeSortable(containerId: any) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (thumbnailState.sortableInstances[containerId]) {
    thumbnailState.sortableInstances[containerId].destroy();
  }

  thumbnailState.sortableInstances[containerId] = Sortable.create(container, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    filter: '.delete-page-btn',
    preventOnFilter: true,
    onStart: function (evt: any) {
      evt.item.style.opacity = '0.5';
    },
    onEnd: function (evt: any) {
      evt.item.style.opacity = '1';
    },
  });
}

/**
 * Renders page thumbnails for tools like 'Organize' and 'Rotate'.
 * @param {string} toolId The ID of the active tool.
 * @param {object} pdfDoc The loaded pdf-lib document instance.
 */
export const renderPageThumbnails = async (toolId: any, pdfDoc: any) => {
  const containerId = toolId === 'organize' ? 'page-organizer' : 'page-rotator';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  showLoader(tProgress('Renderizando prévias de páginas...'));

  const pdfData = await pdfDoc.save();
  // @ts-expect-error TS(2304) FIXME: Não foi possível encontrar o nome 'pdfjsLib'.
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    const wrapper = document.createElement('div');
    wrapper.className = 'page-thumbnail relative group';
    // @ts-expect-error TS(2322) FIXME: Tipo 'number' não é atribuível ao tipo 'string'.
    wrapper.dataset.pageIndex = i - 1;

    const imgContainer = document.createElement('div');
    imgContainer.className =
      'w-full h-36 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-600';

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.className = 'max-w-full max-h-full object-contain';

    imgContainer.appendChild(img);

    if (toolId === 'organize') {
      wrapper.className = 'page-thumbnail relative group';
      wrapper.appendChild(imgContainer);

      const pageNumSpan = document.createElement('span');
      pageNumSpan.className =
        'absolute top-1 left-1 bg-gray-900 bg-opacity-75 text-white text-xs rounded-full px-2 py-1';
      pageNumSpan.textContent = i.toString();

      const deleteBtn = document.createElement('button');
      deleteBtn.className =
        'delete-page-btn absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.addEventListener('click', (e) => {
        (e.currentTarget as HTMLElement).parentElement.remove();
        initializeOrganizeSortable(containerId);
      });

      wrapper.append(pageNumSpan, deleteBtn);
    } else if (toolId === 'rotate') {
      wrapper.className = 'page-rotator-item flex flex-col items-center gap-2';
      wrapper.dataset.rotation = '0';
      img.classList.add('transition-transform', 'duration-300');
      wrapper.appendChild(imgContainer);

      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'flex items-center justify-center gap-3 w-full';

      const pageNumSpan = document.createElement('span');
      pageNumSpan.className = 'font-medium text-sm text-white';
      pageNumSpan.textContent = i.toString();

      const rotateBtn = document.createElement('button');
      rotateBtn.className =
        'rotate-btn btn bg-gray-700 hover:bg-gray-600 p-2 rounded-full';
      rotateBtn.title = 'Rotate 90°';
      rotateBtn.innerHTML = '<i data-lucide="rotate-cw" class="w-5 h-5"></i>';
      rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = (e.currentTarget as HTMLElement).closest(
          '.page-rotator-item'
        ) as HTMLElement;
        const imgEl = card.querySelector('img');
        let currentRotation = parseInt(card.dataset.rotation);
        currentRotation = (currentRotation + 90) % 360;
        card.dataset.rotation = currentRotation.toString();
        imgEl.style.transform = `rotate(${currentRotation}deg)`;
      });

      controlsDiv.append(pageNumSpan, rotateBtn);
      wrapper.appendChild(controlsDiv);
    }

    container.appendChild(wrapper);
    createIcons({ icons });
  }

  if (toolId === 'organize') {
    initializeOrganizeSortable(containerId);
  }

  hideLoader();
};

/**
 * Renders a list of uploaded files in the specified container.
 * @param {HTMLElement} container The DOM element to render the list into.
 * @param {File[]} files The array of file objects.
 */
export const renderFileDisplay = (container: any, files: any) => {
  container.textContent = '';
  if (files.length > 0) {
    files.forEach((file: any) => {
      const fileDiv = document.createElement('div');
      fileDiv.className =
        'flex items-center justify-between bg-gray-700 p-3 rounded-lg text-sm';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'truncate font-medium text-gray-200';
      nameSpan.textContent = file.name;

      const sizeSpan = document.createElement('span');
      sizeSpan.className = 'flex-shrink-0 ml-4 text-gray-400';
      sizeSpan.textContent = formatBytes(file.size);

      fileDiv.append(nameSpan, sizeSpan);
      container.appendChild(fileDiv);
    });
  }
};

const createFileInputHTML = (options = {}) => {
  // @ts-expect-error TS(2339) FIXME: Property 'multiple' does not exist on type '{}'.
  const multiple = options.multiple ? 'multiple' : '';
  // @ts-expect-error TS(2339) FIXME: Property 'accept' does not exist on type '{}'.
  const acceptedFiles = options.accept || 'application/pdf';
  // @ts-expect-error TS(2339) FIXME: Property 'showControls' does not exist on type '{}... Remove this comment to see the full error message
  const showControls = options.showControls || false; // NOVO: Adicionar este parâmetro

  return `
        <div id="drop-zone" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700 transition-colors duration-300">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i data-lucide="upload-cloud" class="w-10 h-10 mb-3 text-gray-400"></i>
                <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Clique para selecionar um arquivo</span> ou arraste e solte</p>
                <p class="text-xs text-gray-500">${multiple ? 'PDFs ou Imagens' : 'Um único arquivo PDF'}</p>
                <p class="text-xs text-gray-500">Seus arquivos nunca saem do seu dispositivo.</p>
            </div>
            <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" ${multiple} accept="${acceptedFiles}">
        </div>
        
        ${
          showControls
            ? `
            <!-- NEW: Add control buttons for multi-file uploads -->
            <div id="file-controls" class="hidden mt-4 flex gap-3">
                <button id="add-more-btn" class="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="plus"></i> Adicionar mais arquivos
                </button>
                <button id="clear-files-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i data-lucide="x"></i> Limpar tudo
                </button>
            </div>
        `
            : ''
        }
    `;
};

export const toolTemplates = {
  merge: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Mesclar PDFs</h2>
    <p class="mb-6 text-gray-400">Combine arquivos inteiros ou selecione páginas específicas para mesclar em um novo documento.</p>
    ${createFileInputHTML({ multiple: true, showControls: true })} 

    <div id="merge-options" class="hidden mt-6">
        <div class="flex gap-2 p-1 rounded-lg bg-gray-900 border border-gray-700 mb-4">
            <button id="file-mode-btn" class="flex-1 btn bg-indigo-600 text-white font-semibold py-2 rounded-md">Modo Arquivo</button>
            <button id="page-mode-btn" class="flex-1 btn text-gray-300 font-semibold py-2 rounded-md">Modo Página</button>
        </div>

        <div id="file-mode-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Clique e arraste o ícone <i data-lucide="grip-vertical" class="inline-block w-3 h-3"></i> para mudar a ordem dos arquivos.</li>
                    <li>No campo "Páginas" de cada arquivo, você pode especificar intervalos (ex.: "1-3, 5") para mesclar apenas essas páginas.</li>
                    <li>Deixe o campo "Páginas" vazio para incluir todas as páginas do arquivo.</li>
                </ul>
            </div>
            <ul id="file-list" class="space-y-2"></ul>
        </div>

        <div id="page-mode-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                 <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Todas as páginas dos PDFs enviados aparecem abaixo.</li>
                    <li>Arraste e solte as miniaturas de páginas para criar exatamente a ordem desejada para o novo arquivo.</li>
                </ul>
            </div>
             <div id="page-merge-preview" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[200px]"></div>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Mesclar PDFs</button>
    </div>
`,

  split: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Dividir PDF</h2>
    <p class="mb-6 text-gray-400">Extrair páginas de um PDF usando vários métodos.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="split-options" class="hidden mt-6">
        
        <label for="split-mode" class="block mb-2 text-sm font-medium text-gray-300">Modo de Divisão</label>
        <select id="split-mode" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4">
            <option value="range">Extrair por intervalo de páginas (padrão)</option>
            <option value="even-odd">Dividir por páginas pares/ímpares</option>
            <option value="all">Dividir todas as páginas em arquivos separados</option>
            <option value="visual">Selecionar páginas visualmente</option>
        </select>

        <div id="range-panel">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                    <li>Informe números de páginas separados por vírgula (ex.: 2, 8, 14).</li>
                    <li>Informe intervalos usando hífen (ex.: 5-10).</li>
                    <li>Combine ambos para seleções complexas (ex.: 1-3, 7, 12-15).</li>
                </ul>
            </div>
            <p class="mb-2 font-medium text-white">Total de Páginas: <span id="total-pages"></span></p>
            <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Informe o intervalo de páginas:</label>
            <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-5, 8">
        </div>

        <div id="even-odd-panel" class="hidden">
            <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Cria um novo PDF contendo apenas as páginas pares ou apenas as ímpares do documento original.</p>
            </div>
            <div class="flex gap-4">
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="odd" checked class="hidden">
                    <span class="font-semibold text-white">Apenas Ímpares</span>
                </label>
                <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                    <input type="radio" name="even-odd-choice" value="even" class="hidden">
                    <span class="font-semibold text-white">Apenas Pares</span>
                </label>
            </div>
        </div>
        
        <div id="visual-select-panel" class="hidden">
             <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
                <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
                <p class="text-xs text-gray-400 mt-1">Clique nas miniaturas de página abaixo para selecionar. Clique novamente para desmarcar. Todas as páginas selecionadas serão extraídas.</p>
            </div>
             <div id="page-selector-grid" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700 min-h-[150px]"></div>
        </div>

        <div id="all-pages-panel" class="hidden p-3 bg-gray-900 rounded-lg border border-gray-700">
            <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
            <p class="text-xs text-gray-400 mt-1">Este modo cria um arquivo PDF separado para cada página do documento e baixa todos juntos em um arquivo ZIP.</p>
        </div>
        
        <div id="zip-option-wrapper" class="hidden mt-4">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                <input type="checkbox" id="download-as-zip" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                Baixar páginas como arquivos individuais em um ZIP
            </label>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6">Dividir PDF</button>

    </div>
`,
  encrypt: () => `
  <h2 class="text-2xl font-bold text-white mb-4">Criptografar PDF</h2>
  <p class="mb-6 text-gray-400">Adicionar proteção por senha AES 256‑bit ao seu PDF.</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="encrypt-options" class="hidden space-y-4 mt-6">
      <div>
          <label for="user-password-input" class="block mb-2 text-sm font-medium text-gray-300">Senha do Usuário</label>
          <input required type="password" id="user-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para abrir o PDF">
          <p class="text-xs text-gray-500 mt-1">Obrigatória para abrir e visualizar o PDF</p>
      </div>
      <div>
          <label for="owner-password-input" class="block mb-2 text-sm font-medium text-gray-300">Senha do Proprietário (opcional)</label>
          <input type="password" id="owner-password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para permissões completas (recomendado)">
          <p class="text-xs text-gray-500 mt-1">Permite alterar permissões e remover a criptografia</p>
      </div>

      <!-- Checkboxes de restrição (mostrados quando senha do proprietário é inserida) -->
      <div id="restriction-options" class="hidden p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h3 class="font-semibold text-base mb-2 text-white">🔒 Restringir Permissões do PDF</h3>
        <p class="text-sm text-gray-400 mb-3">Selecione quais ações deseja desativar:</p>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify" checked>
            <span>Desativar todas as modificações (--modify=none)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-extract" checked>
            <span>Desativar extração de texto e imagem (--extract=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-print" checked>
            <span>Desativar toda impressão (--print=none)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-accessibility">
            <span>Desativar cópia de texto para acessibilidade (--accessibility=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-annotate">
            <span>Desativar anotações (--annotate=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-assemble">
            <span>Desativar montagem de páginas (--assemble=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-form">
            <span>Desativar preenchimento de formulários (--form=n)</span>
          </label>
          <label class="flex items-center space-x-2">
            <input type="checkbox" id="restrict-modify-other">
            <span>Desativar outras modificações (--modify-other=n)</span>
          </label>
        </div>
      </div>

      <div class="p-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">⚠️ Recomendação de Segurança</h3>
          <p class="text-sm text-gray-300">Para maior segurança, defina ambas as senhas. Sem a senha de proprietário, as restrições (impressão, cópia, etc.) podem ser facilmente contornadas.</p>
      </div>
      <div class="p-4 bg-green-900/20 border border-green-500/30 text-green-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2">✓ Criptografia de Alta Qualidade</h3>
          <p class="text-sm text-gray-300">Criptografia AES 256‑bit sem perda de qualidade. O texto permanece selecionável e pesquisável.</p>
      </div>
      <button id="process-btn" class="btn-gradient w-full mt-6">Criptografar & Baixar</button>
  </div>
`,
  decrypt: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Descriptografar PDF</h2>
        <p class="mb-6 text-gray-400">Envie um PDF criptografado e informe sua senha para criar uma versão desbloqueada.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="decrypt-options" class="hidden space-y-4 mt-6">
            <div>
                <label for="password-input" class="block mb-2 text-sm font-medium text-gray-300">Informe a senha do PDF</label>
                <input type="password" id="password-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Informe a senha atual">
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Descriptografar & Baixar</button>
        </div>
        <canvas id="pdf-canvas" class="hidden"></canvas>
    `,
  organize: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Organizar PDF</h2>
        <p class="mb-6 text-gray-400">Reordene, gire ou exclua páginas. Arraste e solte para reordenar.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="page-organizer" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Salvar Alterações</button>
    `,

  rotate: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Rotacionar PDF</h2>
        <p class="mb-6 text-gray-400">Gire todas as páginas ou páginas específicas em um documento PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        
        <div id="rotate-all-controls" class="hidden my-6">
            <div class="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-gray-400 mb-3 text-center">AÇÕES EM LOTE</h3>
                <div class="flex justify-center gap-4">
                    <button id="rotate-all-left-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-ccw" class="mr-2 h-4 w-4"></i>
                        Girar Tudo à Esquerda
                    </button>
                    <button id="rotate-all-right-btn" class="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transform transition-all duration-150 active:scale-95">
                        <i data-lucide="rotate-cw" class="mr-2 h-4 w-4"></i>
                        Girar Tudo à Direita
                    </button>
                </div>
            </div>
        </div>
        <div id="page-rotator" class="hidden grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Salvar Rotações</button>
    `,

  'add-page-numbers': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Adicionar Números de Página</h2>
        <p class="mb-6 text-gray-400">Adicionar números de página personalizáveis ao seu PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="pagenum-options" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
                <label for="position" class="block mb-2 text-sm font-medium text-gray-300">Posição</label>
                <select id="position" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="bottom-center">Centro Inferior</option>
                    <option value="bottom-left">Inferior Esquerda</option>
                    <option value="bottom-right">Inferior Direita</option>
                    <option value="top-center">Centro Superior</option>
                    <option value="top-left">Superior Esquerda</option>
                    <option value="top-right">Superior Direita</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Fonte</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="number-format" class="block mb-2 text-sm font-medium text-gray-300">Formato</label>
                <select id="number-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="default">1, 2, 3...</option>
                    <option value="page_x_of_y">Página 1/N, 2/N...</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do Texto</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Adicionar Números de Página</button>
    `,
  'pdf-to-jpg': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para JPG</h2>
        <p class="mb-6 text-gray-400">Converter cada página de um PDF em uma imagem JPG de alta qualidade.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="jpg-preview" class="hidden text-center mt-6">
            <p class="mb-4 text-white">Clique em "Baixar Tudo em ZIP" para obter imagens de todas as páginas.</p>
            <button id="process-btn" class="btn-gradient w-full mt-6">Baixar Tudo em ZIP</button>
        </div>
    `,
  'jpg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">JPG para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens JPG em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'scan-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Digitalizar para PDF</h2>
        <p class="mb-6 text-gray-400">Use a câmera do seu dispositivo para digitalizar documentos e salvá-los como PDF. No desktop, abrirá um seletor de arquivos.</p>
        ${createFileInputHTML({ accept: 'image/*' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Criar PDF a partir das Digitalizações</button>
    `,

  crop: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Cortar PDF</h2>
    <p class="mb-6 text-gray-400">Clique e arraste para selecionar uma área de corte em qualquer página. Você pode definir áreas diferentes para cada página.</p>
    ${createFileInputHTML()}
    <div id="crop-editor" class="hidden">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div id="page-nav" class="flex items-center gap-2"></div>
            <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="zoom-controls" class="flex items-center gap-2">
                <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Reduzir"><i data-lucide="zoom-out" class="w-5 h-5"></i></button>
                <button id="fit-page-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Ajustar à visão"><i data-lucide="minimize" class="w-5 h-5"></i></button>
                <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600" title="Ampliar"><i data-lucide="zoom-in" class="w-5 h-5"></i></button>
            </div>
             <div class="border-l border-gray-600 h-6 mx-2 hidden md:block"></div>
            <div id="crop-controls" class="flex items-center gap-2">
                 <button id="clear-crop-btn" class="btn bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="Limpar corte nesta página">Limpar Página</button>
                 <button id="clear-all-crops-btn" class="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm" title="Limpar todas as seleções de corte">Limpar Tudo</button>
            </div>
        </div>
        <div id="canvas-container" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600" style="height: 70vh;">
            <canvas id="canvas-editor" class="mx-auto cursor-crosshair"></canvas>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar Corte & Salvar PDF</button>
    </div>
`,
  compress: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Comprimir PDF</h2>
    <p class="mb-6 text-gray-400">Reduza o tamanho do arquivo escolhendo o método de compressão que melhor se adapta ao documento.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="compress-options" class="hidden mt-6 space-y-6">
        <div>
            <label for="compression-level" class="block mb-2 text-sm font-medium text-gray-300">Nível de Compressão</label>
            <select id="compression-level" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="balanced">Equilibrado (Recomendado)</option>
                <option value="high-quality">Alta Qualidade (Arquivo maior)</option>
                <option value="small-size">Menor Tamanho (Qualidade inferior)</option>
                <option value="extreme">Extremo (Qualidade muito baixa)</option>
            </select>
        </div>

        <div>
            <label for="compression-algorithm" class="block mb-2 text-sm font-medium text-gray-300">Algoritmo de Compressão</label>
            <select id="compression-algorithm" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="vector">Vetorial (Para PDFs com muito texto)</option>
                <option value="photon">Photon (Para imagens e desenhos complexos)</option>
            </select>
            <p class="mt-2 text-xs text-gray-400">
                Escolha 'Vetorial' para PDFs baseados em texto, ou 'Photon' para documentos digitalizados e imagens complexas.
            </p>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-4" disabled>Comprimir PDF</button>
    </div>
`,
  'pdf-to-greyscale': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para Tons de Cinza</h2>
        <p class="mb-6 text-gray-400">Converta todas as páginas de um PDF para tons de cinza. O processo renderiza cada página, aplica um filtro e reconstrói o PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para Tons de Cinza</button>
    `,
  'pdf-to-zip': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Combinar PDFs em ZIP</h2>
        <p class="mb-6 text-gray-400">Selecione vários arquivos PDF para baixá-los juntos em um único arquivo ZIP.</p>
        ${createFileInputHTML({ multiple: true, showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Criar Arquivo ZIP</button>
    `,

  'edit-metadata': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Editar Metadados do PDF</h2>
    <p class="mb-6 text-gray-400">Modifique os campos de metadados do seu PDF. Deixe um campo em branco para removê-lo.</p>
    
    <div class="p-3 mb-6 bg-gray-900 border border-yellow-500/30 text-yellow-200/80 rounded-lg text-sm flex items-start gap-3">
        <i data-lucide="info" class="w-5 h-5 flex-shrink-0 mt-0.5"></i>
        <div>
            <strong class="font-semibold text-yellow-200">Nota Importante:</strong>
            Esta ferramenta usa a biblioteca <code class="bg-gray-700 px-1 rounded text-white">pdf-lib</code>, que pode atualizar os campos <strong>Producer</strong>, <strong>CreationDate</strong> e <strong>ModDate</strong> devido ao comportamento padrão. Para ver precisamente os metadados finais após editar (ou apenas visualizar), use a ferramenta <strong>Visualizar Metadados</strong>.
        </div>
    </div>

    ${createFileInputHTML()}
    
    <div id="metadata-form" class="hidden mt-6 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label for="meta-title" class="block mb-2 text-sm font-medium text-gray-300">Título</label>
                <input type="text" id="meta-title" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-author" class="block mb-2 text-sm font-medium text-gray-300">Autor</label>
                <input type="text" id="meta-author" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-subject" class="block mb-2 text-sm font-medium text-gray-300">Assunto</label>
                <input type="text" id="meta-subject" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-keywords" class="block mb-2 text-sm font-medium text-gray-300">Palavras‑chave (separadas por vírgulas)</label>
                <input type="text" id="meta-keywords" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-creator" class="block mb-2 text-sm font-medium text-gray-300">Ferramenta de Criação</label>
                <input type="text" id="meta-creator" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-producer" class="block mb-2 text-sm font-medium text-gray-300">Ferramenta de Produção</label>
                <input type="text" id="meta-producer" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
             <div>
                <label for="meta-creation-date" class="block mb-2 text-sm font-medium text-gray-300">Data de Criação</label>
                <input type="datetime-local" id="meta-creation-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="meta-mod-date" class="block mb-2 text-sm font-medium text-gray-300">Data de Modificação</label>
                <input type="datetime-local" id="meta-mod-date" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>

        <div id="custom-metadata-container" class="space-y-3 pt-4 border-t border-gray-700">
             <h3 class="text-lg font-semibold text-white">Campos Personalizados</h3>
             <p class="text-sm text-gray-400 -mt-2">Nota: Campos personalizados não são suportados por todos os leitores de PDF.</p>
        </div>
        <button id="add-custom-meta-btn" class="btn border border-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            <i data-lucide="plus"></i> Adicionar Campo Personalizado
        </button>
        
    </div>

    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Atualizar Metadados & Baixar</button>
`,

  'remove-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Remover Metadados do PDF</h2>
        <p class="mb-6 text-gray-400">Remova completamente metadados de identificação do seu PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">Remover Metadados & Baixar</button>
    `,
  flatten: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Achatar PDF</h2>
        <p class="mb-6 text-gray-400">Torne campos de formulários e anotações não editáveis ao achatá-los.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden mt-6 btn-gradient w-full">Achatar PDF</button>
    `,
  'pdf-to-png': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para PNG</h2>
        <p class="mb-6 text-gray-400">Converter cada página de um PDF em uma imagem PNG de alta qualidade.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="png-preview" class="hidden text-center mt-6">
            <p class="mb-4 text-white">Seu arquivo está pronto. Clique no botão para baixar um ZIP contendo todas as imagens PNG.</p>
            <button id="process-btn" class="btn-gradient w-full">Baixar Tudo em ZIP</button>
        </div>
    `,
  'png-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PNG para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens PNG em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/png', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'pdf-to-webp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para WebP</h2>
        <p class="mb-6 text-gray-400">Converter cada página de um PDF em uma imagem WebP moderna.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="webp-preview" class="hidden text-center mt-6">
            <p class="mb-4 text-white">Seu arquivo está pronto. Clique no botão para baixar um ZIP contendo todas as imagens WebP.</p>
            <button id="process-btn" class="btn-gradient w-full">Baixar Tudo em ZIP</button>
        </div>
    `,
  'webp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">WebP para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens WebP em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/webp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  edit: () => `
        <h2 class="text-2xl font-bold text-white mb-4">Editor de PDF</h2>
        <p class="mb-6 text-gray-400">Um espaço tudo‑em‑um para anotar, desenhar, destacar, redigir, adicionar comentários e formas, capturar telas e visualizar PDFs.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="embed-pdf-wrapper" class="hidden mt-6 w-full h-[75vh] border border-gray-600 rounded-lg">
            <div id="embed-pdf-container" class="w-full h-full"></div>
        </div>
    `,
  'delete-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Excluir Páginas</h2>
        <p class="mb-6 text-gray-400">Remova páginas específicas ou intervalos de páginas do seu PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="delete-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de Páginas: <span id="total-pages"></span></p>
            <label for="pages-to-delete" class="block mb-2 text-sm font-medium text-gray-300">Informe páginas para excluir (ex.: 2, 4-6, 9):</label>
            <input type="text" id="pages-to-delete" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="ex.: 2, 4-6, 9">
            <button id="process-btn" class="btn-gradient w-full">Excluir Páginas & Baixar</button>
        </div>
    `,
  'add-blank-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Adicionar Páginas em Branco</h2>
        <p class="mb-6 text-gray-400">Insira uma ou mais páginas em branco em uma posição específica do documento.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="blank-page-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de Páginas: <span id="total-pages"></span></p>
            <label for="page-number" class="block mb-2 text-sm font-medium text-gray-300">Inserir páginas em branco após o número da página:</label>
            <input type="number" id="page-number" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="Informe 0 para adicionar no início">
            <label for="page-count" class="block mb-2 text-sm font-medium text-gray-300">Quantidade de páginas em branco a inserir:</label>
            <input type="number" id="page-count" min="1" value="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="Informe a quantidade de páginas">
            <button id="process-btn" class="btn-gradient w-full">Adicionar Páginas & Baixar</button>
        </div>
    `,
  'extract-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Extrair Páginas</h2>
        <p class="mb-6 text-gray-400">Extraia páginas específicas de um PDF para arquivos separados. Seus arquivos serão baixados em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="extract-options" class="hidden mt-6">
            <p class="mb-2 font-medium text-white">Total de Páginas: <span id="total-pages"></span></p>
            <label for="pages-to-extract" class="block mb-2 text-sm font-medium text-gray-300">Informe páginas para extrair (ex.: 2, 4-6, 9):</label>
            <input type="text" id="pages-to-extract" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6" placeholder="ex.: 2, 4-6, 9">
            <button id="process-btn" class="btn-gradient w-full">Extrair & Baixar ZIP</button>
        </div>
    `,

  'add-watermark': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Adicionar Marca d’Água</h2>
    <p class="mb-6 text-gray-400">Aplicar uma marca d’água de texto ou imagem em todas as páginas do seu PDF.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="watermark-options" class="hidden mt-6 space-y-4">
        <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="text" checked class="hidden">
                <span class="font-semibold text-white">Texto</span>
            </label>
            <label class="flex-1 flex items-center justify-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                <input type="radio" name="watermark-type" value="image" class="hidden">
                <span class="font-semibold text-white">Imagem</span>
            </label>
        </div>

        <div id="text-watermark-options">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="watermark-text" class="block mb-2 text-sm font-medium text-gray-300">Texto da Marca d’Água</label>
                    <input type="text" id="watermark-text" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="e.g., CONFIDENTIAL">
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Fonte</label>
                    <input type="number" id="font-size" value="72" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do Texto</label>
                    <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
                <div>
                    <label for="opacity-text" class="block mb-2 text-sm font-medium text-gray-300">Opacidade (<span id="opacity-value-text">0.3</span>)</label>
                    <input type="range" id="opacity-text" value="0.3" min="0" max="1" step="0.1" class="w-full">
                </div>
            </div>
            <div class="mt-4">
                <label for="angle-text" class="block mb-2 text-sm font-medium text-gray-300">Ângulo (<span id="angle-value-text">0</span>°)</label>
                <input type="range" id="angle-text" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

        <div id="image-watermark-options" class="hidden space-y-4">
            <div>
                <label for="image-watermark-input" class="block mb-2 text-sm font-medium text-gray-300">Enviar Imagem da Marca d’Água</label>
                <input type="file" id="image-watermark-input" accept="image/png, image/jpeg" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
            </div>
            <div>
                <label for="opacity-image" class="block mb-2 text-sm font-medium text-gray-300">Opacidade (<span id="opacity-value-image">0.3</span>)</label>
                <input type="range" id="opacity-image" value="0.3" min="0" max="1" step="0.1" class="w-full">
            </div>
            <div>
                <label for="angle-image" class="block mb-2 text-sm font-medium text-gray-300">Ângulo (<span id="angle-value-image">0</span>°)</label>
                <input type="range" id="angle-image" value="0" min="-180" max="180" step="1" class="w-full">
            </div>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Adicionar Marca d’Água & Baixar</button>
`,

  'add-header-footer': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Adicionar Cabeçalho & Rodapé</h2>
    <p class="mb-6 text-gray-400">Adicione texto personalizado ao topo e rodapé de cada página do seu PDF.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="header-footer-options" class="hidden mt-6 space-y-4">
        
        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Opções de Formatação</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Intervalo de páginas (opcional)</label>
                    <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-3, 5">
                    <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages">0</span></p>
                </div>
                <div>
                    <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Fonte</label>
                    <input type="number" id="font-size" value="10" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="font-color" class="block mb-2 text-sm font-medium text-gray-300">Cor da Fonte</label>
                    <input type="color" id="font-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="header-left" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho Esquerdo</label>
                <input type="text" id="header-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-center" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho Central</label>
                <input type="text" id="header-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="header-right" class="block mb-2 text-sm font-medium text-gray-300">Cabeçalho Direito</label>
                <input type="text" id="header-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="footer-left" class="block mb-2 text-sm font-medium text-gray-300">Rodapé Esquerdo</label>
                <input type="text" id="footer-left" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-center" class="block mb-2 text-sm font-medium text-gray-300">Rodapé Central</label>
                <input type="text" id="footer-center" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="footer-right" class="block mb-2 text-sm font-medium text-gray-300">Rodapé Direito</label>
                <input type="text" id="footer-right" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar Cabeçalho & Rodapé</button>
`,

  'image-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Imagem para PDF</h2>
        <p class="mb-6 text-gray-400">Combine múltiplas imagens em um único PDF. Arraste e solte para reordenar.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/jpeg,image/png,image/webp', showControls: true })}
        <ul id="image-list" class="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"></ul>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,

  'change-permissions': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Alterar Permissões do PDF</h2>
    <p class="mb-6 text-gray-400">Modifique senhas e permissões sem perder qualidade.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="permissions-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="current-password" class="block mb-2 text-sm font-medium text-gray-300">Senha atual (se criptografado)</label>
            <input type="password" id="current-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Deixe em branco se o PDF não estiver protegido por senha">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="new-user-password" class="block mb-2 text-sm font-medium text-gray-300">Nova senha de usuário (opcional)</label>
                <input type="password" id="new-user-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para abrir o PDF">
            </div>
            <div>
                <label for="new-owner-password" class="block mb-2 text-sm font-medium text-gray-300">Nova senha de proprietário (opcional)</label>
                <input type="password" id="new-owner-password" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Senha para permissões completas">
            </div>
        </div>

        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
            <h3 class="font-semibold text-base mb-2">Como Funciona</h3>
            <ul class="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li><strong>Senha de Usuário:</strong> Necessária para abrir o PDF</li>
                <li><strong>Senha de Proprietário:</strong> Necessária para aplicar as permissões abaixo</li>
                <li>Deixe ambas em branco para remover toda criptografia e restrições</li>
                <li>Marque as caixas abaixo para PERMITIR ações específicas (desmarcado = desativado)</li>
            </ul>
        </div>
        
        <fieldset class="border border-gray-600 p-4 rounded-lg">
            <legend class="px-2 text-sm font-medium text-gray-300">Permissões (aplicadas apenas com Senha de Proprietário):</legend>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-printing" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Impressão
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-copying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Extração de Texto/Imagem
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-modifying" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Modificações
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-annotating" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Anotações
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-filling-forms" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Preenchimento de Formulários
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-document-assembly" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Montagem de Página
                </label>
                <label class="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" id="allow-page-extraction" checked class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"> 
                    Permitir Extração de Página
                </label>
            </div>
        </fieldset>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Aplicar Alterações</button>
`,

  'pdf-to-markdown': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para Markdown</h2>
        <p class="mb-6 text-gray-400">Converta o conteúdo de texto de um PDF em um arquivo Markdown estruturado.</p>
        ${createFileInputHTML({ accept: '.pdf' })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div class="hidden mt-4 p-3 bg-gray-900 border border-yellow-500/30 text-yellow-200 rounded-lg" id="quality-note">
            <p class="text-sm text-gray-400"><b>Nota:</b> Esta é uma conversão focada em texto. Tabelas e imagens não serão incluídas.</p>
        </div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Converter para Markdown</button>
    `,
  'txt-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Texto para PDF</h2>
        <p class="mb-6 text-gray-400">Digite ou cole seu texto abaixo e converta para PDF com formatação personalizada.</p>
        <textarea id="text-input" rows="12" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" placeholder="Comece a digitar aqui..."></textarea>
        <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label for="font-family" class="block mb-2 text-sm font-medium text-gray-300">Família da Fonte</label>
                <select id="font-family" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="Helvetica">Helvetica</option>
                    <option value="TimesRoman">Times New Roman</option>
                    <option value="Courier">Courier</option>
                </select>
            </div>
            <div>
                <label for="font-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Fonte</label>
                <input type="number" id="font-size" value="12" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
            </div>
            <div>
                <label for="page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Página</label>
                <select id="page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                </select>
            </div>
            <div>
                <label for="text-color" class="block mb-2 text-sm font-medium text-gray-300">Cor do Texto</label>
                <input type="color" id="text-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Criar PDF</button>
    `,
  'invert-colors': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Inverter Cores do PDF</h2>
        <p class="mb-6 text-gray-400">Converta seu PDF para “modo escuro” invertendo as cores. Funciona melhor em documentos com texto e imagens simples.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Inverter Cores & Baixar</button>
    `,
  'view-metadata': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Visualizar Metadados do PDF</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para ver propriedades internas como Título, Autor e Data de Criação.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="metadata-results" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg"></div>
    `,
  'reverse-pages': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Inverter Páginas do PDF</h2>
        <p class="mb-6 text-gray-400">Inverta a ordem de todas as páginas do documento, tornando a última página a primeira.</p>
        ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="hidden btn-gradient w-full mt-6">Inverter & Baixar</button>
    `,
  'md-to-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">${tInterface('Markdown to PDF')}</h2>
    <p class="mb-6 text-gray-400">${tInterface('Write in Markdown, select your formatting options, and get a high-quality, multi-page PDF. <br><strong class="text-gray-300">Nota:</strong> Imagens com links da web (Ex., https://...) requer internet para rendereizar.')}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label for="page-format" class="block mb-2 text-sm font-medium text-gray-300">${tInterface('Page Format')}</label>
                <select id="page-format" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="a4">A4</option>
                    <option value="letter">Letter</option>
                </select>
            </div>
            <div>
                <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">${tInterface('Orientation')}</label>
                <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="portrait">Retrato</option>
                    <option value="landscape">Paisagem</option>
                </select>
            </div>
            <div>
                <label for="margin-size" class="block mb-2 text-sm font-medium text-gray-300">${tInterface('Margin Size')}</label>
                <select id="margin-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                    <option value="normal">Normal</option>
                    <option value="narrow">Estreita</option>
                    <option value="wide">Larga</option>
                </select>
            </div>
        </div>
        <div class="h-[50vh]">
            <label for="md-input" class="block mb-2 text-sm font-medium text-gray-300">${tInterface('Markdown Editor')}</label>
            <textarea id="md-input" class="w-full h-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 font-mono resize-none" placeholder="# Bem-vindo a Markdown..."></textarea>
        </div>
        <button id="process-btn" class="btn-gradient w-full mt-6">${tInterface('Create PDF from Markdown')}</button>
    `,
  'svg-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">${tInterface('SVG to PDF')}</h2>
        <p class="mb-6 text-gray-400">${tInterface('Converter uma ou mais imagens vetoriais SVG em um único arquivo PDF.')}</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/svg+xml', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'bmp-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">BMP para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens BMP em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/bmp', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'heic-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">HEIC para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens HEIC (High Efficiency) do iPhone ou câmera em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: '.heic,.heif', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'tiff-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">TIFF para PDF</h2>
        <p class="mb-6 text-gray-400">Converter uma ou mais imagens TIFF (simples ou múltiplas páginas) em um único arquivo PDF.</p>
        ${createFileInputHTML({ multiple: true, accept: 'image/tiff', showControls: true })}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para PDF</button>
    `,
  'pdf-to-bmp': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para BMP</h2>
        <p class="mb-6 text-gray-400">Converter cada página de um PDF em uma imagem BMP. Seus arquivos serão baixados em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para BMP & Baixar ZIP</button>
    `,
  'pdf-to-tiff': () => `
        <h2 class="text-2xl font-bold text-white mb-4">PDF para TIFF</h2>
        <p class="mb-6 text-gray-400">Converter cada página de um PDF em uma imagem TIFF de alta qualidade. Seus arquivos serão baixados em um ZIP.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6">Converter para TIFF & Baixar ZIP</button>
    `,

  'split-in-half': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Dividir Páginas ao Meio</h2>
        <p class="mb-6 text-gray-400">Escolha um método para dividir cada página do documento em duas páginas separadas.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="split-half-options" class="hidden mt-6">
            <label for="split-type" class="block mb-2 text-sm font-medium text-gray-300">Selecione o Tipo de Divisão</label>
            <select id="split-type" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-6">
                <option value="vertical">Dividir Verticalmente (Metades Esquerda & Direita)</option>
                <option value="horizontal">Dividir Horizontalmente (Metades Superior & Inferior)</option>
            </select>

            <button id="process-btn" class="btn-gradient w-full mt-6">Dividir PDF</button>
        </div>
    `,
  'page-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Analisar Dimensões da Página</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para ver dimensões precisas, tamanho padrão e orientação de cada página.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="dimensions-results" class="hidden mt-6">
            <div class="flex justify-end mb-4">
                <label for="units-select" class="text-sm font-medium text-gray-300 self-center mr-3">Unidades de Exibição:</label>
                <select id="units-select" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                    <option value="pt" selected>Pontos (pt)</option>
                    <option value="in">Polegadas (in)</option>
                    <option value="mm">Milímetros (mm)</option>
                    <option value="px">Pixels (a 96 DPI)</option>
                </select>
            </div>
            <div class="overflow-x-auto rounded-lg border border-gray-700">
                <table class="min-w-full divide-y divide-gray-700 text-sm text-left">
                    <thead class="bg-gray-900">
                        <tr>
                            <th class="px-4 py-3 font-medium text-white">Página #</th>
                            <th class="px-4 py-3 font-medium text-white">Dimensões (L x A)</th>
                            <th class="px-4 py-3 font-medium text-white">Tamanho Padrão</th>
                            <th class="px-4 py-3 font-medium text-white">Orientação</th>
                        </tr>
                    </thead>
                    <tbody id="dimensions-table-body" class="divide-y divide-gray-700">
                        </tbody>
                </table>
            </div>
        </div>
    `,

  'n-up': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Arranjo N‑Up de Páginas</h2>
        <p class="mb-6 text-gray-400">Combine várias páginas do seu PDF em uma única folha. Ótimo para livretos ou folhas de prova.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="n-up-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="pages-per-sheet" class="block mb-2 text-sm font-medium text-gray-300">Páginas por Folha</label>
                    <select id="pages-per-sheet" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="2">2-Up</option>
                        <option value="4" selected>4-Up (2x2)</option>
                        <option value="9">9-Up (3x3)</option>
                        <option value="16">16-Up (4x4)</option>
                    </select>
                </div>
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da Página de Saída</label>
                    <select id="output-page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="Letter">Letter (8.5 x 11 in)</option>
                        <option value="Legal">Legal (8.5 x 14 in)</option>
                        <option value="Tabloid">Tabloid (11 x 17 in)</option>
                        <option value="A4" selected>A4 (210 x 297 mm)</option>
                        <option value="A3">A3 (297 x 420 mm)</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação de Saída</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>Automatic</option>
                        <option value="portrait">Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
                <div class="flex items-end pb-1">
                     <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input type="checkbox" id="add-margins" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Adicionar Margens & Espaçamentos
                    </label>
                </div>
            </div>

            <div class="border-t border-gray-700 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center">
                     <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input type="checkbox" id="add-border" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Desenhar Borda ao Redor de Cada Página
                    </label>
                </div>
                 <div id="border-color-wrapper" class="hidden">
                    <label for="border-color" class="block mb-2 text-sm font-medium text-gray-300">Cor da Borda</label>
                     <input type="color" id="border-color" value="#000000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>

            <button id="process-btn" class="btn-gradient w-full mt-6">Criar PDF N‑Up</button>
        </div>
    `,

  'duplicate-organize': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Gerenciador de Páginas</h2>
        <p class="mb-6 text-gray-400">Arraste páginas para reordenar. Use o ícone <i data-lucide="copy-plus" class="inline-block w-4 h-4 text-green-400"></i> para duplicar uma página ou o ícone <i data-lucide="x-circle" class="inline-block w-4 h-4 text-red-400"></i> para excluir.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="page-manager-options" class="hidden mt-6">
             <div id="page-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 my-6">
                </div>
             <button id="process-btn" class="btn-gradient w-full mt-6">Salvar Novo PDF</button>
        </div>
    `,

  'combine-single-page': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Combinar em Única Página</h2>
        <p class="mb-6 text-gray-400">Una todas as páginas do seu PDF verticalmente para criar uma única página contínua e rolável.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="combine-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="page-spacing" class="block mb-2 text-sm font-medium text-gray-300">Espaçamento entre páginas (em pontos)</label>
                    <input type="number" id="page-spacing" value="18" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Cor de Fundo</label>
                    <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                </div>
            </div>
            <div>
                <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="add-separator" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Desenhar uma linha separadora entre páginas
                </label>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Combinar Páginas</button>
        </div>
    `,

  'fix-dimensions': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Padronizar Dimensões da Página</h2>
        <p class="mb-6 text-gray-400">Converta todas as páginas do seu PDF para um tamanho uniforme. Escolha um formato padrão ou defina dimensões personalizadas.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>

        <div id="fix-dimensions-options" class="hidden mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="target-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho Alvo</label>
                    <select id="target-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="Tabloid">Tabloid</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                        <option value="Custom">Custom Size...</option>
                    </select>
                </div>
                <div>
                    <label for="orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação</label>
                    <select id="orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="portrait" selected>Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
            </div>

            <div id="custom-size-wrapper" class="hidden p-4 rounded-lg bg-gray-900 border border-gray-700 grid grid-cols-3 gap-3">
                <div>
                    <label for="custom-width" class="block mb-2 text-xs font-medium text-gray-300">Largura</label>
                    <input type="number" id="custom-width" value="8.5" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-height" class="block mb-2 text-xs font-medium text-gray-300">Altura</label>
                    <input type="number" id="custom-height" value="11" class="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2">
                </div>
                <div>
                    <label for="custom-units" class="block mb-2 text-xs font-medium text-gray-300">Unidades</label>
                    <select id="custom-units" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                        <option value="in">Polegadas</option>
                        <option value="mm">Milímetros</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block mb-2 text-sm font-medium text-gray-300">Método de Escalonamento do Conteúdo</label>
                <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        <div>
                            <span class="font-semibold text-white">Ajustar</span>
                            <p class="text-xs text-gray-400">Preserva todo o conteúdo, pode adicionar barras brancas.</p>
                        </div>
                    </label>
                    <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                         <div>
                            <span class="font-semibold text-white">Preencher</span>
                            <p class="text-xs text-gray-400">Cobre a página, pode cortar conteúdo.</p>
                        </div>
                    </label>
                </div>
            </div>

             <div>
                <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Cor de Fundo (para o modo 'Ajustar')</label>
                <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>

            <button id="process-btn" class="btn-gradient w-full mt-6">Padronizar Páginas</button>
        </div>
    `,

  'change-background-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Alterar Cor de Fundo</h2>
        <p class="mb-6 text-gray-400">Selecione uma nova cor de fundo para todas as páginas do seu PDF.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="change-background-color-options" class="hidden mt-6">
            <label for="background-color" class="block mb-2 text-sm font-medium text-gray-300">Escolha a Cor de Fundo</label>
            <input type="color" id="background-color" value="#FFFFFF" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar Cor & Baixar</button>
        </div>
    `,

  'change-text-color': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Alterar Cor do Texto</h2>
        <p class="mb-6 text-gray-400">Altere a cor de textos escuros no seu PDF. Esse processo converte páginas em imagens, então o texto não será selecionável no arquivo final.</p>
        ${createFileInputHTML()}
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <div id="text-color-options" class="hidden mt-6 space-y-4">
            <div>
                <label for="text-color-input" class="block mb-2 text-sm font-medium text-gray-300">Selecionar Cor do Texto</label>
                <input type="color" id="text-color-input" value="#FF0000" class="w-full h-[42px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">Original</h3>
                    <canvas id="original-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
                <div class="text-center">
                    <h3 class="font-semibold text-white mb-2">Prévia</h3>
                    <canvas id="text-color-canvas" class="w-full h-auto rounded-lg border-2 border-gray-600"></canvas>
                </div>
            </div>
            <button id="process-btn" class="btn-gradient w-full mt-6">Aplicar Cor & Baixar</button>
        </div>
    `,

  'compare-pdfs': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Comparar PDFs</h2>
        <p class="mb-6 text-gray-400">Envie dois arquivos para compará-los visualmente usando sobreposição ou visualização lado a lado.</p>
        
        <div id="compare-upload-area" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="drop-zone-1" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-1" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-scan" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Enviar PDF Original</span></p>
                </div>
                <input id="file-input-1" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
            <div id="drop-zone-2" class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div id="file-display-2" class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-diff" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Enviar PDF Revisado</span></p>
                </div>
                <input id="file-input-2" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf">
            </div>
        </div>

        <div id="compare-viewer" class="hidden mt-6">
            <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <button id="prev-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
                <span class="text-white font-medium">Página <span id="current-page-display-compare">1</span> de <span id="total-pages-display-compare">1</span></span>
                <button id="next-page-compare" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div class="bg-gray-700 p-1 rounded-md flex gap-1">
                    <button id="view-mode-overlay" class="btn bg-indigo-600 px-3 py-1 rounded text-sm font-semibold">Sobreposição</button>
                    <button id="view-mode-side" class="btn px-3 py-1 rounded text-sm font-semibold">Lado a Lado</button>
                </div>
                <div class="border-l border-gray-600 h-6 mx-2"></div>
                <div id="overlay-controls" class="flex items-center gap-2">
                    <button id="flicker-btn" class="btn bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm font-semibold">Alternar</button>
                    <label for="opacity-slider" class="text-sm font-medium text-gray-300">Opacidade:</label>
                    <input type="range" id="opacity-slider" min="0" max="1" step="0.05" value="0.5" class="w-24">
                </div>
                <div id="side-by-side-controls" class="hidden flex items-center gap-2">
                    <label class="flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer">
                        <input type="checkbox" id="sync-scroll-toggle" checked class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                        Sincronizar Rolagem
                    </label>
                </div>
            </div>
            <div id="compare-viewer-wrapper" class="compare-viewer-wrapper overlay-mode">
                <div id="panel-1" class="pdf-panel"><canvas id="canvas-compare-1"></canvas></div>
                <div id="panel-2" class="pdf-panel"><canvas id="canvas-compare-2"></canvas></div>
            </div>
        </div>
    `,

  'ocr-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">OCR em PDF</h2>
    <p class="mb-6 text-gray-400">Converta PDFs digitalizados em documentos pesquisáveis. Selecione um ou mais idiomas presentes no arquivo para melhores resultados.</p>
    
    <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
        <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
        <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
            <li><strong class="text-white">Extrair Texto:</strong> Usa Tesseract OCR para reconhecer texto de imagens digitalizadas ou PDFs.</li>
            <li><strong class="text-white">Saída Pesquisável:</strong> Cria um novo PDF com camada de texto invisível, tornando o documento pesquisável e preservando a aparência original.</li>
            <li><strong class="text-white">Filtragem de Caracteres:</strong> Use listas de permissão para filtrar caracteres indesejados e melhorar a precisão para tipos específicos (notas fiscais, formulários etc.).</li>
            <li><strong class="text-white">Suporte Multilíngue:</strong> Selecione vários idiomas para documentos com conteúdo misto.</li>
        </ul>
    </div>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="ocr-options" class="hidden mt-6 space-y-4">
        <div>
            <label class="block mb-2 text-sm font-medium text-gray-300">Idiomas no Documento</label>
            <div class="relative">
                <input type="text" id="lang-search" class="w-full bg-gray-900 border border-gray-600 text-white rounded-lg p-2.5 mb-2" placeholder="Pesquisar idiomas...">
                <div id="lang-list" class="max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-2 bg-gray-900">
                    ${Object.entries(tesseractLanguages)
                      .map(
                        ([code, name]) => `
                        <label class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
                            <input type="checkbox" value="${code}" class="lang-checkbox w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                            ${name}
                        </label>
                    `
                      )
                      .join('')}
                </div>
            </div>
             <p class="text-xs text-gray-500 mt-1">Selecionados: <span id="selected-langs-display" class="font-semibold">Nenhum</span></p>
        </div>
        
        <!-- Advanced settings section -->
        <details class="bg-gray-900 border border-gray-700 rounded-lg p-3">
            <summary class="text-sm font-medium text-gray-300 cursor-pointer flex items-center justify-between">
                <span>Configurações Avançadas (Recomendado para melhorar a precisão)</span>
                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform details-icon"></i>
            </summary>
            <div class="mt-4 space-y-4">
                <!-- Resolution Setting -->
                <div>
                    <label for="ocr-resolution" class="block mb-1 text-xs font-medium text-gray-400">Resolução</label>
                    <select id="ocr-resolution" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                        <option value="2.0">Padrão (192 DPI)</option>
                        <option value="3.0" selected>Alta (288 DPI)</option>
                        <option value="4.0">Ultra (384 DPI)</option>
                    </select>
                </div>
                <!-- Binarization Toggle -->
                <label class="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" id="ocr-binarize" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                    Binarizar Imagem (Aumentar Contraste para Digitalizações Limpas)
                </label>
                
                <!-- Character Whitelist Presets -->
                <div>
                    <label for="whitelist-preset" class="block mb-1 text-xs font-medium text-gray-400">Predefinição de Lista de Caracteres</label>
                    <select id="whitelist-preset" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm mb-2">
                        <option value="">Nenhuma (Todos os caracteres)</option>
                        <option value="alphanumeric">Alfanumérico + Pontuação Básica</option>
                        <option value="numbers-currency">Números + Símbolos de Moeda</option>
                        <option value="letters-only">Somente Letras (A‑Z, a‑z)</option>
                        <option value="numbers-only">Somente Números (0‑9)</option>
                        <option value="invoice">Notas/Recibos (Números, $, ., -, /)</option>
                        <option value="forms">Formulários (Alfanumérico + Símbolos Comuns)</option>
                        <option value="custom">Personalizado...</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">Somente esses caracteres serão reconhecidos. Deixe vazio para todos os caracteres.</p>
                </div>
                
                <!-- Character Whitelist Input -->
                <div>
                    <label for="ocr-whitelist" class="block mb-1 text-xs font-medium text-gray-400">Lista de Caracteres Permitidos (Opcional)</label>
                    <input type="text" id="ocr-whitelist" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm" placeholder="ex., abcdefghijklmnopqrstuvwxyz0123456789$.,">
                    <p class="text-xs text-gray-500 mt-1">Somente esses caracteres serão reconhecidos. Deixe vazio para todos os caracteres.</p>
                </div>
            </div>
        </details>
        
        <button id="process-btn" class="btn-gradient w-full disabled:opacity-50" disabled>Iniciar OCR</button>
    </div>

    <div id="ocr-progress" class="hidden mt-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p id="progress-status" class="text-white mb-2">Inicializando...</p>
        <div class="w-full bg-gray-700 rounded-full h-4">
            <div id="progress-bar" class="bg-indigo-600 h-4 rounded-full transition-width duration-300" style="width: 0%"></div>
        </div>
        <pre id="progress-log" class="mt-4 text-xs text-gray-400 max-h-32 overflow-y-auto bg-black p-2 rounded-md"></pre>
    </div>

    <div id="ocr-results" class="hidden mt-6">
        <h3 class="text-xl font-bold text-white mb-2">OCR Concluído</h3>
        <p class="mb-4 text-gray-400">Seu PDF pesquisável está pronto. Você também pode copiar ou baixar o texto extraído abaixo.</p>
        <div class="relative">
            <textarea id="ocr-text-output" rows="10" class="w-full bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-2.5 font-sans" readonly></textarea>
            <button id="copy-text-btn" class="absolute top-2 right-2 btn bg-gray-700 hover:bg-gray-600 p-2 rounded-md" title="Copiar para a Área de Transferência">
                <i data-lucide="clipboard-copy" class="w-4 h-4 text-gray-300"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button id="download-txt-btn" class="btn w-full bg-gray-700 text-white font-semibold py-3 rounded-lg hover:bg-gray-600">Baixar como .txt</button>
            <button id="download-searchable-pdf" class="btn w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700">Baixar PDF Pesquisável</button>
        </div>
    </div>
`,

  'word-to-pdf': () => `
        <h2 class="text-2xl font-bold text-white mb-4">Word para PDF</h2>
        <p class="mb-6 text-gray-400">Envie um arquivo .docx para convertê-lo em um PDF de alta qualidade com texto selecionável. Layouts complexos podem não ser preservados perfeitamente.</p>
        
        <div id="file-input-wrapper">
             <div class="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900 hover:bg-gray-700">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <i data-lucide="file-text" class="w-10 h-10 mb-3 text-gray-400"></i>
                    <p class="mb-2 text-sm text-gray-400"><span class="font-semibold">Clique para selecionar um arquivo</span> ou arraste e solte</p>
                    <p class="text-xs text-gray-500">Um único arquivo .docx</p>
                </div>
                <input id="file-input" type="file" class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </div>
        </div>
        
        <div id="file-display-area" class="mt-4 space-y-2"></div>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Pré‑visualizar & Converter</button>
    `,

  'sign-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Assinar PDF</h2>
    <p class="mb-6 text-gray-400">${tInterface('Create your signature, select it, then click on the document to place. You can drag to move placed signatures.')}</p>
    ${createFileInputHTML()}
    
    <div id="signature-editor" class="hidden mt-6">
        <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
            <div class="flex border-b border-gray-700 mb-4">
                <button id="draw-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-indigo-500 text-white">Desenhar</button>
                <button id="type-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">Digitar</button>
                <button id="upload-tab-btn" class="flex-1 p-2 text-sm font-semibold border-b-2 border-transparent text-gray-400">Enviar</button>
            </div>
            
            <div id="draw-panel">
                <canvas id="signature-draw-canvas" class="bg-white rounded-md cursor-crosshair w-full" height="150"></canvas>
                
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-4 sm:gap-2">
                    <div class="flex items-center gap-2">
                        <label for="signature-color" class="text-sm font-medium text-gray-300">Cor:</label>
                        <input type="color" id="signature-color" value="#22c55e" class="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="clear-draw-btn" class="btn hover:bg-gray-600 text-sm flex-grow sm:flex-grow-0">Limpar</button>
                        <button id="save-draw-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg flex-grow sm:flex-grow-0">Salvar Assinatura</button>
                    </div>
                </div>
            </div>

            <div id="type-panel" class="hidden">
                <input type="text" id="signature-text-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 mb-4" placeholder="Digite seu nome aqui">
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label for="font-family-select" class="block mb-1 text-xs font-medium text-gray-400">Estilo da Fonte</label>
                        <select id="font-family-select" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
                            <option value="'Great Vibes', cursive">Assinatura</option>
                            <option value="'Kalam', cursive">Manuscrita</option>
                            <option value="'Dancing Script', cursive">Caligrafia</option>
                            <option value="'Lato', sans-serif">Regular</option>
                            <option value="'Merriweather', serif">Formal</option>
                        </select>
                    </div>
                     <div>
                        <label for="font-size-slider" class="block mb-1 text-xs font-medium text-gray-400">Tamanho da Fonte (<span id="font-size-value">48</span>px)</label>
                        <input type="range" id="font-size-slider" min="24" max="72" value="32" class="w-full">
                    </div>
                    <div>
                        <label for="font-color-picker" class="block mb-1 text-xs font-medium text-gray-400">Cor</label>
                        <input type="color" id="font-color-picker" value="#22c55e" class="w-full h-[38px] bg-gray-700 border border-gray-600 rounded-lg p-1 cursor-pointer">
                    </div>
                </div>

                <div id="font-preview" class="p-4 h-[80px] bg-transparent rounded-md flex items-center justify-center text-4xl" style="font-family: 'Great Vibes', cursive; font-size: 32px; color: #22c55e;">Seu Nome</div>
                 
                <div class="flex justify-end mt-4">
                    <button id="save-type-btn" class="btn-gradient px-4 py-2 text-sm rounded-lg">Salvar Assinatura</button>
                </div>
            </div>

            <div id="upload-panel" class="hidden">
                <input type="file" id="signature-upload-input" accept="image/png" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700">
                *apenas arquivos PNG
            </div>
            
            <hr class="border-gray-700 my-4">
            <h4 class="text-md font-semibold text-white mb-2">Assinaturas Salvas</h4>
            <div id="saved-signatures-container" class="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-md min-h-[50px]">
                <p class="text-xs text-gray-500 text-center w-full">Suas assinaturas salvas aparecerão aqui. Clique em uma para selecionar.</p>
            </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <button id="prev-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left"></i></button>
            <span class="text-white font-medium">Página <span id="current-page-display-sign">1</span> de <span id="total-pages-display-sign">1</span></span>
            <button id="next-page-sign" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-out"></i></button>
            <button id="fit-width-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="minimize"></i></button>
            <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600"><i data-lucide="zoom-in"></i></button>
            <div class="border-l border-gray-600 h-6 mx-2 hidden sm:block"></div>
            <button id="undo-btn" class="btn p-2 rounded-full" title="${tInterface('Undo Last Placement')}"><i data-lucide="undo-2"></i></button>
        </div>

        <div id="canvas-container-sign" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 h-[60vh] md:h-[80vh]">
            <canvas id="canvas-sign" class="mx-auto"></canvas>
        </div>

    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">${tInterface('Apply Signatures & Download PDF')}</button>
`,

  'remove-annotations': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Remover anotações</h2>
    <p class="mb-6 text-gray-400">Selecione os tipos de anotações a serem removidas de todas as páginas ou de um intervalo específico.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-annotations-options" class="hidden mt-6 space-y-6">
        <div>
            <h3 class="text-lg font-semibold text-white mb-2">1. Escolha a página</h3>
            <div class="flex gap-4 p-2 rounded-lg bg-gray-900">
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="all" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">Todas as páginas</span>
                </label>
                <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
                    <input type="radio" name="page-scope" value="specific" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    <span class="font-semibold text-white">Página especifica</span>
                </label>
            </div>
            <div id="page-range-wrapper" class="hidden mt-2">
                 <input type="text" id="page-range-input" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="e.x., 1-3, 5, 8">
                 <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages"></span></p>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-semibold text-white mb-2">2. Selecione Tipos de Anotações para Remover</h3>
            <div class="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div class="border-b border-gray-700 pb-2">
                    <label class="flex items-center gap-2 font-semibold text-white cursor-pointer">
                        <input type="checkbox" id="select-all-annotations" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600">
                        Marcar todos / Desmarcar todos
                    </label>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2">
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Highlight"> Realce</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="StrikeOut"> Tachado</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Underline"> Sublinhado</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Ink"> Tinta / Desenho</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Polygon"> Polígono</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Square"> Quadrado</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Circle"> Círculo</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Line"> Linha / Seta</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="PolyLine"> Polilinha</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Link"> Link</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Text"> Texto (Nota)</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FreeText"> Texto Livre</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Popup"> Popup / Comentário</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Squiggly"> Zigue‑zague</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Stamp"> Carimbo</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="Caret"> Caret</label>
            <label class="flex items-center gap-2"><input type="checkbox" class="annot-checkbox" value="FileAttachment"> Anexo de Arquivo</label>
                </div>
            </div>
        </div>
    </div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6">Remover Anotações Selecionadas</button>
`,

  cropper: () => `
    <h2 class="text-2xl font-bold text-white mb-4">PDF Cropper</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para cortar visualmente uma ou mais páginas. Esta ferramenta oferece pré‑visualização ao vivo e dois modos distintos de corte.</p>
    
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    
    <div id="cropper-ui-container" class="hidden mt-6">
        
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-6">
            <p class="text-sm text-gray-300"><strong class="text-white">Como Funciona:</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li><strong class="text-white">Pré-Visualização ao Vivo:</strong> Veja a sua seleção de cultivo em tempo real antes de aplicá-la.</li>
                <li><strong class="text-white">Modo Não Destrutivo:</strong> Este é o modo padrão. Ele simplesmente "oculta" o conteúdo cortado ajustando as margens da página. O texto e os dados originais são preservados no arquivo.</li>
                <li><strong class="text-white">Modo Destrutivo:</strong> Esta opção remove permanentemente o conteúdo cortado, achatando o PDF. Use-a para máxima segurança e tamanho de arquivo menor, mas observe que ela removerá o texto selecionável.</li>
            </ul>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4 mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div class="flex items-center gap-2">
                 <button id="prev-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <span id="page-info" class="text-white font-medium">Page 0 of 0</span>
                <button id="next-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
            </div>
            
            <div class="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="destructive-crop-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Ativar corte destrutivo
                </label>
                 <label class="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <input type="checkbox" id="apply-to-all-toggle" class="w-4 h-4 rounded text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                    Aplicar a todas as páginas
                </label>
            </div>
        </div>
        
        <div id="status" class="text-center italic text-gray-400 mb-4">Selecione um arquivo PDF para começar.</div>
        <div id="cropper-container" class="w-full relative overflow-hidden flex items-center justify-center bg-gray-900 rounded-lg border border-gray-600 min-h-[500px]"></div>
        
        <button id="crop-button" class="btn-gradient w-full mt-6" disabled>Cortar & Baixar</button>
    </div>
`,

  'form-filler': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Preenchimento de formulários em PDF</h2>
        <p class="mb-6 text-gray-400">Envie um PDF para preencher campos de formulário existentes. A visualização à direita será atualizada conforme você digita.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <div id="form-filler-options" class="hidden mt-6">
        <div class="flex flex-col lg:flex-row gap-4 h-[80vh]">
            
            <!-- Sidebar for form fields -->
            <div class="w-full lg:w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto border border-gray-700 flex-shrink-0">
                <div id="form-fields-container" class="space-y-4">
                    <div class="p-4 text-center text-gray-400">
        <p>Envie um arquivo para ver os campos de formulário aqui.</p>
                    </div>
                </div>
            </div>

            <!-- PDF Viewer -->
            <div class="w-full lg:w-2/3 flex flex-col items-center gap-4">
                <div class="flex flex-nowrap items-center justify-center gap-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <button id="prev-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        <i data-lucide="chevron-left" class="w-5 h-5"></i>
                    </button>
                    <span class="text-white font-medium">
                        Página <span id="current-page-display">1</span> de <span id="total-pages-display">1</span>
                    </span>
                    <button id="next-page" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50">
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>
                    <button id="zoom-out-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                        <i data-lucide="zoom-out"></i>
                    </button>
                    <button id="zoom-in-btn" class="btn p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                        <i data-lucide="zoom-in"></i>
                    </button>
                </div>

                <div id="pdf-viewer-container" class="relative w-full overflow-auto bg-gray-900 rounded-lg border border-gray-600 flex-grow">
                    <canvas id="pdf-canvas" class="mx-auto max-w-full h-full"></canvas>
                </div>
            </div>
        </div>
        
        <button id="process-btn" class="btn-gradient w-full mt-6 hidden">Salvar & Baixar</button>
    </div>
`,

  posterize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Posterize PDF</h2>
    <p class="mb-6 text-gray-400">Divida as páginas em várias folhas menores para imprimir como um pôster. Navegue pela pré-visualização e veja a grade atualizar de acordo com suas configurações.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="posterize-options" class="hidden mt-6 space-y-6">

        <div class="space-y-2">
             <label class="block text-sm font-medium text-gray-300">Pré-visualização da página (<span id="current-preview-page">1</span> / <span id="total-preview-pages">1</span>)</label>
            <div id="posterize-preview-container" class="relative w-full max-w-xl mx-auto bg-gray-900 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                <button id="prev-preview-page" class="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-left"></i></button>
                <canvas id="posterize-preview-canvas" class="w-full h-auto rounded-md"></canvas>
                <button id="next-preview-page" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-gray-700 disabled:opacity-50 z-10"><i data-lucide="chevron-right"></i></button>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Layout da grade</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="posterize-rows" class="block mb-2 text-sm font-medium text-gray-300">Linhas</label>
                    <input type="number" id="posterize-rows" value="1" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
                <div>
                    <label for="posterize-cols" class="block mb-2 text-sm font-medium text-gray-300">Colunas</label>
                    <input type="number" id="posterize-cols" value="2" min="1" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Configurações da página de saída</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="output-page-size" class="block mb-2 text-sm font-medium text-gray-300">Tamanho da página</label>
                    <select id="output-page-size" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="A4" selected>A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="A3">A3</option>
                        <option value="A5">A5</option>
                    </select>
                </div>
                <div>
                    <label for="output-orientation" class="block mb-2 text-sm font-medium text-gray-300">Orientação</label>
                    <select id="output-orientation" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <option value="auto" selected>Automatic (Recommended)</option>
                        <option value="portrait">Retrato</option>
                        <option value="landscape">Paisagem</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-semibold text-white mb-3">Opções Avançadas</h3>
            <div class="space-y-4">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-300">Dimensionamento de conteúdo</label>
                    <div class="flex gap-4 p-2 rounded-lg bg-gray-800">
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fit" checked class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                            <div>
                                <span class="font-semibold text-white">Ajustar</span>
                                <p class="text-xs text-gray-400">Preserva todo o conteúdo, pode adicionar margens.</p>
                            </div>
                        </label>
                        <label class="flex-1 flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 cursor-pointer has-[:checked]:bg-indigo-600">
                            <input type="radio" name="scaling-mode" value="fill" class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500">
                             <div>
                                <span class="font-semibold text-white">Preencher (Recorte)</span>
                                <p class="text-xs text-gray-400">Preenche a página, pode recortar o conteúdo.</p>
                            </div>
                        </label>
                    </div>
                </div>
                 <div>
                    <label for="overlap" class="block mb-2 text-sm font-medium text-gray-300">Overlap (para montagem)</label>
                    <div class="flex items-center gap-2">
                        <input type="number" id="overlap" value="0" min="0" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                        <select id="overlap-units" class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5">
                            <option value="pt">Ponto</option>
                            <option value="in">Polegada</option>
                            <option value="mm">mm</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <label for="page-range" class="block mb-2 text-sm font-medium text-gray-300">Intervalo de páginas (opcional)</label>
        <input type="text" id="page-range" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="ex.: 1-3, 5">
                    <p class="text-xs text-gray-400 mt-1">Total de páginas: <span id="total-pages">0</span></p>
                </div>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Posterizar PDF</button>
    </div>
`,

  'remove-blank-pages': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Remover Páginas em Branco</h2>
    <p class="mb-6 text-gray-400">Remova automaticamente páginas em branco ou quase em branco do seu PDF. Ajuste a sensibilidade para controlar o que é considerado "em branco".</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="remove-blank-options" class="hidden mt-6 space-y-4">
        <div>
            <label for="sensitivity-slider" class="block mb-2 text-sm font-medium text-gray-300">
                Sensibilidade (<span id="sensitivity-value">99</span>%)
            </label>
            <input type="range" id="sensitivity-slider" min="80" max="100" value="99" class="w-full">
            <p class="text-xs text-gray-400 mt-1">A sensibilidade mais alta requer que as páginas sejam mais "em branco" para serem removidas.</p>
        </div>
        
        <div id="analysis-preview" class="hidden p-4 bg-gray-900 border border-gray-700 rounded-lg">
             <h3 class="text-lg font-semibold text-white mb-2">Resultados da Análise</h3>
             <p id="analysis-text" class="text-gray-300"></p>
             <div id="removed-pages-thumbnails" class="mt-4 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2"></div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">Remover Páginas em Branco & Baixar</button>
    </div>
`,

  'alternate-merge': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Alternar & Misturar Páginas</h2>
    <p class="mb-6 text-gray-400">Combine páginas de 2 ou mais documentos, alternando entre eles. Arraste os arquivos para definir a ordem de mistura (por exemplo, Página 1 do Doc A, Página 1 do Doc B, Página 2 do Doc A, Página 2 do Doc B, etc.).</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })}
    
    <div id="alternate-merge-options" class="hidden mt-6">
        <div class="p-3 bg-gray-900 rounded-lg border border-gray-700 mb-3">
            <p class="text-sm text-gray-300"><strong class="text-white">Como funciona:</strong></p>
            <ul class="list-disc list-inside text-xs text-gray-400 mt-1 space-y-1">
                <li>A ferramenta pegará uma página de cada documento na ordem que você especificar abaixo, e repetirá para a próxima página até que todas as páginas sejam usadas.</li>
                <li>Se um documento terminar antes de todas as páginas, ele será ignorado, e a ferramenta continuará alternando com os documentos restantes.</li>
            </ul>
        </div>
        <ul id="alternate-file-list" class="space-y-2"></ul>
        <button id="process-btn" class="btn-gradient w-full mt-6" disabled>Alternar & Misturar PDFs</button>
    </div>
`,

  linearize: () => `
    <h2 class="text-2xl font-bold text-white mb-4">Linearizar PDFs (Visualização Rápida)</h2>
    <p class="mb-6 text-gray-400">Otimize múltiplos PDFs para carregamento mais rápido na web. Os arquivos serão baixados em um arquivo ZIP.</p>
    ${createFileInputHTML({ multiple: true, accept: 'application/pdf', showControls: true })} 
    <div id="file-display-area" class="mt-4 space-y-2"></div>
    <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>Linearizar PDFs & Baixar ZIP</button> 
  `,
  'add-attachments': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Incorporar Arquivos em PDFs</h2>
        <p class="mb-6 text-gray-400">Primeiro, envie o PDF ao qual deseja adicionar arquivos.</p>
    ${createFileInputHTML({ accept: 'application/pdf' })}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="attachment-options" class="hidden mt-8">
      <h3 class="text-lg font-semibold text-white mb-3">Enviar Arquivos para Anexar</h3>
      <p class="mb-4 text-gray-400">Selecione um ou mais arquivos para incorporar no PDF. Você pode anexar qualquer tipo de arquivo (imagens, documentos, planilhas etc.).</p>
      
      <label for="attachment-files-input" class="w-full flex justify-center items-center px-6 py-10 bg-gray-900 text-gray-400 rounded-lg border-2 border-dashed border-gray-600 hover:bg-gray-800 hover:border-gray-500 cursor-pointer transition-colors">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          <span class="mt-2 block text-sm font-medium">Clique para enviar arquivos</span>
          <span class="mt-1 block text-xs">Qualquer tipo de arquivo, múltiplos permitidos</span>
        </div>
        <input id="attachment-files-input" name="attachment-files" type="file" class="sr-only" multiple>
      </label>

      <div id="attachment-file-list" class="mt-4 space-y-2"></div>

      <button id="process-btn" class="hidden btn-gradient w-full mt-6" disabled>Incorporar Arquivos & Baixar</button>
    </div>
  `,

  'sanitize-pdf': () => `
    <h2 class="text-2xl font-bold text-white mb-4">Sanitizar PDF</h2>
    <p class="mb-6 text-gray-400">Remova informações potencialmente sensíveis ou desnecessárias do seu PDF antes de compartilhar. Selecione os itens que deseja remover.</p>
    ${createFileInputHTML()}
    <div id="file-display-area" class="mt-4 space-y-2"></div>

    <div id="sanitize-pdf-options" class="hidden mt-6 space-y-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <h3 class="text-lg font-semibold text-white mb-3">Opções de Sanitização</h3>
    <div>
            <strong class="font-semibold text-yellow-200">Observação:</strong>
            Remover <code class="bg-gray-700 px-1 rounded text-white">Fontes Embutidas</code> pode quebrar a renderização de texto! O texto pode não exibir corretamente ou nem aparecer. Use apenas se tiver certeza de que o visualizador possui fontes substitutas.
    </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Segurança Essencial</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="flatten-forms" name="sanitizeOption" value="flatten-forms" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Achatar Campos de Formulário</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-metadata" name="sanitizeOption" value="metadata" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Todos os Metadados</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-annotations" name="sanitizeOption" value="annotations" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Anotações</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-javascript" name="sanitizeOption" value="javascript" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover JavaScript</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-embedded-files" name="sanitizeOption" value="embeddedFiles" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Arquivos Embutidos</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-layers" name="sanitizeOption" value="layers" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Camadas (OCG)</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-links" name="sanitizeOption" value="links" checked class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Links Externos</span>
                </label>
            </div>
        </div>

        <div>
            <h4 class="text-sm font-semibold text-gray-400 mb-2">Opções Adicionais</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-structure-tree" name="sanitizeOption" value="structure" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Árvore de Estrutura</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-markinfo" name="sanitizeOption" value="markinfo" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white">Remover Informações de Marcação</span>
                </label>
                <label class="flex items-center space-x-2 p-3 rounded-md bg-gray-800 hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" id="remove-fonts" name="sanitizeOption" value="fonts" class="w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500">
                    <span class="text-white text-sm">Remover Fontes Embutidas</span>
                </label>
            </div>
        </div>

        <button id="process-btn" class="btn-gradient w-full mt-6">Sanitizar PDF e Baixar</button>
    </div>
`,

  'remove-restrictions': () => `
  <h2 class="text-2xl font-bold text-white mb-4">Remover Restrições de PDF</h2>
  <p class="mb-6 text-gray-400">Remove restrições de segurança e desbloqueia as permissões de edição e impressão do PDF.</p>
  ${createFileInputHTML()}
  <div id="file-display-area" class="mt-4 space-y-2"></div>
  <div id="remove-restrictions-options" class="hidden space-y-4 mt-6">
        <div class="p-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 rounded-lg">
          <h3 class="font-semibold text-base mb-2"> Como Funciona </h3>
          <p class="text-sm text-gray-300 mb-2">Esta operação irá:</p>
          <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
            <li>Remover todas as restrições de permissão (impressão, cópia, edição)</li>
            <li>Remover a criptografia, mesmo se o arquivo estiver criptografado</li>
            <li>Remover restrições de segurança associadas a arquivos PDF assinados digitalmente (isso invalidará as assinaturas)</li>
            <li>Criar um PDF totalmente editável e sem restrições</li>
          </ul>
      </div>

      <div>
          <label for="owner-password-remove" class="block mb-2 text-sm font-medium text-gray-300">Senha do Proprietário (se necessário)</label>
          <input type="password" id="owner-password-remove" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5" placeholder="Deixe em branco se o PDF não tiver senha">
          <p class="text-xs text-gray-500 mt-1">Insira a senha do proprietário se o PDF estiver protegido por senha</p>
      </div>

<div class="p-4 bg-red-900/20 border border-red-500/30 text-red-200 rounded-lg">
  <h3 class="font-semibold text-base mb-2">Aviso</h3>
  <p class="text-sm text-gray-300 mb-2">Esta ferramenta é destinada a fins legítimos, como:</p>
  <ul class="text-sm text-gray-300 list-disc list-inside space-y-1 ml-2">
    <li>Remover restrições de PDFs que você possui ou tem permissão para modificar</li>
    <li>Recuperar acesso a um PDF quando você legitimamente esqueceu a senha</li>
    <li>Acessar conteúdo que você comprou ou criou legalmente</li>
    <li>Editar documentos para fins autorizados de negócios</li>
    <li>Abrir documentos para fluxos de trabalho legítimos de arquivamento, conformidade ou recuperação</li>
    <li class="font-semibold">Limitações: esta ferramenta pode remover restrições apenas de PDFs protegidos fracamente ou PDFs que não têm senha do proprietário definida. Não pode remover ou ultrapassar a criptografia AES‑256 (256‑bit).</li>
  </ul>
  <p class="text-sm text-gray-300 mt-3 font-semibold">
    Uso Ilegal: usar esta ferramenta para ultrapassar proteções de direitos autorais, violar direitos de propriedade intelectual ou acessar documentos sem autorização é ilegal em sua jurisdição. Não nos responsabilizamos por qualquer mau uso desta ferramenta — se você não está seguro, consulte um advogado legal ou o proprietário do documento antes de prosseguir.
  </p>
</div>
      <button id="process-btn" class="btn-gradient w-full mt-6">Remover Restrições e Baixar</button>
  </div>
`,
};
