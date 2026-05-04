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

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createVisit(@Body() createVisitDto: any) {
    try {
        const data = {
        ...createVisitDto,
        temperature: createVisitDto.temperature ? parseFloat(createVisitDto.temperature) : null,
        weight_kg: createVisitDto.weight_kg ? parseFloat(createVisitDto.weight_kg) : null,
        height_cm: createVisitDto.height_cm ? parseFloat(createVisitDto.height_cm) : null,
        };
        
      const result = await this.visitsService.create(createVisitDto);
      return {
        message: 'Visit created successfully',
        visit_id: result.insertId,
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create visit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateVisit(@Param('id') id: number, @Body() updateVisitDto: any) {
    try {
      const result = await this.visitsService.update(id, updateVisitDto);
      if (result.affectedRows === 0) {
        throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Visit updated successfully' };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to update visit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteVisit(@Param('id') id: number) {
    try {
      const result = await this.visitsService.delete(id);
      if (result.affectedRows === 0) {
        throw new HttpException('Visit not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Visit deleted successfully' };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to delete visit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('patientId') patientId?: string,
  ) {
    return await this.visitsService.findAll(
      parseInt(page),
      parseInt(limit),
      patientId ? parseInt(patientId) : undefined,
    );
  }
}