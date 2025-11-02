import createModule from '@neslinesli93/qpdf-wasm';
import { showLoader, hideLoader, showAlert } from '../ui';
import { readFileAsArrayBuffer, downloadFile } from '../utils/helpers';
import { state } from '../state';
import JSZip from 'jszip';
import { tMessage, tProgress } from '../i18n';

let qpdfInstance: any = null;

async function initializeQpdf() {
  if (qpdfInstance) {
    return qpdfInstance;
  }
  showLoader(tProgress('Inicializando motor de otimização...'));
  try {
    qpdfInstance = await createModule({
      locateFile: () => '/qpdf.wasm',
    });
  } catch (error) {
    console.error(tMessage('Falha ao inicializar qpdf-wasm:'), error);
    showAlert(
      tMessage('Erro na Inicialização'),
      tMessage('Não foi possível carregar o motor de otimização. Por favor, atualize a página e tente novamente.')
    );
    throw error;
  } finally {
    hideLoader();
  }
  return qpdfInstance;
}

export async function linearizePdf() {
  // Check if there are files and at least one PDF
  const pdfFiles = state.files.filter(
    (file: File) => file.type === 'application/pdf'
  );
  if (!pdfFiles || pdfFiles.length === 0) {
    showAlert(tMessage('Nenhum Arquivo PDF'), tMessage('Por favor, envie pelo menos um arquivo PDF.'));
    return;
  }

  showLoader(tProgress('Otimizando PDFs para visualização web (linearizando)...'));
  const zip = new JSZip(); // Create a JSZip instance
  let qpdf: any;
  let successCount = 0;
  let errorCount = 0;

  try {
    qpdf = await initializeQpdf();

    for (let i = 0; i < pdfFiles.length; i++) {
      const file = pdfFiles[i];
      const inputPath = `/input_${i}.pdf`;
      const outputPath = `/output_${i}.pdf`;

      showLoader(tProgress(`Otimizando ${file.name} (${i + 1}/${pdfFiles.length})...`));

      try {
        const fileBuffer = await readFileAsArrayBuffer(file);
        const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

        qpdf.FS.writeFile(inputPath, uint8Array);

        const args = [inputPath, '--linearize', outputPath];

        qpdf.callMain(args);

        const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });
        if (!outputFile || outputFile.length === 0) {
          console.error(
            tMessage(`Linearização resultou em um arquivo vazio para ${file.name}.`)
          );
          throw new Error(tMessage(`Processamento falhou para ${file.name}.`));
        }

        zip.file(tMessage(`linearized-${file.name}`), outputFile, { binary: true });
        successCount++;
      } catch (fileError: any) {
        errorCount++;
        console.error(tMessage(`Falha na linearização de ${file.name}:`), fileError);
        // Optionally add an error marker/file to the zip? For now, we just skip.
      } finally {
        // Clean up WASM filesystem for this file
        try {
          if (qpdf?.FS) {
            if (qpdf.FS.analyzePath(inputPath).exists) {
              qpdf.FS.unlink(inputPath);
            }
            if (qpdf.FS.analyzePath(outputPath).exists) {
              qpdf.FS.unlink(outputPath);
            }
          }
        } catch (cleanupError) {
          console.warn(
            tMessage(`Falha ao limpar o sistema de arquivos WASM para ${file.name}: `),
            cleanupError
          );
        }
      }
    }

    if (successCount === 0) {
      throw new Error(tMessage('Nenhum arquivo PDF pôde ser linearizado.'));
    }

    showLoader(tProgress('Gerando arquivo ZIP...'));
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'linearized-pdfs.zip');

    let alertMessage = tMessage(`${successCount} PDF(s) linearizados com sucesso.`);
    if (errorCount > 0) {
      alertMessage += tMessage(` ${errorCount} arquivo(s) falhou.`);
    }
    showAlert(tMessage('Processamento Concluído'), alertMessage);
  } catch (error: any) {
    console.error(tMessage('Erro no Processamento'), error);
    showAlert(
      tMessage('Processamento Falhou'),
      tMessage(`Ocorreu um erro: ${error.message || 'Erro desconhecido'}.`)
    );
  } finally {
    hideLoader();
  }
}
