'use client';
import { API_PATH } from '@/app/store/querys/api-path';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function MockingUser({ children }: React.PropsWithChildren) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    async function enableMocking() {
      if (typeof window !== 'undefined') {
        const response = await fetch(`${API_PATH.auth}/signIn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'corporation.dok.service@gmail.com',
            password: '123456',
          }),
        });

        console.log(response);
        const result = await response.json();
        // console.log(result);
        Cookies.set('accessToken', result.accessToken, {
          secure: true,
          path: '/',
        });

        setInit(true);
      }
    }

    enableMocking();
  }, []);

  return <>{init ? children : null}</>;
}
