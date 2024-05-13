import json
import re

class EconomicIndicatorEval:
    def __init__(self, data_jsonl):
        self.data_jsonl = data_jsonl

    #1.정확한 function calling 진행했는지? 2. targetsymbol이 일치하는지 3.source symbol의 정규식표현 정확한지
    def eval_sample(self, sample):
        function_call = sample['output'].startswith('predict_economic_indicator')
        target_check = re.search(r"predict_economic_indicator\(target_symbol='([A-Z\/]+)'", sample['output'])
        correct_target_symbol = target_check and target_check.group(1) == sample['expected_target_symbol']
        source_format_check = all(re.match(r"^[A-Z\/]+$", sym.strip()) for sym in re.findall(r"['\"]([A-Z\/]+)['\"]", sample['output']))

        return function_call and correct_target_symbol and source_format_check

    def run_evaluation(self):
        with open(self.data_jsonl, 'r') as file:
            test_cases = [json.loads(line) for line in file]

        results = []
        for case in test_cases:
            result = self.eval_sample(case)
            results.append(result)

        accuracy = sum(results) / len(results) if results else 0
        print(f"Accuracy: {accuracy * 100:.2f}%")
