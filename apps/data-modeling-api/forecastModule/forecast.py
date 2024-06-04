from statsmodels.tsa.api import VAR
from statsmodels.tsa.arima.model import ARIMA
from verificationModule import verification
import pandas as pd
import numpy as np
import pmdarima as pm

def runVar(df: pd.DataFrame, group: list[str], period: int) -> pd.DataFrame:
  df = df.bfill()

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
  df = df.bfill()
  
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
  df = df.bfill()
    
  auto_model = pm.auto_arima(df[target], seasonal=False, trace=True,
    error_action='ignore', suppress_warnings=True,
    stepwise=True, n_jobs=-1)

  best_order = auto_model.order

  return best_order