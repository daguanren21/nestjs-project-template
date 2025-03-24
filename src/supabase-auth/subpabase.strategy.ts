import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseAuthStrategy } from '.';
import { FastifyRequest } from 'fastify';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(SupabaseAuthStrategy, 'supabase') {
  public constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_KEY ?? '',
      supabaseOptions: {},
    //   supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET ?? '',
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: any): any {
    return super.validate(payload);
  }

  authenticate(req: FastifyRequest) {
    super.authenticate(req);
  }
}
