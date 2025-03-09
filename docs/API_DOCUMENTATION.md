# Documentação das APIs - Docgeo

Este documento descreve as APIs disponíveis no projeto Docgeo, incluindo exemplos de requisições e respostas.

## Base URL

Todas as APIs estão disponíveis em `http://localhost:3000/api`.

## Autenticação

A autenticação é gerenciada pelo Supabase. As APIs verificam a sessão do usuário através de cookies.

## Formato das Respostas

Todas as respostas são retornadas no formato JSON. Em caso de sucesso, o corpo da resposta contém os dados solicitados. Em caso de erro, o corpo da resposta contém um objeto com a propriedade `error` contendo a mensagem de erro.

## APIs de Documentos

### Listar Documentos

```
GET /documents
```

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Documento 1",
    "description": "Descrição do documento 1",
    "content": "Conteúdo do documento 1",
    "file_url": "https://example.com/documento1.pdf",
    "file_type": "PDF",
    "file_size": 1024,
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
    "tags": ["tag1", "tag2"],
    "author": "Autor 1",
    "is_public": true,
    "view_count": 10,
    "created_by": "123e4567-e89b-12d3-a456-426614174003",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-02T00:00:00.000Z",
    "document_categories": {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Categoria 1",
      "description": "Descrição da categoria 1"
    },
    "document_subcategories": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Subcategoria 1",
      "description": "Descrição da subcategoria 1",
      "category_id": "123e4567-e89b-12d3-a456-426614174001"
    }
  }
]
```

### Obter Documento por ID

```
GET /documents/:id
```

**Parâmetros de URL**

| Parâmetro | Tipo   | Descrição       |
|-----------|--------|-----------------|
| id        | string | ID do documento |

**Resposta de Sucesso (200 OK)**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Documento 1",
  "description": "Descrição do documento 1",
  "content": "Conteúdo do documento 1",
  "file_url": "https://example.com/documento1.pdf",
  "file_type": "PDF",
  "file_size": 1024,
  "category_id": "123e4567-e89b-12d3-a456-426614174001",
  "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
  "tags": ["tag1", "tag2"],
  "author": "Autor 1",
  "is_public": true,
  "view_count": 10,
  "created_by": "123e4567-e89b-12d3-a456-426614174003",
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-02T00:00:00.000Z",
  "document_categories": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Categoria 1",
    "description": "Descrição da categoria 1"
  },
  "document_subcategories": {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Subcategoria 1",
    "description": "Descrição da subcategoria 1",
    "category_id": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

### Criar Documento

```
POST /documents
```

**Corpo da Requisição**

```json
{
  "title": "Novo Documento",
  "description": "Descrição do novo documento",
  "content": "Conteúdo do novo documento",
  "file_url": "https://example.com/novo-documento.pdf",
  "file_type": "PDF",
  "file_size": 1024,
  "category_id": "123e4567-e89b-12d3-a456-426614174001",
  "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
  "tags": ["tag1", "tag2"],
  "author": "Autor 1",
  "is_public": true
}
```

**Resposta de Sucesso (200 OK)**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "title": "Novo Documento",
  "description": "Descrição do novo documento",
  "content": "Conteúdo do novo documento",
  "file_url": "https://example.com/novo-documento.pdf",
  "file_type": "PDF",
  "file_size": 1024,
  "category_id": "123e4567-e89b-12d3-a456-426614174001",
  "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
  "tags": ["tag1", "tag2"],
  "author": "Autor 1",
  "is_public": true,
  "view_count": 0,
  "created_by": "123e4567-e89b-12d3-a456-426614174003",
  "created_at": "2023-01-03T00:00:00.000Z",
  "updated_at": "2023-01-03T00:00:00.000Z"
}
```

### Atualizar Documento

```
PUT /documents
```

**Corpo da Requisição**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "title": "Documento Atualizado",
  "description": "Descrição atualizada",
  "content": "Conteúdo atualizado",
  "file_url": "https://example.com/documento-atualizado.pdf",
  "file_type": "PDF",
  "file_size": 2048,
  "category_id": "123e4567-e89b-12d3-a456-426614174001",
  "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Autor 1",
  "is_public": true
}
```

**Resposta de Sucesso (200 OK)**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174004",
  "title": "Documento Atualizado",
  "description": "Descrição atualizada",
  "content": "Conteúdo atualizado",
  "file_url": "https://example.com/documento-atualizado.pdf",
  "file_type": "PDF",
  "file_size": 2048,
  "category_id": "123e4567-e89b-12d3-a456-426614174001",
  "subcategory_id": "123e4567-e89b-12d3-a456-426614174002",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Autor 1",
  "is_public": true,
  "view_count": 0,
  "created_by": "123e4567-e89b-12d3-a456-426614174003",
  "created_at": "2023-01-03T00:00:00.000Z",
  "updated_at": "2023-01-04T00:00:00.000Z"
}
```

### Excluir Documento

```
DELETE /documents?id=123e4567-e89b-12d3-a456-426614174004
```

**Parâmetros de URL**

| Parâmetro | Tipo   | Descrição       |
|-----------|--------|-----------------|
| id        | string | ID do documento |

**Resposta de Sucesso (200 OK)**

```json
{
  "success": true
}
```

## APIs de Categorias

### Listar Categorias

```
GET /categories
```

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "name": "Categoria 1",
    "description": "Descrição da categoria 1",
    "icon": "folder",
    "color": "#FF0000",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "document_subcategories": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "name": "Subcategoria 1",
        "description": "Descrição da subcategoria 1",
        "category_id": "123e4567-e89b-12d3-a456-426614174001",
        "icon": "file",
        "color": "#00FF00",
        "created_at": "2023-01-01T00:00:00.000Z",
        "updated_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

