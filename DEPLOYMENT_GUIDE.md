# Guia de Implantação - Docgeo

Este documento fornece instruções detalhadas para implantar o projeto Docgeo em diferentes ambientes.

## Pré-requisitos

Antes de implantar o Docgeo, certifique-se de que você tem:

- Node.js 18.x ou superior
- npm 9.x ou superior
- Conta no Supabase
- (Opcional) Conta na Vercel, Netlify ou outro serviço de hospedagem

## Preparação para Implantação

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.production.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

### 2. Configurar o Banco de Dados

1. Execute os scripts SQL no Console do Supabase para criar as tabelas necessárias:
   - `create_document_tables.sql`
   - `create_task_tables.sql`
   - `create_tools_table.sql`

2. Configure as políticas RLS (Row Level Security) para proteger seus dados:

```sql
-- Exemplo para tabela documents
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
CREATE POLICY "Usuários podem ver documentos públicos ou próprios" 
ON documents FOR SELECT 
USING (is_public OR created_by = auth.uid());

-- Política para INSERT
CREATE POLICY "Usuários podem criar documentos" 
ON documents FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Política para UPDATE
CREATE POLICY "Usuários podem atualizar seus próprios documentos" 
ON documents FOR UPDATE 
USING (created_by = auth.uid());

-- Política para DELETE
CREATE POLICY "Usuários podem excluir seus próprios documentos" 
ON documents FOR DELETE 
USING (created_by = auth.uid());
```

3. Configure os buckets de armazenamento no Supabase Storage:
   - `documents` - Para arquivos de documentos
   - `task-attachments` - Para anexos de tarefas
   - `tool-images` - Para imagens de ferramentas

### 3. Construir a Aplicação

Execute o comando de build para gerar a versão de produção:

```bash
npm run build
```

Verifique se o build foi concluído sem erros.

## Opções de Implantação

### Opção 1: Implantação na Vercel

A Vercel é a plataforma recomendada para implantar aplicações Next.js.

#### Passos para Implantação na Vercel

