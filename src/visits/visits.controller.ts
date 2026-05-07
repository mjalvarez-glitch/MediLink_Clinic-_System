import { 
  Controller, 
  Post, 
    Get,
    Query,
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("visits")
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createVisit(@Body() createVisitDto: any) {
    try {
      if (!createVisitDto.patient_id) {
        throw new HttpException(
          "Patient ID is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createVisitDto.visit_date) {
        throw new HttpException(
          "Visit date is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createVisitDto.reason?.trim()) {
        throw new HttpException("Reason is required", HttpStatus.BAD_REQUEST);
      }
      if (!createVisitDto.diagnosis?.trim()) {
        throw new HttpException(
          "Diagnosis is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createVisitDto.blood_pressure?.trim()) {
        throw new HttpException(
          "Blood pressure is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createVisitDto.temperature) {
        throw new HttpException(
          "Temperature is required",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!createVisitDto.weight_kg) {
        throw new HttpException("Weight is required", HttpStatus.BAD_REQUEST);
      }
      if (!createVisitDto.height_cm) {
        throw new HttpException("Height is required", HttpStatus.BAD_REQUEST);
      }
      if (!createVisitDto.attended_by?.trim()) {
        throw new HttpException(
          "Attended by is required",
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = {
        ...createVisitDto,
        temperature: parseFloat(createVisitDto.temperature),
        weight_kg: parseFloat(createVisitDto.weight_kg),
        height_cm: parseFloat(createVisitDto.height_cm),
      };

      const result = await this.visitsService.create(createVisitDto);
      return {
        message: "Visit created successfully",
        visit_id: result.insertId,
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
          "Required visit fields cannot be null/empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        error.message || "Failed to create visit",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateVisit(@Param("id") id: number, @Body() updateVisitDto: any) {
    try {
      if (
        updateVisitDto.patient_id !== undefined &&
        !updateVisitDto.patient_id
      ) {
        throw new HttpException(
          "Patient ID cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.visit_date !== undefined &&
        !updateVisitDto.visit_date
      ) {
        throw new HttpException(
          "Visit date cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.reason !== undefined &&
        !updateVisitDto.reason?.trim()
      ) {
        throw new HttpException(
          "Reason cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.diagnosis !== undefined &&
        !updateVisitDto.diagnosis?.trim()
      ) {
        throw new HttpException(
          "Diagnosis cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.blood_pressure !== undefined &&
        !updateVisitDto.blood_pressure?.trim()
      ) {
        throw new HttpException(
          "Blood pressure cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.temperature !== undefined &&
        !updateVisitDto.temperature
      ) {
        throw new HttpException(
          "Temperature cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateVisitDto.weight_kg !== undefined && !updateVisitDto.weight_kg) {
        throw new HttpException(
          "Weight cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (updateVisitDto.height_cm !== undefined && !updateVisitDto.height_cm) {
        throw new HttpException(
          "Height cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        updateVisitDto.attended_by !== undefined &&
        !updateVisitDto.attended_by?.trim()
      ) {
        throw new HttpException(
          "Attended by cannot be empty",
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.visitsService.update(id, updateVisitDto);
      if (result.affectedRows === 0) {
        throw new HttpException("Visit not found", HttpStatus.NOT_FOUND);
      }
      return { message: "Visit updated successfully" };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Failed to update visit",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteVisit(@Param("id") id: number) {
    try {
      const result = await this.visitsService.delete(id);
      if (result.affectedRows === 0) {
        throw new HttpException("Visit not found", HttpStatus.NOT_FOUND);
      }
      return { message: "Visit deleted successfully" };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Failed to delete visit",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("patientId") patientId?: string,
  ) {
    return await this.visitsService.findAll(
      parseInt(page),
      parseInt(limit),
      patientId ? parseInt(patientId) : undefined,
    );
  }
}