# Contribuindo para RW PDF

Obrigado por considerar contribuir para o **RW PDF**! Sua ajuda melhora o projeto para todos.

Este documento descreve como contribuir, reportar problemas e se envolver no projeto.

---

## 1. Como Contribuir

Você pode contribuir de várias maneiras:

- **Reportar bugs:** Abra uma issue com passos para reproduzir e logs/prints.
- **Solicitar recursos:** Abra uma issue descrevendo sua ideia claramente.
- **Contribuir código:** Envie um PR com novas features, correções ou melhorias.
- **Documentação:** Melhore README, exemplos de uso e guias.
- **Testes:** Ajude a testar novas versões/mudanças para garantir estabilidade.

---

### Template de Issues

Ao reportar bugs, solicitar recursos ou fazer perguntas, por favor use nosso [template de issue](.github/ISSUE_TEMPLATE/bug_feature_question.md). O template aparecerá automaticamente quando você criar uma nova issue.

**Nosso template ajuda a fornecer:**

- Categorização clara (Bug, Solicitação de Recurso ou Pergunta)
- Passos para reproduzir (para bugs)
- Comportamento esperado vs comportamento atual
- Detalhes do ambiente
- Screenshots ou logs

**Exemplos de título:**

- `(Bug) Alinhamento de texto incorreto em parágrafos multi-linha`
- `(Feature) Adicionar suporte para metadados PDF personalizados`
- `(Question) Como incorporar fontes personalizadas?`

### Template de Pull Request

Ao submeter contribuições de código, por favor use nosso [template de pull request](.github/pull_request_template.md). O template aparecerá automaticamente quando você criar um novo PR.

**Requisitos principais:**

- Link para a issue relacionada (ex: `Fixes #123`)
- Descrever o tipo de mudança (correção de bug, feature, mudança breaking)
- Explicar como você testou suas mudanças
- Completar o checklist antes de submeter

## 2. Começando com Contribuições de Código

1.  **Fazer Fork do Repositório**

    ```bash
    git clone https://github.com/rwconsultoria/rwpdf.git
    cd rw-pdf
    npm install
    ```

2.  **Criar uma Nova Branch**

    ```bash
    git checkout -b feature/minha-nova-feature
    ```

3.  **Fazer Suas Mudanças**
    - Siga o estilo de código e convenções usadas no projeto.
    - Adicione comentários onde necessário.
    - Atualize ou adicione testes se aplicável.

4.  **Executar Testes**

    ```bash
    npm run test
    ```

5.  **Fazer Commit das Suas Mudanças**

    ```bash
    git add .
    git commit -m "Adicionar uma mensagem de commit significativa"
    ```

6.  **Fazer Push e Submeter um Pull Request**

    ```bash
    git push origin feature/minha-nova-feature
    ```

    - Abra um pull request no GitHub e forneça uma descrição clara das suas mudanças.

---

## 3. Estilo de Código

- Siga as convenções existentes de TypeScript e JavaScript.
- Use `camelCase` para variáveis e funções.
- Mantenha as linhas razoavelmente curtas e legíveis.
- Comente lógica complexa para clareza.

---

## 4. Issues e Pull Requests

- Certifique-se de que seu PR seja focado e aborde uma única issue ou feature.
- Referencie issues relacionadas na descrição do seu PR (ex: `Closes #12`).
- Seja responsivo ao feedback e faça as mudanças solicitadas prontamente.

---

## 5. Relato de Questões de Segurança

Se encontrar uma vulnerabilidade, **não** abra uma issue pública. Contate o mantenedor:

**Email:** [rodineyw@yahoo.com.br](mailto:rodineyw@yahoo.com.br)  
**Empresa:** RW Consultoria - Soluções em Software

---

## 6. Código de Conduta

Todos os colaboradores devem seguir o Código de Conduta. Seja respeitoso e considerado em todas as comunicações.

---

## 7. Sobre o RW PDF

O **RW PDF** é desenvolvido e mantido pela **RW Consultoria**, especializada em soluções de software personalizadas e ferramentas de produtividade empresarial.

Para mais informações sobre nossos serviços e projetos, entre em contato através do email acima.

---

Obrigado por ajudar a tornar o **RW PDF** melhor para todos!
