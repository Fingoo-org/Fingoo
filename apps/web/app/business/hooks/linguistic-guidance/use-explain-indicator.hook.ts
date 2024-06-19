import { getIndicatorBySymbol } from '../../services/linguistic-guidance/search-symbol.service';
import { createIndicator } from '../../services/numerical-guidance/view-model/indicator-list/indicator-view-model.service';

export default function useExplainIndicator() {
  const handleExplainIndicator = async (symbol: string) => {
    const indicatorResponse = await getIndicatorBySymbol(symbol);

    if (!indicatorResponse) return '지표를 찾을 수 없습니다.';

    const indicator = createIndicator(indicatorResponse);

    return JSON.stringify(`
      지표 정보: ${JSON.stringify(indicator.formattedIndicator)}
      
      speak_to_user에 명시된 출력필드를 따르며 아래와 같은 지시사항을 따라 사용자에게 지표에 대한 설명을 제공합니다.
        - 지표의 의미와 중요성을 설명에 포함하여 제공합니다.
        - 지표의 특징과 활용 방법을 포함하여 제공합니다.
        - 분석을 하지 말고 단순히 지표에 대한 정보를 제공합니다.
        - speak_to_user를 호출하여 명시된 출력필드에 따라 사용자에게 설명을 제공합니다.
      `);
  };

  return {
    handleExplainIndicator,
  };
}
