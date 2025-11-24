# Structure de l'API NestJS

Ce document détaille l'architecture complète de l'API backend développée avec NestJS.

## Vue d'ensemble de la structure

```
backend/
├── src/
│   ├── main.ts                          # Point d'entrée de l'application
│   ├── app.module.ts                    # Module racine
│   │
│   ├── common/                          # Éléments partagés
│   │   ├── decorators/                  # Décorateurs personnalisés
│   │   │   ├── roles.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   │
│   │   ├── guards/                      # Guards d'authentification et autorisation
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── ldap-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── permissions.guard.ts
│   │   │
│   │   ├── interceptors/                # Intercepteurs
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── timeout.interceptor.ts
│   │   │
│   │   ├── filters/                     # Filtres d'exceptions
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   │
│   │   ├── pipes/                       # Pipes de validation
│   │   │   ├── validation.pipe.ts
│   │   │   └── parse-uuid.pipe.ts
│   │   │
│   │   ├── middleware/                  # Middlewares
│   │   │   └── logger.middleware.ts
│   │   │
│   │   └── dto/                         # DTOs partagés
│   │       ├── pagination.dto.ts
│   │       └── response.dto.ts
│   │
│   ├── config/                          # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── ldap.config.ts
│   │   ├── redis.config.ts
│   │   ├── email.config.ts
│   │   └── app.config.ts
│   │
│   ├── database/                        # Base de données
│   │   ├── migrations/                  # Migrations
│   │   ├── seeds/                       # Seeds
│   │   └── entities/                    # Entités (si TypeORM)
│   │
│   ├── modules/                         # Modules métier
│   │   │
│   │   ├── auth/                        # Module d'authentification
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── ldap.strategy.ts
│   │   │   │   └── refresh-token.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── ad-login.dto.ts
│   │   │   │   └── refresh-token.dto.ts
│   │   │   └── interfaces/
│   │   │       └── jwt-payload.interface.ts
│   │   │
│   │   ├── users/                       # Module utilisateurs
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   └── repositories/
│   │   │       └── user.repository.ts
│   │   │
│   │   ├── roles/                       # Module rôles
│   │   │   ├── roles.module.ts
│   │   │   ├── roles.controller.ts
│   │   │   ├── roles.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── role.entity.ts
│   │   │   │   └── permission.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-role.dto.ts
│   │   │       └── assign-permissions.dto.ts
│   │   │
│   │   ├── departments/                 # Module départements
│   │   │   ├── departments.module.ts
│   │   │   ├── departments.controller.ts
│   │   │   ├── departments.service.ts
│   │   │   ├── entities/
│   │   │   │   └── department.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-department.dto.ts
│   │   │       └── update-department.dto.ts
│   │   │
│   │   ├── checklists/                  # Module checklists
│   │   │   ├── checklists.module.ts
│   │   │   ├── checklists.controller.ts
│   │   │   ├── checklists.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── checklist-template.entity.ts
│   │   │   │   ├── checklist-section.entity.ts
│   │   │   │   └── field-definition.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-checklist-template.dto.ts
│   │   │   │   ├── update-checklist-template.dto.ts
│   │   │   │   ├── create-section.dto.ts
│   │   │   │   └── create-field.dto.ts
│   │   │   └── services/
│   │   │       ├── checklist-builder.service.ts
│   │   │       └── checklist-validator.service.ts
│   │   │
│   │   ├── assignments/                 # Module attributions
│   │   │   ├── assignments.module.ts
│   │   │   ├── assignments.controller.ts
│   │   │   ├── assignments.service.ts
│   │   │   ├── entities/
│   │   │   │   └── assignment.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-assignment.dto.ts
│   │   │   │   └── update-assignment-status.dto.ts
│   │   │   └── services/
│   │   │       └── assignment-scheduler.service.ts
│   │   │
│   │   ├── data-collection/             # Module collecte de données
│   │   │   ├── data-collection.module.ts
│   │   │   ├── data-collection.controller.ts
│   │   │   ├── data-collection.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── data-collection.entity.ts
│   │   │   │   ├── collection-data.entity.ts
│   │   │   │   └── attachment.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-data-collection.dto.ts
│   │   │   │   ├── submit-data-collection.dto.ts
│   │   │   │   └── update-field-value.dto.ts
│   │   │   └── services/
│   │   │       ├── data-validation.service.ts
│   │   │       └── attachment.service.ts
│   │   │
│   │   ├── approvals/                   # Module approbations
│   │   │   ├── approvals.module.ts
│   │   │   ├── approvals.controller.ts
│   │   │   ├── approvals.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── approval-workflow.entity.ts
│   │   │   │   ├── approval-request.entity.ts
│   │   │   │   └── approval-step.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-approval-request.dto.ts
│   │   │   │   ├── approve.dto.ts
│   │   │   │   └── reject.dto.ts
│   │   │   └── services/
│   │   │       └── approval-workflow.service.ts
│   │   │
│   │   ├── kpi/                         # Module KPI
│   │   │   ├── kpi.module.ts
│   │   │   ├── kpi.controller.ts
│   │   │   ├── kpi.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── kpi-definition.entity.ts
│   │   │   │   └── kpi-value.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-kpi-definition.dto.ts
│   │   │   │   └── kpi-query.dto.ts
│   │   │   └── services/
│   │   │       ├── kpi-calculator.service.ts
│   │   │       └── kpi-scheduler.service.ts
│   │   │
│   │   ├── dashboards/                  # Module dashboards
│   │   │   ├── dashboards.module.ts
│   │   │   ├── dashboards.controller.ts
│   │   │   ├── dashboards.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── dashboard.entity.ts
│   │   │   │   └── dashboard-widget.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-dashboard.dto.ts
│   │   │       └── create-widget.dto.ts
│   │   │
│   │   ├── sync/                        # Module synchronisation
│   │   │   ├── sync.module.ts
│   │   │   ├── sync.controller.ts
│   │   │   ├── sync.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── sync-queue.entity.ts
│   │   │   │   └── sync-conflict.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── sync-request.dto.ts
│   │   │   │   └── resolve-conflict.dto.ts
│   │   │   └── services/
│   │   │       ├── sync-processor.service.ts
│   │   │       └── conflict-resolver.service.ts
│   │   │
│   │   ├── notifications/               # Module notifications
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── entities/
│   │   │   │   └── notification.entity.ts
│   │   │   ├── dto/
│   │   │   │   └── create-notification.dto.ts
│   │   │   └── services/
│   │   │       ├── email.service.ts
│   │   │       ├── sms.service.ts
│   │   │       └── push.service.ts
│   │   │
│   │   ├── reports/                     # Module rapports
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   ├── dto/
│   │   │   │   └── generate-report.dto.ts
│   │   │   └── services/
│   │   │       ├── pdf-generator.service.ts
│   │   │       └── excel-generator.service.ts
│   │   │
│   │   ├── audit/                       # Module audit
│   │   │   ├── audit.module.ts
│   │   │   ├── audit.controller.ts
│   │   │   ├── audit.service.ts
│   │   │   └── entities/
│   │   │       └── audit-log.entity.ts
│   │   │
│   │   └── files/                       # Module fichiers
│   │       ├── files.module.ts
│   │       ├── files.controller.ts
│   │       ├── files.service.ts
│   │       └── services/
│   │           ├── local-storage.service.ts
│   │           └── s3-storage.service.ts
│   │
│   └── shared/                          # Services partagés
│       ├── cache/
│       │   ├── cache.module.ts
│       │   └── cache.service.ts
│       │
│       ├── queue/
│       │   ├── queue.module.ts
│       │   ├── queue.service.ts
│       │   └── processors/
│       │       ├── email.processor.ts
│       │       ├── kpi-calculation.processor.ts
│       │       └── sync.processor.ts
│       │
│       ├── database/
│       │   ├── database.module.ts
│       │   └── database.service.ts
│       │
│       └── utils/
│           ├── date.util.ts
│           ├── encryption.util.ts
│           └── validation.util.ts
│
├── test/                                # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── prisma/                              # Prisma (si utilisé)
│   ├── schema.prisma
│   └── migrations/
│
├── .env.example                         # Variables d'environnement
├── .eslintrc.js                         # Configuration ESLint
├── .prettierrc                          # Configuration Prettier
├── nest-cli.json                        # Configuration NestJS CLI
├── package.json
├── tsconfig.json
└── README.md
```

