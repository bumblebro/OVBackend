import { config } from "dotenv";
import { z } from "zod";

// Load environment variables
config();

// Environment variable schema
const envSchema = z.object({
  // NODE_ENV: z
  //   .enum(["development", "production", "test"])
  //   .default("development"),
  // PORT: z.string().default("3000"),
  // DATABASE_URL: z.string(),
  // JWT_SECRET: z.string(),
  // JWT_EXPIRES_IN: z.string().default("7d"),
  // AWS_ACCESS_KEY_ID: z.string(),
  // AWS_SECRET_ACCESS_KEY: z.string(),
  // AWS_REGION: z.string(),
  // AWS_S3_BUCKET: z.string(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

export default env;
