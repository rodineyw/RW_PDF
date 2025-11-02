# RW PDF

**RW PDF** é um toolkit de PDF voltado à privacidade, 100% client-side, que permite manipular, editar, mesclar e processar arquivos PDF diretamente no navegador. Não há processamento no servidor, garantindo que seus arquivos permaneçam seguros e privados.

Mantido por **RW Consultoria** — autor e codificador: **Alam** e  **Ródiney W.**.


---

## ✨ Por que RW PDF?

- **Privacidade em primeiro lugar**: Tudo acontece no seu navegador. Seus arquivos nunca são enviados para servidor.
- **Sem limites**: Manipule quantos arquivos quiser, quantas vezes quiser.
- **Alta performance**: Construído com tecnologias modernas, rápido e eficiente, inclusive para PDFs grandes.
- **Totalmente gratuito**: Ferramenta livre e open-source para todos.

---

## 🛠️ Funcionalidades / Ferramentas

O RW PDF oferece um conjunto completo de ferramentas para lidar com PDFs.

### Organizar & Gerenciar PDFs

| Nome da Ferramenta        | Descrição                                                                      |
| :------------------------ | :----------------------------------------------------------------------------- |
| **Mesclar PDFs**          | Combinar múltiplos arquivos PDF em um só.                                     |
| **Dividir PDFs**          | Extrair páginas específicas ou dividir um documento em arquivos menores.      |
| **Organizar Páginas**     | Reordenar, duplicar ou excluir páginas com uma interface simples de arrastar. |
| **Extrair Páginas**       | Salvar um intervalo específico de páginas como um novo PDF.                   |
| **Excluir Páginas**       | Remover páginas indesejadas do seu documento.                                 |
| **Rotacionar PDF**        | Rotacionar páginas individuais ou todas as páginas de um documento.           |
| **N-Up PDF**              | Combinar múltiplas páginas em uma única página.                               |
| **Visualizar PDF**        | Um visualizador de PDF poderoso e integrado.                                  |
| **Alternar e Misturar**   | Mesclar páginas alternando páginas de cada PDF.                               |
| **Posterizar PDF**        | Dividir um PDF em múltiplas páginas menores para impressão.                   |

### Editar & Modificar PDFs

| Nome da Ferramenta        | Descrição                                                           |
| :------------------------ | :------------------------------------------------------------------ |
| **Editor de PDF**         | Um editor abrangente para modificar seus PDFs.                     |
| **Adicionar Numeração**   | Adicionar facilmente números de página com formatação personalizável. |
| **Adicionar Marca D'água** | Adicionar marcas d'água de texto ou imagem para proteger documentos. |
| **Cabeçalho e Rodapé**    | Adicionar cabeçalhos e rodapés personalizáveis.                    |
| **Cortar PDF**            | Cortar páginas específicas ou todo o documento.                    |
| **Inverter Cores**        | Inverter as cores das páginas do PDF para melhor legibilidade.     |
| **Alterar Fundo**         | Modificar a cor de fundo do seu PDF.                               |
| **Alterar Cor do Texto**  | Alterar a cor do conteúdo de texto dentro do PDF.                  |
| **Preencher Formulários** | Preencher formulários PDF diretamente no seu navegador.            |
| **Achatar PDF**           | Achatar campos de formulário e anotações em conteúdo estático.     |
| **Remover Anotações**     | Remover comentários, destaques e outras anotações.                 |
| **Remover Páginas Vazias** | Detectar automaticamente e remover páginas em branco de um PDF.    |

### Converter para PDF

| Nome da Ferramenta    | Descrição                                                           |
| :-------------------- | :------------------------------------------------------------------ |
| **Imagem para PDF**   | Converter imagens JPG, PNG, WebP, SVG, BMP, HEIC e TIFF para PDF.  |
| **Markdown para PDF** | Converter arquivos `.md` em documentos PDF profissionais.          |
| **Texto para PDF**    | Converter arquivos de texto simples em PDF.                        |

### Converter de PDF

