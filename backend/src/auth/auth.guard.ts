import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../users/constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}

    async canActivate(contex: ExecutionContext): Promise<boolean> {
        
        const request = contex.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throw new UnauthorizedException(`No token provided`);
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret
                }
            );
            
            request.user_id = payload.user_id;
            
        } catch {
            throw new UnauthorizedException();
        }
        return true;
        
        
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}