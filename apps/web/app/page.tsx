'use client';
import Link from 'next/link';
import { CardContent, CardFooter, Card } from '@/app/ui/components/view/molecule/card/card';
import Form from './ui/components/view/molecule/form';
import { authenticate } from './business/services/auth/sign-in.service';
import SplitScreenToggleGroup from './ui/pages/workspace/split-screen/split-screen-toggle-group';
import Workspace from './ui/pages/workspace/workspace';
import MockingUser from './ui/components/util/mocking-user';
import ChatAiNavigator from './ui/pages/workspace/chat-ai-navigator';
import FloatingComponentContainer from './ui/pages/workspace/floating-component-container';
import SideNav from './ui/pages/workspace/side-bar/sidenav';
import { SWRProvider } from './ui/components/util/swr-provider';
import ChatProvider from './business/hooks/linguistic-guidance/provider/chat-provider';
import Callout from './ui/components/view/molecule/callout';

export default function Page() {
  return (
    <MockingUser>
      <ChatProvider>
        <SWRProvider>
          <div className="flex h-screen md:flex-row md:overflow-hidden">
            <SideNav />
            <div className="grow bg-fingoo-gray-1.5">
              <div className="relative h-full w-full">
                <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-lg ">
                  <SplitScreenToggleGroup />
                </div>
                <div className="flex h-full items-center justify-center">
                  <Workspace />
                </div>
                <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-lg ">
                  <Callout>
                    FINGOO 블로그로 이동하려면{'   '}
                    <Link className="underline hover:text-gray-100" href="/blog">
                      여기
                    </Link>
                    를 클릭하세요.
                  </Callout>
                </div>
              </div>
            </div>
            <ChatAiNavigator />
            <FloatingComponentContainer />
          </div>
        </SWRProvider>
      </ChatProvider>
    </MockingUser>
  );
}

function LoginFormPage() {
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
      <div className="mr-1.5 hidden"></div>
    </div>
  );
}