## Détail des Modules Principaux

### 1. Module Auth

```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LdapStrategy } from './strategies/ldap.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LdapStrategy, RefreshTokenStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
```

```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AdLoginDto, RefreshTokenDto } from './dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('ad/login')
  @HttpCode(HttpStatus.OK)
  async adLogin(@Body() adLoginDto: AdLoginDto) {
    return this.authService.adLogin(adLoginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }
}
```

```typescript
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, AdLoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password_hash: hashedPassword,
      auth_type: 'jwt'
    });

    // Envoi email de vérification
    // await this.sendVerificationEmail(user.email);

    return {
      message: 'User registered successfully. Please verify your email.'
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByIdentifier(loginDto.identifier);
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active || !user.is_verified) {
      throw new UnauthorizedException('Account not active or not verified');
    }

    return this.generateTokens(user);
  }

  async adLogin(adLoginDto: AdLoginDto) {
    // Logique d'authentification AD
    // ...
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // Logique de refresh token
    // ...
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    // Révocation du refresh token
    // ...
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );

    // Sauvegarder le refresh token
    // ...

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles: user.roles
      }
    };
  }
}
```

### 2. Module Checklists

```typescript
// src/modules/checklists/checklists.module.ts
import { Module } from '@nestjs/common';
import { ChecklistsController } from './checklists.controller';
import { ChecklistsService } from './checklists.service';
import { ChecklistBuilderService } from './services/checklist-builder.service';
import { ChecklistValidatorService } from './services/checklist-validator.service';

@Module({
  controllers: [ChecklistsController],
  providers: [
    ChecklistsService,
    ChecklistBuilderService,
    ChecklistValidatorService
  ],
  exports: [ChecklistsService]
})
export class ChecklistsModule {}
```

