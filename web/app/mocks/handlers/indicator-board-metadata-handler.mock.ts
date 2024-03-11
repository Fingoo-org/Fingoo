import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import { mockDB } from '../db';
import {
  CreateIndicatorMetadataRequestBody,
  AddIndicatorToMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export type metadataParam = {
  metadataId: string;
};

export type indicatorParam = {
  indicatorId: string;
};

export const indicatorBoardMetadataHandlers = [
  http.get(API_PATH.indicatorBoardMetadata, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getMetadataList());
  }),
  http.post<never, CreateIndicatorMetadataRequestBody, never>(API_PATH.indicatorBoardMetadata, async ({ request }) => {
    const newMetadata = await request.json();
    mockDB.postMetadataList(newMetadata);
    await delayForDevelopment();
    return HttpResponse.json({
      status: 200,
    });
  }),
  http.post<metadataParam, AddIndicatorToMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const indicator = await request.json();
      mockDB.postIndicatorToMetadata(metadataId, indicator);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam & indicatorParam>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId/indicator/:indicatorId`,
    async ({ params }) => {
      const { metadataId, indicatorId } = params;
      mockDB.deleteIndicatorFromMetadata(metadataId, indicatorId);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.patch<metadataParam, UpdateIndicatorBoardMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId`,
    async ({ request, params }) => {
      const { metadataId } = params;
      const data = await request.json();
      await delayForDevelopment();
      mockDB.patchMetadata(metadataId, data);
      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam>(`${API_PATH.indicatorBoardMetadata}/:metadataId`, async ({ params }) => {
    const { metadataId } = params;
    mockDB.deleteIndicatorBoardMetadata(metadataId);
    await delayForDevelopment();

    return HttpResponse.json({ status: 200 });
  }),
];
