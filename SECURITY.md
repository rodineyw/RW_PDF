# Política de Segurança

## Suporte a Usuário Não-Root

O **RW PDF** usa nginx-unprivileged para maior segurança. Isso segue o Princípio do Menor Privilégio e é essencial em produção.

### Benefícios de Segurança

- **Superfície de Ataque Reduzida**: Se comprometido, atacantes não terão privilégios de root
- **Conformidade**: Atende padrões de segurança como SOC 2, PCI DSS
- **Compatibilidade Kubernetes/OpenShift**: Funciona com políticas de segurança que exigem execução não-root
- **Proteção do Sistema**: Previne danos em todo o sistema se a aplicação for comprometida

### Uso

#### Configuração Padrão (nginx-unprivileged)

```bash
docker build -t rwpdf .
docker run -p 8080:8080 rwpdf
```

#### Modo Simples

```bash
# Build com modo simples habilitado
docker build --build-arg SIMPLE_MODE=true -t rwpdf-simple .

# Executar o container
docker run -p 8080:8080 rwpdf-simple
```

#### Exemplo Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rwpdf
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 2000
        runAsGroup: 2000
      containers:
        - name: rwpdf
          image: rwpdf:latest
          ports:
            - containerPort: 8080
```

#### Exemplo Docker Compose

```yaml
version: '3.8'
services:
  rwpdf:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        SIMPLE_MODE: false
    ports:
      - '8080:8080'
    security_opt:
      - no-new-privileges:true
```

### Verificação

Para verificar se o container está executando como não-root:

```bash
# Verificar o usuário dentro do container
docker exec <container_id> whoami
# Deve retornar: nginx

# Verificar o ID do usuário
docker exec <container_id> id
# Deve mostrar UID/GID para o usuário nginx (tipicamente 101)
```

### Melhores Práticas de Segurança

1. **Use nginx-unprivileged**: Usuário não-root integrado com privilégios mínimos
2. **Atualizações Regulares**: Mantenha a imagem base atualizada (atualmente usando 1.29-alpine)
3. **Porta 8080**: Use números de porta altos para evitar exigir privilégios de root
4. **Escaneamento de Segurança**: Escaneie regularmente as imagens em busca de vulnerabilidades
5. **Políticas de Rede**: Implemente segmentação de rede

### Solução de Problemas

Se encontrar problemas de permissão:

1. **Verificar propriedade de arquivos**: Certifique-se de que todos os arquivos da aplicação pertencem ao usuário nginx
2. **Verificar diretório PID**: Certifique-se de que o diretório `/etc/nginx/tmp/` existe e é gravável
3. **Vinculação de porta**: Certifique-se de que a porta 8080 está disponível e não bloqueada pelo firewall

### Migração do Root

Se estiver migrando de uma configuração baseada em root:

1. Atualize seu Dockerfile para usar a imagem base nginx-unprivileged
2. Altere os mapeamentos de porta de 80 para 8080 em todas as configurações
3. Atualize nginx.conf para usar `/etc/nginx/tmp/nginx.pid` para o arquivo PID
4. Reconstrua suas imagens com as novas configurações de segurança
5. Atualize suas configurações de deployment (Kubernetes, Docker Compose, etc.)
6. Teste completamente em um ambiente de staging

---

## Relatório de Vulnerabilidades de Segurança

Se você descobrir uma vulnerabilidade de segurança no **RW PDF**, por favor **não** abra uma issue pública. Em vez disso, relate-a de forma responsável entrando em contato conosco diretamente.

### Como Reportar

**Email:** rodineyw@yahoo.com.br  
**Empresa:** RW Consultoria - Soluções em Software  
**Assunto:** [SEGURANÇA] Vulnerabilidade no RW PDF

### Informações a Incluir

Por favor, inclua as seguintes informações em seu relatório:

1. **Descrição da Vulnerabilidade**: Descrição detalhada do problema de segurança
2. **Passos para Reproduzir**: Instruções claras sobre como reproduzir a vulnerabilidade
3. **Impacto Potencial**: Avaliação do possível impacto da vulnerabilidade
4. **Versão Afetada**: Versão(ões) do RW PDF afetadas
5. **Ambiente**: Detalhes do ambiente onde a vulnerabilidade foi descoberta
6. **Evidências**: Screenshots, logs ou outros materiais de suporte (se aplicável)

### Nosso Compromisso

- **Confirmação**: Confirmaremos o recebimento do seu relatório dentro de 48 horas
- **Avaliação**: Avaliaremos a vulnerabilidade e forneceremos uma resposta inicial dentro de 5 dias úteis
- **Correção**: Trabalharemos para corrigir vulnerabilidades confirmadas o mais rápido possível
- **Crédito**: Com sua permissão, daremos crédito apropriado pela descoberta responsável

### Divulgação Responsável

Pedimos que você:

- Nos dê tempo razoável para investigar e corrigir a vulnerabilidade antes da divulgação pública
- Não acesse, modifique ou exclua dados de outros usuários
- Não execute ataques que possam prejudicar a disponibilidade do serviço
- Não divulgue a vulnerabilidade publicamente até que tenhamos tido a oportunidade de corrigi-la

---

## Sobre o RW PDF

O **RW PDF** é desenvolvido e mantido pela **RW Consultoria**, especializada em soluções de software personalizadas e ferramentas de produtividade empresarial.

Para mais informações sobre nossos serviços e projetos, entre em contato através do email acima.
