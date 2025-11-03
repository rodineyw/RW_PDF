import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';

export async function removeRestrictions() {
  const file = state.files[0];
  const password =
    (document.getElementById('owner-password-remove') as HTMLInputElement)
      ?.value || '';

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader('Inicializando...');
    qpdf = await initializeQpdf();

    showLoader('Lendo o PDF...');
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader('Removendo restrições...');

    const args = [inputPath];

    if (password) {
      args.push(`--password=${password}`);
    }

    args.push('--decrypt', '--remove-restrictions', '--', outputPath);

    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('qpdf execution error:', qpdfError);
      if (
        qpdfError.message?.includes('password') ||
        qpdfError.message?.includes('encrypt')
      ) {
        throw new Error(
          'Falha ao remover restrições. O PDF pode exigir a senha do proprietário correta.'
        );
      }

      throw new Error(
        'Falha ao remover restrições: ' +
          (qpdfError.message || 'Erro desconhecido')
      );
    }

    showLoader('Preparando download...');
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (!outputFile || outputFile.length === 0) {
      throw new Error('Operação resultou em um arquivo vazio.');
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `documento-sem-restricoes-${file.name}`);

    hideLoader();

    showAlert(
      'Sucesso',  
      'PDF restrições removidas com sucesso! O arquivo agora é totalmente editável e imprimível.'
    );
  } catch (error: any) {
    console.error('Erro durante a remoção de restrições:', error);
    hideLoader();
    showAlert(
      'Operação Falhou',
      `Ocorreu um erro: ${error.message || 'O PDF pode estar corrompido ou protegido por senha.'}`
    );
  } finally {
    try {
      if (qpdf?.FS) {
        try {
          qpdf.FS.unlink(inputPath);
        } catch (e) {
          console.warn('Falha ao remover arquivo de entrada:', e);
        }
        try {
          qpdf.FS.unlink(outputPath);
        } catch (e) {
          console.warn('Falha ao remover arquivo de saída:', e);
        }
      }
    } catch (cleanupError) {
      console.warn('Falha ao limpar o sistema de arquivos WASM:', cleanupError);
    }
  }
}
