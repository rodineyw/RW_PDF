import { showLoader, hideLoader, showAlert } from '../ui.js';
import {
  downloadFile,
  initializeQpdf,
  readFileAsArrayBuffer,
} from '../utils/helpers.js';
import { state } from '../state.js';

export async function changePermissions() {
  const file = state.files[0];
  const currentPassword =
    (document.getElementById('current-password') as HTMLInputElement)?.value ||
    '';
  const newUserPassword =
    (document.getElementById('new-user-password') as HTMLInputElement)?.value ||
    '';
  const newOwnerPassword =
    (document.getElementById('new-owner-password') as HTMLInputElement)
      ?.value || '';

  const inputPath = '/input.pdf';
  const outputPath = '/output.pdf';
  let qpdf: any;

  try {
    showLoader('Inicializando...');
    qpdf = await initializeQpdf();

    showLoader('Lendo PDF...');
    const fileBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(fileBuffer as ArrayBuffer);
    qpdf.FS.writeFile(inputPath, uint8Array);

    showLoader('Processando permissões do PDF...');

    const args = [inputPath];

    // Add password if provided
    if (currentPassword) {
      args.push('--password=' + currentPassword);
    }

    const shouldEncrypt = newUserPassword || newOwnerPassword;

    if (shouldEncrypt) {
      const finalUserPassword = newUserPassword;
      const finalOwnerPassword = newOwnerPassword;

      args.push('--encrypt', finalUserPassword, finalOwnerPassword, '256');

      const allowPrinting = (
        document.getElementById('allow-printing') as HTMLInputElement
      )?.checked;
      const allowCopying = (
        document.getElementById('allow-copying') as HTMLInputElement
      )?.checked;
      const allowModifying = (
        document.getElementById('allow-modifying') as HTMLInputElement
      )?.checked;
      const allowAnnotating = (
        document.getElementById('allow-annotating') as HTMLInputElement
      )?.checked;
      const allowFillingForms = (
        document.getElementById('allow-filling-forms') as HTMLInputElement
      )?.checked;
      const allowDocumentAssembly = (
        document.getElementById('allow-document-assembly') as HTMLInputElement
      )?.checked;
      const allowPageExtraction = (
        document.getElementById('allow-page-extraction') as HTMLInputElement
      )?.checked;

      if (finalOwnerPassword) {
        if (!allowModifying) args.push('--modify=none');
        if (!allowCopying) args.push('--extract=n');
        if (!allowPrinting) args.push('--print=none');
        if (!allowAnnotating) args.push('--annotate=n');
        if (!allowDocumentAssembly) args.push('--assemble=n');
        if (!allowFillingForms) args.push('--form=n');
        if (!allowPageExtraction) args.push('--extract=n');
        // --modify-other is not directly mapped, apply if modifying is disabled
        if (!allowModifying) args.push('--modify-other=n');
      } else if (finalUserPassword) {
        args.push('--allow-insecure');
      }
    } else {
      args.push('--decrypt');
    }

    args.push('--', outputPath);
    try {
      qpdf.callMain(args);
    } catch (qpdfError: any) {
      console.error('qpdf execution error:', qpdfError);

      const errorMsg = qpdfError.message || '';

      if (
        errorMsg.includes('invalid password') ||
        errorMsg.includes('incorrect password') ||
        errorMsg.includes('password')
      ) {
        throw new Error('INVALID_PASSWORD');
      }

      if (
        errorMsg.includes('encrypted') ||
        errorMsg.includes('password required')
      ) {
        throw new Error('PASSWORD_REQUIRED');
      }

      throw new Error('Processamento falhou: ' + errorMsg || 'Erro desconhecido');
    }

    showLoader('Preparando download...');
    const outputFile = qpdf.FS.readFile(outputPath, { encoding: 'binary' });

    if (!outputFile || outputFile.length === 0) {
      throw new Error('Processamento resultou em um arquivo vazio.');
    }

    const blob = new Blob([outputFile], { type: 'application/pdf' });
    downloadFile(blob, `permissions-changed-${file.name}`);

    hideLoader();

    let successMessage = 'Permissões do PDF alteradas com sucesso!';
    if (!shouldEncrypt) {
      successMessage =
        'PDF decriptado com sucesso! Todas as restrições e criptografia foram removidas.';
    }

    showAlert('Sucesso', successMessage);
  } catch (error: any) {
    console.error('Erro durante a alteração de permissões do PDF:', error);
    hideLoader();

    if (error.message === 'INVALID_PASSWORD') {
      showAlert(
        'Senha Incorreta',
        'A senha atual que você digitou está incorreta. Por favor, tente novamente.'
      );
    } else if (error.message === 'PASSWORD_REQUIRED') {
      showAlert(
        'Senha Requerida',
        'Este PDF está protegido por senha. Por favor, digite a senha atual para continuar.'
      );
    } else {
      showAlert(
        'Processamento Falhou', 
        `Ocorreu um erro: ${error.message || 'O PDF pode estar corrompido ou protegido por senha.'}`
      );
    }
  } finally {
    try {
      if (qpdf?.FS) {
        try {
          qpdf.FS.unlink(inputPath);
        } catch (e) {}
        try {
          qpdf.FS.unlink(outputPath);
        } catch (e) {}
      }
    } catch (cleanupError) {
      console.warn('Erro ao limpar arquivos temporários no WASM FS:', cleanupError);
    }
  }
}
