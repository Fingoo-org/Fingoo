import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiExceptionResponse = (statusCode: number, message: string) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: statusCode },
          message: { type: 'string', example: message },
          timestamp: { type: 'string', format: 'date-time', example: '2024-03-04T05:17:33.756Z' },
          url: {
            type: 'string',
            example: '/api/numerical-guidance/..',
          },
        },
      },
    }),
  );
};