```typescript
// src/modules/checklists/checklists.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChecklistsService } from './checklists.service';
import { CreateChecklistTemplateDto, UpdateChecklistTemplateDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('checklists')
@UseGuards(JwtAuthGuard)
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Post()
  @Permissions('checklist:create')
  async create(@Body() createDto: CreateChecklistTemplateDto) {
    return this.checklistsService.create(createDto);
  }

  @Get()
  @Permissions('checklist:read')
  async findAll(@Query() query: any) {
    return this.checklistsService.findAll(query);
  }

  @Get(':id')
  @Permissions('checklist:read')
  async findOne(@Param('id') id: string) {
    return this.checklistsService.findOne(id);
  }

  @Put(':id')
  @Permissions('checklist:update')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateChecklistTemplateDto
  ) {
    return this.checklistsService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissions('checklist:delete')
  async remove(@Param('id') id: string) {
    return this.checklistsService.remove(id);
  }

  @Post(':id/publish')
  @Permissions('checklist:publish')
  async publish(@Param('id') id: string) {
    return this.checklistsService.publish(id);
  }

  @Post(':id/archive')
  @Permissions('checklist:archive')
  async archive(@Param('id') id: string) {
    return this.checklistsService.archive(id);
  }
}
```

### 3. Module Data Collection

```typescript
// src/modules/data-collection/data-collection.controller.ts
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DataCollectionService } from './data-collection.service';
import { CreateDataCollectionDto, SubmitDataCollectionDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('data-collection')
@UseGuards(JwtAuthGuard)
export class DataCollectionController {
  constructor(private readonly dataCollectionService: DataCollectionService) {}

  @Post()
  async create(
    @Body() createDto: CreateDataCollectionDto,
    @CurrentUser() user: any
  ) {
    return this.dataCollectionService.create(createDto, user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
    @CurrentUser() user: any
  ) {
    return this.dataCollectionService.update(id, updateDto, user.userId);
  }

  @Post(':id/submit')
  async submit(
    @Param('id') id: string,
    @Body() submitDto: SubmitDataCollectionDto,
    @CurrentUser() user: any
  ) {
    return this.dataCollectionService.submit(id, submitDto, user.userId);
  }

  @Get('my-collections')
  async getMyCollections(@CurrentUser() user: any, @Query() query: any) {
    return this.dataCollectionService.findByUser(user.userId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dataCollectionService.findOne(id);
  }
}
```

### 4. Module KPI

```typescript
// src/modules/kpi/kpi.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { KpiCalculatorService } from './services/kpi-calculator.service';

@Injectable()
export class KpiService {
  constructor(
    private readonly kpiCalculatorService: KpiCalculatorService
  ) {}

  async getKpiValue(kpiId: string, startDate: Date, endDate: Date) {
    return this.kpiCalculatorService.calculateKpi(kpiId, startDate, endDate);
  }

  async getKpiTrend(kpiId: string, period: string) {
    // Calcul de la tendance
  }

  @Cron(CronExpression.EVERY_HOUR)
  async calculateHourlyKpis() {
    // Calcul automatique des KPIs horaires
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async calculateDailyKpis() {
    // Calcul automatique des KPIs quotidiens
  }
}
```

### 5. Module Sync

