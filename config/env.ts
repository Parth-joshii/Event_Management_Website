import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  GOOGLE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.string().optional(),
  GOOGLE_SHEETS_WEBHOOK_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Shree Velora Event's"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  OPENAI_API_KEY: z.string().optional(),
  SMTP_FROM_EMAIL: z.string().email().optional().or(z.literal("")),
  SMTP_HOST: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
  SMTP_TO_EMAIL: z.string().email().optional().or(z.literal("")),
  SMTP_USER: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_DRIVE_FOLDER_ID: process.env.GOOGLE_DRIVE_FOLDER_ID,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NODE_ENV: process.env.NODE_ENV,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_TO_EMAIL: process.env.SMTP_TO_EMAIL,
  SMTP_USER: process.env.SMTP_USER
});
