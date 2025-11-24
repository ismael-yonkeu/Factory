# Diagramme de Classes UML

## Vue d'ensemble
Ce diagramme représente les principales classes métier du système et leurs relations.

## Diagramme de classes principal

```mermaid
classDiagram
    %% Entités principales
    class User {
        -UUID id
        -String email
        -String phone
        -String password
        -String firstName
        -String lastName
        -String adUsername
        -AuthType authType
        -UserStatus status
        -DateTime createdAt
        -DateTime updatedAt
        -DateTime lastLogin
        +authenticate()
        +updateProfile()
        +changePassword()
        +hasPermission()
        +hasRole()
    }

    class Role {
        -UUID id
        -String name
        -String description
        -Boolean isSystem
        -DateTime createdAt
        +addPermission()
        +removePermission()
        +getPermissions()
    }

    class Permission {
        -UUID id
        -String resource
        -String action
        -String description
        +validate()
        +toString()
    }

    class Department {
        -UUID id
        -String name
        -String code
        -String description
        -UUID parentId
        -Boolean active
        +getHierarchy()
        +getMembers()
        +addMember()
    }

    class Checklist {
        -UUID id
        -String title
        -String description
        -ChecklistType type
        -String version
        -JSON schema
        -ChecklistStatus status
        -UUID createdBy
        -DateTime createdAt
        -DateTime updatedAt
        +validate()
        +publish()
        +archive()
        +duplicate()
        +export()
    }

    class ChecklistTemplate {
        -UUID id
        -String name
        -String category
        -JSON structure
        -Boolean isActive
        -String version
        +createChecklist()
        +updateStructure()
        +validateSchema()
    }

    class ChecklistItem {
        -UUID id
        -UUID checklistId
        -String label
        -ItemType type
        -JSON options
        -Boolean required
        -Integer order
        -JSON validationRules
        +validate()
        +getDefaultValue()
    }

    class ChecklistAssignment {
        -UUID id
        -UUID checklistId
        -UUID assignedTo
        -UUID assignedBy
        -DateTime assignedAt
        -DateTime dueDate
        -Priority priority
        -AssignmentStatus status
        -String notes
        +assign()
        +reassign()
        +cancel()
        +complete()
    }

    class ChecklistSubmission {
        -UUID id
        -UUID assignmentId
        -UUID submittedBy
        -JSON data
        -SubmissionStatus status
        -DateTime startedAt
        -DateTime submittedAt
        -String signature
        -GeoLocation location
        +submit()
        +saveDraft()
        +validate()
        +approve()
        +reject()
    }

    class ApprovalWorkflow {
        -UUID id
        -String name
        -WorkflowType type
        -JSON stages
        -Boolean active
        +initiate()
        +getNextStage()
        +complete()
    }

    class ApprovalRequest {
        -UUID id
        -UUID workflowId
        -UUID submissionId
        -UUID currentApprover
        -ApprovalStatus status
        -String comments
        -DateTime requestedAt
        -DateTime decidedAt
        +approve()
        +reject()
        +escalate()
        +delegate()
    }

    class DataPoint {
        -UUID id
        -UUID submissionId
        -UUID itemId
        -String value
        -DataType type
        -DateTime timestamp
        -JSON metadata
        +validate()
        +transform()
        +aggregate()
    }

    class Attachment {
        -UUID id
        -UUID entityId
        -EntityType entityType
        -String fileName
        -String mimeType
        -Long size
        -String url
        -DateTime uploadedAt
        -UUID uploadedBy
        +upload()
        +download()
        +delete()
        +getMetadata()
    }

    class Notification {
        -UUID id
        -UUID userId
        -NotificationType type
        -String title
        -String message
        -JSON data
        -Boolean isRead
        -DateTime createdAt
        -DateTime readAt
        +send()
        +markAsRead()
        +delete()
    }

    class AuditLog {
        -UUID id
        -UUID userId
        -String action
        -String entity
        -UUID entityId
        -JSON oldValue
        -JSON newValue
        -String ipAddress
        -String userAgent
        -DateTime timestamp
        +log()
        +query()
        +export()
    }

    class Dashboard {
        -UUID id
        -String name
        -UUID ownerId
        -JSON layout
        -Boolean isPublic
        -DateTime createdAt
        +addWidget()
        +removeWidget()
        +share()
        +export()
    }

    class Widget {
        -UUID id
        -UUID dashboardId
        -WidgetType type
        -String title
        -JSON config
        -JSON dataSource
        -Position position
        -Size size
        +render()
        +refresh()
        +configure()
    }

    class KPI {
        -UUID id
        -String name
        -String formula
        -String unit
        -Decimal target
        -Decimal current
        -Period period
        -DateTime calculatedAt
        +calculate()
        +getHistory()
        +getTrend()
    }

    class Report {
        -UUID id
        -String name
        -ReportType type
        -JSON parameters
        -String format
        -UUID generatedBy
        -DateTime generatedAt
        -String url
        +generate()
        +schedule()
        +export()
        +email()
    }

    %% Relations
    User "1" --> "*" Role : has
    Role "1" --> "*" Permission : contains
    User "1" --> "1" Department : belongsTo
    Department "1" --> "*" User : hasMembers
    Department "1" --> "*" Department : hasSubDepartments
    
    User "1" --> "*" Checklist : creates
    Checklist "1" --> "*" ChecklistItem : contains
    Checklist "1" --> "1" ChecklistTemplate : basedOn
    
    Checklist "1" --> "*" ChecklistAssignment : hasAssignments
    ChecklistAssignment "1" --> "1" User : assignedTo
    ChecklistAssignment "1" --> "1" User : assignedBy
    
    ChecklistAssignment "1" --> "*" ChecklistSubmission : hasSubmissions
    ChecklistSubmission "1" --> "1" User : submittedBy
    ChecklistSubmission "1" --> "*" DataPoint : contains
    DataPoint "1" --> "1" ChecklistItem : relatedTo
    
    ChecklistSubmission "1" --> "*" ApprovalRequest : hasApprovals
    ApprovalRequest "1" --> "1" ApprovalWorkflow : followsWorkflow
    ApprovalRequest "1" --> "1" User : approver
    
    User "1" --> "*" Notification : receives
    User "1" --> "*" AuditLog : generates
    
    ChecklistSubmission "1" --> "*" Attachment : hasAttachments
    DataPoint "1" --> "*" Attachment : hasAttachments
    
    User "1" --> "*" Dashboard : owns
    Dashboard "1" --> "*" Widget : contains
    Widget "1" --> "*" KPI : displays
    
    User "1" --> "*" Report : generates
```

