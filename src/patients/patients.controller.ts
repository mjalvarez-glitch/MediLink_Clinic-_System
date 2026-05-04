import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  UseGuards,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPatients(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'patient_id',
    @Query('sortOrder') sortOrder: string = 'ASC',
    @Query('search') search?: string,
  ) {
    try {
      return await this.patientsService.findAll(
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder,
        search,
      );
    } catch (error: any) {
      throw new HttpException(
        'Failed to fetch patients',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPatientById(@Param('id') id: number) {
    try {
      const patient = await this.patientsService.findById(id);
      if (!patient) {
        throw new HttpException(
          'Patient not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return patient;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPatient(@Body() createPatientDto: any) {
    try {
      const result = await this.patientsService.create(createPatientDto);
      return {
        message: 'Patient created successfully',
        patient_id: result.insertId,
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updatePatient(
    @Param('id') id: number,
    @Body() updatePatientDto: any,
  ) {
    try {
      const result = await this.patientsService.update(id, updatePatientDto);
      if (result.affectedRows === 0) {
        throw new HttpException(
          'Patient not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Patient updated successfully',
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to update patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePatient(@Param('id') id: number) {
    try {
      const result = await this.patientsService.delete(id);
      if (result.affectedRows === 0) {
        throw new HttpException(
          'Patient not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        message: 'Patient deleted successfully',
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to delete patient',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/visits')
  async getPatientVisits(@Param('id') id: number) {
    try {
      return await this.patientsService.getVisits(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch patient visits',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/medical-history')
  async getPatientMedicalHistory(@Param('id') id: number) {
    try {
      return await this.patientsService.getMedicalHistory(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch medical history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/emergency-contacts')
  async getPatientEmergencyContacts(@Param('id') id: number) {
    try {
      return await this.patientsService.getEmergencyContacts(id);
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch emergency contacts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}