| Nome da Ferramenta    | Descrição                                                                      |
| :-------------------- | :----------------------------------------------------------------------------- |
| **PDF para Imagem**   | Converter páginas de PDF para formatos JPG, PNG, WebP, BMP ou TIFF.           |
| **PDF para Escala de Cinza** | Converter um PDF colorido em uma versão preto e branco.            |
| **OCR PDF**           | Tornar PDFs digitalizados pesquisáveis e copiáveis usando Reconhecimento Óptico de Caracteres. |

### Proteger & Otimizar PDFs

| Nome da Ferramenta    | Descrição                                                           |
| :-------------------- | :------------------------------------------------------------------ |
| **Comprimir PDF**     | Reduzir o tamanho do arquivo mantendo a qualidade.                 |
| **Reparar PDF**       | Tentar reparar e recuperar dados de um PDF corrompido.             |
| **Criptografar PDF**  | Adicionar uma senha para proteger seu PDF de acesso não autorizado. |
| **Descriptografar PDF** | Remover proteção por senha de um PDF (senha necessária).         |
| **Alterar Permissões** | Definir ou modificar permissões de usuário para impressão, cópia e edição. |
| **Assinar PDF**       | Adicionar sua assinatura digital a um documento.                   |
| **Redigir Conteúdo**  | Remover permanentemente conteúdo sensível dos seus PDFs.           |
| **Editar Metadados**  | Visualizar e modificar metadados do PDF (autor, título, palavras-chave, etc.). |
| **Remover Metadados** | Remover todos os metadados do seu PDF para privacidade.            |
| **Linearizar PDF**    | Otimizar PDF para visualização rápida na web.                      |
| **Sanitizar PDF**     | Remover arquivos potencialmente indesejados ou maliciosos do PDF.  |

---

## 🚀 Começando

Você pode executar o RW PDF localmente para desenvolvimento ou uso pessoal.

### Pré‑requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/install/) (opcional)

### 🚀 Execução com Docker (opcional)

Você pode construir e rodar localmente:

```bash
docker build -t rwpdf .
docker run -p 3000:8080 rwpdf
```

Abra: http://localhost:3000

### 🚀 Executar com Docker Compose (recomendado)

Para uma configuração mais robusta, com capacidade de reinício automático:

1. **Baixe o repositório e use o `docker-compose.yml` incluso**:

```yaml
services:
  rwpdf:
    image: rwpdf:latest
    container_name: rwpdf
    ports:
      - '3000:8080'
    restart: unless-stopped
```

2. **Inicie a aplicação**:

```bash
docker-compose up -d
```

Aplicação disponível em `http://localhost:3000`.

### 🏢 Modo Simples para uso interno

Para quem quer uma interface limpa, sem distrações, focada somente nas ferramentas, o RW PDF suporta **Modo Simples** que oculta branding e conteúdo de marketing.

**O que o Modo Simples faz:**

- Oculta navegação, seção hero, recursos, FAQ, depoimentos e rodapé
- Mostra apenas as ferramentas essenciais de PDF
- Atualiza o título da página para "Ferramentas de PDF"
- Perfeito para ferramentas internas de empresas e instituições educacionais

Detalhes: [SIMPLE_MODE.md](SIMPLE_MODE.md).

### 🔒 Segurança

RW PDF roda como usuário não‑root usando nginx‑unprivileged:

- **Execução como não‑root**: O container roda com privilégios mínimos usando nginx‑unprivileged
- **Porta 8080**: Usa porta de número alto para evitar exigir privilégios de root
- **Boas práticas de segurança**: Segue o Princípio do Menor Privilégio

#### Uso Básico

```bash
docker build -t rwpdf .
docker run -p 8080:8080 rwpdf
```

Para detalhes de segurança, veja [SECURITY.md](SECURITY.md).

### 📦 Versionamento

RW PDF usa versionamento semântico.

Exemplos de uso local estão acima (Docker/Docker Compose). Ajuste para seu registro privado se necessário.

#### Quick Release

```bash
# Release a patch version (0.0.1 → 0.0.2)
npm run release

# Release a minor version (0.0.1 → 0.1.0)
npm run release:minor

# Release a major version (0.0.1 → 1.0.0)
npm run release:major
```

