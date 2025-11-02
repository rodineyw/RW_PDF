import { showLoader, hideLoader, showAlert } from '../ui.js';
import { downloadFile } from '../utils/helpers.js';
import { state } from '../state.js';

export function flattenFormsInDoc(pdfDoc) {
  const form = pdfDoc.getForm();
  form.flatten();
}

export async function flatten() {
  if (!state.pdfDoc) {
    showAlert('Erro', 'O PDF não foi carregado.');
    return;
  }
  showLoader('Aplicando flatten...');
  try {
    flattenFormsInDoc(state.pdfDoc);

    const flattenedBytes = await state.pdfDoc.save();
    downloadFile(
      new Blob([flattenedBytes], { type: 'application/pdf' }),
      'flattened.pdf'
    );
  } catch (e) {
    console.error(e);
    if (e.message.includes('getForm')) {
      showAlert(
        'Nenhum Campo Encontrado',
        'Este PDF não contém nenhum campo para aplicação do flatten.'
      );
    } else {
      showAlert('Erro', 'Ocorreu um erro ao aplicar o flatten.');
    }
  } finally {
    hideLoader();
  }
}
