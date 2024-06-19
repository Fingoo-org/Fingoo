import { FunctionName } from '@/app/business/services/linguistic-guidance/tools-schema.service';
import Separator from '../atom/separator';

type ToolGuideProps = {
  tool_name: FunctionName;
};

export function ToolGuide({ tool_name }: ToolGuideProps) {
  return (
    <div className="flex w-full items-center justify-center space-x-2 text-xs text-fingoo-gray-5">
      <Separator />
      <div className="whitespace-nowrap">{mapToolNameToGuide(tool_name)}</div>
      <Separator />
    </div>
  );
}

function mapToolNameToGuide(tool_name: FunctionName): string {
  switch (tool_name) {
    case 'predict_economic_indicator':
      return 'Fingoo가 예측을 시작합니다';
    case 'analyze_economic_indicators':
      return 'Fingoo가 분석을 시작합니다';
    case 'explain_economic_indicator':
      return 'Fingoo가 설명을 시작합니다';
    case 'recommend_economic_indicator':
      return 'Fingoo가 추천을 시작합니다';
    case 'get_instructions':
      return 'Fingoo가 질문을 이해하고 있습니다';
    default:
      return 'Fingoo가 작업을 시작합니다';
  }
}
