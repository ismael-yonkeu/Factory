import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [AuthModule, UsersModule, ChecklistsModule, AssignmentsModule, SubmissionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
