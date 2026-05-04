import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET || "access_secret",
        });
    }

    async validate(payload: any) {
    // The payload contains the 'sub' (id), username, and role from the login token
    return { 
      id: payload.sub, 
      username: payload.username,
      full_name: payload.full_name,
      role: payload.role 
    };
  }
}