## Classes d'énumération

```mermaid
classDiagram
    class AuthType {
        <<enumeration>>
        JWT
        ACTIVE_DIRECTORY
    }

    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        LOCKED
        PENDING
    }

    class ChecklistType {
        <<enumeration>>
        INSPECTION
        MAINTENANCE
        QUALITY_CONTROL
        SAFETY
        AUDIT
    }

    class ChecklistStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        ARCHIVED
    }

    class ItemType {
        <<enumeration>>
        TEXT
        NUMBER
        DATE
        TIME
        DATETIME
        BOOLEAN
        SELECT
        MULTISELECT
        FILE
        PHOTO
        SIGNATURE
        LOCATION
    }

    class AssignmentStatus {
        <<enumeration>>
        PENDING
        IN_PROGRESS
        COMPLETED
        OVERDUE
        CANCELLED
    }

    class SubmissionStatus {
        <<enumeration>>
        DRAFT
        SUBMITTED
        IN_REVIEW
        APPROVED
        REJECTED
        ARCHIVED
    }

    class Priority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }

    class ApprovalStatus {
        <<enumeration>>
        PENDING
        APPROVED
        REJECTED
        ESCALATED
        DELEGATED
    }

    class NotificationType {
        <<enumeration>>
        ASSIGNMENT
        SUBMISSION
        APPROVAL_REQUIRED
        APPROVAL_DECISION
        REMINDER
        ALERT
        SYSTEM
    }

    class WorkflowType {
        <<enumeration>>
        SEQUENTIAL
        PARALLEL
        CONDITIONAL
    }

    class DataType {
        <<enumeration>>
        STRING
        NUMBER
        BOOLEAN
        DATE
        JSON
        BINARY
    }

    class EntityType {
        <<enumeration>>
        CHECKLIST
        SUBMISSION
        DATA_POINT
        USER
        REPORT
    }

    class WidgetType {
        <<enumeration>>
        CHART
        TABLE
        KPI_CARD
        MAP
        TIMELINE
        LIST
    }

    class ReportType {
        <<enumeration>>
        SUMMARY
        DETAILED
        COMPLIANCE
        TREND
        CUSTOM
    }

    class Period {
        <<enumeration>>
        DAILY
        WEEKLY
        MONTHLY
        QUARTERLY
        YEARLY
    }
```

