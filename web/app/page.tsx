'use client';
import Link from 'next/link';
import { CardContent, CardFooter, Card } from '@/app/ui/components/view/molecule/card/card';
import Form from './ui/components/view/molecule/form';
import { authenticate } from './business/services/auth/sign-in.service';

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Enter your email and password below to access your account.
          </p>
        </div>
        <Card>
          <Form id="sign-in" action={authenticate}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Form.TextInput label="Email" id="email" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <Form.PasswordInput label="Password" id="password" placeholder="" />
              </div>
            </CardContent>
            <CardFooter>
              <Form.SubmitButton label="Sign in" position="center" className="w-full" />
            </CardFooter>
          </Form>
        </Card>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Dont have an account?
          <Link className="font-medium hover:underline" href="#">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