1. Crie uma conta na [Vercel](https://vercel.com) se ainda não tiver uma.

2. Instale a CLI da Vercel:
   ```bash
   npm install -g vercel
   ```

3. Faça login na Vercel:
   ```bash
   vercel login
   ```

4. Implante o projeto:
   ```bash
   vercel
   ```

5. Para implantações de produção:
   ```bash
   vercel --prod
   ```

6. Configure as variáveis de ambiente no dashboard da Vercel:
   - Vá para o projeto no dashboard da Vercel
   - Navegue até "Settings" > "Environment Variables"
   - Adicione as variáveis de ambiente necessárias

#### Configuração de Domínio Personalizado na Vercel

1. No dashboard da Vercel, vá para o projeto
2. Navegue até "Settings" > "Domains"
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

### Opção 2: Implantação na Netlify

#### Passos para Implantação na Netlify

1. Crie uma conta na [Netlify](https://netlify.com) se ainda não tiver uma.

2. Instale a CLI da Netlify:
   ```bash
   npm install -g netlify-cli
   ```

3. Faça login na Netlify:
   ```bash
   netlify login
   ```

4. Inicialize o projeto:
   ```bash
   netlify init
   ```

5. Configure o build command como `npm run build` e o diretório de publicação como `.next`.

6. Implante o projeto:
   ```bash
   netlify deploy
   ```

7. Para implantações de produção:
   ```bash
   netlify deploy --prod
   ```

8. Configure as variáveis de ambiente no dashboard da Netlify:
   - Vá para o projeto no dashboard da Netlify
   - Navegue até "Site settings" > "Environment variables"
   - Adicione as variáveis de ambiente necessárias

### Opção 3: Implantação em Servidor Próprio

#### Requisitos do Servidor

- Node.js 18.x ou superior
- npm 9.x ou superior
- Servidor web (Nginx, Apache, etc.)
- (Opcional) PM2 para gerenciamento de processos

#### Passos para Implantação em Servidor Próprio

1. Clone o repositório no servidor:
   ```bash
   git clone https://github.com/seu-usuario/docgeo.git
   cd docgeo
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env.production.local` com as variáveis de ambiente necessárias.

4. Construa a aplicação:
   ```bash
   npm run build
   ```

5. Inicie o servidor:
   ```bash
   npm run start
   ```

6. (Recomendado) Use o PM2 para gerenciar o processo:
   ```bash
   npm install -g pm2
   pm2 start npm --name "docgeo" -- start
   pm2 save
   pm2 startup
   ```

#### Configuração do Nginx como Proxy Reverso

Crie um arquivo de configuração para o Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative a configuração e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/docgeo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Opção 4: Implantação com Docker

#### Requisitos

- Docker
- Docker Compose (opcional)

#### Criação do Dockerfile

Crie um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
FROM node:18-alpine AS base

# Instalar dependências apenas para compilação
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Construir a aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Configuração do Docker Compose

Crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3'

services:
  docgeo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
    restart: always
```

#### Implantação com Docker

1. Construa a imagem Docker:
   ```bash
   docker build -t docgeo .
   ```

2. Execute o contêiner:
   ```bash
   docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase -e NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase docgeo
   ```

Ou, usando Docker Compose:

```bash
docker-compose up -d
```

## Configurações Adicionais

### Configuração de HTTPS

Para configurar HTTPS, você pode usar:

1. **Vercel/Netlify**: HTTPS é configurado automaticamente.

2. **Servidor próprio com Nginx e Let's Encrypt**:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

3. **Docker com Traefik**:
   Configure o Traefik como proxy reverso para gerenciar certificados automaticamente.

### Configuração de Cache

Para melhorar o desempenho, configure o cache:

1. **Vercel**: O cache é configurado automaticamente.

2. **Nginx**:
   ```nginx
   location /_next/static/ {
       expires 1y;
       add_header Cache-Control "public, max-age=31536000, immutable";
   }
   
   location /static/ {
       expires 1w;
       add_header Cache-Control "public, max-age=604800";
   }
   ```

### Monitoramento

Configure o monitoramento para acompanhar o desempenho e a disponibilidade:

1. **Vercel Analytics**: Ative no dashboard da Vercel.

2. **Servidor próprio**:
   - Use o PM2 para monitoramento básico: `pm2 monit`
   - Configure o Prometheus e Grafana para monitoramento avançado

## Atualizações e Manutenção

### Atualizações de Código

1. **Vercel/Netlify**: Conecte ao repositório Git para implantação automática.

2. **Servidor próprio**:
   ```bash
   git pull
   npm install
   npm run build
   pm2 restart docgeo
   ```

3. **Docker**:
   ```bash
   docker-compose down
   git pull
   docker-compose build
   docker-compose up -d
   ```

### Backups

Configure backups regulares do banco de dados:

1. **Supabase**: Use a funcionalidade de backup do Supabase.

2. **Backup manual**:
   ```bash
   pg_dump -h sua-url-do-supabase -U postgres -d postgres > backup.sql
   ```

## Solução de Problemas de Implantação

### Erros Comuns

1. **Erro 500 em API Routes**:
   - Verifique os logs do servidor
   - Verifique se as variáveis de ambiente estão configuradas corretamente
   - Verifique se o Supabase está acessível

2. **Erro 404 em Arquivos Estáticos**:
   - Verifique se o build foi concluído corretamente
   - Verifique se os arquivos estáticos estão sendo servidos corretamente

3. **Problemas de CORS**:
   - Verifique se o Supabase está configurado para permitir requisições do domínio da aplicação

### Logs e Depuração

1. **Vercel**: Acesse os logs no dashboard da Vercel.

2. **Servidor próprio**:
   ```bash
   pm2 logs docgeo
   ```

3. **Docker**:
   ```bash
   docker logs docgeo
   ```

## Checklist de Implantação

- [ ] Configurar variáveis de ambiente
- [ ] Configurar banco de dados e políticas RLS
- [ ] Configurar buckets de armazenamento
- [ ] Construir a aplicação
- [ ] Implantar a aplicação
- [ ] Configurar domínio personalizado
- [ ] Configurar HTTPS
- [ ] Configurar cache
- [ ] Configurar monitoramento
- [ ] Configurar backups
- [ ] Testar a aplicação em produção

## Recursos Adicionais

- [Documentação de Implantação do Next.js](https://nextjs.org/docs/deployment)
- [Documentação de Implantação do Supabase](https://supabase.io/docs/guides/hosting/overview)
- [Documentação do Docker](https://docs.docker.com/)
- [Documentação do Nginx](https://nginx.org/en/docs/)
- [Documentação do PM2](https://pm2.keymetrics.io/docs/usage/quick-start/) 