from statsmodels.tsa.api import VAR
from statsmodels.tsa.arima.model import ARIMA
from verificationModule import verification
import pandas as pd
import numpy as np

def runVar(df: pd.DataFrame, group: list[str], period: int) -> pd.DataFrame:
  df = df.fillna(method='backfill')

  dfVar = df[group]
  for i in group:
    if verification.getADFDataFrame(dfVar[i])['Data']['p_value'] >= 0.05:
      dfVar.loc[:, i] = dfVar[i].diff().bfill()
  
  dfNorm = (dfVar/dfVar.iloc[0]) - 1
  
  model = VAR(dfNorm).fit(10)
  ins = dfNorm.values[-model.k_ar:]
  forecast = model.forecast(y=ins, steps=period)
  dfForecast = pd.DataFrame(forecast, columns=dfNorm.columns)

  dfVarDnorm = (dfForecast+1).mul(dfVar.iloc[0].to_numpy())
  for name in group:
    dfVarDnorm[name] = np.r_[df[group][name].iloc[-1], dfVarDnorm[name]].cumsum()[1:]

  return dfVarDnorm

def runArima(df: pd.DataFrame, target: str, period: int) -> pd.DataFrame:
  df = df.fillna(method='backfill')

  if verification.getADFDataFrame(df[target])['Data']['p_value'] >= 0.05:
    df[target] = df[target].diff().bfill()

  order = optimizationArima(df, target)
  p = int(order[0])
  q = int(order[1])
  d = int(order[2])

  model = ARIMA(df[target], order=(p, q, d))
  fitted_model = model.fit()

  forecast = fitted_model.forecast(steps=period)
  forecast_df = pd.DataFrame({target: forecast})

  return forecast_df

def optimizationArima(df: pd.DataFrame, target: str) -> str:
  df = df.fillna(method='backfill')
  if verification.getADFDataFrame(df[target])['Data']['p_value'] >= 0.05:
    df[target] = df[target].diff().bfill()

  order = [3, 3, 3]
  orderList = []
  aicList = []
  bicList = []

  for p in range(order[0]):
    for q in range(order[1]):
      for d in range(order[2]):
        model = ARIMA(df[target], order=(p, q, d))
        try:
          fitted_model = model.fit()
          Corder = f'{p}{d}{q}'
          aic = fitted_model.aic
          bic = fitted_model.bic
          orderList.append(Corder)
          aicList.append(aic)
          bicList.append(bic)
        except:
          pass
  resultDf = pd.DataFrame(list(zip(orderList, aicList)), columns=['order','AIC'])
  resultDf.sort_values('AIC', inplace= True)

  minAicRow = resultDf.loc[resultDf['AIC'].idxmin()]
  minOrder = minAicRow['order']

  return minOrder