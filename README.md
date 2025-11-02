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
docker build -t rodpdf .
docker run -p 3000:8080 rodpdf
```

Abra: http://localhost:3000

### 🚀 Executar com Docker Compose (recomendado)

For a more robust setup with auto-restart capabilities:

1. **Baixe o repositório e use o `docker-compose.yml` incluso**:

```yaml
services:
  rodpdf:
    image: rodpdf:latest
    container_name: rodpdf
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

**What Simple Mode does:**

- Oculta navegação, seção hero, recursos, FAQ, depoimentos e rodapé
- Mostra apenas as ferramentas essenciais de PDF
- Atualiza o título da página para "Ferramentas de PDF"
- Perfeito para ferramentas internas de empresas e instituições educacionais

Detalhes: [SIMPLE_MODE.md](SIMPLE_MODE.md).

### 🔒 Segurança

RW PDF roda como usuário não‑root usando nginx‑unprivileged:

- **Non-Root Execution**: Container runs with minimal privileges using nginx-unprivileged
- **Port 8080**: Uses high port number to avoid requiring root privileges
- **Security Best Practices**: Follows Principle of Least Privilege

#### Basic Usage

```bash
docker build -t bentopdf .
docker run -p 8080:8080 bentopdf
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

For detailed release instructions, see [RELEASE.md](RELEASE.md).

### 🚀 Development Setup

#### Option 1: Run with npm

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/alam00000/bentopdf.git
   cd bentopdf
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

#### Option 2: Build and Run with Docker Compose

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/alam00000/bentopdf.git
   cd bentopdf
   ```

2. **Run with Docker Compose**:

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

   The application will be available at `http://localhost:3000`.

   > **Note:** After making any local changes to the code, rebuild the Docker image using:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

   This ensures your latest changes are applied inside the container.

---

## 🛠️ Stack técnico

O RW PDF usa **HTML**, **CSS** e **TypeScript** com **Vite** e **Tailwind**.

- **Vite**: A fast build tool for modern web development.
- **TypeScript**: For type safety and an improved developer experience.
- **Tailwind CSS**: For rapid and consistent UI development.

> **Nota:** Algumas partes ainda usam estrutura legada e serão atualizadas gradualmente.

---

## 🗺️ Roadmap

### Planned Features:

- **HTML to PDF**: Convert HTML files or web pages into PDF documents.
- **Markdown to PDF**: Enhanced support for converting `.md` files to PDF.
- **Convert to PDF/A**: Convert PDFs to the PDF/A archival format.
- **Edit PDF Content**: Directly edit text and other content within your PDF.
- **PDF to Office**: Converts PDF files into editable Word, Excel, and PowerPoint formats.
- **Office to PDF**: Converts Word, Excel, and PowerPoint documents into optimized PDFs.

Contribuições e discussões são bem‑vindas! Use Issues no GitHub.

---

## 🤝 Contribuindo

We welcome contributions from the community! Here's how you can get started:

1.  **Fork the repository** and create your branch from `main`.
2.  Follow the **Getting Started** steps to set up your local environment.
3.  Make your changes and commit them with a clear message.
4.  **Open a Pull Request** and describe the changes you've made.

Tem ideia de ferramenta ou melhoria? [Abra uma issue](https://github.com/rodineyw/RW_PDF/issues) para discutir.

---

## Agradecimentos

Este projeto só é possível graças a ferramentas e bibliotecas open‑source:

- **[PDFLib.js](https://pdf-lib.js.org/)** – For enabling powerful client-side PDF manipulation.
- **[PDF.js](https://mozilla.github.io/pdf.js/)** – For the robust PDF rendering engine in the browser.
- **[PDFKit](https://pdfkit.org/)** – For creating and editing PDFs with ease.
- **[EmbedPDF](https://github.com/embedpdf/embed-pdf-viewer)** – For seamless PDF editing in pure JS.
- **[Cropper.js](https://fengyuanchen.github.io/cropperjs/)** – For intuitive image cropping functionality.
- **[Vite](https://vitejs.dev/)** – For lightning-fast development and build tooling.
- **[Tailwind CSS](https://tailwindcss.com/)** – For rapid, flexible, and beautiful UI styling.
- **[qpdf](https://github.com/qpdf/qpdf)** and **[qpdf-wasm](https://github.com/neslinesli93/qpdf-wasm)**– A powerful command-line tool and library for inspecting, repairing, and transforming PDF file ported to wasm

Obrigado à comunidade open‑source por tornar isso possível!

## 📜 Licença

Este projeto é licenciado sob os termos do arquivo **LICENSE** deste repositório.
