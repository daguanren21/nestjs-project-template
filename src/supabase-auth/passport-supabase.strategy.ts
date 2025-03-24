import { FastifyRequest } from 'fastify';
import { JwtFromRequestFunction } from 'passport-jwt';
import { Strategy } from '@fastify/passport';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_AUTH, UNAUTHORIZED } from './constants';
import { SupabaseAuthUser, SupabaseAuthStrategyOptions } from './supabase.type';

export class SupabaseAuthStrategy extends Strategy {
  readonly name = SUPABASE_AUTH;
  private supabase: SupabaseClient;
  private extractor: JwtFromRequestFunction;
  constructor(options: SupabaseAuthStrategyOptions) {
    super('supabaseAuthStrategy');
    if (!options.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }

    this.supabase = createClient(
      options.supabaseUrl,
      options.supabaseKey,
      (options.supabaseOptions = {}),
    );
    this.extractor = options.extractor;
  }

  validate(payload: SupabaseAuthUser): SupabaseAuthUser | null {
    if (!!payload) {
      this.success(payload, {});

      return payload;
    }

    this.fail(UNAUTHORIZED, 401);

    return null;
  }

  authenticate(req: FastifyRequest): void {
    const idToken = this.extractor(req);

    if (!idToken) {
      this.fail(UNAUTHORIZED, 401);
      return;
    }

    this.supabase.auth
      .getUser(idToken)
      .then(({ data: { user } }) => user && this.validate(user))
      .catch((err) => {
        this.fail(err.message, 401);
      });
  }
}
