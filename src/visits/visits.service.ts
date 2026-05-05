import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class VisitsService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  // Match the pattern of patients.service.ts[cite: 1]
  async create(createVisitDto: any) {
    try {
      const {
        patient_id,
        visit_date,
        reason,
        diagnosis,
        blood_pressure,
        temperature,
        weight_kg,
        height_cm,
        attended_by,
      } = createVisitDto;

      const [result] = await this.pool.query(
        'INSERT INTO visits (patient_id, visit_date, reason, diagnosis, blood_pressure, temperature, weight_kg, height_cm, attended_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [patient_id, visit_date, reason, diagnosis, blood_pressure, temperature, weight_kg, height_cm, attended_by],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async update(visitId: number, updateVisitDto: any) {
    try {
      const {
        visit_date,
        reason,
        diagnosis,
        blood_pressure,
        temperature,
        weight_kg,
        height_cm,
        attended_by,
      } = updateVisitDto;

      const [result] = await this.pool.query(
        'UPDATE visits SET visit_date = ?, reason = ?, diagnosis = ?, blood_pressure = ?, temperature = ?, weight_kg = ?, height_cm = ?, attended_by = ? WHERE visit_id = ?',
        [visit_date, reason, diagnosis, blood_pressure, temperature, weight_kg, height_cm, attended_by, visitId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async delete(visitId: number) {
    try {
      const [result] = await this.pool.query(
        'DELETE FROM visits WHERE visit_id = ?',
        [visitId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, patientId?: number) {
  try {
    let query = `
      SELECT 
        v.visit_id,
        v.patient_id,
        v.visit_date,
        v.reason,
        v.diagnosis,
        v.blood_pressure,
        v.temperature,
        v.weight_kg,
        v.height_cm,
        v.attended_by,
        p.first_name,
        p.last_name
      FROM visits v
      JOIN patients p ON v.patient_id = p.patient_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (patientId) {
      query += ' AND v.patient_id = ?';
      params.push(patientId);
    }

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await this.pool.query(query, params);
    
    return {
      data: rows
    };
  } catch (error: any) {
    console.error('SQL Error:', error.message);
    throw error;
  }
  }
}