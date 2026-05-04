import { Module } from '@nestjs/common';
import { EmergencyContactsController } from './emergency_contact_info.controller';
import { EmergencyContactsService } from './emergency_contact_info.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EmergencyContactsController],
  providers: [EmergencyContactsService],
})
export class EmergencyContactInfoModule {}