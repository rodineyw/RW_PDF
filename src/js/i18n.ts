// Simple i18n helper for PT-BR UI
// Keeps tests stable by translating display-only strings at render time

export function tTitle(title: any): any {
  if (typeof title !== 'string') return title;
  const map: Record<string, string> = {
    Error: 'Erro',
    Success: 'Sucesso',
    'Invalid Input': 'Entrada Inválida',
    'No Files': 'Sem Arquivos',
    'No File': 'Sem Arquivo',
    'Protected PDFs': 'PDFs Protegidos',
    'Input Required': 'Entrada Necessária',
    'Processing Complete': 'Processamento Concluído',
    'Conversion Error': 'Erro de Conversão',
    Ready: 'Pronto',
  };
  return map[title] ?? title;
}

const messageMap: Record<string, string> = {
  'Please enter a page number.': 'Por favor, informe um número de página.',
  'Please enter the number of pages to insert.': 'Por favor, informe a quantidade de páginas a inserir.',
  'Please enter a page range.': 'Por favor, informe um intervalo de páginas.',
  'Please enter page numbers to extract.': 'Por favor, informe páginas para extrair.',
  'Please enter page numbers to delete.': 'Por favor, informe páginas para excluir.',
  'Failed to render page previews.': 'Falha ao renderizar prévias de páginas.',
  'Failed to render page thumbnails': 'Falha ao renderizar miniaturas de páginas.',
  'Could not remove annotations. Please check your page range.': 'Não foi possível remover anotações. Verifique o intervalo de páginas.',
  'Could not extract pages.': 'Não foi possível extrair páginas.',
  'Could not delete pages.': 'Não foi possível excluir páginas.',
  'Could not add blank page.': 'Não foi possível adicionar página em branco.',
  'Could not invert PDF colors.': 'Não foi possível inverter as cores do PDF.',
  'Failed to convert PDF to PNG.': 'Falha ao converter PDF para PNG.',
  'Failed to convert PDF to WebP.': 'Falha ao converter PDF para WebP.',
  'Failed to convert PDF to JPG. The file might be corrupted.': 'Falha ao converter PDF para JPG. O arquivo pode estar corrompido.',
  'Failed to convert PDF to BMP. The file might be corrupted.': 'Falha ao converter PDF para BMP. O arquivo pode estar corrompido.',
  'Failed to convert PDF to TIFF. The file might be corrupted.': 'Falha ao converter PDF para TIFF. O arquivo pode estar corrompido.',
  'Failed to convert WebP to PDF. Ensure all files are valid WebP images.': 'Falha ao converter WebP para PDF. Verifique se todos os arquivos são WebP válidos.',
  'Failed to convert TIFF to PDF. One of the files may be invalid or corrupted.': 'Falha ao converter TIFF para PDF. Algum arquivo pode ser inválido ou corrompido.',
  'Failed to convert HEIC to PDF. One of the files may be invalid or unsupported.': 'Falha ao converter HEIC para PDF. Algum arquivo pode ser inválido ou não suportado.',
  'Failed to create PDF from text.': 'Falha ao criar PDF a partir de texto.',
  'Failed to create PDF from images.': 'Falha ao criar PDF a partir de imagens.',
  'Failed to create ZIP file.': 'Falha ao criar arquivo ZIP.',
  'Could not load the optimization engine. Please refresh the page and try again.': 'Não foi possível carregar o mecanismo de otimização. Atualize a página e tente novamente.',
  'Invalid page range specified.': 'Intervalo de páginas inválido.',
};

export function tMessage(text: any): any {
  if (typeof text !== 'string') return text;
  if (messageMap[text]) return messageMap[text];
  return text;
}

