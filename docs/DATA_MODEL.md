# Modèle de Données - Plateforme de Digitalisation d'Usine

## Schéma Entité-Relation (ERD)

### Vue d'ensemble des Entités

```
┌─────────────────────────────────────────────────────────────────┐
│                    GESTION DES UTILISATEURS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐    │
│  │   User    │────────>│   Role    │<────────│ Permission│    │
│  └─────┬─────┘         └───────────┘         └───────────┘    │
│        │                                                         │
│        │ (1:N)                                                  │
│        │                                                         │
│        v                                                         │
│  ┌───────────┐                                                  │
│  │Department │                                                  │
│  └───────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   GESTION DES CHECKLISTS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   (1:N)   ┌──────────────┐                  │
│  │ChecklistTemplate│───────>│ChecklistSection│                  │
│  └──────┬───────┘           └──────┬───────┘                  │
│         │                           │                            │
│         │ (1:N)                    │ (1:N)                     │
│         │                           │                            │
│         v                           v                            │
│  ┌──────────────┐           ┌──────────────┐                  │
│  │ FieldDefinition│          │FieldGroup    │                  │
│  └──────────────┘           └──────────────┘                  │
│         │                                                         │
│         │ (N:1)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐                                               │
│  │  FieldType   │                                               │
│  │ (enum/table) │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            ATTRIBUTION ET COLLECTE DE DONNÉES                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │ChecklistTemplate│                                             │
│  └──────┬───────┘                                               │
│         │                                                         │
│         │ (1:N)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐   (N:1)   ┌──────────┐                      │
│  │ Assignment   │────────────>│   User   │                      │
│  └──────┬───────┘             └──────────┘                      │
│         │                                                         │
│         │ (1:1)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐   (1:N)   ┌──────────────┐                  │
│  │DataCollection│────────────>│CollectionData│                  │
│  └──────┬───────┘             └──────┬───────┘                  │
│         │                             │                          │
│         │ (1:N)                      │ (N:1)                   │
│         │                             │                          │
│         v                             v                          │
│  ┌──────────────┐           ┌──────────────┐                  │
│  │ Attachment   │           │FieldDefinition│                  │
│  └──────────────┘           └──────────────┘                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                 WORKFLOW D'APPROBATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │DataCollection│                                               │
│  └──────┬───────┘                                               │
│         │                                                         │
│         │ (1:N)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐   (N:1)   ┌──────────┐                      │
│  │ApprovalRequest│──────────>│   User   │                      │
│  └──────┬───────┘  (approver)└──────────┘                      │
│         │                                                         │
│         │ (1:N)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐   (N:1)   ┌──────────┐                      │
│  │ApprovalComment│──────────>│   User   │                      │
│  └──────────────┘             └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    KPI ET DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   (1:N)   ┌──────────────┐                  │
│  │KPIDefinition │────────────>│  KPIValue    │                  │
│  └──────────────┘             └──────────────┘                  │
│         │                                                         │
│         │ (N:M)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐                                               │
│  │  Dashboard   │                                               │
│  └──────┬───────┘                                               │
│         │                                                         │
│         │ (N:M)                                                  │
│         │                                                         │
│         v                                                         │
│  ┌──────────────┐                                               │
│  │   Widget     │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Description Détaillée des Tables

### 1. GESTION DES UTILISATEURS

#### Table: `users`
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255), -- NULL pour les utilisateurs AD
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    auth_type ENUM('jwt', 'ad') NOT NULL DEFAULT 'jwt',
    ad_username VARCHAR(255), -- Pour les utilisateurs AD
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    department_id UUID REFERENCES departments(id),
    profile_picture_url TEXT,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_auth_type ON users(auth_type);
```

#### Table: `roles`
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- Admin, Supervisor, Operator, Viewer
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE, -- Rôles système non modifiables
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `permissions`
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL, -- checklist, user, dashboard, etc.
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, approve
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `user_roles`
```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);
```

#### Table: `role_permissions`
```sql
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
```

#### Table: `departments`
```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES departments(id), -- Hiérarchie
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. AUTHENTIFICATION ET SESSIONS

#### Table: `refresh_tokens`
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    device_info JSONB, -- Info sur l'appareil
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

#### Table: `audit_logs`
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- login, logout, create, update, delete, etc.
    resource_type VARCHAR(50), -- checklist, user, etc.
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### 3. GESTION DES CHECKLISTS

#### Table: `checklist_templates`
```sql
CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Sécurité, Maintenance, Qualité, etc.
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    frequency ENUM('daily', 'weekly', 'monthly', 'on_demand', 'custom') NOT NULL,
    frequency_config JSONB, -- Configuration détaillée de la fréquence
    estimated_duration INTEGER, -- En minutes
    department_id UUID REFERENCES departments(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    archived_at TIMESTAMP
);

