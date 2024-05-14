import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiExceptionResponse = (statusCode: number, message: string, error: string) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: statusCode },
          errorMessage: { type: 'string', example: message },
          description: { type: 'string', example: error },
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
