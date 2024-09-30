import Pending from '../../../view/molecule/pending';
import { Card, CardContent, CardHeader, CardTitle } from '../../../view/molecule/card/card';
import { IndicatorQuoteRequest } from '@/app/store/querys/numerical-guidance/indicator-quote.query';
import { useIndicatorQuote } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-quote-view-model.hooks';

export function IndicatorQuoteAnalytics(indicator: IndicatorQuoteRequest) {
  const { formattedIndicatorQuote: indicatorQuoteData, isPending } = useIndicatorQuote(indicator);

  return (
    <Pending isPending={isPending}>
      {indicatorQuoteData !== undefined ? (
        <Card>
          <CardHeader>
            <CardTitle className=" flex items-center justify-center text-lg">주요통계</CardTitle>
          </CardHeader>
          <CardContent>
            {indicatorQuoteData.isMarketOpen ? (
              <div className=" flex justify-between text-sm">
                <div>시작</div>
                <div>{indicatorQuoteData.open}</div>
              </div>
            ) : (
              ''
            )}
            <div className=" flex justify-between text-sm">
              <div>1년 최고</div>
              <div>{indicatorQuoteData.fiftyTwoWeek.high}</div>
            </div>
            <div className=" flex justify-between text-sm">
              <div>1년 최저</div>
              <div>{indicatorQuoteData.fiftyTwoWeek.low}</div>
            </div>
            {indicatorQuoteData.isMarketOpen ? (
              <div className=" flex justify-between text-sm">
                <div>거래량</div>
                <div>{indicatorQuoteData.volume}</div>
              </div>
            ) : (
              ''
            )}
          </CardContent>
        </Card>
      ) : (
        ''
      )}
    </Pending>
  );
}
