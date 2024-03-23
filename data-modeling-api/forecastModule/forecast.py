from statsmodels.tsa.api import VAR
from statsmodels.tsa.arima.model import ARIMA
from verificationModule import verification
import pandas as pd
import numpy as np

def runVar(df: pd.DataFrame, group: list[str], period: int) -> pd.DataFrame:
  df = df.fillna(method='ffill')

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
  df = df.fillna(method='ffill')

  if verification.getADFDataFrame(df[target])['Data']['p_value'] >= 0.05:
    df[target] = df[target].diff().bfill()

  model = ARIMA(df[target], order=(1, 0, 1))
  fitted_model = model.fit()

  forecast = fitted_model.forecast(steps=period)
  forecast_df = pd.DataFrame({target: forecast})

  return forecast_df
  