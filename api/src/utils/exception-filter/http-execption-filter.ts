import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errorResponse: any = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };
    const url: string = request.url;
    const timestamp: string = new Date().toISOString();

    if (typeof errorResponse === 'string') {
      response.status(status).json({
        successs: false,
        timestamp: timestamp,
        statusCode: status,
        url: url,
        errorResponse,
      });
    } else {
      response.status(status).json({
        success: false,
        message: errorResponse.message,
        timestamp: timestamp,
        statusCode: status,
        ...errorResponse,
      });
    }

    this.errorLogging(url, errorResponse, timestamp);
  }

  private errorLogging(
    url: string,
    errorResponse: string | { error: string; statusCode: number; message: string | string[] },
    timestamp: string,
  ) {
    console.log('요청 url: ', url);
    console.log('-------------------------------------');
    console.log('error 정보: ', errorResponse);
    console.log('-------------------------------------');
    console.log('발생 시간: ', timestamp);
  }
}
