# Melhorias no Sistema de Gerenciamento de Tema

## Visão Geral

Este documento descreve as melhorias implementadas no sistema de gerenciamento de tema da aplicação DocGeo, seguindo o padrão de repositório utilizado no projeto Geohome.

## Padrão de Repositório

Implementamos um padrão de repositório para melhorar a organização do código e a confiabilidade das operações com o Supabase. As principais características incluem:

1. **Encapsulamento da lógica de conexão** com o Supabase
2. **Métodos CRUD genéricos** para facilitar operações de dados
3. **Fallback automático para localStorage** quando o Supabase não está disponível
4. **Separação de responsabilidades** entre acesso a dados e lógica de negócios

## Componentes Implementados

### 1. SupabaseRepository

```typescript
// src/services/supabase.ts
export class SupabaseRepository<T extends { id: string }> {
  // Métodos CRUD genéricos com fallback para localStorage
  async create(data: Omit<T, 'id'> & { id?: string }): Promise<{ data: T | null; error: Error | null }>
  async getAll(): Promise<{ data: T[] | null; error: Error | null }>
  async getById(id: string): Promise<{ data: T | null; error: Error | null }>
  async getByField(field: string, value: any): Promise<{ data: T[] | null; error: Error | null }>
  async update(id: string, data: Partial<T>): Promise<{ data: T | null; error: Error | null }>
  async delete(id: string): Promise<{ error: Error | null }>
}
```

### 2. ThemeRepository

Refatorado para utilizar o padrão de repositório e permitir persistência do tema no Supabase.

```typescript
// src/repositories/ThemeRepository.ts
export class ThemeRepository {
  // Métodos para gerenciar configurações de tema
  async getThemeSettings(userId?: string): Promise<ThemeSettings>
  async saveThemeSettings(mode: ThemeMode, userId?: string): Promise<ThemeSettings>
}
```

### 3. useThemeRepository Hook

```typescript
// src/hooks/useThemeRepository.ts
export function useThemeRepository(userId?: string) {
  // Hook para gerenciar o tema usando o ThemeRepository
  return {
    themeSettings,
    loading,
    error,
    updateTheme,
    isDarkMode
  };
}
```

### 4. ThemeContext

```typescript
// src/contexts/ThemeContext.tsx
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Contexto para fornecer acesso ao tema em toda a aplicação
}

export const useTheme = (): ThemeContextType => {
  // Hook para acessar o contexto de tema
}
```

### 5. ThemeAdapter

```typescript
// src/components/theme-adapter.tsx
export function ThemeAdapter() {
  // Sincroniza o ThemeContext com o next-themes
}
```

### 6. ThemeStyles

```typescript
// src/components/theme/ThemeStyles.tsx
export function ThemeStyles() {
  // Aplica estilos CSS globais baseados no tema atual
}
```

### 7. ThemeSwitcher

```typescript
// src/components/theme-switcher.tsx
export function ThemeSwitcher() {
  // Interface para alternar entre temas (claro, escuro, sistema)
}
```

## Benefícios

1. **Modularidade**: Código mais organizado e fácil de manter
2. **Consistência**: Gerenciamento de tema uniforme em toda a aplicação
3. **Resiliência**: Fallback automático para localStorage quando o Supabase não está disponível
4. **Experiência do Usuário**: Transições suaves entre temas e persistência das preferências
5. **Extensibilidade**: Facilidade para adicionar novos temas ou funcionalidades relacionadas
6. **Desempenho**: Carregamento otimizado das configurações de tema

## Componentes Atualizados

Os seguintes componentes foram atualizados para utilizar o novo sistema de tema:

- **DashboardSummary**: Utiliza o HOC withTheme
- **ToolsOverview**: Utiliza o HOC withTheme
- **DocumentsOverview**: Utiliza o HOC withTheme
- **TasksOverview**: Utiliza o HOC withTheme
- **Sidebar**: Acessa o tema diretamente via ThemeContext
- **Layout**: Inclui ThemeProvider e ThemeStyles

## Próximos Passos

1. Implementar testes automatizados para o sistema de tema
2. Adicionar mais opções de tema personalizáveis
3. Melhorar a acessibilidade com base nas configurações de tema
4. Otimizar o carregamento inicial para evitar flash de tema incorreto

---

*Documento atualizado em: 07/03/2025*