```typescript
// src/modules/sync/sync.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncRequestDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  async pushChanges(
    @Body() syncRequest: SyncRequestDto,
    @CurrentUser() user: any
  ) {
    return this.syncService.processSync(syncRequest, user.userId);
  }

  @Post('pull')
  async pullChanges(@CurrentUser() user: any, @Body() body: any) {
    return this.syncService.getChangesSince(user.userId, body.lastSyncAt);
  }

  @Post('conflicts/:id/resolve')
  async resolveConflict(
    @Param('id') conflictId: string,
    @Body() resolution: any
  ) {
    return this.syncService.resolveConflict(conflictId, resolution);
  }
}
```

## Configuration Globale

### main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
  });

  // Compression
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Factory API')
    .setDescription('API de gestion de données d\'usine')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
```

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// Configuration
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ChecklistsModule } from './modules/checklists/checklists.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { DataCollectionModule } from './modules/data-collection/data-collection.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';
import { SyncModule } from './modules/sync/sync.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // Database
    TypeOrmModule.forRoot(databaseConfig),

    // Cache
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ...redisConfig
    }),

    // Queue
    BullModule.forRoot({
      redis: redisConfig
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Business modules
    AuthModule,
    UsersModule,
    RolesModule,
    DepartmentsModule,
    ChecklistsModule,
    AssignmentsModule,
    DataCollectionModule,
    ApprovalsModule,
    KpiModule,
    DashboardsModule,
    SyncModule,
    NotificationsModule,
    ReportsModule,
    AuditModule,
    FilesModule
  ]
})
export class AppModule {}
```

## Guards et Décorateurs

### JWT Auth Guard

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### Permissions Guard

```typescript
// src/common/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredPermissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  }
}
```

### Permissions Decorator

```typescript
// src/common/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### Current User Decorator

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

## DTOs et Validation

### Exemple de DTO avec validation

```typescript
// src/modules/checklists/dto/create-checklist-template.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ON_DEMAND = 'on_demand'
}

export class CreateChecklistTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(FrequencyType)
  frequency: FrequencyType;

  @IsOptional()
  frequency_config?: any;

  @IsOptional()
  estimated_duration?: number;

  @IsString()
  @IsOptional()
  department_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections: CreateSectionDto[];
}

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  field_type: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  placeholder?: string;

  @IsOptional()
  is_required?: boolean;

  @IsOptional()
  validation_rules?: any;

  @IsOptional()
  options?: any;
}
```

## Tests

### Test Unitaire

```typescript
// src/modules/checklists/checklists.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistsService } from './checklists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChecklistTemplate } from './entities/checklist-template.entity';

describe('ChecklistsService', () => {
  let service: ChecklistsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecklistsService,
        {
          provide: getRepositoryToken(ChecklistTemplate),
          useValue: mockRepository
        }
      ]
    }).compile();

    service = module.get<ChecklistsService>(ChecklistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a checklist template', async () => {
    const createDto = {
      title: 'Test Checklist',
      frequency: 'daily',
      sections: []
    };

    mockRepository.create.mockReturnValue(createDto);
    mockRepository.save.mockResolvedValue({ id: '1', ...createDto });

    const result = await service.create(createDto);
    expect(result).toBeDefined();
    expect(result.title).toBe(createDto.title);
  });
});
```

### Test E2E

```typescript
// test/e2e/checklists.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Checklists (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get access token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@example.com',
        password: 'password'
      });

    accessToken = loginResponse.body.accessToken;
  });

  it('/api/v1/checklists (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/checklists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Checklist',
        frequency: 'daily',
        sections: []
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Test Checklist');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Scripts package.json

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "seed": "ts-node -r tsconfig-paths/register src/database/seeds/run-seeds.ts"
  }
}
```

## Bonnes Pratiques

### 1. Organisation du Code
- Un module par domaine métier
- Services réutilisables dans `shared/`
- DTOs séparés pour chaque opération
- Entities au plus près des modules

### 2. Validation
- Validation systématique avec class-validator
- DTOs pour toutes les entrées
- Transformation automatique des types

### 3. Sécurité
- Guards pour l'authentification et l'autorisation
- Validation des permissions à tous les niveaux
- Sanitisation des inputs
- Rate limiting sur les routes sensibles

### 4. Performance
- Cache Redis pour les données fréquemment consultées
- Queues pour les traitements longs
- Pagination systématique
- Indexes sur les colonnes fréquemment requêtées

### 5. Tests
- Tests unitaires pour la logique métier
- Tests d'intégration pour les services
- Tests E2E pour les endpoints critiques
- Coverage > 80%

### 6. Documentation
- Swagger/OpenAPI pour l'API
- JSDoc pour les fonctions complexes
- README par module
- Changelog maintenu à jour
