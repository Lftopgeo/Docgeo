# Diagrama ER do Banco de Dados Docgeo

O diagrama abaixo representa a estrutura do banco de dados do sistema Docgeo, mostrando as tabelas e seus relacionamentos.

```mermaid
erDiagram
    %% Autenticação e Usuários
    auth_users ||--|| profiles : "tem"
    auth_users ||--|| user_settings : "tem"
    
    %% Documentos
    document_categories ||--o{ document_subcategories : "contém"
    document_categories ||--o{ documents : "categoriza"
    document_subcategories ||--o{ documents : "subcategoriza"
    auth_users ||--o{ documents : "cria"
    
    %% Tarefas
    auth_users ||--o{ tasks : "cria"
    auth_users ||--o{ tasks : "é atribuído"
    tasks ||--o{ task_tags : "tem"
    tasks ||--o{ task_comments : "tem"
    auth_users ||--o{ task_comments : "cria"
    
    %% Ferramentas
    auth_users ||--o{ tools : "cria"
    tools ||--o{ tool_integrations : "tem"
    tools ||--o{ tool_usage_stats : "tem"
    
    %% Definição das entidades
    auth_users {
        uuid id PK
        string email
        string encrypted_password
        timestamp created_at
    }
    
    profiles {
        uuid id PK,FK
        string email
        string full_name
        string avatar_url
        string role
        timestamp created_at
        timestamp updated_at
    }
    
    user_settings {
        uuid id PK,FK
        string language
        string theme
        boolean notifications
        boolean email_notifications
        boolean auto_save
        string default_view
        string primary_color
        string font_size
        boolean animations_enabled
        boolean two_factor_auth
        integer session_timeout
        timestamp created_at
        timestamp updated_at
    }
    
    document_categories {
        uuid id PK
        string name
        uuid created_by FK
        timestamp created_at
    }
    
    document_subcategories {
        uuid id PK
        string name
        uuid category_id FK
        timestamp created_at
    }
    
    documents {
        uuid id PK
        string title
        string description
        string file_path
        string file_type
        string file_size
        uuid category_id FK
        uuid subcategory_id FK
        uuid created_by FK
        timestamp created_at
        timestamp last_updated
    }
    
    tasks {
        uuid id PK
        string title
        string description
        string status
        string priority
        timestamp due_date
        uuid assignee_id FK
        uuid created_by FK
        timestamp created_at
    }
    
    task_tags {
        uuid id PK
        uuid task_id FK
        string tag
        timestamp created_at
    }
    
    task_comments {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        string comment
        timestamp created_at
    }
    
    tools {
        uuid id PK
        string name
        string description
        string category
        string api_endpoint
        string documentation
        string image_url
        string status
        boolean is_public
        uuid created_by FK
        timestamp created_at
        timestamp last_updated
    }
    
    tool_integrations {
        uuid id PK
        uuid tool_id FK
        string integration_name
        string status
        timestamp created_at
    }
    
    tool_usage_stats {
        uuid id PK
        uuid tool_id FK
        date date
        integer requests
        numeric success_rate
        numeric average_response_time
        timestamp created_at
    }
```

## Legenda

- **PK**: Chave Primária
- **FK**: Chave Estrangeira
- **||--||**: Relacionamento um-para-um
- **||--o{**: Relacionamento um-para-muitos
- **}o--o{**: Relacionamento muitos-para-muitos

## Descrição dos Relacionamentos

1. **Usuários e Configurações**:
   - Cada usuário (`auth_users`) tem um perfil (`profiles`)
   - Cada usuário tem configurações personalizadas (`user_settings`)

2. **Documentos**:
   - Categorias (`document_categories`) contêm subcategorias (`document_subcategories`)
   - Documentos (`documents`) pertencem a categorias e subcategorias
   - Usuários criam documentos

3. **Tarefas**:
   - Usuários criam tarefas (`tasks`)
   - Tarefas são atribuídas a usuários
   - Tarefas têm tags (`task_tags`) e comentários (`task_comments`)
   - Usuários criam comentários em tarefas

4. **Ferramentas**:
   - Usuários criam ferramentas (`tools`)
   - Ferramentas têm integrações (`tool_integrations`)
   - Ferramentas têm estatísticas de uso (`tool_usage_stats`) 