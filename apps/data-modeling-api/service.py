import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import text
from dtos import IndicatorDto, ForecastIndicatorDto, SourceIndicatorsVerificationResponse, ForecastValue, Verification
import pandas as pd
from verificationModule import verification
from forecastModule import forecast
import datetime
import requests
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("FAST_BASE_URL")

def predict(targetIndicatorId:str, targetIndicatorType: str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], weights: list[int], validIndicatorId: list[str], db: Session) -> ForecastIndicatorDto:
  varIndicators: list[IndicatorDto] = []
  sourceIndicatorIds.append(targetIndicatorId)
  sourceIndicatorsType.append(targetIndicatorType)

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    if sourceIndicatorType == 'forex_pairs' or sourceIndicatorType == 'cryptocurrencies':
      query = text(f"SELECT id, symbol FROM public.{sourceIndicatorType} WHERE id = '{sourceIndicatorId}'")
      result = db.execute(query).fetchone()
      if result:
        indicatorDto = IndicatorDto(id=str(result[0]), name='currency_base', ticker=result[1])
    else:
      query = text(f"SELECT id, name, symbol FROM public.{sourceIndicatorType} WHERE id = '{sourceIndicatorId}'")
      result = db.execute(query).fetchone()
      if result:
        indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
    varIndicators.append(indicatorDto)

  print(varIndicators)

  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)

  startDate = (datetime.datetime.now()-datetime.timedelta(days=30)).strftime("%Y-%m-%d")

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    req = requests.get(f'http://{BASE_URL}?indicatorId={sourceIndicatorId}&interval=day&indicatorType={sourceIndicatorType}&startDate={startDate}')
    data = req.json()
    print(data)
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip(sourceIndicatorIds, APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [varIndicator.id for varIndicator in varIndicators]

  df_var = replaceNanAndInf(df_var)
  
  # weights.append(0)
  # for indicator, weight in zip(df_var, weights):
  #   weight = int(weight)
  #   df_var = verification.applyWeight(df_var, indicator, weight)

  try:
    if len(validIndicatorId) >= 2:
      if targetIndicatorId in validIndicatorId:
        print('Var')
        customForecastIndicator = forecast.runVar(df_var, validIndicatorId, int(len(df_var)/2))
        for id in validIndicatorId:
          if id == targetIndicatorId:
            forecastdata = customForecastIndicator[id].to_dict()
            forecastValuesWithoutDates = list(forecastdata.values())
            values = []
            currentDate = datetime.datetime.now()
            for i in range(len(forecastValuesWithoutDates)):
              forecastDate = (currentDate + datetime.timedelta(days=i)).strftime("%Y%m%d")
              forecastValue = ForecastValue(
                value = forecastValuesWithoutDates[i],
                date = forecastDate
              )
              values.append(forecastValue)
            result: ForecastIndicatorDto = {
              "type": "multi",
              "values": values
              }
        return result
      elif targetIndicatorId not in validIndicatorId:
        return predictWithoutTargetIndicator(targetIndicatorId, targetIndicatorType, db)
    else:
      return predictWithoutTargetIndicator(targetIndicatorId, targetIndicatorType, db)
  except Exception as error:
    print(f'Error: {error}')
    # arima
    return predictWithoutTargetIndicator(targetIndicatorId, targetIndicatorType, db)
  
def predictWithoutTargetIndicator(targetIndicatorId:str, targetIndicatorType:str, db: Session) -> ForecastIndicatorDto:
  sourceIndicators: list[IndicatorDto] = []
  if targetIndicatorType == 'forex_pairs' or targetIndicatorType == 'cryptocurrencies':
    query = text(f"SELECT id, symbol FROM public.{targetIndicatorType} WHERE id = '{targetIndicatorId}'")
    result = db.execute(query).fetchone()
    if result:
      indicatorDto = IndicatorDto(id=str(result[0]), name='currency_base', ticker=result[1])
  else:
    query = text(f"SELECT id, name, symbol FROM public.{targetIndicatorType} WHERE id = '{targetIndicatorId}'")
    result = db.execute(query).fetchone()
    if result:
      indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
  sourceIndicators.append(indicatorDto)

  # nameList = []
  # for sourceIndicator in sourceIndicators:
  #   nameList.append(sourceIndicator.name)

  for sourceIndicator in sourceIndicators:
    if sourceIndicator.id == targetIndicatorId:
      targetIndicatorName = sourceIndicator.name

  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)

  startDate = (datetime.datetime.now()-datetime.timedelta(days=30)).strftime("%Y-%m-%d")
  targetIndicatorReq = requests.get(f'http://{BASE_URL}?indicatorId={targetIndicatorId}&interval=day&indicatorType={targetIndicatorType}&startDate={startDate}')
  targetIndicatorData = targetIndicatorReq.json()
  targetIndicatorValues = targetIndicatorData['values']
  targetIndicatorDf = pd.DataFrame(targetIndicatorValues)
  targetIndicatorDf['date'] = pd.to_datetime(targetIndicatorDf['date'])
  targetIndicatorDf['value'] = targetIndicatorDf['value'].astype(float)
  APIList.append(targetIndicatorDf)

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip([targetIndicatorId], APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_arima = pd.DataFrame(sourceDataFrames)

  df_arima.columns = [sourceIndicator.name for sourceIndicator in sourceIndicators]
  
  # weights = []
  # weights.append(0)
  # for indicator, weight in zip(df_arima, weights):
  #   weight = int(weight)
  #   df_arima = verification.applyWeight(df_arima, indicator, weight)

  print('Arima')
  customForecastIndicator = forecast.runArima(df_arima, targetIndicatorName, int(len(df_arima)/2))
  forecastdata = customForecastIndicator[targetIndicatorName].to_dict()
  forecastValuesWithoutDates = list(forecastdata.values())
  values = []
  currentDate = datetime.datetime.now()
  for i in range(len(forecastValuesWithoutDates)):
    forecastDate = (currentDate + datetime.timedelta(days=i)).strftime("%Y%m%d")
    forecastValue = ForecastValue(
      value = forecastValuesWithoutDates[i],
      date = forecastDate
    )
    values.append(forecastValue)
  result: ForecastIndicatorDto = {
    "type": "single",
    "values": values
  }

  return result

def sourceIndicatorsVerification(targetIndicatorId:str, targetIndicatorType:str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], weights: list[float], db: Session) ->  SourceIndicatorsVerificationResponse:
# 데이터베이스로부터 Indicator 정보 가져오기
  varIndicators: list[IndicatorDto] = []

  # 재료 지표에 targetIndicator와 type 포함(var 관점에서는 재료지표와 타겟 지표가 모두 있어야 함)
  sourceIndicatorIds.append(targetIndicatorId)
  sourceIndicatorsType.append(targetIndicatorType)

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    if sourceIndicatorType == 'forex_pairs' or sourceIndicatorType == 'cryptocurrencies':
      query = text(f"SELECT id, symbol FROM public.{sourceIndicatorType} WHERE id = '{sourceIndicatorId}'")
      result = db.execute(query).fetchone()
      if result:
        indicatorDto = IndicatorDto(id=str(result[0]), name='currency_base', ticker=result[1])
    else:
      query = text(f"SELECT id, name, symbol FROM public.{sourceIndicatorType} WHERE id = '{sourceIndicatorId}'")
      result = db.execute(query).fetchone()
      if result:
        indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
    varIndicators.append(indicatorDto)

  print(varIndicators)
  
  nameList = []
  for varIndicator in varIndicators:
    nameList.append(varIndicator.name)

  for varIndicator in varIndicators:
    if varIndicator.id == targetIndicatorId:
      targetIndicatorName = varIndicator.name

  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)

  startDate = (datetime.datetime.now()-datetime.timedelta(days=30)).strftime("%Y-%m-%d")

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    req = requests.get(f'http://{BASE_URL}?indicatorId={sourceIndicatorId}&interval=day&indicatorType={sourceIndicatorType}&startDate={startDate}')
    data = req.json()
    print(data)
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip(sourceIndicatorIds, APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [varIndicator.id for varIndicator in varIndicators]

  df_var = replaceNanAndInf(df_var)
  
  # weights.append(0)
  # for indicator, weight in zip(df_var, weights):
  #   weight = int(weight)
  #   df_var = verification.applyWeight(df_var, indicator, weight)

  falseResult:list[Verification] = []
  for varIndicator in varIndicators:
    ver: Verification = {"indicatorId": varIndicator.id, "verification": "False"}
    falseResult.append(ver)

  # granger
  try: 
    grangerDf = verification.grangerVerification(df_var)
    checkDf = verification.findSignificantValues(grangerDf)
    grangerGroup = verification.findInfluentialGroups(checkDf)
    print(f'Var Group: {grangerGroup}')
    grangerVerificationResult:list[Verification] = []
    for varIndicator in varIndicators:
      if varIndicator.id in grangerGroup:
        ver: Verification = {"indicatorId": varIndicator.id, "verification": "True"}
      else:
        ver: Verification = {"indicatorId": varIndicator.id, "verification": "False"}
      grangerVerificationResult.append(ver)
  except Exception:
    sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
      "grangerGroup": falseResult,
      "cointJohansenVerification": falseResult
    }
    return sourceIndicatorsVerification

  # coint jojansen
  # try:
  #   grangerDf = verification.grangerVerification(df_var)
  #   checkDf = verification.findSignificantValues(grangerDf)
  #   grangerGroup = verification.findInfluentialGroups(checkDf)
  #   cointJohansenVerificationResult: list[Verification] = []
  #   cointJohansenVerification = verification.cointJohansenVerification(df_var, grangerGroup)
  #   cointJohansenVerificationList = [str(item) for item in cointJohansenVerification]
  #   for varIndicator in varIndicators:
  #     if varIndicator.id in cointJohansenVerificationList:
  #       ver: Verification = {'indicatorId': varIndicator.id, 'verification': 'True'}
  #     else:
  #       ver: Verification = {'indicatorId': varIndicator.id, 'verification': 'False'}
  #     cointJohansenVerificationResult.append(ver)
  # except Exception:
  #   sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
  #     "grangerGroup": grangerVerificationResult,
  #     "cointJohansenVerification": falseResult
  #   }
  #   return sourceIndicatorsVerification
  
  # Source Indicators Verification Response 객체 생성 (공적분 검정은 일단 사용하지 않으므로, false)
  sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
    "grangerGroup": grangerVerificationResult,
    "cointJohansenVerification": falseResult #cointJohansenVerificationResult
  }
  return sourceIndicatorsVerification

def replaceNanAndInf(df: pd.DataFrame):
  df.fillna(method='ffill', inplace=True)
  df.replace([np.inf, -np.inf], np.nan, inplace=True)
  df.fillna(df.max(), inplace=True)
  return df