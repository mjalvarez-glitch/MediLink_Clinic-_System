import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class PrescriptionsService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  async findAll(page: number = 1, limit: number = 10, patientId?: number) {
    try {
      let query = 'SELECT * FROM prescriptions WHERE 1=1';
      const params: any[] = [];

      if (patientId) {
        query += ' AND patient_id = ?';
        params.push(patientId);
      }

      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await this.pool.query(query, params);

      let countQuery = 'SELECT COUNT(*) as total FROM prescriptions WHERE 1=1';
      const countParams: any[] = [];
      if (patientId) {
        countQuery += ' AND patient_id = ?';
        countParams.push(patientId);
      }

      const [countResult] = await this.pool.query(countQuery, countParams);
      const total = countResult[0].total;

      return {
        data: rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async create(createPrescriptionDto: any) {
    try {
      const {
        patient_id,
        visit_id,
        medication,
        dosage,
        frequency,
        duration_days,
      } = createPrescriptionDto;

      const [result] = await this.pool.query(
        'INSERT INTO prescriptions (patient_id, visit_id, medication, dosage, frequency, duration_days) VALUES (?, ?, ?, ?, ?, ?)',
        [patient_id, visit_id, medication, dosage, frequency, duration_days],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async update(id: number, updateDto: any) {
    try {
      const { medication, dosage, frequency, duration_days } = updateDto;
      const [result] = await this.pool.query(
        'UPDATE prescriptions SET medication = ?, dosage = ?, frequency = ?, duration_days = ? WHERE prescription_id = ?',
        [medication, dosage, frequency, duration_days, id],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

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