## Classes de service

```mermaid
classDiagram
    class AuthenticationService {
        -UserRepository userRepository
        -TokenService tokenService
        -CacheService cacheService
        +authenticateWithAD(credentials)
        +authenticateWithJWT(credentials)
        +refreshToken(token)
        +logout(userId)
        +validateToken(token)
        +generateOTP(userId)
        +verifyOTP(userId, code)
    }

    class ChecklistService {
        -ChecklistRepository repository
        -ValidationService validator
        -NotificationService notifier
        +create(checklist)
        +update(id, checklist)
        +delete(id)
        +publish(id)
        +duplicate(id)
        +assign(checklistId, userId)
        +getAssignments(userId)
    }

    class SubmissionService {
        -SubmissionRepository repository
        -DataPointService dataService
        -ApprovalService approvalService
        +submit(submission)
        +saveDraft(submission)
        +validate(submission)
        +getSubmissions(filters)
        +approve(id)
        +reject(id, reason)
    }

    class ApprovalService {
        -WorkflowRepository workflowRepo
        -ApprovalRepository approvalRepo
        -NotificationService notifier
        +initiateWorkflow(submissionId)
        +approve(requestId, comments)
        +reject(requestId, reason)
        +escalate(requestId)
        +delegate(requestId, userId)
        +getNextApprover(workflowId, stage)
    }

    class NotificationService {
        -NotificationRepository repository
        -EmailService emailService
        -SMSService smsService
        -WebSocketService wsService
        +send(notification)
        +sendBulk(notifications)
        +markAsRead(notificationId)
        +getUnread(userId)
    }

    class DashboardService {
        -DashboardRepository repository
        -WidgetService widgetService
        -KPIService kpiService
        +create(dashboard)
        +update(id, dashboard)
        +share(id, users)
        +addWidget(dashboardId, widget)
        +removeWidget(dashboardId, widgetId)
        +export(id, format)
    }

    class KPIService {
        -KPIRepository repository
        -DataAggregator aggregator
        -Calculator calculator
        +calculate(kpiId)
        +calculateAll()
        +getHistory(kpiId, period)
        +getTrend(kpiId)
        +compareWithTarget(kpiId)
    }

    class ReportService {
        -ReportRepository repository
        -TemplateEngine templateEngine
        -ExportService exportService
        +generate(reportConfig)
        +schedule(reportId, cron)
        +export(reportId, format)
        +email(reportId, recipients)
        +getTemplates()
    }

    class FileStorageService {
        -StorageProvider provider
        -VirusScanService scanner
        -ImageProcessor processor
        +upload(file)
        +download(fileId)
        +delete(fileId)
        +generatePresignedUrl(fileId)
        +processImage(image)
    }

    class AuditService {
        -AuditRepository repository
        -EventEmitter emitter
        +log(event)
        +query(filters)
        +export(filters, format)
        +subscribe(eventType, handler)
    }

    %% Relations de dépendance
    AuthenticationService ..> User : uses
    ChecklistService ..> Checklist : manages
    ChecklistService ..> NotificationService : notifies
    SubmissionService ..> ChecklistSubmission : processes
    SubmissionService ..> ApprovalService : triggers
    ApprovalService ..> NotificationService : notifies
    DashboardService ..> KPIService : uses
    ReportService ..> FileStorageService : stores
    AuditService ..> AuditLog : creates
```

