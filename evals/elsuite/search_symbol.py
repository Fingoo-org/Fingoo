import random
import evals
import evals.metrics

class SearchSymbol(evals.Eval):
    def __init__(self, test_jsonl, **kwargs):
        super().__init__(**kwargs)
        self.test_jsonl = test_jsonl

    def run(self, recorder):
        test_samples = evals.get_jsonl(self.test_jsonl)
        self.eval_all_samples(recorder, test_samples)

        return {
            "accuracy": evals.metrics.get_accuracy(recorder.get_events("match")),
        }

    def eval_sample(self, test_sample, rng: random.Random):
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "predict_economic_indicator",
                    "description": "time series 형태의 경제 지표 예측 결과 값을 가져온다",
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
            }
        ]
        
        prompt = [
            {
                "role": "system",
                "content": """
                역할:
                경제 지표의 예측 및 해석 역할을 수행합니다.
                
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
                - 심볼이 무엇인지 물어본경우 GPT가 알고있는 지식을 활용해 심볼을 제공합니다.
                
                출력 지시사항:
                    - 출력필드:
                    필드 1: 목표 및 재료 지표
                    필드 2: 예측 결과 값
                    필드 3: 예측에 대한 해석
                """
            },
            {"role": "user", "content": test_sample["input"]},
        ]

        result = self.completion_fn(prompt=prompt, tools=tools, tool_choice="auto", temperature=0.0)
        
        if result.get_completions():
            sampled = result.get_completions()[0].strip()
        else:
            sampled = ""  # 빈 응답 처리

        evals.record_and_check_match(prompt=prompt, sampled=sampled, expected=test_sample["expected_target_symbol"])

