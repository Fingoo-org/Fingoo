import { getIndicatorBySymbol } from '../../services/linguistic-guidance/search-symbol.service';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';

export default function useAnalyzeEconomy() {
  const analyzeEconomicHandler = async (symbols: string[]) => {
    // 1. 심볼로 아이디 가져오기
    // 2. 메타데이터 만들기
    // 3. 메타데이터에 지표 추가
    // 4. 메타데이터 선택
    // 5. 값 가져오기
    // 6. GPT에 분석 요청

    const indicators = (
      await Promise.all(
        symbols.map(async (symbol) => {
          const indicator = await getIndicatorBySymbol(symbol);

          if (!indicator) return;

          return createIndicator(indicator);
        }),
      )
    ).filter((indicator) => indicator !== undefined);

    console.log('analyze');
    console.log(symbols);
    console.log(indicators);

    return undefined;
  };

  return {
    analyzeEconomicHandler,
  };
}