CREATE INDEX idx_checklist_templates_category ON checklist_templates(category);
CREATE INDEX idx_checklist_templates_department ON checklist_templates(department_id);
```

#### Table: `checklist_sections`
```sql
CREATE TABLE checklist_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_template_id UUID REFERENCES checklist_templates(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_conditional BOOLEAN DEFAULT FALSE,
    condition_config JSONB, -- Conditions d'affichage
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checklist_sections_template ON checklist_sections(checklist_template_id);
```

#### Table: `field_definitions`
```sql
CREATE TABLE field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_section_id UUID REFERENCES checklist_sections(id) ON DELETE CASCADE,
    field_type VARCHAR(50) NOT NULL, -- text, number, date, time, select, multi_select, checkbox, radio, photo, signature, etc.
    label VARCHAR(255) NOT NULL,
    placeholder TEXT,
    help_text TEXT,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    validation_rules JSONB, -- min, max, regex, etc.
    options JSONB, -- Pour select, radio, etc.
    default_value TEXT,
    is_conditional BOOLEAN DEFAULT FALSE,
    condition_config JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_field_definitions_section ON field_definitions(checklist_section_id);
```

### 4. ATTRIBUTION ET PLANIFICATION

#### Table: `assignments`
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_template_id UUID REFERENCES checklist_templates(id),
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    due_date TIMESTAMP NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'overdue', 'cancelled') DEFAULT 'pending',
    location VARCHAR(255),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE INDEX idx_assignments_user ON assignments(assigned_to);
CREATE INDEX idx_assignments_template ON assignments(checklist_template_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

#### Table: `assignment_notifications`
```sql
CREATE TABLE assignment_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    notification_type ENUM('created', 'reminder', 'overdue', 'completed') NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    sent_via ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    status ENUM('sent', 'failed', 'pending') DEFAULT 'pending'
);
```

### 5. COLLECTE DE DONNÉES

#### Table: `data_collections`
```sql
CREATE TABLE data_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id),
    checklist_template_id UUID REFERENCES checklist_templates(id),
    collected_by UUID REFERENCES users(id),
    status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    location JSONB, -- Coordonnées GPS: {lat, lng, accuracy}
    device_info JSONB,
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    synced_at TIMESTAMP, -- Quand les données offline ont été synchronisées
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_collections_assignment ON data_collections(assignment_id);
CREATE INDEX idx_data_collections_user ON data_collections(collected_by);
CREATE INDEX idx_data_collections_status ON data_collections(status);
```

#### Table: `collection_data`
```sql
CREATE TABLE collection_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_collection_id UUID REFERENCES data_collections(id) ON DELETE CASCADE,
    field_definition_id UUID REFERENCES field_definitions(id),
    value TEXT, -- Valeur sérialisée
    value_type VARCHAR(50), -- Pour validation
    files JSONB, -- Array de fichiers pour les photos/documents
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_collection_data_collection ON collection_data(data_collection_id);
CREATE INDEX idx_collection_data_field ON collection_data(field_definition_id);
```

#### Table: `attachments`
```sql
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_collection_id UUID REFERENCES data_collections(id) ON DELETE CASCADE,
    collection_data_id UUID REFERENCES collection_data(id), -- Si attaché à un champ spécifique
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- image, pdf, etc.
    file_size INTEGER, -- En octets
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attachments_collection ON attachments(data_collection_id);
```

### 6. APPROBATION ET VALIDATION

#### Table: `approval_workflows`
```sql
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    checklist_template_id UUID REFERENCES checklist_templates(id),
    steps JSONB NOT NULL, -- Array of steps with approvers
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `approval_requests`
```sql
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_collection_id UUID REFERENCES data_collections(id),
    workflow_id UUID REFERENCES approval_workflows(id),
    current_step INTEGER DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    requested_by UUID REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_approval_requests_collection ON approval_requests(data_collection_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
```

#### Table: `approval_steps`
```sql
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    approver_id UUID REFERENCES users(id),
    status ENUM('pending', 'approved', 'rejected', 'skipped') DEFAULT 'pending',
    decision_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_approval_steps_request ON approval_steps(approval_request_id);
CREATE INDEX idx_approval_steps_approver ON approval_steps(approver_id);
```

#### Table: `approval_comments`
```sql
CREATE TABLE approval_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID REFERENCES approval_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. KPI ET DASHBOARD

#### Table: `kpi_definitions`
```sql
CREATE TABLE kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Performance, Qualité, Sécurité, etc.
    calculation_type ENUM('count', 'sum', 'average', 'percentage', 'custom') NOT NULL,
    calculation_config JSONB, -- Configuration du calcul
    unit VARCHAR(50), -- %, nombre, heures, etc.
    target_value DECIMAL(15,2),
    threshold_config JSONB, -- Seuils pour alertes
    refresh_frequency ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `kpi_values`
```sql
CREATE TABLE kpi_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_definition_id UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    value DECIMAL(15,2) NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    metadata JSONB, -- Données supplémentaires
    calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kpi_values_definition ON kpi_values(kpi_definition_id);
CREATE INDEX idx_kpi_values_period ON kpi_values(period_start, period_end);
```

