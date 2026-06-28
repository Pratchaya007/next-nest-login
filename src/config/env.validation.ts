import { Logger } from '@nestjs/common';
import z from 'zod';

const envScheme = z.object({
  PORT: z.coerce.number().min(0).max(65535),
  APP_URL: z.url(),
  DATABASE_URL: z.url(),
  SALT_ROUNDS: z.coerce.number(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string().min(10)
});

export type EnvConfigType = z.infer<typeof envScheme>;

export const validate = (config: Record<string, any>) => {
  const { error, data, success } = envScheme.safeParse(config);

  if (!success) {
    const logger = new Logger('EnvValidation');
    logger.error(`Env validation failed: \n${z.prettifyError(error)}`);
    process.exit(1);
  }
  return data;
};
