import json
import re
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')

client = OpenAI(
    api_key=api_key
)

def format_symbol(symbol: str) -> str:
    if ':' in symbol:
        return symbol.split(':')[1]
    if '^' in symbol:
        return symbol.split('^')[1]
    if '.' in symbol:
        return symbol.split('.')[0]
    return symbol

def check_source_symbol(symbol: str) -> bool:
    return bool(re.match(r'^[A-Z/]+$', symbol))

def evaluate():
    tools = [
        {
            "name": 'predict_economic_indicator',
            "description": 'time series 형태의 경제 지표 예측 결과 값을 가져온다',
            "parameters": {
                "type": 'object',
                "properties": {
                    "target_symbol": {
                        "type": 'string',
                        "description": '예측할 목표 경제 지표의 심볼(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)',
                    },
                    "source_symbols": {
                        "type": 'array',
                        "items": {
                            "type": 'string',
                        },
                        "description": '재료 지표의 심볼 리스트(예시: [005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG])',
                    },
                },
                "required": ['target_symbol', 'source_symbols'],
            },
        },
    ]

    system_prompt = """
    역할: 
    경제지표의 예측 및 해석 역할을 수행합니다.

    상황: 
    - 사용자가 특정 경제 지표에 대한 예측 결과를 알고 싶어합니다.

    입력값:
    - 사용자가 예측하고 싶은 경제 지표

    지시사항:
    - 가능한 경제 지표 분류에는 주식, 환율, 크립토, ETF, 지수, 펀드, 채권이 포함됩니다.
    - 경제 지표 예측에는 예측하고 싶은 목표 지표와 해당 지표를 예측하기 위한 재료 지표들이 필요합니다.
    - 재료 지표는 목표 지표와 연관성이 있는 지표로, 사용자에게 묻지 않고 GPT가 알고 있는 지식을 기반으로 제공합니다. 재료 지표는 최소 2개에서 최대 5개까지 제공해야 합니다.
    - 목표 지표는 재료 지표가 될 수 없습니다.
    - 반드시 지표의 심볼만 함수의 인자 값으로 전달해야 합니다.(예시: 005930, EUR/USD, BTC/USD, SPY, IXIC, 0P00000AMG 등)
    - 심볼에는 '.'이나 '^' 와 같은 접미사나 접두사를 붙이지 않습니다(예시: GSPC). 
    - 크립토와 환율의 심볼은 '/'를 사용합니다(예시: EUR/USD, BTC/USD 등).
    - 함수의 결과로 예측 결과 값이 제공되면, 예측 결과에 대한 해석을 추가하여 사용자에게 전달해야 합니다.

    가이드라인:
    - 목표 지표와 재료 지표가 무엇인지 명확히 설명해야 합니다.
    - 예측 결과 값을 제공해야 합니다.
    - 해석에는 목표 지표와 재료 지표의 연관성에 대한 지식을 설명해야 합니다.
    - 예측 결과 값을 기반으로 해당 지표가 상승하는지 하락하는지에 대한 해석을 제공 합니다.
    - 예측 결과 값을 기반으로 GPT가 알고 있는 지식을 활용하여 해석을 제공 합니다.
    - 예측 결과 값이 부정확할 수 있음을 설명해야 합니다.

    출력 지시사항:
    - 출력필드:
    필드 1: 목표 및 재료 지표
    필드 2: 예측 결과 값
    필드 3: 예측에 대한 해석
    """

    with open('evals/predict_economic_indicator_test_case.json') as f:
        test_cases = json.load(f)

    correct_count = 0
    incorrect_count = 0

    for test_case in test_cases:
        user_prompt = test_case["user_prompt"]
        expected_target_symbol = test_case["expected_target_symbol"]

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-0125",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                functions=tools,
                function_call='auto'
            )

            choices = response.choices[0]
            message = choices.message
            function_call = message.function_call
            arguments = json.loads(function_call.arguments)
            
            target_symbol = format_symbol(arguments['target_symbol'])
            source_symbols = arguments['source_symbols']
            formatted_source_symbols = [format_symbol(symbol) for symbol in source_symbols]
            valid_symbols = all(check_source_symbol(symbol) for symbol in formatted_source_symbols)

            if not valid_symbols:
                incorrect_count += 1
            if target_symbol == expected_target_symbol:
                correct_count += 1
            else:
                incorrect_count += 1
            
            print(f"Test case '{user_prompt}': expected '{expected_target_symbol}', output: '{target_symbol}', source_symbol_array: '{source_symbols}' source_symbol validtest: {valid_symbols}")
        except Exception as e:
            print(f"Error processing test case '{user_prompt}': {e}")
            incorrect_count += 1

    results = {
        '정답': correct_count,
        '오답': incorrect_count,
    }

    print(results)

if __name__ == "__main__":
    evaluate()