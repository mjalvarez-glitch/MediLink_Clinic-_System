import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class MedicalHistoryService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;

      const [rows] = await this.pool.query(
        `
        SELECT 
          mh.history_id,
          mh.patient_id,
          mh.conditions,
          mh.allergies,
          mh.past_surgeries,
          mh.family_history,
          mh.updated_at,
          p.first_name,
          p.last_name
        FROM medical_history mh
        JOIN patients p ON mh.patient_id = p.patient_id
        LIMIT ? OFFSET ?
        `,
        [limit, offset],
      );

      const [countResult] = await this.pool.query(
        'SELECT COUNT(*) as total FROM medical_history'
      );

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

  async update(historyId: number, dto: any) { // ✅ was 'patientId'
    try {
      const { conditions, allergies, past_surgeries, family_history } = dto;
      const [result] = await this.pool.query(
        'UPDATE medical_history SET conditions = ?, allergies = ?, past_surgeries = ?, family_history = ? WHERE history_id = ?', // ✅ was 'WHERE patient_id = ?'
        [conditions, allergies, past_surgeries, family_history, historyId],
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