import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInRequestBody = z.infer<typeof SignInFormSchema>;
