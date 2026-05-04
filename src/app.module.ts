import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { PatientsModule } from './patients/patients.module';
import { VisitsModule } from './visits/visits.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicalHistoryModule } from './medical_history/medical_history.module';
import { EmergencyContactInfoModule } from './emergency_contact_info/emergency_contact_info.module';

@Module({
    imports: [UsersModule, AuthModule, DatabaseModule, PatientsModule, VisitsModule, PrescriptionsModule, MedicalHistoryModule, EmergencyContactInfoModule],
})
export class AppModule {}