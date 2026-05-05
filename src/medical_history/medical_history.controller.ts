import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus 
} from '@nestjs/common';
import { MedicalHistoryService } from './medical_history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('medical_history')
export class MedicalHistoryController {
  constructor(private readonly historyService: MedicalHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.historyService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':patientId')
  async getByPatient(@Param('patientId') patientId: string) {
    const history = await this.historyService.findByPatientId(+patientId);
    if (!history) throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    return history;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: any) {
    try {
      const result = await this.historyService.create(dto);
      return { message: 'Medical history created successfully', id: result.insertId };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')                                              // ✅ was ':patientId'
  async update(@Param('id') id: string, @Body() dto: any) { // ✅ was 'patientId'
    const result = await this.historyService.update(+id, dto);
    if (result.affectedRows === 0) throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    return { message: 'Medical history updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.historyService.delete(+id);
    if (result.affectedRows === 0) throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
    return { message: 'Medical history deleted successfully' };
  }
}