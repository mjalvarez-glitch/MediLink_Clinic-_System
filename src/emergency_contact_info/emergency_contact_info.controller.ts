import { Controller, Get, Post, Put, Delete, Query, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { EmergencyContactsService } from './emergency_contact_info.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('emergency_contact_info')
export class EmergencyContactsController {
  constructor(private readonly contactService: EmergencyContactsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('patients/:patientId')
  async getByPatient(@Param('patientId') patientId: string) {
    return this.contactService.findByPatientId(+patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: any) {
    try {
      const result = await this.contactService.create(dto);
      return { message: 'Emergency contact added', id: result.insertId };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const result = await this.contactService.update(+id, dto);
    if (result.affectedRows === 0) throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    return { message: 'Emergency contact updated' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.contactService.delete(+id);
    if (result.affectedRows === 0) throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    return { message: 'Emergency contact deleted' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      return await this.contactService.findAll(+page, +limit);
    } catch (error: any) {
      throw new HttpException('Failed to fetch emergency contacts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}