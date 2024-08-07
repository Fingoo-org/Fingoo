const instructions = [
  {
    type: 'predict',
    instruction: `
    경제 지표에 대한 예측을 수행한 후 결과에 대한 해석을 제공합니다. 

    지시사항: 
    - 가능한 경제 지표 분류에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다. 
    - 경제 지표 예측에는 예측하고 싶은 목표 지표와 해당 지표를 예측하기 위한 재료 지표들이 필요합니다. 
    - 재료 지표는 목표 지표와 연관성이 있는 지표로, 사용자에게 묻지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다. 재료 지표는 최소 2개에서 최대 5개까지 제공해야 합니다. 
    - 목표 지표에 재료 지표가 포함되지 않습니다. (틀린예시: source_symbol=[AAPL], target_symol='AAPL')
    - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)
    - 환율의 경우에는 국가를 두 개 명시하지 않는 경우 반드시 한국을 기준으로 전달합니다. (예시: 미국환율: KRW/USD, 유로환율: KRW/EUR, 엔화환율: KRW/JPY) 
    - 심볼에는 '.'d이나 '^' 와 같은 접미사나 접두사를 붙이지 않습니다(예시: GSPC). - 크립토와 환율의 심볼은 '/'를 사용합니다(예시: EUR/USD, BTC/USD 등). 
    - 함수의 결과로 예측 결과 값이 제공되면, 예측 결과에 대한 해석을 추가하여 사용자에게 전달해야 합니다. 
    
    가이드라인: 
    - 목표 지표와 재료 지표가 무엇인지 명확히 설명해야 합니다. 
    - 목표 지표와 재료 지표가 겹치지 않아야합니다.
    - 예측 결과 값을 제공해야 합니다. 
    - 해석에는 목표 지표와 재료 지표의 연관성에 대한 지식을 설명해야 합니다. 
    - 예측 결과 값을 기반으로 해당 지표가 상승하는지 하락하는지에 대한 해석을 제공 합니다. 
    - 예측 결과 값을 기반으로 GPT가 알고 있는 지식을 활용하여 해석을 제공 합니다. 
    - 예측 결과 값이 부정확할 수 있음을 설명해야 합니다.
    `,
  },
  {
    type: 'analyze',
    instruction: `
    시장 상황이나 지수를 분석하는데 필요한 지표를 가져온 후 지표를 바탕으로 분석을 제공합니다.

    지시사항:
    - 가능한 경제 지표 분류에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다. 
    - 분석에 필요한 연관 지표는 분류된 경제 지표에서만 찾아야합니다.
    - 연관 경제 지표는 사용자가 질문한 분야와 가장 밀접하게 관련이 있는 지표여야 합니다.
    - 연관 경제 지표는 FRED(Federal Reserve Economic Data) API를 통해 제공되며, FRED의 심볼값을 기준으로 제공합니다.
    - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: AAPL, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)
    - 환율의 경우에는 국가를 두 개 명시하지 않는 경우 반드시 한국을 기준으로 전달합니다. (예시: 미국환율: KRW/USD, 유로환율: KRW/EUR, 엔화환율: KRW/JPY)
    - 심볼에는 '.'d이나 '^' 와 같은 접미사나 접두사를 붙이지 않습니다(예시: GSPC). - 크립토와 환율의 심볼은 '/'를 사용합니다(예시: EUR/USD, BTC/USD 등). 
    - 연관 지표는 4개를 넘겨서는 안됩니다.
    
    `,
  },
  {
    type: 'explain',
    instruction: `
    사용자가 질문한 지표에 대한 개요를 지피티가 알고있는 정보로 사용자에게 설명합니다.

    지시사항:
    - 경제지표에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 해당됩니다.
    - 경제 지표는 FRED(Federal Reserve Economic Data) API를 통해 제공되며, FRED의 심볼값을 기준으로 제공합니다.
    - 정보는 다른 도구를 호출하지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다.
    - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: AAPL, GSPC, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등) 
    - 환율의 경우에는 국가를 두 개 명시하지 않는 경우 반드시 한국을 기준으로 전달합니다. (예시: 미국환율: KRW/USD, 유로환율: KRW/EUR, 엔화환율: KRW/JPY)
    - 분석을 하지 말고 단순히 지표에 대한 정보를 제공합니다.
    - 지표의 의미와 중요성을 설명에 포함하여 제공합니다.
    - 지표의 특징과 활용 방법을 포함하여 제공합니다.
    - 분석을 하지 말고 단순히 지표에 대한 정보를 제공합니다.
    - speak_to_user를 호출하여 명시된 출력필드에 따라 사용자에게 설명을 제공합니다.
    `,
  },
  {
    type: 'recommend',
    instruction: `
    사용자에게 현재 상황에 맞는 경제 지표를 추천합니다.

    지시사항:
    - 경제지표에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다. 
    - 경제 지표는 FRED(Federal Reserve Economic Data) API를 통해 제공되며, FRED의 심볼값을 기준으로 제공합니다.
    - 정보는 다른 도구를 호출하지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다.
    - 환율의 경우에는 국가를 두 개 명시하지 않는 경우 반드시 한국을 기준으로 전달합니다. (예시: 미국환율: KRW/USD, 유로환율: KRW/EUR, 엔화환율: KRW/JPY)
    - 추천 경제 지표는 2개에서 5개를 선택합니다.
        `,
  },
  {
    type: 'draw',
    instruction: `
    사용자의 현재 화면에 지표를 포함한 메타데이터를 생성합니다.

    지시사항:
    - 경제지표에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다. 
    - 경제 지표는 FRED(Federal Reserve Economic Data) API를 통해 제공되며, FRED의 심볼값을 기준으로 제공합니다.
    - 정보는 다른 도구를 호출하지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다.
    - 환율의 경우에는 국가를 두 개 명시하지 않는 경우 반드시 한국을 기준으로 전달합니다. (예시: 미국환율: KRW/USD, 유로환율: KRW/EUR, 엔화환율: KRW/JPY)
    - 5개 이상의 지표를 선택한 경우 앞에서부터 순서대로 5개의 지표만을 선택합니다.
    - 별도의 출력 없이 메타데이터를 생성합니다.
    `,
  },
  {
    type: 'metadata',
    instruction: `
    사용자의 현재 화면에 지표를 제외한 메타데이터를 생성합니다.

    지시사항:
    - 지표없이 메타데이터를 생성합니다.
    - 별도의 출력 없이 메타데이터를 생성합니다.
    `,
  },
];

export default function useInstruction() {
  const getInstruction = ({ query }: { query: string }) => {
    const instruction = instructions.find((instruction) => instruction.type === query);

    // fix: 지시를 row 데이터로?
    return JSON.stringify({
      instruction: instruction?.instruction,
    });
  };

  return {
    getInstruction,
  };
}
