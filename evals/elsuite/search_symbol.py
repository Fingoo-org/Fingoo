import random
import evals
import evals.metrics

class SearchSymbol(evals.Eval):
    def __init__(self, test_jsonl, **kwargs):
        super().__init__(**kwargs)
        self.test_jsonl = test_jsonl

    def run(self, recorder):
        """
        Called by the `oaieval` CLI to run the eval. The `eval_all_samples` method calls `eval_sample`.
        """
        test_samples = evals.get_jsonl(self.test_jsonl)
        self.eval_all_samples(recorder, test_samples)

        # Record overall metrics
        return {
            "accuracy": evals.metrics.get_accuracy(recorder.get_events("match")),
        }

    def eval_sample(self, test_sample, rng: random.Random):
        """
        Called by the `eval_all_samples` method to evaluate a single sample.

        ARGS
        ====
        `test_sample`: a line from the JSONL test file
        `rng`: should be used for any randomness that is needed during evaluation

        This method does the following:
        1. Generate a prompt that contains the task statement and the test question.
        2. Generate a completion from the model.
        3. Check if the generated answer is correct.
        """
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
                
                출력 지시사항: 목표지표 심볼값
                """
            },
            {"role": "user", "content": test_sample["problem"]}
        ]

        result = self.completion_fn(prompt=prompt, temperature=0.0, max_tokens=10)
        sampled = result.get_completions()[0].strip()

        evals.record_and_check_match(prompt=prompt, sampled=sampled, expected=test_sample["answer"])
