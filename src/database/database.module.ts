import { Module, Global } from "@nestjs/common";
import { DatabaseService } from "./database.service";

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_POOL',
      useFactory: (databaseService: DatabaseService) => databaseService.getPool(),
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, 'DATABASE_POOL'],
})
export class DatabaseModule {}