Para instruções detalhadas de release, veja [RELEASE.md](RELEASE.md).

### 🚀 Ambiente de Desenvolvimento

#### Opção 1: Rodar com npm

1. **Clonar o repositório**:

   ```bash
   git clone https://github.com/rodineyw/RW_PDF.git
   cd RW_PDF
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Rodar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   A aplicação ficará disponível em `http://localhost:5173`.

#### Opção 2: Build e execução com Docker Compose

1. **Clonar o repositório**:

   ```bash
   git clone https://github.com/rodineyw/RW_PDF.git
   cd RW_PDF
   ```

2. **Executar com Docker Compose**:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

   A aplicação ficará disponível em `http://localhost:3000`.

   > **Nota:** Após realizar alterações locais no código, reconstrua a imagem Docker usando:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

   Isso garante que suas últimas alterações sejam aplicadas dentro do container.

---

## 🛠️ Stack técnico

O RW PDF usa **HTML**, **CSS** e **TypeScript** com **Vite** e **Tailwind**.

- **Vite**: Ferramenta de build rápida para desenvolvimento web moderno.
- **TypeScript**: Tipagem estática e melhor experiência de desenvolvimento.
- **Tailwind CSS**: Desenvolvimento de UI rápido, consistente e escalável.

> **Nota:** Algumas partes ainda usam estrutura legada e serão atualizadas gradualmente.

---

## 🗺️ Roadmap

### Funcionalidades Planejadas:

- **HTML para PDF**: Converter arquivos HTML ou páginas web em documentos PDF.
- **Markdown para PDF**: Suporte aprimorado para converter arquivos `.md` em PDF.
- **Converter para PDF/A**: Converter PDFs para o formato de arquivamento PDF/A.
- **Editar conteúdo do PDF**: Editar diretamente textos e outros conteúdos dentro do PDF.
- **PDF para Office**: Converter arquivos PDF para formatos editáveis do Word, Excel e PowerPoint.
- **Office para PDF**: Converter documentos Word, Excel e PowerPoint para PDFs otimizados.

Contribuições e discussões são bem‑vindas! Use Issues no GitHub.

---

## 🤝 Contribuindo

Contribuições da comunidade são muito bem‑vindas! Veja como começar:

1.  **Faça um fork do repositório** e crie sua branch a partir da `main`.
2.  Siga os passos de **Começando** para configurar seu ambiente local.
3.  Faça suas alterações e crie commits com mensagens claras.
4.  **Abra um Pull Request** e descreva as mudanças realizadas.

Tem ideia de ferramenta ou melhoria? [Abra uma issue](https://github.com/rodineyw/RW_PDF/issues) para discutir.

---

## Agradecimentos

Este projeto só é possível graças a ferramentas e bibliotecas open‑source:

- **[PDFLib.js](https://pdf-lib.js.org/)** – Manipulação de PDF client‑side poderosa.
- **[PDF.js](https://mozilla.github.io/pdf.js/)** – Motor robusto de renderização de PDF no navegador.
- **[PDFKit](https://pdfkit.org/)** – Criação e edição de PDFs com facilidade.
- **[EmbedPDF](https://github.com/embedpdf/embed-pdf-viewer)** – Edição de PDF fluida em JavaScript puro.
- **[Cropper.js](https://fengyuanchen.github.io/cropperjs/)** – Recorte de imagens intuitivo.
- **[Vite](https://vitejs.dev/)** – Ferramenta de desenvolvimento e build ultrarrápida.
- **[Tailwind CSS](https://tailwindcss.com/)** – Estilização de UI rápida, flexível e elegante.
- **[qpdf](https://github.com/qpdf/qpdf)** e **[qpdf-wasm](https://github.com/neslinesli93/qpdf-wasm)** – Ferramenta e biblioteca de linha de comando para inspecionar, reparar e transformar PDF, portada para wasm.

Obrigado à comunidade open‑source por tornar isso possível!

## 📜 Licença

Este projeto é licenciado sob os termos do arquivo **LICENSE** deste repositório.
