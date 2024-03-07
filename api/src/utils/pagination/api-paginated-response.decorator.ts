import { CursorPageDto } from './cursor-page.dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export const ApiPaginatedResponseDecorator = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(CursorPageDto, model),
    ApiOkResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(CursorPageDto) }],
      },
    }),
  );
};
