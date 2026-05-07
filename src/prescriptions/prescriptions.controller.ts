import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Delete, 
  Param, 
  Query, 
  Body, 
  UseGuards, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("prescriptions")
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("patientId") patientId?: string,
  ) {
    try {
      return await this.prescriptionsService.findAll(
        parseInt(page),
        parseInt(limit),
        patientId ? parseInt(patientId) : undefined,
      );
    } catch (error: any) {
      throw new HttpException(
        "Failed to fetch prescriptions",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDto: any) {
    try {
      if (!createDto.patient_id) {
        throw new HttpException(
          "Patient ID is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createDto.visit_id) {
        throw new HttpException("Visit ID is required", HttpStatus.BAD_REQUEST);
      }
      if (!createDto.medication?.trim()) {
        throw new HttpException(
          "Medication is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createDto.dosage?.trim()) {
        throw new HttpException("Dosage is required", HttpStatus.BAD_REQUEST);
      }
      if (!createDto.frequency?.trim()) {
        throw new HttpException(
          "Frequency is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createDto.duration_days) {
        throw new HttpException(
          "Duration days is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.prescriptionsService.create(createDto);
      return {
        message: "Prescription created successfully",
        prescription_id: result.insertId,
      };
    } catch (error: any) {
      if (error.code === "ER_DATA_TOO_LONG") {
        throw new HttpException(
          "Data too long for one of the fields",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
        throw new HttpException(
          "Required prescription fields cannot be null/empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        error.message || "Failed to create prescription",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param("id") id: number, @Body() updateDto: any) {
    try {
      if (updateDto.patient_id !== undefined && !updateDto.patient_id) {
        throw new HttpException(
          "Patient ID cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateDto.visit_id !== undefined && !updateDto.visit_id) {
        throw new HttpException(
          "Visit ID cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateDto.medication !== undefined && !updateDto.medication?.trim()) {
        throw new HttpException(
          "Medication cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateDto.dosage !== undefined && !updateDto.dosage?.trim()) {
        throw new HttpException(
          "Dosage cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateDto.frequency !== undefined && !updateDto.frequency?.trim()) {
        throw new HttpException(
          "Frequency cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateDto.duration_days !== undefined && !updateDto.duration_days) {
        throw new HttpException(
          "Duration days cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.prescriptionsService.update(id, updateDto);
      if (result.affectedRows === 0) {
        throw new HttpException("Prescription not found", HttpStatus.NOT_FOUND);
      }
      return { message: "Prescription updated successfully" };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Update failed",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: number) {
    try {
      const result = await this.prescriptionsService.delete(id);
      if (result.affectedRows === 0) {
        throw new HttpException("Prescription not found", HttpStatus.NOT_FOUND);
      }
      return { message: "Prescription deleted successfully" };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Delete failed",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}