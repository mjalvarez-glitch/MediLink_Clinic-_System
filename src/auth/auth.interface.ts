import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    full_name: string;
    role: "Admin" | "Doctor" | "Nurse" | "Receptionist";
  };
}