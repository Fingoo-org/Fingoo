import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import { mockDB } from '../db';
import {
  CreateIndicatorMetadataRequestBody,
  AddIndicatorToMetadataRequestBody,
  AddCustomForecastIndicatorToMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
  UpdateIndicatorBoardMetadataSectionsRequestBody,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export type metadataParam = {
  metadataId: string;
};

export type indicatorParam = {
  indicatorId: string;
};

export type customForecastIndicatorParam = {
  customForecastIndicatorId: string;
};

export const indicatorBoardMetadataHandlers = [
  http.get(API_PATH.indicatorBoardMetadata, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getMetadataList());
  }),
  http.post<never, CreateIndicatorMetadataRequestBody, never>(API_PATH.indicatorBoardMetadata, async ({ request }) => {
    const newMetadata = await request.json();
    await delayForDevelopment();
    return HttpResponse.text(mockDB.postMetadataList(newMetadata));
  }),
  http.post<metadataParam, AddIndicatorToMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const body = await request.json();
      mockDB.postIndicatorToMetadata(metadataId, body);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.post<metadataParam, AddCustomForecastIndicatorToMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/custom-forecast-indicator/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const body = await request.json();
      mockDB.postCustomForecastIndicatorToMetadata(metadataId, body);
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
  http.delete<metadataParam & customForecastIndicatorParam>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId/custom-forecast-indicator/:customForecastIndicatorId`,
    async ({ params }) => {
      const { metadataId, customForecastIndicatorId } = params;
      mockDB.deleteCustomForecastIndicatorFromMetadata(metadataId, customForecastIndicatorId);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.patch<metadataParam, UpdateIndicatorBoardMetadataSectionsRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId/sections`,
    async ({ request, params }) => {
      const { metadataId } = params;
      const data = await request.json();
      await delayForDevelopment();
      mockDB.patchIndicatorIdsWithsectionIds(metadataId, data);
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
