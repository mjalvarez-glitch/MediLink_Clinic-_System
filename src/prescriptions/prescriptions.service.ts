import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class PrescriptionsService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  // GET ALL PRESCRIPTIONS (with patient name + pagination)
  async findAll(page: number = 1, limit: number = 10, patientId?: number) {
    try {
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          pr.prescription_id,
          pr.patient_id,
          pr.visit_id,
          pr.medication,
          pr.dosage,
          pr.frequency,
          pr.duration_days,
          p.first_name,
          p.last_name
        FROM prescriptions pr
        JOIN patients p ON pr.patient_id = p.patient_id
      `;

      const params: any[] = [];

      if (patientId) {
        query += ` WHERE pr.patient_id = ?`;
        params.push(patientId);
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await this.pool.query(query, params);

      // COUNT QUERY
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM prescriptions pr
      `;

      const countParams: any[] = [];

      if (patientId) {
        countQuery += ` WHERE pr.patient_id = ?`;
        countParams.push(patientId);
      }

      const [countResult] = await this.pool.query(countQuery, countParams);

      return {
        data: rows,
        total: countResult[0].total,
        page,
        limit,
      };
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  // CREATE
  async create(dto: any) {
    try {
      const {
        patient_id,
        visit_id,
        medication,
        dosage,
        frequency,
        duration_days,
      } = dto;

      const [result] = await this.pool.query(
        `INSERT INTO prescriptions 
        (patient_id, visit_id, medication, dosage, frequency, duration_days)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [patient_id, visit_id, medication, dosage, frequency, duration_days],
      );

      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  // UPDATE
  async update(id: number, dto: any) {
    try {
      const { medication, dosage, frequency, duration_days } = dto;

      const [result] = await this.pool.query(
        `UPDATE prescriptions 
         SET medication = ?, dosage = ?, frequency = ?, duration_days = ?
         WHERE prescription_id = ?`,
        [medication, dosage, frequency, duration_days, id],
      );

      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  // DELETE
  async delete(id: number) {
    try {
      const [result] = await this.pool.query(
        'DELETE FROM prescriptions WHERE prescription_id = ?',
        [id],
      );

      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }
}