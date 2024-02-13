import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const error: any =
      exception instanceof HttpException
        ? (exception.getResponse() as string | { error: string; statusCode: number; message: string | string[] })
        : HttpStatus.INTERNAL_SERVER_ERROR;

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
