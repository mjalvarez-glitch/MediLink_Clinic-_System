import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class EmergencyContactsService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  async findByPatientId(patient_id: number) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM emergency_contact_info WHERE patient_id = ?',
        [patient_id],
      );
      return rows;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async create(dto: any) {
    try {
      const { patient_id, person_name, relationship, phone_no, alt_phone_no } = dto;
      const [result] = await this.pool.query(
        'INSERT INTO emergency_contact_info (patient_id, person_name, relationship, phone_no) VALUES (?, ?, ?, ?)',
        [patient_id, person_name, relationship, phone_no],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async update(id: number, dto: any) {
    try {
      const { person_name, relationship, phone_no } = dto;
      const [result] = await this.pool.query(
        'UPDATE emergency_contact_info SET person_name = ?, relationship = ?, phone_no = ?, WHERE contact_id = ?',
        [person_name, relationship, phone_no, id],
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
        'DELETE FROM emergency_contact_info WHERE contact_id = ?',
        [id],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const [rows] = await this.pool.query(
        'SELECT * FROM emergency_contact_info LIMIT ? OFFSET ?',
        [limit, offset],
      );
      const [countResult] = await this.pool.query('SELECT COUNT(*) as total FROM emergency_contact_info');
      
      return {
        data: rows,
        total: countResult[0].total,
      };
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }
}