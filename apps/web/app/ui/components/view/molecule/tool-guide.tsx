import { FunctionName } from '@/app/business/services/linguistic-guidance/tools-schema.service';
import Separator from '../atom/separator';

type ToolGuideProps = {
  tool_name: FunctionName;
};
export function ToolGuide({ tool_name }: ToolGuideProps) {
  return (
    <div className="flex w-full items-center justify-center space-x-2 text-xs text-fingoo-gray-5">
      <Separator />
      <div>{tool_name}</div>
      <Separator />
    </div>
  );
}
