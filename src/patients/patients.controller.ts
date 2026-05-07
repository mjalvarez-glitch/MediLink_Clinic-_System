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
      if (!createPatientDto.first_name?.trim()) {
        throw new HttpException(
          "First name is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createPatientDto.last_name?.trim()) {
        throw new HttpException(
          "Last name is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createPatientDto.birthdate) {
        throw new HttpException(
          "Birthdate is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createPatientDto.sex?.trim()) {
        throw new HttpException("Sex is required", HttpStatus.BAD_REQUEST);
      }
      if (!createPatientDto.address?.trim()) {
        throw new HttpException("Address is required", HttpStatus.BAD_REQUEST);
      }
      if (!createPatientDto.phone_no?.trim()) {
        throw new HttpException(
          "Phone number is required",
          HttpStatus.BAD_REQUEST,
        );
      }

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
      if (
        updatePatientDto.first_name !== undefined &&
        !updatePatientDto.first_name?.trim()
      ) {
        throw new HttpException(
          "First name cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updatePatientDto.last_name !== undefined &&
        !updatePatientDto.last_name?.trim()
      ) {
        throw new HttpException(
          "Last name cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updatePatientDto.birthdate !== undefined &&
        !updatePatientDto.birthdate
      ) {
        throw new HttpException(
          "Birthdate cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updatePatientDto.sex !== undefined && !updatePatientDto.sex?.trim()) {
        throw new HttpException("Sex cannot be empty", HttpStatus.BAD_REQUEST);
      }
      if (
        updatePatientDto.address !== undefined &&
        !updatePatientDto.address?.trim()
      ) {
        throw new HttpException(
          "Address cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updatePatientDto.phone_no !== undefined &&
        !updatePatientDto.phone_no?.trim()
      ) {
        throw new HttpException(
          "Phone number cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }

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