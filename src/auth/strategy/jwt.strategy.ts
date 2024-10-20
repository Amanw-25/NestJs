import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable() // Correctly use the decorator
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'), // Get the JWT secret from the config
        });
    }

    async validate(payload: { sub: number; email: string; }) {
        // Fetch the user from the database using the ID from the JWT payload
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        // If user is not found, return null (this will trigger an unauthorized response)
        if (!user) {
            return null; // or throw an exception, depending on your strategy
        }

        return user; // Return the user object if found
    }
}
