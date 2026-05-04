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

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientId') patientId?: string,
  ) {
    try {
      return await this.prescriptionsService.findAll(
        parseInt(page),
        parseInt(limit),
        patientId ? parseInt(patientId) : undefined,
      );
    } catch (error: any) {
      throw new HttpException('Failed to fetch prescriptions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createDto: any) {
    try {
      const result = await this.prescriptionsService.create(createDto);
      return {
        message: 'Prescription created successfully',
        prescription_id: result.insertId,
      };
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to create prescription', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: any) {
    try {
      const result = await this.prescriptionsService.update(id, updateDto);
      if (result.affectedRows === 0) {
        throw new HttpException('Prescription not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Prescription updated successfully' };
    } catch (error: any) {
      throw new HttpException(error.message || 'Update failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const result = await this.prescriptionsService.delete(id);
      if (result.affectedRows === 0) {
        throw new HttpException('Prescription not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Prescription deleted successfully' };
    } catch (error: any) {
      throw new HttpException(error.message || 'Delete failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}