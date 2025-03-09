# Guia de Solução de Problemas - Docgeo

Este documento fornece soluções para problemas comuns que podem ser encontrados durante o desenvolvimento e uso do projeto Docgeo.

## Problemas de Inicialização

### Portas em Uso

**Problema**: Ao iniciar o servidor de desenvolvimento, você vê mensagens como:
```
Port 3000 is in use, trying 3001 instead.
```

**Solução**:
1. O Next.js tentará automaticamente usar a próxima porta disponível.
2. Se você precisar usar uma porta específica, encerre os processos que estão usando essa porta:

   No Windows:
   ```
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

   No Linux/Mac:
   ```
   lsof -i :3000
   kill -9 <PID>
   ```

3. Alternativamente, você pode especificar uma porta diferente ao iniciar o servidor:
   ```
   npm run dev -- -p 3001
   ```

### Erro ao Iniciar o Servidor

**Problema**: O servidor não inicia e exibe erros de compilação.

**Solução**:
1. Verifique se todas as dependências estão instaladas:
   ```
   npm install
   ```

2. Limpe o cache do Next.js:
   ```
   rm -rf .next
   ```

3. Verifique se há erros de sintaxe no código.

## Problemas de Compilação

### Erros de Importação

**Problema**: Erros como:
```
Attempted import error: 'FilePresentation' is not exported from 'lucide-react'
```

**Solução**:
1. Verifique se o nome do ícone está correto na documentação da biblioteca.
2. Atualize a versão da biblioteca:
   ```
   npm update lucide-react
   ```
3. Se o ícone foi renomeado ou removido, substitua por uma alternativa:
   ```typescript
   // Antes
   import { FilePresentation } from 'lucide-react'
   
   // Depois
   import { Presentation } from 'lucide-react'
   ```

### Problemas com TypeScript

**Problema**: Erros de tipo TypeScript.

**Solução**:
1. Verifique se os tipos estão definidos corretamente.
2. Atualize as definições de tipo:
   ```
   npm update @types/react @types/node
   ```
3. Limpe o cache do TypeScript:
   ```
   rm -rf node_modules/.cache/typescript
   ```

### Problemas com Cache do Webpack

**Problema**: Erros como:
```
Caching failed for pack: Error: ENOENT: no such file or directory
```

**Solução**:
1. Limpe o cache do Next.js:
   ```
   rm -rf .next/cache
   ```
2. Reinicie o servidor de desenvolvimento.

## Problemas com Supabase

### Erros de Autenticação

**Problema**: Não consegue autenticar com o Supabase.

**Solução**:
1. Verifique se as variáveis de ambiente estão configuradas corretamente:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
   ```

2. Verifique se o provedor de autenticação está habilitado no Console do Supabase.

3. Limpe os cookies do navegador e tente novamente.

### Erros de Permissão

**Problema**: Erros como "Permission denied" ao acessar dados.

**Solução**:
1. Verifique se as políticas RLS estão configuradas corretamente.
2. Verifique se o usuário está autenticado.
3. Verifique os logs do Supabase para mais detalhes sobre o erro.

### Erros de Consulta

**Problema**: Erros ao executar consultas no Supabase.

**Solução**:
1. Verifique a sintaxe da consulta.
2. Verifique se as tabelas e colunas existem.
3. Use o Console do Supabase para testar a consulta manualmente.
4. Adicione logs para depurar:
   ```typescript
   const { data, error } = await supabase
     .from('documents')
     .select('*')
   
   if (error) {
     console.error('Erro na consulta:', error)
     throw error
   }
   ```

## Problemas com Upload de Arquivos

### Falha no Upload

**Problema**: Não consegue fazer upload de arquivos para o Supabase Storage.

**Solução**:
1. Verifique se o bucket existe no Supabase Storage.
2. Verifique se as políticas RLS estão configuradas corretamente.
3. Verifique o tamanho do arquivo (limite padrão é 50MB).
4. Adicione logs para depurar:
   ```typescript
   const { data, error } = await supabase.storage
     .from('documents')
     .upload(filePath, file)
   
   if (error) {
     console.error('Erro no upload:', error)
     throw error
   }
   ```

### Problemas com URLs de Arquivos

**Problema**: URLs de arquivos não funcionam ou expiram.

**Solução**:
1. Use URLs públicas para arquivos que devem ser acessíveis publicamente:
   ```typescript
   const { data: { publicUrl } } = supabase.storage
     .from('documents')
     .getPublicUrl(filePath)
   ```

2. Para arquivos privados, use URLs assinadas com tempo de expiração:
   ```typescript
   const { data: { signedUrl } } = await supabase.storage
     .from('documents')
     .createSignedUrl(filePath, 3600) // expira em 1 hora
   ```

## Problemas com API Routes

### Erros 500 em API Routes

