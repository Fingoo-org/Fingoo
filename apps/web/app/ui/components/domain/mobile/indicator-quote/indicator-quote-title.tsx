import { IndicatorQuoteRequest } from '@/app/store/querys/mobile/indicator-quote.query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../view/molecule/card/card';
import { useIndicatorQuote } from '@/app/business/hooks/mobile/indicator/use-indicator-quote-view-model.hooks';
import Pending from '../../../view/molecule/pending';

export function IndicatorQuoteTitle(indicator: IndicatorQuoteRequest) {
  const { formattedIndicatorQuote: indicatorQuoteData, isPending } = useIndicatorQuote(indicator);

  if (!indicatorQuoteData) {
    return (
      <Card>
        <CardTitle>데이터를 불러올 수 없습니다.</CardTitle>
      </Card>
    );
  }

  return (
    <Pending isPending={isPending}>
      <Card>
        <CardHeader>
          <CardTitle className=" text-lg">
            {indicatorQuoteData.currency === 'USD' ? '$' : '₩'}
            {indicatorQuoteData.close}
          </CardTitle>
          <CardDescription className=" flex flex-row">
            어제보다
            <div className={` pl-3 ${Number(indicatorQuoteData.change) < 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {indicatorQuoteData.change} ({indicatorQuoteData.percentChange})
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Pending>
  );
}
