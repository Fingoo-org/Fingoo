from statsmodels.tsa.api import VAR
from statsmodels.tsa.arima.model import ARIMA
import statsmodels.api as sm
from verificationModule import verification
import pandas as pd
import numpy as np
import pmdarima as pm
from dtos import RegressionModelAndRsquared, RsquaredResult
import numpy as np

def runVar(df: pd.DataFrame, group: list[str], period: int) -> pd.DataFrame:
  df = df.bfill()

  dfVar = df[group]
  for i in group:
    if verification.getADFDataFrame(dfVar[i])['Data']['p_value'] >= 0.05:
      while verification.getADFDataFrame(dfVar[i])['Data']['p_value'] >= 0.05:
        print(verification.getADFDataFrame(dfVar[i]))
        dfVar.loc[:, i] = dfVar[i].diff().bfill()
        print('---------------------------------')
        print(verification.getADFDataFrame(dfVar[i]))
        print('---------------------------------')
      print('정상성 검증 완료 ~ ! 차분 끝')
  
  dfNorm = (dfVar/dfVar.iloc[0]) - 1
  
  minAic=100
  optP=0
  for p in range(1,10):
    result = VAR(dfNorm).fit(p)
    if(result.aic <= minAic):
      minAic = result.aic
      optP = p
  
  print('optimized P: ', optP)
  model = VAR(dfNorm).fit(optP)
  
  ins = dfNorm.values[-model.k_ar:]
  forecast = model.forecast(y=ins, steps=period)
  dfForecast = pd.DataFrame(forecast, columns=dfNorm.columns)

  dfVarDnorm = (dfForecast+1).mul(dfVar.iloc[0].to_numpy())
  for name in group:
    dfVarDnorm[name] = np.r_[df[group][name].iloc[-1], dfVarDnorm[name]].cumsum()[1:]

  return dfVarDnorm

def runArima(df: pd.DataFrame, target: str, period: int) -> pd.DataFrame:
  auto_model = pm.auto_arima(df[target], seasonal=False, trace=True,
    error_action='ignore', suppress_warnings=True,
    stepwise=True, n_jobs=-1)

  forecast = auto_model.predict(n_periods=period)
  forecast_df = pd.DataFrame({target: forecast})

  return forecast_df

def runRegression(df: pd.DataFrame, targetIndicatorId: str, totalCount:int):
  df = df.iloc[-(totalCount):-1]
  y = df[targetIndicatorId]
  x = df.drop(columns=[targetIndicatorId])

  if len(y)!=len(x) : raise ValueError("가중치를 적용한 값과 VAR 결과 데이터 수가 맞지 않습니다.")

  models: list[RegressionModelAndRsquared] = []

  print('회귀분석 시작 ~ !')
  for column in x.columns:
    xSingle = sm.add_constant(x[column])
    model = sm.OLS(y, xSingle).fit()
    predictions = model.predict(xSingle).tolist()
    rsquared = model.rsquared
    if not isinstance(rsquared, float) or np.isnan(rsquared) or np.isinf(rsquared): rsquared = -100
    rsquared = float(rsquared)
    print(f'{column} 결정계수: {rsquared}, {type(rsquared)}')

    regressionModelAndRsquared = RegressionModelAndRsquared(
            sourceIndicatorId=column, values=predictions, rsquared=rsquared
        )
    models.append(regressionModelAndRsquared)

  sumRsquared = sum([model.rsquared for model in models if model.rsquared >= 0])
  results = []
  rsquaredResults:list[RsquaredResult] = []
  for model in models:
    rsquaredResult= RsquaredResult(id=model.sourceIndicatorId, rsquared=model.rsquared)
    rsquaredResults.append(rsquaredResult)
    if model.rsquared > 0:
      ratio: float = model.rsquared/sumRsquared
      result = [x*ratio for x in model.values]
      results.append(result)
  
  if(len(results)>0):
    sumResults:list[float] = [sum(values) for values in zip(*results)]
  else:
    print("분석된 회귀식의 결정계수가 모두 음수입니다.")
    sumResults = []
  
  return sumResults, rsquaredResults