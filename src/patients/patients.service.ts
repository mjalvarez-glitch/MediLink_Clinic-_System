import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class PatientsService {
  constructor(@Inject('DATABASE_POOL') private pool: any) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'patient_id',
    sortOrder: string = 'ASC',
    search?: string,
  ) {
    try {
      let query = `SELECT *, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS calculated_age FROM patients WHERE 1=1`;
      const params: any[] = [];

      // Add search filter
      if (search) {
        query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_no LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Add sorting
      const validSortFields = [
        'patient_id',
        'first_name',
        'last_name',
        'birthdate',
        'email',
        'phone_no',
      ];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'patient_id';
      const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortField} ${order}`;

      // Add pagination
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await this.pool.query(query, params);

      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM patients WHERE 1=1';
      const countParams: any[] = [];
      if (search) {
        countQuery +=
          ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_no LIKE ?)';
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
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

  async findById(patientId: number) {
    try {
      const [rows] = await this.pool.query(
        `SELECT *, TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age 
        FROM patients WHERE patient_id = ?`,
        [patientId],
      );
      return rows[0] || null;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async create(createPatientDto: any) {
    try {
      const {
        first_name,
        last_name,
        birthdate,
        sex,
        address,
        phone_no,
        email,
      } = createPatientDto;

      const [result] = await this.pool.query(
        'INSERT INTO patients (first_name, last_name, birthdate, sex, address, phone_no, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, birthdate, sex, address, phone_no, email],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async update(patientId: number, updatePatientDto: any) {
    try {
      const {
        first_name,
        last_name,
        birthdate,
        sex,
        address,
        phone_no,
        email,
      } = updatePatientDto;

      const [result] = await this.pool.query(
        'UPDATE patients SET first_name = ?, last_name = ?, birthdate = ?, sex = ?, address = ?, phone_no = ?, email = ? WHERE patient_id = ?',
        [first_name, last_name, birthdate, sex, address, phone_no, email, patientId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async delete(patientId: number) {
    try {
      const [result] = await this.pool.query(
        'DELETE FROM patients WHERE patient_id = ?',
        [patientId],
      );
      return result;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async getVisits(patientId: number) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM visits WHERE patient_id = ? ORDER BY visit_date DESC',
        [patientId],
      );
      return rows;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }

  async getMedicalHistory(patientId: number) {
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

  async getEmergencyContacts(patientId: number) {
    try {
      const [rows] = await this.pool.query(
        'SELECT * FROM emergency_contact_info WHERE patient_id = ?',
        [patientId],
      );
      return rows;
    } catch (error: any) {
      console.error('SQL Error:', error.message);
      throw error;
    }
  }
}