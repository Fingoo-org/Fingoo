import type { NextRequest } from 'next/server';

async function getAuth(request: NextRequest): Promise<{
  role: 'guest' | 'user';
}> {
  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return {
      role: 'guest',
    };
  }
  return {
    role: 'user',
  };
}

const allowdGuestPath = ['/sign-in'];

function isAllowedGuestPath(path: string) {
  if (path === '/') {
    return true;
  }

  return allowdGuestPath.some((allowedPath) => path.startsWith(allowedPath));
}

export async function middleware(request: NextRequest) {
  const auth = await getAuth(request);

  if (auth.role === 'guest' && !isAllowedGuestPath(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|mockServiceWorker|_next/static|_next/image|.*\\.png$).*)'],
};