#### Table: `dashboards`
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB, -- Configuration du layout
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `dashboard_widgets`
```sql
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    widget_type VARCHAR(50) NOT NULL, -- chart, table, card, gauge, etc.
    title VARCHAR(255),
    config JSONB NOT NULL, -- Configuration du widget
    position JSONB, -- Position et taille
    kpi_definition_id UUID REFERENCES kpi_definitions(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table: `dashboard_shares`
```sql
CREATE TABLE dashboard_shares (
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission ENUM('view', 'edit') DEFAULT 'view',
    shared_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (dashboard_id, user_id)
);
```

### 8. SYNCHRONISATION (POUR MODE OFFLINE)

#### Table: `sync_queue`
```sql
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL, -- data_collection, attachment, etc.
    entity_id UUID,
    operation ENUM('create', 'update', 'delete') NOT NULL,
    payload JSONB NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
```

#### Table: `sync_conflicts`
```sql
CREATE TABLE sync_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_queue_id UUID REFERENCES sync_queue(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    local_version JSONB,
    server_version JSONB,
    resolution ENUM('pending', 'use_local', 'use_server', 'merged', 'manual') DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 9. NOTIFICATIONS

#### Table: `notifications`
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- assignment, approval, reminder, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB, -- Données additionnelles
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

## Relations Principales

### One-to-Many (1:N)
- Un `User` peut avoir plusieurs `Assignments`
- Un `ChecklistTemplate` peut avoir plusieurs `ChecklistSections`
- Une `ChecklistSection` peut avoir plusieurs `FieldDefinitions`
- Un `DataCollection` peut avoir plusieurs `CollectionData`
- Un `DataCollection` peut avoir plusieurs `Attachments`

### Many-to-Many (M:N)
- `Users` ↔ `Roles` (via `user_roles`)
- `Roles` ↔ `Permissions` (via `role_permissions`)
- `Dashboards` ↔ `Users` (via `dashboard_shares`)

### One-to-One (1:1)
- Un `Assignment` a un `DataCollection` (optionnel)
- Un `DataCollection` a une `ApprovalRequest` (optionnel)

## Index et Optimisations

### Index Composites Recommandés
```sql
CREATE INDEX idx_assignments_user_status ON assignments(assigned_to, status);
CREATE INDEX idx_data_collections_user_status ON data_collections(collected_by, status);
CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_kpi_values_def_period ON kpi_values(kpi_definition_id, period_start, period_end);
```

### Partitionnement (pour tables volumineuses)
```sql
-- Partitionner audit_logs par mois
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
    
-- Partitionner kpi_values par trimestre
CREATE TABLE kpi_values_y2024q1 PARTITION OF kpi_values
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
```

## Vues Matérialisées

### Vue: `v_assignment_stats`
```sql
CREATE MATERIALIZED VIEW v_assignment_stats AS
SELECT 
    assigned_to,
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM assignments
GROUP BY assigned_to, status, DATE(created_at);

CREATE INDEX idx_assignment_stats ON v_assignment_stats(assigned_to, date);
```

### Vue: `v_kpi_summary`
```sql
CREATE MATERIALIZED VIEW v_kpi_summary AS
SELECT 
    kd.id,
    kd.name,
    kv.value,
    kv.period_start,
    kv.period_end,
    CASE 
        WHEN kv.value >= kd.target_value THEN 'achieved'
        WHEN kv.value >= kd.target_value * 0.8 THEN 'on_track'
        ELSE 'at_risk'
    END as status
FROM kpi_definitions kd
LEFT JOIN LATERAL (
    SELECT * FROM kpi_values
    WHERE kpi_definition_id = kd.id
    ORDER BY period_end DESC
    LIMIT 1
) kv ON true
WHERE kd.is_active = true;
```

## Règles Métier et Contraintes

### Contraintes CHECK
```sql
-- Les dates de fin doivent être après les dates de début
ALTER TABLE kpi_values ADD CONSTRAINT check_period 
    CHECK (period_end > period_start);

-- Le pourcentage de progression doit être entre 0 et 100
ALTER TABLE data_collections ADD CONSTRAINT check_progress 
    CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Le nombre de tentatives ne peut pas être négatif
ALTER TABLE sync_queue ADD CONSTRAINT check_retry 
    CHECK (retry_count >= 0);
```

### Triggers

#### Mise à jour automatique des timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer à toutes les tables avec updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Calcul automatique du statut overdue
```sql
CREATE OR REPLACE FUNCTION update_assignment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.due_date < NOW() AND NEW.status = 'pending' THEN
        NEW.status = 'overdue';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_assignment_overdue BEFORE INSERT OR UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_assignment_status();
```

## Stratégie de Backup

### Backup Complet
- Fréquence : Quotidien à 2h00 du matin
- Rétention : 30 jours

### Backup Incrémental
- Fréquence : Toutes les 6 heures
- Rétention : 7 jours

### Point-in-Time Recovery
- Activation du WAL archiving
- Rétention : 7 jours

## Migration et Versioning

- Utilisation de migrations TypeORM ou Prisma
- Versioning sémantique des schémas
- Tests de migration en environnement de staging avant production
- Rollback automatique en cas d'échec
