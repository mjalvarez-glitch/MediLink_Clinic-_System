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
      if (!dto.person_name?.trim()) {
        throw new HttpException('Person name is required', HttpStatus.BAD_REQUEST);
      }
      if (!dto.relationship?.trim()) {
        throw new HttpException('Relationship is required', HttpStatus.BAD_REQUEST);
      }
      if (!dto.phone_no?.trim()) {
        throw new HttpException('Phone number is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.contactService.create(dto);
      return { message: 'Emergency contact added', id: result.insertId };
    } catch (error: any) {
      if (error.code === 'ER_DATA_TOO_LONG') {
        throw new HttpException('Data too long for one of the fields', HttpStatus.BAD_REQUEST);
      }
      if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new HttpException('Required fields (person_name, relationship, phone_no) cannot be null', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    try {
      if (dto.person_name !== undefined && !dto.person_name?.trim()) {
        throw new HttpException('Person name cannot be empty', HttpStatus.BAD_REQUEST);
      }
      if (dto.relationship !== undefined && !dto.relationship?.trim()) {
        throw new HttpException('Relationship cannot be empty', HttpStatus.BAD_REQUEST);
      }
      if (dto.phone_no !== undefined && !dto.phone_no?.trim()) {
        throw new HttpException('Phone number cannot be empty', HttpStatus.BAD_REQUEST);
      }

      const result = await this.contactService.update(+id, dto);
      if (result.affectedRows === 0) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Emergency contact updated' };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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