import { IndicatorQuoteRequest } from '@/app/store/querys/mobile/indicator-quote.query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../view/molecule/card/card';
import { useIndicatorQuote } from '@/app/business/hooks/mobile/indicator/use-indicator-quote-view-model.hooks';
import Pending from '../../../view/molecule/pending';

export function IndicatorQuoteTitle(indicator: IndicatorQuoteRequest) {
  const { formattedIndicatorQuote: indicatorQuoteData, isPending } = useIndicatorQuote(indicator);

  return (
    <Pending isPending={isPending}>
      <Card>
        <CardHeader>
          <CardTitle className=" text-lg">
            {indicatorQuoteData.currency === 'USD' ? '$ ' : '₩ '}
            {indicatorQuoteData.close}
          </CardTitle>
        </CardHeader>

        <CardContent className=" flex flex-row">
          어제보다
          <p className={` pl-2 ${Number(indicatorQuoteData.change) < 0 ? 'text-blue-500' : 'text-red-500'}`}>
            {Number(indicatorQuoteData.change) < 0 ? '-' : '+'}
            {indicatorQuoteData.currency === 'USD' ? '$' : '₩'}
            {Math.abs(Number(indicatorQuoteData.change))} ({indicatorQuoteData.percentChange})
          </p>
        </CardContent>
      </Card>
    </Pending>
  );
}
