# Contribuindo para RW PDF

Obrigado por considerar contribuir para o **RW PDF**! Sua ajuda melhora o projeto para todos.

This document outlines how to contribute, report issues, and get involved in the project.

---

## 1. Como contribuir

You can contribute in several ways:

- **Reportar bugs:** Abra uma issue com passos para reproduzir e logs/prints.
- **Solicitar recursos:** Abra uma issue descrevendo sua ideia claramente.
- **Contribuir código:** Envie um PR com novas features, correções ou melhorias.
- **Documentação:** Melhore README, exemplos de uso e guias.
- **Testes:** Ajude a testar novas versões/mudanças para garantir estabilidade.

---

### Template de Issues

When reporting bugs, requesting features, or asking questions, please use our [issue template](.github/ISSUE_TEMPLATE/bug_feature_question.md). The template will automatically appear when you create a new issue.

**Nosso template ajuda a fornecer:**

- Clear categorization (Bug, Feature Request, or Question)
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Environment details
- Screenshots or logs

**Exemplos de título:**

- `(Bug) Text alignment incorrect on multi-line paragraphs`
- `(Feature) Add support for custom PDF metadata`
- `(Question) How to embed custom fonts?`

### Pull Request Template

When submitting code contributions, please use our [pull request template](.github/pull_request_template.md). The template will automatically appear when you create a new PR.

**Key requirements:**

- Link to the related issue (e.g., `Fixes #123`)
- Describe the type of change (bug fix, feature, breaking change)
- Explain how you tested your changes
- Complete the checklist before submitting

## 2. Getting Started with Code Contributions

1.  **Fork the Repository**

    ```bash
    git clone https://github.com/alam00000/bentopdf.git
    cd bento-pdf
    npm install
    ```

2.  **Create a New Branch**

    ```bash
    git checkout -b feature/my-new-feature
    ```

3.  **Make Your Changes**
    - Follow the code style and conventions used in the project.
    - Add comments where necessary.
    - Update or add tests if applicable.

4.  **Run Tests**

    ```bash
    npm run test
    ```

5.  **Commit Your Changes**

    ```bash
    git add .
    git commit -m "Add a meaningful commit message"
    ```

6.  **Push and Submit a Pull Request**

    ```bash
    git push origin feature/my-new-feature
    ```

    - Open a pull request on GitHub and provide a clear description of your changes.

---

## 3. Code Style

- Follow the existing TypeScript and JavaScript conventions.
- Use `camelCase` for variables and functions.
- Keep lines reasonably short and readable.
- Comment complex logic for clarity.

---

## 4. Issues e Pull Requests

- Make sure your PR is focused and addresses a single issue or feature.
- Reference related issues in your PR description (e.g., `Closes #12`).
- Be responsive to feedback and make requested changes promptly.

---

## 5. Relato de questões de segurança

Se encontrar vulnerabilidade, **não** abra issue pública. Contate o mantenedor:

**Email:** [rodineyw@yahoo.com.br](mailto:rodineyw@yahoo.com.br)

---

## 6. Código de Conduta

All contributors are expected to follow the Code of Conduct. Be respectful and considerate in all communications.

---

Obrigado por ajudar a tornar o **RW PDF** melhor para todos!
