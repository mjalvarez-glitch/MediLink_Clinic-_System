import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthenticatedRequest } from "./auth.interface";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Post("register")
    async register(@Body() body: { full_name: string; username: string; password: string; role: 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' }) {
        return this.usersService.createUser(body.full_name, body.username, body.password, body.role);
    }

    @Post("login")
    async login(@Body() body: { username: string; password: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        if (!user) return { error: "Invalid credentials" };
        return this.authService.login(user);
    }

    @Post("logout")
    async logout(@Body() body: { userId: number }) {
        return this.authService.logout(body.userId);
    }

    @Post("refresh")
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshTokens(body.refreshToken); 
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req: AuthenticatedRequest) {
        return {
            data: req.user 
        };
    }
}