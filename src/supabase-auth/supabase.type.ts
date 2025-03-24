import { AuthUser, SupabaseClientOptions } from '@supabase/supabase-js';
import { JwtFromRequestFunction } from 'passport-jwt';

export type SupabaseAuthUser = AuthUser;

export interface SupabaseAuthStrategyOptions {
  supabaseUrl: string;
  supabaseKey: string;
  supabaseOptions: SupabaseClientOptions<'myschema'>;
  extractor: JwtFromRequestFunction;
}
