# Guia de Estilo - Docgeo

Este documento serve como referência para todos os elementos visuais utilizados no projeto Docgeo, garantindo consistência em toda a aplicação.

## Índice

- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Bordas e Sombras](#bordas-e-sombras)
- [Backgrounds](#backgrounds)
- [Componentes](#componentes)
- [Animações](#animações)
- [Responsividade](#responsividade)

## Cores

### Paleta Principal

| Nome | Modo Escuro | Modo Claro | Uso |
|------|-------------|------------|-----|
| Background | `#0F172A` | `#FAFAFA` | Fundo principal da aplicação |
| Background Secundário | `#1E293B` | `#FFFFFF` | Cards, dropdowns, modais |
| Texto Primário | `#F8FAFC` | `#212121` | Textos principais, títulos |
| Texto Secundário | `#94A3B8` | `#64748B` | Textos secundários, descrições |
| Texto Terciário | `#64748B` | `#94A3B8` | Textos de menor importância |
| Primária | `#FF6B00` | `#FF6B00` | Botões principais, destaques |
| Primária Hover | `#FF8C3F` | `#FF8C3F` | Estado hover de elementos primários |
| Borda | `rgba(59, 130, 246, 0.5)` | `rgba(176, 190, 197, 0.5)` | Bordas de cards e inputs |

### Cores de Status

| Status | Modo Escuro | Modo Claro | Texto Escuro | Texto Claro |
|--------|-------------|------------|--------------|-------------|
| Todo | `rgba(37, 99, 235, 0.8)` | `rgba(59, 130, 246, 0.7)` | `#93C5FD` | `#1E40AF` |
| Em Andamento | `rgba(202, 138, 4, 0.8)` | `rgba(234, 179, 8, 0.7)` | `#FDE68A` | `#854D0E` |
| Concluído | `rgba(22, 163, 74, 0.8)` | `rgba(34, 197, 94, 0.7)` | `#86EFAC` | `#166534` |
| Bloqueado | `rgba(220, 38, 38, 0.8)` | `rgba(239, 68, 68, 0.7)` | `#FCA5A5` | `#991B1B` |

### Cores de Prioridade

| Prioridade | Modo Escuro | Modo Claro | Texto Escuro | Texto Claro |
|------------|-------------|------------|--------------|-------------|
| Baixa | `rgba(22, 163, 74, 0.8)` | `rgba(34, 197, 94, 0.7)` | `#86EFAC` | `#166534` |
| Média | `rgba(37, 99, 235, 0.8)` | `rgba(59, 130, 246, 0.7)` | `#93C5FD` | `#1E40AF` |
| Alta | `rgba(234, 88, 12, 0.8)` | `rgba(249, 115, 22, 0.7)` | `#FDBA74` | `#9A3412` |
| Urgente | `rgba(220, 38, 38, 0.8)` | `rgba(239, 68, 68, 0.7)` | `#FCA5A5` | `#991B1B` |

### Cores de Tags

| Modo | Background | Borda | Texto |
|------|------------|-------|-------|
| Escuro | `rgba(30, 58, 138, 0.3)` | `rgba(59, 130, 246, 0.5)` | `#93C5FD` |
| Claro | `rgba(219, 234, 254, 1)` | `rgba(147, 197, 253, 0.5)` | `#1E40AF` |

## Tipografia

### Fonte Principal

- Família: `Inter` (sans-serif)
- Fallback: `system-ui, -apple-system, sans-serif`

### Tamanhos de Fonte

| Uso | Tamanho | Peso | Linha |
|-----|---------|------|-------|
| Título Principal | `1.5rem` (24px) | `700` (bold) | `2rem` (32px) |
| Título Secundário | `1.25rem` (20px) | `600` (semibold) | `1.75rem` (28px) |
| Título de Card | `1.125rem` (18px) | `600` (semibold) | `1.5rem` (24px) |
| Texto Normal | `1rem` (16px) | `400` (regular) | `1.5rem` (24px) |
| Texto Pequeno | `0.875rem` (14px) | `400` (regular) | `1.25rem` (20px) |
| Texto Muito Pequeno | `0.75rem` (12px) | `400` (regular) | `1rem` (16px) |

### Classes de Texto

```css
.text-xs    /* 0.75rem (12px) */
.text-sm    /* 0.875rem (14px) */
.text-base  /* 1rem (16px) */
.text-lg    /* 1.125rem (18px) */
.text-xl    /* 1.25rem (20px) */
.text-2xl   /* 1.5rem (24px) */
```

## Espaçamento

### Sistema de Grid

- Baseado em grid de 4px
- Utiliza classes do Tailwind CSS

### Padding

```css
.p-0    /* 0px */
.p-1    /* 0.25rem (4px) */
.p-2    /* 0.5rem (8px) */
.p-3    /* 0.75rem (12px) */
.p-4    /* 1rem (16px) */
.p-6    /* 1.5rem (24px) */
.p-8    /* 2rem (32px) */
```

### Margin

```css
.m-0    /* 0px */
.m-1    /* 0.25rem (4px) */
.m-2    /* 0.5rem (8px) */
.m-3    /* 0.75rem (12px) */
.m-4    /* 1rem (16px) */
.m-6    /* 1.5rem (24px) */
.m-8    /* 2rem (32px) */
```

### Gap

```css
.gap-1   /* 0.25rem (4px) */
.gap-2   /* 0.5rem (8px) */
.gap-4   /* 1rem (16px) */
.gap-6   /* 1.5rem (24px) */
.gap-8   /* 2rem (32px) */
```

## Bordas e Sombras

### Bordas

| Uso | Modo Escuro | Modo Claro | Espessura | Raio |
|-----|-------------|------------|-----------|------|
| Cards | `rgba(59, 130, 246, 0.5)` | `rgba(176, 190, 197, 0.5)` | `1px` | `0.5rem` (8px) |
| Inputs | `rgba(59, 130, 246, 0.7)` | `rgba(176, 190, 197, 0.7)` | `1px` | `0.375rem` (6px) |
| Botões | `transparent` | `transparent` | `0px` | `9999px` (pill) |
| Divisores | `rgba(59, 130, 246, 0.3)` | `rgba(176, 190, 197, 0.3)` | `1px` | `0px` |

### Sombras

| Uso | Valor |
|-----|-------|
| Cards | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` |
| Cards Hover | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |
| Dropdowns | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |
| Modais | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` |

## Backgrounds

### Gradientes

| Uso | Valor |
|-----|-------|
| Destaque | `linear-gradient(135deg, #FF6B00 0%, #FF8C3F 100%)` |
| Sidebar Hover | `linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)` |

### Efeitos de Vidro (Glass Effect)

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Componentes

### Botões

#### Botão Primário

```css
/* Modo Escuro */
.bg-[#FF6B00] hover:bg-[#FF8C3F] text-white rounded-full

/* Modo Claro */
.bg-[#FF6B00] hover:bg-[#FF8C3F] text-white rounded-full
```

#### Botão Secundário

```css
/* Modo Escuro */
.bg-transparent border border-blue-700 text-white hover:bg-blue-900/20 rounded-full

/* Modo Claro */
.bg-transparent border border-[#B0BEC5] text-[#212121] hover:bg-gray-100 rounded-full
```

#### Botão Ghost

```css
/* Modo Escuro */
.text-gray-300 hover:text-white hover:bg-white/10

/* Modo Claro */
.text-gray-700 hover:text-[#212121] hover:bg-gray-200/50
```

### Cards

```css
/* Modo Escuro */
.bg-[#0F172A] border border-blue-700/50 rounded-lg

/* Modo Claro */
.bg-white border border-[#B0BEC5]/50 rounded-lg
```

### Inputs

```css
/* Modo Escuro */
.bg-[#0F172A] border-blue-700 text-white placeholder:text-gray-500

/* Modo Claro */
.bg-white border-[#B0BEC5] text-[#212121] placeholder:text-gray-400
```

### Badges

```css
/* Status e Prioridade - Modo Escuro */
.bg-[cor-status]/80 text-[cor-texto] px-2 py-0.5 rounded-full text-xs

/* Status e Prioridade - Modo Claro */
.bg-[cor-status]/70 text-[cor-texto] px-2 py-0.5 rounded-full text-xs

/* Tags - Modo Escuro */
.bg-blue-900/30 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full text-xs

/* Tags - Modo Claro */
.bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-full text-xs
```

## Animações

### Transições

| Elemento | Propriedade | Duração | Timing |
|----------|-------------|---------|--------|
| Botões | `all` | `300ms` | `ease` |
| Cards | `transform, box-shadow` | `300ms` | `ease` |
| Modais | `opacity, transform` | `200ms` | `ease-out` |
| Dropdowns | `opacity, transform` | `150ms` | `ease-out` |

### Animações Keyframe

#### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

#### Slide Down

```css
@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-down {
  animation: slideDown 300ms ease-out;
}
```

#### Slide Up

```css
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 300ms ease-out;
}
```

#### Slide Right

```css
@keyframes slideRight {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-right {
  animation: slideRight 300ms ease-out;
}
```

### Efeitos de Hover

#### Hover Lift

```css
.hover-lift {
  transition: transform 300ms ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}
```

#### Hover Scale

```css
.hover-scale {
  transition: transform 300ms ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

## Responsividade

### Breakpoints

| Nome | Tamanho |
|------|---------|
| sm | `640px` |
| md | `768px` |
| lg | `1024px` |
| xl | `1280px` |
| 2xl | `1536px` |

### Layout Responsivo

#### Grid de Cards

```css
/* Mobile: 1 coluna */
.grid-cols-1

/* Tablet: 2 colunas */
.md:grid-cols-2

/* Desktop pequeno: 3 colunas */
.lg:grid-cols-3

/* Desktop grande: 4 colunas */
.xl:grid-cols-4
```

#### Sidebar

```css
/* Mobile: escondida ou como drawer */
.w-0 .md:w-[250px]

/* Desktop: visível */
.w-[250px]
```

#### Espaçamento Responsivo

```css
/* Padding menor em mobile */
.p-4 .md:p-6 .lg:p-8

/* Margin menor em mobile */
.m-4 .md:m-6 .lg:m-8
``` 