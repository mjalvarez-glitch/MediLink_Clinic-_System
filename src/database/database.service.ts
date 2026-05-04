import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private pool: mysql.Pool; // Removed ! and made private

    constructor() {
        // Move the pool creation HERE so it is ready immediately
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'mysql-14666f91-urjus10-3f78.c.aivencloud.com',
            port: +(process.env.DB_PORT || 12086),
            user: process.env.DB_USER || 'avnadmin',
            password: process.env.DB_PASSWORD || 'AVNS__-73sObH2vP0DHwWpHs',
            database: process.env.DB_NAME || 'defaultdb',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        console.log('MySQL pool created in Constructor');
    }

    // Keep this for cleanup[cite: 10]
    async onModuleDestroy() {
        await this.pool.end();
    }

    getPool() {
        return this.pool;
    }
}