## Patterns de conception utilisés

### 1. Repository Pattern
```typescript
interface Repository<T> {
    findById(id: UUID): Promise<T>
    findAll(filters?: any): Promise<T[]>
    create(entity: T): Promise<T>
    update(id: UUID, entity: T): Promise<T>
    delete(id: UUID): Promise<void>
}
```

### 2. Factory Pattern
```typescript
class ChecklistFactory {
    static createFromTemplate(template: ChecklistTemplate): Checklist
    static createBlank(): Checklist
    static createFromImport(data: any): Checklist
}
```

### 3. Strategy Pattern
```typescript
interface AuthenticationStrategy {
    authenticate(credentials: any): Promise<User>
    verify(token: string): Promise<boolean>
}

class ADAuthStrategy implements AuthenticationStrategy { }
class JWTAuthStrategy implements AuthenticationStrategy { }
```

### 4. Observer Pattern
```typescript
class EventEmitter {
    private listeners: Map<string, Function[]>
    
    on(event: string, handler: Function): void
    emit(event: string, data: any): void
    off(event: string, handler: Function): void
}
```

### 5. Decorator Pattern
```typescript
@Injectable()
@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
class ChecklistController {
    @Post()
    @Roles('admin', 'manager')
    create(@Body() checklist: CreateChecklistDto) { }
}
```

### 6. Chain of Responsibility Pattern
```typescript
abstract class ApprovalHandler {
    protected next: ApprovalHandler
    
    setNext(handler: ApprovalHandler): ApprovalHandler
    handle(request: ApprovalRequest): void
}

class ManagerApproval extends ApprovalHandler { }
class DirectorApproval extends ApprovalHandler { }
class CEOApproval extends ApprovalHandler { }
```

## Classes DTO (Data Transfer Objects)

```mermaid
classDiagram
    class CreateChecklistDto {
        +String title
        +String description
        +ChecklistType type
        +Array~ChecklistItemDto~ items
        +validate()
    }

    class SubmitChecklistDto {
        +UUID assignmentId
        +Map~String,Any~ data
        +Array~AttachmentDto~ attachments
        +GeoLocation location
        +String signature
        +validate()
    }

    class LoginDto {
        +String identifier
        +String password
        +String deviceId
        +String platform
        +validate()
    }

    class UserResponseDto {
        +UUID id
        +String email
        +String name
        +Array~String~ roles
        +Array~String~ permissions
        +toJSON()
    }

    class PaginationDto {
        +Integer page
        +Integer limit
        +String sortBy
        +String sortOrder
        +getOffset()
    }

    class FilterDto {
        +DateTime startDate
        +DateTime endDate
        +Array~String~ statuses
        +Array~UUID~ departments
        +toQuery()
    }
```

## Relations avec la base de données

Les classes métier sont mappées vers des tables PostgreSQL via TypeORM :

- Utilisation de décorateurs pour le mapping (`@Entity`, `@Column`, `@ManyToOne`, etc.)
- Gestion automatique des migrations
- Support des transactions
- Lazy loading et eager loading selon les besoins
- Indexation pour les performances

## Considérations de performance

1. **Lazy Loading** : Chargement différé des relations pour éviter le N+1 problem
2. **Caching** : Utilisation de Redis pour les données fréquemment accédées
3. **Pagination** : Toutes les listes sont paginées
4. **Indexation** : Index sur les clés étrangères et les champs de recherche
5. **Query Optimization** : Utilisation de query builders pour des requêtes optimisées