import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';

export async function decrypt() {
  const file = state.files[0];
  const password = (
    document.getElementById('password-input') as HTMLInputElement
  )?.value;

  if (!password) {
    showAlert('Campo Obrigatório', 'Por favor, insira a senha do PDF.');
    return;
  }

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader('Inicializando descriptografia...');
    qpdf = await initializeQpdf();

    showLoader('Lendo PDF criptografado...');
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);

    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader('Descriptografando PDF...');

    const args = [inputPath, '--password=' + password, '--decrypt', outputPath];

    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('Erro ao executar qpdf:', qpdfError);

      if (
        qpdfError.message?.includes('invalid password') ||
        qpdfError.message?.includes('password')
      ) {
        throw new Error('INVALID_PASSWORD');
      }
      throw qpdfError;
    }

    showLoader('Preparando download...');
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (outputFile.length === 0) {
      throw new Error('Decryption resulted in an empty file.');
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `unlocked-${file.name}`);

    hideLoader();
    showAlert(
      'Sucesso',
      'PDF descriptografado com sucesso! O download foi iniciado.'
    );
  } catch (error: any) {
    console.error('Erro durante descriptografia do PDF:', error);
    hideLoader();

    if (error.message === 'INVALID_PASSWORD') {
      showAlert(
        'Senha Incorreta',
        'A senha que você inseriu está incorreta. Por favor, tente novamente.'
      );
    } else if (error.message?.includes('password')) {
      showAlert(
        'Erro na Descriptografia',
        'Não foi possível descriptografar o PDF com a senha fornecida. Por favor, tente novamente.'
      );
    } else {
      showAlert(
        'Erro na Descriptografia',
        `Um erro ocorreu: ${error.message || 'A senha que você inseriu está incorreta ou o arquivo está corrompido.'}`
      );
    }
  } finally {
    try {
      if (qpdf?.FS) {
        try {
          qpdf.FS.unlink(inputPath);
        } catch (e) {
          console.warn('Erro ao remover arquivo de entrada:', e);
        }
        try {
          qpdf.FS.unlink(outputPath);
        } catch (e) {
          console.warn('Erro ao remover arquivo de saída:', e);
        }
      }
    } catch (cleanupError) {
      console.warn('Erro ao limpar FS do WASM:', cleanupError);
    }
  }
}
