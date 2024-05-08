'use server';
import { cookies } from 'next/headers';
import { FormState } from '@/app/ui/components/view/molecule/form/form-root';
import { SignInFormSchema, SignInRequestBody } from './auth-validation.service';
import { API_PATH } from '@/app/store/querys/api-path';
import { HttpError } from '@/app/utils/http/http-error';

export async function authenticate(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      isFailure: true,
      validationError: validatedFields.error.flatten().fieldErrors,
      message: '양식에 맞춰 다시 입력해주세요.',
    };
  }

  const body: SignInRequestBody = {
    ...validatedFields.data,
  };

  try {
    const response = await fetch(`${API_PATH.auth}/signIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(response);

    if (!response.ok) {
      throw new HttpError(response.status, '서버 에러');
    }

    const result = await response.json();

    cookies().set('accessToken', result.accessToken, {
      secure: true,
      path: '/',
    });

    // redirect('/my');
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 404) {
      // 잘못된 요청 처리 로직
      return {
        isSuccess: false,
        isFailure: true,
        validationError: {},
        message: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요',
      };
    } else {
      throw error;
    }
  }

  return {
    isSuccess: true,
    isFailure: false,
    validationError: {},
    message: '로그인 성공',
  };
}
