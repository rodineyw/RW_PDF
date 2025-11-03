import { showLoader, hideLoader, showAlert } from '../ui.js';
import { downloadFile } from '../utils/helpers.js';
import { state } from '../state.js';
import { PDFName } from 'pdf-lib';

export function removeMetadataFromDoc(pdfDoc) {
  const infoDict = pdfDoc.getInfoDict();
  const allKeys = infoDict.keys();
  allKeys.forEach((key: any) => {
    infoDict.delete(key);
  });

  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');

  try {
    const catalogDict = pdfDoc.catalog.dict;
    if (catalogDict.has(PDFName.of('Metadata'))) {
      catalogDict.delete(PDFName.of('Metadata'));
    }
  } catch (e) {
    console.warn('Não foi possível remover os metadados XMP:', e.message);
  }

  try {
    const context = pdfDoc.context;
    if (context.trailerInfo) {
      delete context.trailerInfo.ID;
    }
  } catch (e) {
    console.warn('Não foi possível remover os IDs do documento:', e.message);
  }

  try {
    const catalogDict = pdfDoc.catalog.dict;
    if (catalogDict.has(PDFName.of('PieceInfo'))) {
      catalogDict.delete(PDFName.of('PieceInfo'));
    }
  } catch (e) {
    console.warn('Não foi possível remover o PieceInfo:', e.message);
  }
}

export async function removeMetadata() {
  showLoader('Removendo todos os metadados...');
  try {
    removeMetadataFromDoc(state.pdfDoc);

    const newPdfBytes = await state.pdfDoc.save();
    downloadFile(
      new Blob([newPdfBytes], { type: 'application/pdf' }),
      'documento-sem-metadados.pdf'
    );
  } catch (e) {
    console.error(e);
    showAlert('Erro', 'Ocorreu um erro ao remover os metadados.');
  } finally {
    hideLoader();
  }
}
