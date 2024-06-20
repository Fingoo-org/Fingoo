import { API_PATH } from '@/app/store/querys/api-path';
import { IndicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { instance } from '@/app/utils/http';
import { NotFoundError } from '@/app/utils/http/http-error';

export async function getIndicatorIdBySymbolToAPI(symbol: string): Promise<IndicatorByTypeResponse | undefined> {
  return await getIndicator(symbol, 'none');
}

export async function getIndicatorIdBySymbolToFred(symbol: string): Promise<IndicatorByTypeResponse | undefined> {
  return await getIndicator(symbol, 'economy');
}

export async function getIndicatorBySymbol(symbol: string): Promise<IndicatorByTypeResponse | undefined> {
  const indicatorFromFred = await getIndicatorIdBySymbolToFred(symbol);

  if (indicatorFromFred) {
    return indicatorFromFred;
  }

  const indicatorFromAPI = await getIndicatorIdBySymbolToAPI(symbol);

  return indicatorFromAPI;
}

export async function getIndicatorBySymbolAPIFirst(symbol: string): Promise<IndicatorByTypeResponse | undefined> {
  const indicatorFromAPI = await getIndicatorIdBySymbolToAPI(symbol);

  if (indicatorFromAPI) {
    return indicatorFromAPI;
  }

  const indicatorFromFred = await getIndicatorIdBySymbolToFred(symbol);

  return indicatorFromFred;
}

async function getIndicator(symbol: string, type: string): Promise<IndicatorByTypeResponse | undefined> {
  try {
    const { data } = await instance.get(`${API_PATH.indicatorList}/search`, {
      params: {
        symbol,
        type: type,
      },
    });

    return data;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return undefined;
    }
  }
}