**Problema**: Erros 500 ao chamar API Routes.

**Solução**:
1. Adicione tratamento de erros adequado:
   ```typescript
   // src/app/api/documents/route.ts
   import { NextRequest, NextResponse } from 'next/server'
   
   export async function GET(req: NextRequest) {
     try {
       // Código para buscar documentos
       return NextResponse.json(data)
     } catch (error: any) {
       console.error('Erro na API:', error)
       return NextResponse.json(
         { error: error.message || 'Erro interno do servidor' },
         { status: 500 }
       )
     }
   }
   ```

2. Verifique os logs do servidor para mais detalhes sobre o erro.

### Problemas com Métodos HTTP

**Problema**: Métodos HTTP não funcionam como esperado.

**Solução**:
1. Verifique se o método está implementado corretamente:
   ```typescript
   // src/app/api/documents/route.ts
   export async function GET(req: NextRequest) { ... }
   export async function POST(req: NextRequest) { ... }
   export async function PUT(req: NextRequest) { ... }
   export async function DELETE(req: NextRequest) { ... }
   ```

2. Verifique se o cliente está enviando a requisição com o método correto.

## Problemas com Componentes React

### Componentes Não Renderizam

**Problema**: Componentes não renderizam ou renderizam incorretamente.

**Solução**:
1. Verifique se o componente está importado corretamente.
2. Verifique se as props estão sendo passadas corretamente.
3. Use o React DevTools para inspecionar o componente.
4. Adicione logs para depurar:
   ```typescript
   console.log('Props:', props)
   ```

### Problemas com Estado

**Problema**: Estado não atualiza como esperado.

**Solução**:
1. Verifique se o estado está sendo atualizado corretamente:
   ```typescript
   // Errado
   const [count, setCount] = useState(0)
   setCount(count + 1) // Pode não refletir o valor mais recente
   
   // Correto
   setCount(prevCount => prevCount + 1)
   ```

2. Use o hook `useEffect` para depurar mudanças de estado:
   ```typescript
   useEffect(() => {
     console.log('Estado atualizado:', count)
   }, [count])
   ```

## Problemas com Tailwind CSS

### Estilos Não Aplicados

**Problema**: Classes do Tailwind não aplicam estilos.

**Solução**:
1. Verifique se o Tailwind está configurado corretamente.
2. Verifique se a classe está escrita corretamente.
3. Limpe o cache do Tailwind:
   ```
   rm -rf node_modules/.cache/tailwindcss
   ```
4. Reinicie o servidor de desenvolvimento.

### Conflitos de Estilo

**Problema**: Estilos conflitantes ou inesperados.

**Solução**:
1. Use a inspeção do navegador para identificar quais estilos estão sendo aplicados.
2. Verifique a ordem das classes (classes posteriores têm precedência).
3. Use `!important` com moderação para sobrescrever estilos:
   ```html
   <div className="bg-red-500 !bg-blue-500">
     Este div será azul
   </div>
   ```

## Problemas de Desempenho

### Renderizações Lentas

**Problema**: Componentes renderizam lentamente.

**Solução**:
1. Use o React DevTools Profiler para identificar componentes lentos.
2. Memoize componentes que não precisam renderizar frequentemente:
   ```typescript
   const MemoizedComponent = React.memo(MyComponent)
   ```
3. Use `useMemo` e `useCallback` para evitar recálculos desnecessários:
   ```typescript
   const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
   const memoizedCallback = useCallback(() => doSomething(a, b), [a, b])
   ```

### Carregamento Lento de Dados

**Problema**: Dados demoram para carregar.

**Solução**:
1. Implemente carregamento lazy e paginação:
   ```typescript
   const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(...)
   ```
2. Implemente cache com SWR ou React Query:
   ```typescript
   const { data, error, isLoading } = useSWR('/api/documents', fetcher)
   ```
3. Otimize consultas ao banco de dados adicionando índices.

## Problemas de Implantação

### Falha na Implantação

**Problema**: A implantação falha.

**Solução**:
1. Verifique os logs de implantação para identificar o erro.
2. Verifique se todas as variáveis de ambiente estão configuradas.
3. Verifique se o build funciona localmente:
   ```
   npm run build
   ```

### Diferenças entre Desenvolvimento e Produção

**Problema**: Comportamento diferente entre desenvolvimento e produção.

**Solução**:
1. Verifique se há código específico para ambiente:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     // Código específico para desenvolvimento
   }
   ```
2. Verifique se todas as variáveis de ambiente estão configuradas corretamente em produção.
3. Teste localmente em modo de produção:
   ```
   npm run build && npm run start
   ```

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.io/docs)
- [Documentação do React](https://reactjs.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Fórum da Comunidade Next.js](https://github.com/vercel/next.js/discussions)
- [Fórum da Comunidade Supabase](https://github.com/supabase/supabase/discussions) 