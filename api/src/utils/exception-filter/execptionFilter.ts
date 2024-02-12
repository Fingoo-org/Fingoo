import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const error: any = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    if (typeof error === 'string') {
      response.status(status).json({
        successs: false,
        timestamp: new Date().toISOString(),
        statusCode: status,
        url: request.url,
        error,
      });
    } else {
      response.status(status).json({
        successs: false,
        message: error.message,
        timestamp: new Date().toISOString(),
        ...error,
      });
    }

    const url: string = request.url;
    const timestamp: string = new Date().toISOString();

    console.log('요청 url: ', url);
    console.log('-------------------------------------');
    console.log('error 정보: ', error);
    console.log('-------------------------------------');
    console.log('발생 시간: ', timestamp);
  }
}
