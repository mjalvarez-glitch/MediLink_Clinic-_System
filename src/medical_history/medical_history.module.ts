import { Module } from '@nestjs/common';
import { MedicalHistoryController } from './medical_history.controller';
import { MedicalHistoryService } from './medical_history.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
})
export class MedicalHistoryModule {}