### Criar Categoria

```
POST /categories
```

**Corpo da Requisição**

```json
{
  "name": "Nova Categoria",
  "description": "Descrição da nova categoria",
  "icon": "folder",
  "color": "#0000FF"
}
```

**Resposta de Sucesso (200 OK)**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "name": "Nova Categoria",
  "description": "Descrição da nova categoria",
  "icon": "folder",
  "color": "#0000FF",
  "created_at": "2023-01-05T00:00:00.000Z",
  "updated_at": "2023-01-05T00:00:00.000Z"
}
```

## APIs de Subcategorias

### Listar Subcategorias

```
GET /subcategories
```

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Subcategoria 1",
    "description": "Descrição da subcategoria 1",
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "icon": "file",
    "color": "#00FF00",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### Listar Subcategorias por Categoria

```
GET /subcategories?categoryId=123e4567-e89b-12d3-a456-426614174001
```

**Parâmetros de URL**

| Parâmetro  | Tipo   | Descrição      |
|------------|--------|----------------|
| categoryId | string | ID da categoria |

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "name": "Subcategoria 1",
    "description": "Descrição da subcategoria 1",
    "category_id": "123e4567-e89b-12d3-a456-426614174001",
    "icon": "file",
    "color": "#00FF00",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

## APIs de Tarefas

### Listar Tarefas

```
GET /tasks
```

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "title": "Tarefa 1",
    "description": "Descrição da tarefa 1",
    "status": "pending",
    "priority": "high",
    "due_date": "2023-01-10T00:00:00.000Z",
    "assigned_to": "123e4567-e89b-12d3-a456-426614174003",
    "project_id": "123e4567-e89b-12d3-a456-426614174007",
    "parent_task_id": null,
    "is_recurring": false,
    "recurrence_pattern": null,
    "estimated_hours": 8,
    "actual_hours": 0,
    "progress": 0,
    "created_by": "123e4567-e89b-12d3-a456-426614174003",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z",
    "completed_at": null,
    "tags": ["importante", "urgente"]
  }
]
```

### Criar Tarefa

```
POST /tasks
```

**Corpo da Requisição**

```json
{
  "title": "Nova Tarefa",
  "description": "Descrição da nova tarefa",
  "status": "pending",
  "priority": "medium",
  "due_date": "2023-01-15T00:00:00.000Z",
  "assigned_to": "123e4567-e89b-12d3-a456-426614174003",
  "project_id": "123e4567-e89b-12d3-a456-426614174007",
  "parent_task_id": null,
  "is_recurring": false,
  "recurrence_pattern": null,
  "estimated_hours": 4,
  "actual_hours": 0,
  "progress": 0,
  "tags": ["importante"]
}
```

**Resposta de Sucesso (200 OK)**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174008",
  "title": "Nova Tarefa",
  "description": "Descrição da nova tarefa",
  "status": "pending",
  "priority": "medium",
  "due_date": "2023-01-15T00:00:00.000Z",
  "assigned_to": "123e4567-e89b-12d3-a456-426614174003",
  "project_id": "123e4567-e89b-12d3-a456-426614174007",
  "parent_task_id": null,
  "is_recurring": false,
  "recurrence_pattern": null,
  "estimated_hours": 4,
  "actual_hours": 0,
  "progress": 0,
  "created_by": "123e4567-e89b-12d3-a456-426614174003",
  "created_at": "2023-01-05T00:00:00.000Z",
  "updated_at": "2023-01-05T00:00:00.000Z",
  "completed_at": null,
  "tags": ["importante"]
}
```

## APIs de Ferramentas

### Listar Ferramentas

```
GET /tools
```

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174009",
    "name": "Ferramenta 1",
    "description": "Descrição da ferramenta 1",
    "status": "active",
    "category": "IA",
    "last_updated": "2023-01-01T00:00:00.000Z",
    "image_url": "https://example.com/ferramenta1.png",
    "created_at": "2023-01-01T00:00:00.000Z",
    "created_by": "123e4567-e89b-12d3-a456-426614174003",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

### Listar Ferramentas por Categoria

```
GET /tools?category=IA
```

**Parâmetros de URL**

| Parâmetro | Tipo   | Descrição      |
|-----------|--------|----------------|
| category  | string | Categoria da ferramenta |

**Resposta de Sucesso (200 OK)**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174009",
    "name": "Ferramenta 1",
    "description": "Descrição da ferramenta 1",
    "status": "active",
    "category": "IA",
    "last_updated": "2023-01-01T00:00:00.000Z",
    "image_url": "https://example.com/ferramenta1.png",
    "created_at": "2023-01-01T00:00:00.000Z",
    "created_by": "123e4567-e89b-12d3-a456-426614174003",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

## Códigos de Status

| Código | Descrição                                                  |
|--------|-----------------------------------------------------------|
| 200    | OK - A requisição foi bem-sucedida                        |
| 400    | Bad Request - A requisição contém parâmetros inválidos    |
| 401    | Unauthorized - A requisição requer autenticação           |
| 404    | Not Found - O recurso solicitado não foi encontrado       |
| 500    | Internal Server Error - Ocorreu um erro no servidor       |

## Erros

Em caso de erro, a resposta contém um objeto com a propriedade `error` contendo a mensagem de erro.

**Exemplo de Erro**

```json
{
  "error": "O título do documento é obrigatório"
}
``` 