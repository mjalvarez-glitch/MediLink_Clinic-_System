import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import { User } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ) {}

    /**
     * Validates user credentials during login.
     */
    async validateUser(username: string, pass: string) {
        const user = await this.usersService.findByUsername(username);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (isPasswordValid) {
            return { id: user.id, username: user.username, role: user.role };
        }
        return null;
    }

    /**
     * Handles initial login and issues the first token pair.
     */
    async login(user: { id: number; username: string; role: string }) {
        return this.generateTokens(user);
    }

    /**
     * Clears the refresh token from the DB to log the user out.
     */
    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
        return { ok: true };
    }

    /**
     * Refreshes access tokens and rotates the refresh token for security.
     */
    async refreshTokens(refreshToken: string) {
        try {
            // 1. Verify the signature and expiration of the provided token
            const decoded: any = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret'
            );

            // 2. Fetch the user from DB (Ensure users.service uses the correct 'refresh_token' column)
            const user = await this.usersService.findById(decoded.sub);
            
            // 3. Compare provided token with the HASHED token in the database
            if (!user || !user.refresh_token) {
                throw new UnauthorizedException('Access Denied');
            }

            const isTokenMatch = await bcrypt.compare(refreshToken, user.refresh_token);
            if (!isTokenMatch) {
                // If they don't match, someone might be reusing an old token. 
                // Security best practice: Revoke all tokens for this user.
                await this.usersService.setRefreshToken(user.id, null);
                throw new UnauthorizedException('Token compromise detected');
            }

            // 4. Issue a brand new pair (Rotation)
            return this.generateTokens({ 
                id: user.id, 
                username: user.username, 
                role: user.role 
            });

        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    private async generateTokens(user: { id: number; username: string; role: string }) {
        const payload = { sub: user.id, username: user.username, role: user.role };
        
        const accessToken = this.jwtService.sign(payload);

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_secret',
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
        } as JwtSignOptions);

        // SECURITY FIX: Hash the refresh token before storing it in the database
        const salt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        
        await this.usersService.setRefreshToken(user.id, hashedRefreshToken);

        return { accessToken, refreshToken };
    }
}