import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MedicalHistoryService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await this.pool.query(
        'SELECT * FROM medical_history LIMIT ? OFFSET ?',
        [limit, offset],
      );
      const [countResult] = await this.pool.query('SELECT COUNT(*) as total FROM medical_history');
      
      return {
        data: rows,
        total: countResult[0].total,
      };
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async findByPatientId(patientId: number) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM medical_history WHERE patient_id = ?',
        [patientId],
      );
      return rows[0] || null;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async create(dto: any) {
    try {
      const { patient_id, conditions, allergies, past_surgeries, family_history } = dto;
      const [result] = await this.pool.query(
        'INSERT INTO medical_history (patient_id, conditions, allergies, past_surgeries, family_history) VALUES (?, ?, ?, ?, ?)',
        [patient_id, conditions, allergies, past_surgeries, family_history],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async update(patientId: number, dto: any) {
    try {
      const { conditions, allergies, past_surgeries, family_history } = dto;
      const [result] = await this.pool.query(
        'UPDATE medical_history SET conditions = ?, allergies = ?, past_surgeries = ?, family_history = ? WHERE patient_id = ?',
        [conditions, allergies, past_surgeries, family_history, patientId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async delete(historyId: number) {
    try {
      const [result] = await this.pool.query(
        'DELETE FROM medical_history WHERE history_id = ?',
        [historyId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }
}