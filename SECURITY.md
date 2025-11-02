# Segurança

## Non-Root User Support

RW PDF usa nginx-unprivileged para maior segurança. Isso segue o Princípio do Menor Privilégio e é essencial em produção.

### Security Benefits

- **Reduced Attack Surface**: If compromised, attackers won't have root privileges
- **Compliance**: Meets security standards like SOC 2, PCI DSS
- **Kubernetes/OpenShift Compatibility**: Works with security policies that require non-root execution
- **System Protection**: Prevents system-wide damage if the application is compromised

### Uso

#### Default Configuration (nginx-unprivileged)

```bash
docker build -t rodpdf .
docker run -p 8080:8080 rodpdf
```

#### Simple Mode

```bash
# Build com modo simples habilitado
docker build --build-arg SIMPLE_MODE=true -t rodpdf-simple .

# Rodar o container
docker run -p 8080:8080 rodpdf-simple
```

#### Kubernetes Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rodpdf
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 2000
        runAsGroup: 2000
      containers:
        - name: rodpdf
          image: rodpdf:latest
          ports:
            - containerPort: 8080
```

#### Docker Compose Example

```yaml
version: '3.8'
services:
  bentopdf:
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

### Verification

To verify the container is running as non-root:

```bash
# Check the user inside the container
docker exec <container_id> whoami
# Should output: nginx

# Check the user ID
docker exec <container_id> id
# Should show UID/GID for nginx user (typically 101)
```

### Security Best Practices

1. **Use nginx-unprivileged**: Built-in non-root user with minimal privileges
2. **Regular Updates**: Keep the base image updated (currently using 1.29-alpine)
3. **Port 8080**: Use high port numbers to avoid requiring root privileges
4. **Security Scanning**: Regularly scan images for vulnerabilities
5. **Network Policies**: Implement network segmentation

### Troubleshooting

If you encounter permission issues:

1. **Check file ownership**: Ensure all application files are owned by the nginx user
2. **Verify PID directory**: Ensure `/etc/nginx/tmp/` directory exists and is writable
3. **Port binding**: Ensure port 8080 is available and not blocked by firewall

### Migration from Root

If migrating from a root-based setup:

1. Update your Dockerfile to use nginx-unprivileged base image
2. Change port mappings from 80 to 8080 in all configurations
3. Update nginx.conf to use `/etc/nginx/tmp/nginx.pid` for PID file
4. Rebuild your images with the new security settings
5. Update your deployment configurations (Kubernetes, Docker Compose, etc.)
6. Test thoroughly in a staging environment
