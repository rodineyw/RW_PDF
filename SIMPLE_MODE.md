# Modo Simples para RW PDF

O Modo Simples foi desenvolvido pela RW Consultoria para uso organizacional interno, onde você deseja ocultar todo o conteúdo de marca e marketing, mostrando apenas as ferramentas essenciais de PDF para seus usuários.

## O que o Modo Simples Faz

Quando habilitado, o Modo Simples irá:

- Ocultar a barra de navegação
- Ocultar a seção hero com conteúdo de marketing
- Ocultar a seção de recursos
- Ocultar a seção de segurança/conformidade
- Ocultar a seção de FAQ
- Ocultar a seção de depoimentos
- Ocultar a seção de suporte
- Ocultar o rodapé
- Atualizar o título da página para "Ferramentas PDF"
- Tornar a seção de ferramentas mais proeminente

## Como Habilitar o Modo Simples

### Método 1: Usando Imagem Pré-construída do Modo Simples (Recomendado)

Use a imagem pré-construída do Modo Simples diretamente:

**Usando Docker Hub:**
```bash
docker run -p 3000:8080 rwconsultoria/rwpdf-simple:latest
```

**Usando GitHub Container Registry:**
```bash
docker run -p 3000:8080 ghcr.io/rwconsultoria/rwpdf-simple:latest
```
Ou com Docker Compose:

```yaml
services:
  rwpdf:
    # Usando Docker Hub
    image: rwconsultoria/rwpdf-simple:latest
    # Ou usando GitHub Container Registry
    # image: ghcr.io/rwconsultoria/rwpdf-simple:latest
    container_name: rwpdf
    restart: unless-stopped
    ports:
      - '3000:8080'
```

### Método 2: Usando Docker Compose com Build

Construa a imagem localmente com o Modo Simples habilitado:

```bash
docker compose -f docker-compose.dev.yml build --build-arg SIMPLE_MODE=true
docker compose -f docker-compose.dev.yml up -d
```

### Método 3: Usando Docker Build

Construa a imagem com o argumento de build SIMPLE_MODE:

```bash
docker build --build-arg SIMPLE_MODE=true -t rwpdf-simple .
docker run -p 3000:8080 rwpdf-simple
```

### Método 4: Usando Script npm (Mais Fácil para Desenvolvimento Local)

Use o script npm integrado que cuida de tudo:

```bash
npm run serve:simple
```

Este comando automaticamente:

- Define `SIMPLE_MODE=true`
- Constrói o projeto com o Modo Simples habilitado
- Serve os arquivos construídos em `http://localhost:3000`

### Método 5: Usando Variáveis de Ambiente

Defina a variável de ambiente antes de construir:

```bash
export SIMPLE_MODE=true
npm run build
npx serve dist -p 3000
```

## 🧪 Testando o Modo Simples Localmente

### Método 1: Usando Script npm (Mais Fácil para Desenvolvimento)

```bash
npm run serve:simple
```

Isso automaticamente constrói e serve o Modo Simples em `http://localhost:3000`.

### Método 2: Usando Imagem Pré-construída (Mais Fácil para Produção)

```bash
# Baixar e executar a imagem do Modo Simples
docker pull rwconsultoria/rwpdf-simple:latest
docker run -p 3000:8080 rwconsultoria/rwpdf-simple:latest
```

Abra `http://localhost:3000` no seu navegador.

### Método 3: Construir e Testar Localmente

```bash
# Construir com modo simples
SIMPLE_MODE=true npm run build

# Servir os arquivos construídos
npx serve dist -p 3000
```

Abra `http://localhost:3000` no seu navegador.

### Método 4: Comparar Ambos os Modos

```bash
# Testar Modo Normal
docker run -p 3000:8080 rwconsultoria/rwpdf:latest

# Testar Modo Simples
docker run -p 3001:8080 rwconsultoria/rwpdf-simple:latest
```

- Modo Normal: `http://localhost:3000`
- Modo Simples: `http://localhost:3001`

## 🔍 O que Procurar

Quando o Modo Simples estiver funcionando corretamente, você deve ver:

- ✅ Cabeçalho limpo "Ferramentas PDF" (sem seção hero de marketing)
- ✅ Subtítulo "Selecione uma ferramenta para começar"
- ✅ Barra de pesquisa para ferramentas
- ✅ Todos os cartões de ferramentas PDF organizados por categoria
- ❌ Nenhuma barra de navegação
- ❌ Nenhuma seção hero com "O Kit de Ferramentas PDF construído para privacidade"
- ❌ Nenhuma seção de recursos, FAQ, depoimentos ou rodapé

## 📦 Imagens Docker Disponíveis

### Modo Normal (marca completa)

Use imagens locais (`rwconsultoria/rwpdf:latest`) ou seu registro privado.

### Modo Simples (interface limpa)

Use imagens locais (`rwconsultoria/rwpdf-simple:latest`) ou seu registro privado.

## 🚀 Exemplos de Deployment em Produção

### Ferramenta Interna da RW Consultoria

```yaml
services:
  rwpdf:
    image: rwconsultoria/rwpdf-simple:latest
    container_name: rwpdf
    restart: unless-stopped
    ports:
      - '80:80'
    environment:
      - PUID=1000
      - PGID=1000
```

## ⚠️ Notas Importantes

- **Imagens pré-construídas**: Use `rwconsultoria/rwpdf-simple:latest` para o Modo Simples
- **Variáveis de ambiente**: `SIMPLE_MODE=true` funciona apenas durante a construção, não em tempo de execução
- **Otimização em tempo de construção**: O Modo Simples usa eliminação de código morto para pacotes menores
- **Mesma funcionalidade**: Todas as ferramentas PDF funcionam de forma idêntica em ambos os modos
- **Desenvolvido por**: RW Consultoria para soluções empresariais personalizadas
