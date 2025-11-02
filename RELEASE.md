# 🚀 Processo de Release - Cenários do Mundo Real

## 📋 Cenários Comuns de Release

### **Cenário 1: Acabei de Terminar uma Feature e Quero Fazer Release**

**Situação:** Você completou uma nova funcionalidade, testou localmente e quer fazer o release.

**Estado Atual:**

```bash
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/js/new-feature.js
  modified:   src/css/styles.css
  modified:   README.md

Untracked files:
  src/js/feature-helper.js
```

**Passos:**

```bash
# 1. Faça commit das suas mudanças de feature
git add .
git commit -m "Adicionar nova funcionalidade de marca d'água em PDF"

# 2. Escolha seu tipo de release e execute
npm run release        # Patch: 1.0.0 → 1.0.1 (correções de bug, pequenas melhorias)
npm run release:minor  # Minor: 1.0.0 → 1.1.0 (novas features, compatível com versões anteriores)
npm run release:major  # Major: 1.0.0 → 2.0.0 (mudanças que quebram compatibilidade)
```

**O que Acontece:**

- ✅ Seu commit de feature permanece como está
- ✅ Versão é incrementada no `package.json`
- ✅ Novo commit de release é criado
- ✅ Tag Git é criada (ex.: `v1.0.1`)
- ✅ Tudo é enviado para o GitHub
- ✅ Imagem Docker é construída e publicada

---

### **Cenário 2: Tenho Mudanças Não Commitadas e Quero Fazer Release**

**Situação:** Você tem mudanças locais mas ainda não fez commit delas.

**Estado Atual:**

```bash
$ git status
Changes not staged for commit:
  modified:   package.json
  modified:   src/js/main.js
  modified:   README.md
```

**❌ Isso Vai Falhar:**

```bash
npm run release
# Error: Your local changes would be overwritten by merge
```

**✅ Opções de Solução:**

**Opção A: Fazer Commit de Tudo Primeiro (Recomendado)**

```bash
git add .
git commit -m "Adicionar novas funcionalidades e melhorias"
npm run release
```

**Opção B: Fazer Stash das Mudanças Temporariamente**

```bash
git stash
npm run release
git stash pop  # Restaurar suas mudanças após o release
```

**Opção C: Fazer Commit Apenas do Necessário**

```bash
git add package.json src/js/main.js
git commit -m "Adicionar melhorias principais"
npm run release
git add README.md
git commit -m "Atualizar documentação"
```

---

### **Cenário 3: Quero Fazer Release de um Hotfix**

**Situação:** Há um bug crítico em produção que precisa ser corrigido imediatamente.

**Passos:**

```bash
# 1. Corrigir o bug
git add src/js/bug-fix.js
git commit -m "Corrigir problema crítico de renderização de PDF"

# 2. Fazer release como patch (correção de bug)
npm run release
# Isso cria: 1.0.0 → 1.0.1
```

**Resultado:**

- ✅ Correção de bug é liberada imediatamente
- ✅ Imagem Docker com a correção está disponível
- ✅ Usuários podem baixar a versão corrigida

---

### **Cenário 4: Quero Fazer Release de uma Atualização Major**

**Situação:** Você adicionou funcionalidades significativas que podem quebrar a funcionalidade existente.

**Passos:**

```bash
# 1. Fazer commit de todas as suas mudanças
git add .
git commit -m "Adicionar funcionalidades principais de edição de PDF e mudanças na API"

# 2. Fazer release como versão major
npm run release:major
# Isso cria: 1.0.0 → 2.0.0
```

**Resultado:**

- ✅ Incremento de versão major indica mudanças que quebram compatibilidade
- ✅ Usuários sabem que devem verificar compatibilidade
- ✅ Ambas as versões antiga e nova estão disponíveis

---

### **Cenário 5: Quero Fazer Release de Múltiplas Features de Uma Vez**

**Situação:** Você tem trabalhado em múltiplas funcionalidades e quer fazer release delas juntas.

**Passos:**

```bash
# 1. Fazer commit de todas as features
git add .
git commit -m "Adicionar múltiplas ferramentas PDF: marca d'água, criptografia e compressão"

# 2. Escolher o tipo de release apropriado
npm run release:minor  # Para novas features (1.0.0 → 1.1.0)
# OU
npm run release:major  # Para mudanças que quebram compatibilidade (1.0.0 → 2.0.0)
```

---

### **Cenário 6: Quero Testar o Processo de Release**

**Situação:** Você quer testar o sistema de release sem afetar a produção.

