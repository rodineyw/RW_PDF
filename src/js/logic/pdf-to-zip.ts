import { showLoader, hideLoader, showAlert } from '../ui.js';
import { downloadFile, readFileAsArrayBuffer } from '../utils/helpers.js';
import { state } from '../state.js';
import JSZip from 'jszip';

export async function pdfToZip() {
  if (state.files.length === 0) {
    showAlert('Nenhum Arquivo', 'Por favor, selecione um ou mais arquivos PDF.');
    return;
  }
  showLoader('Criando arquivo ZIP...');
  try {
    const zip = new JSZip();
    for (const file of state.files) {
      const fileBuffer = await readFileAsArrayBuffer(file);
      zip.file(file.name.replace(/\.pdf$/i, '.zip'), fileBuffer as ArrayBuffer);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'pdfs.zip');
  } catch (e) {
    console.error(e);
    showAlert('Erro', 'Falha ao criar arquivo ZIP.');
  } finally {
    hideLoader();
  }
}
