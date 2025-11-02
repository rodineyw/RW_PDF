# RW PDF

**RW PDF** é um toolkit de PDF voltado à privacidade, 100% client-side, que permite manipular, editar, mesclar e processar arquivos PDF diretamente no navegador. Não há processamento no servidor, garantindo que seus arquivos permaneçam seguros e privados.

Mantido por **RW Consultoria** — autor e codificador: **Ródiney**.

## ⭐ Repositório

GitHub: https://github.com/rodineyw/RW_PDF

---

## ✨ Por que RW PDF?

- **Privacidade em primeiro lugar**: Tudo acontece no seu navegador. Seus arquivos nunca são enviados para servidor.
- **Sem limites**: Manipule quantos arquivos quiser, quantas vezes quiser.
- **Alta performance**: Construído com tecnologias modernas, rápido e eficiente, inclusive para PDFs grandes.
- **Totalmente gratuito**: Ferramenta livre e open-source para todos.

---

## 🛠️ Funcionalidades / Ferramentas

O RW PDF oferece um conjunto completo de ferramentas para lidar com PDFs.

### Organize & Manage PDFs

| Tool Name                 | Description                                                                |
| :------------------------ | :------------------------------------------------------------------------- |
| **Merge PDFs**            | Combine multiple PDF files into one.                                       |
| **Split PDFs**            | Extract specific pages or divide a document into smaller files.            |
| **Organize Pages**        | Reorder, duplicate, or delete pages with a simple drag-and-drop interface. |
| **Extract Pages**         | Save a specific range of pages as a new PDF.                               |
| **Delete Pages**          | Remove unwanted pages from your document.                                  |
| **Rotate PDF**            | Rotate individual or all pages in a document.                              |
| **N-Up PDF**              | Combine multiple pages onto a single page.                                 |
| **View PDF**              | A powerful, integrated PDF viewer.                                         |
| **Alternate & Mix pages** | Merge pages by alternating pages from each PDF.                            |
| **Posterize PDF**         | Split a PDF into multiple smaller pages for print.                         |

### Edit & Modify PDFs

| Tool Name              | Description                                                 |
| :--------------------- | :---------------------------------------------------------- |
| **PDF Editor**         | A comprehensive editor to modify your PDFs.                 |
| **Add Page Numbers**   | Easily add page numbers with customizable formatting.       |
| **Add Watermark**      | Add text or image watermarks to protect your documents.     |
| **Header & Footer**    | Add customizable headers and footers.                       |
| **Crop PDF**           | Crop specific pages or the entire document.                 |
| **Invert Colors**      | Invert the colors of your PDF pages for better readability. |
| **Change Background**  | Modify the background color of your PDF.                    |
| **Change Text Color**  | Change the color of text content within the PDF.            |
| **Fill Forms**         | Fill out PDF forms directly in your browser.                |
| **Flatten PDF**        | Flatten form fields and annotations into static content.    |
| **Remove Annotations** | Remove comments, highlights, and other annotations.         |
| **Remove Blank Pages** | Auto detect and remove blank pages in a PDF.                |

### Convert to PDF

| Tool Name           | Description                                                     |
| :------------------ | :-------------------------------------------------------------- |
| **Image to PDF**    | Convert JPG, PNG, WebP, SVG, BMP, HEIC, and TIFF images to PDF. |
| **Markdown to PDF** | Convert `.md` files into professional PDF documents.            |
| **Text to PDF**     | Convert plain text files into a PDF.                            |

### Convert from PDF

| Tool Name            | Description                                                                    |
| :------------------- | :----------------------------------------------------------------------------- |
| **PDF to Image**     | Convert PDF pages to JPG, PNG, WebP, BMP, or TIFF formats.                     |
| **PDF to Greyscale** | Convert a color PDF into a black-and-white version.                            |
| **OCR PDF**          | Make scanned PDFs searchable and copyable using Optical Character Recognition. |

### Secure & Optimize PDFs

| Tool Name              | Description                                                        |
| :--------------------- | :----------------------------------------------------------------- |
| **Compress PDF**       | Reduce file size while maintaining quality.                        |
| **Repair PDF**         | Attempt to repair and recover data from a corrupted PDF.           |
| **Encrypt PDF**        | Add a password to protect your PDF from unauthorized access.       |
| **Decrypt PDF**        | Remove password protection from a PDF (password required).         |
| **Change Permissions** | Set or modify user permissions for printing, copying, and editing. |
| **Sign PDF**           | Add your digital signature to a document.                          |
| **Redact Content**     | Permanently remove sensitive content from your PDFs.               |
| **Edit Metadata**      | View and modify PDF metadata (author, title, keywords, etc.).      |
| **Remove Metadata**    | Strip all metadata from your PDF for privacy.                      |
| **Linearize PDF**      | Optimize PDF for fast web view.                                    |
| **Sanitize PDF**       | Remove potentially unwanted or malicous files from PDF.            |

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

- Hides navigation, hero section, features, FAQ, testimonials, and footer
- Shows only the essential PDF tools
- Updates page title to "PDF Tools"
- Perfect for internal company tools and educational institutions

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