**Passos:**

```bash
# 1. Fazer uma pequena mudança de teste
echo "// Comentário de teste" >> src/js/main.js
git add src/js/main.js
git commit -m "Testar processo de release"

# 2. Executar release patch
npm run release
# Isso cria: 1.0.0 → 1.0.1

# 3. Verificar se tudo funciona
# Verificar GitHub Actions, Docker Hub, etc.

# 4. Se quiser desfazer o release de teste
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
git reset --hard HEAD~1
```

---

## 🎯 **Guia de Tipos de Release**

| Cenário             | Comando                 | Mudança de Versão | Quando Usar                          |
| ------------------- | ----------------------- | ------------------ | ------------------------------------ |
| **Correção de Bug** | `npm run release`       | `1.0.0 → 1.0.1`    | Correções, pequenas melhorias        |
| **Nova Feature**    | `npm run release:minor` | `1.0.0 → 1.1.0`    | Novas funcionalidades compatíveis    |
| **Breaking Change** | `npm run release:major` | `1.0.0 → 2.0.0`    | Mudanças que quebram compatibilidade |

---

## 🔄 **O que Acontece Após Executar o Comando de Release**

### **Ações Imediatas (Local):**

1. **Atualização de Versão**: `package.json` é incrementado
2. **Git Commit**: Criado commit "Release vX.X.X"
3. **Git Tag**: Criada tag (ex.: `v1.0.1`)
4. **Git Push**: Tudo enviado ao GitHub

### **Ações Automáticas (GitHub):**

Se você usa CI/CD, configure seu próprio workflow para build e deploy conforme seu registro. Removemos referências a terceiros.

### **Resultado Final:**

Após o release, utilize seu registro privado (se aplicável) para distribuir imagens.

---

## 🚨 **Antes de Fazer Release - Pré-requisitos**

### **1. Configuração de Credenciais do Docker Hub**

Se usar Actions, adicione os secrets ao seu repositório:

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Adicione estes secrets:
   - `DOCKER_USERNAME`: Seu nome de usuário do Docker Hub
   - `DOCKER_TOKEN`: Seu token de acesso do Docker Hub

### **2. Obter Token do Docker Hub**

1. Vá para [Docker Hub](https://hub.docker.com)
2. Account Settings → Security → New Access Token
3. Defina permissões para "Read, Write, Delete"
4. Copie o token e adicione aos GitHub Secrets

---

## 🔧 **Solucionando Problemas Comuns**

### **❌ "Your local changes would be overwritten by merge"**

**Problema:** Você tem mudanças não commitadas
**Solução:**

```bash
git add .
git commit -m "Sua mensagem de commit"
npm run release
```

### **❌ "Permission denied" no GitHub Actions**

**Problema:** Credenciais do Docker Hub ausentes
**Solução:** Adicione `DOCKER_USERNAME` e `DOCKER_TOKEN` aos GitHub Secrets

### **❌ "Tag already exists"**

**Problema:** Você executou o mesmo release antes
**Solução:** Isso é normal! O script vai pular a criação de tags duplicadas

### **❌ GitHub Actions falha**

**Problema:** Vários problemas de build
**Solução:**

1. Verifique a aba Actions para logs detalhados
2. Verifique credenciais do Docker Hub
3. Verifique o Dockerfile para erros de sintaxe

---

## 🧪 **Testando Seu Sistema de Release**

### **Teste Rápido:**

```bash
# Fazer uma pequena mudança
echo "// Teste" >> src/js/main.js
git add src/js/main.js
git commit -m "Teste de release"
npm run release
```

### **Verificar Resultados:**

1. **GitHub Actions**: Verifique a aba Actions para build bem-sucedido
2. **Docker Hub**: Verifique se as imagens foram publicadas
3. **Git Tags**: `git tag --list` deve mostrar a nova tag
4. **Versão**: `cat package.json | grep version` deve mostrar a versão atualizada

### **Desfazer Release de Teste:**

```bash
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
git reset --hard HEAD~1
```

---

## 🎉 **É Isso!**

Seu fluxo de release está pronto. Siga os cenários acima e execute o comando `npm run release` conforme necessário.

---

## 📞 **Sobre o RW PDF**

O **RW PDF** é desenvolvido e mantido pela **RW Consultoria**, especializada em soluções de software personalizadas e ferramentas de produtividade empresarial.

Para mais informações sobre nossos serviços e projetos, entre em contato:

**Email:** rodineyw@yahoo.com.br  
**Empresa:** RW Consultoria - Soluções em Software