export function tProgress(text: any): any {
  if (typeof text !== 'string') return text;
  
  const progressMap: Record<string, string> = {
    'Processando...': 'Processando...',
    'Carregando...': 'Carregando...',
    'Salvando...': 'Salvando...',
    'Convertendo...': 'Convertendo...',
    'Gerando PDF...': 'Gerando PDF...',
    'Comprimindo...': 'Comprimindo...',
    'Extraindo páginas...': 'Extraindo páginas...',
    'Mesclando arquivos...': 'Mesclando arquivos...',
    'Aplicando rotações...': 'Aplicando rotações...',
    'Aplicando cortes...': 'Aplicando cortes...',
    'Removendo páginas em branco...': 'Removendo páginas em branco...',
    'Adicionando números de página...': 'Adicionando números de página...',
    'Criptografando PDF...': 'Criptografando PDF...',
    'Descriptografando PDF...': 'Descriptografando PDF...',
    'Organizando páginas...': 'Organizando páginas...',
    'Convertendo para JPG...': 'Convertendo para JPG...',
    'Convertendo para PDF...': 'Convertendo para PDF...',
    'Digitalizando documento...': 'Digitalizando documento...',
    'Preenchendo formulário...': 'Preenchendo formulário...',
    'Aplicando assinaturas...': 'Aplicando assinaturas...',
    'Removendo anotações...': 'Removendo anotações...',
    'Alterando permissões...': 'Alterando permissões...',
    'Corrigindo dimensões...': 'Corrigindo dimensões...',
    'Aplicando OCR...': 'Aplicando OCR...',
    'Linearizando PDF...': 'Linearizando PDF...',
    'Adicionando anexos...': 'Adicionando anexos...',
    'Sanitizando PDF...': 'Sanitizando PDF...',
    'Criando pôster...': 'Criando pôster...',
    'Combinando páginas...': 'Combinando páginas...',
    'Mesclando alternadamente...': 'Mesclando alternadamente...',
    'Redacting content...': 'Aplicando redações...',
    'Applying redactions...': 'Aplicando redações...',
    'Applying signatures...': 'Aplicando assinaturas...',
    'Applying rotations...': 'Aplicando rotações...',
    'Applying crop...': 'Aplicando corte...',
    'Applying form data...': 'Aplicando dados do formulário...'
  };
  
  if (progressMap[text]) return progressMap[text];
  
  if (text.startsWith('Rendering page previews')) {
    return text.replace('Rendering page previews', 'Renderizando prévias de páginas');
  }
  if (text.startsWith('Rendering Page ')) {
    return text.replace('Rendering Page ', 'Renderizando Página ');
  }
  if (text.startsWith('Rendering page ')) {
    return text.replace('Rendering page ', 'Renderizando página ');
  }
  if (text.startsWith('Loading page ')) {
    return text.replace('Loading page ', 'Carregando página ');
  }
  if (text.startsWith('Processing page ')) {
    return text.replace('Processing page ', 'Processando página ').replace(' of ', ' de ');
  }
  if (text.startsWith('Optimizing PDFs for web view')) {
    return 'Otimizando PDFs para visualização web (linearizando)...';
  }
  if (text.startsWith('Converting to greyscale')) {
    return 'Convertendo para tons de cinza...';
  }
  if (text.startsWith('Converting ')) {
    return text.replace('Converting ', 'Convertendo ');
  }
  return text;
}

// Função para traduzir textos de interface (descrições, botões, labels)
export function tInterface(text: any): any {
  if (typeof text !== 'string') return text;
  
  const interfaceMap: Record<string, string> = {
    // Sign PDF interface
    'Create your signature, select it, then click on the document to place. You can drag to move placed signatures.': 'Crie sua assinatura, selecione-a e clique no documento para posicionar. Você pode arrastar para mover as assinaturas posicionadas.',
    'Apply Signatures & Download PDF': 'Aplicar Assinaturas e Baixar PDF',
    'Undo Last Placement': 'Desfazer Último Posicionamento',
    
    // Markdown to PDF interface
    'Markdown to PDF': 'Markdown para PDF',
    'Write in Markdown, select your formatting options, and get a high-quality, multi-page PDF. <br><strong class="text-gray-300">Note:</strong> Images linked from the web (e.g., https://...) require an internet connection to be rendered.': 'Escreva em Markdown, selecione suas opções de formatação e obtenha um PDF de alta qualidade e múltiplas páginas. <br><strong class="text-gray-300">Nota:</strong> Imagens vinculadas da web (ex.: https://...) requerem conexão com a internet para serem renderizadas.',
    'Page Format': 'Formato da Página',
    'Orientation': 'Orientação',
    'Margin Size': 'Tamanho da Margem',
    'Markdown Editor': 'Editor Markdown',
    'Create PDF from Markdown': 'Criar PDF do Markdown',
    
    // Common interface elements
    'Apply': 'Aplicar',
    'Save': 'Salvar',
    'Download': 'Baixar',
    'Upload': 'Enviar',
    'Browse': 'Procurar',
    'Select': 'Selecionar',
    'Choose': 'Escolher',
    'File': 'Arquivo',
    'Files': 'Arquivos',
    'Page': 'Página',
    'Pages': 'Páginas',
    'Loading': 'Carregando',
    'Processing': 'Processando'
  };
  
  return interfaceMap[text] ?? text;
}