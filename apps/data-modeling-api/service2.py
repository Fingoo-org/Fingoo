from fastapi import Response
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
    varIndicators.append(getIndicatorDtoFromDB(sourceIndicatorId, sourceIndicatorType, db))
  print(varIndicators)
  
  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)
  startDate = (datetime.datetime.now()-datetime.timedelta(days=30)).strftime("%Y-%m-%d")

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    APIList.append(getIndicatorValue(sourceIndicatorId, sourceIndicatorType, startDate))

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip(sourceIndicatorIds, APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)
  df_var.columns = [varIndicator.id for varIndicator in varIndicators]
  df_var = replaceNanAndInf(df_var)
  
  

def sourceIndicatorsVerification2(targetIndicatorId:str, targetIndicatorType:str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], weights: list[float], db: Session) ->  SourceIndicatorsVerificationResponse:
  varIndicators: list[IndicatorDto] = []
  sourceIndicatorIds.append(targetIndicatorId)
  sourceIndicatorsType.append(targetIndicatorType)

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    varIndicators.append(getIndicatorDtoFromDB(sourceIndicatorId, sourceIndicatorType, db))
  print(varIndicators)
  
  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)
  startDate = (datetime.datetime.now()-datetime.timedelta(days=30)).strftime("%Y-%m-%d")

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    APIList.append(getIndicatorValue(sourceIndicatorId, sourceIndicatorType, startDate))

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip(sourceIndicatorIds, APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)
  df_var.columns = [varIndicator.id for varIndicator in varIndicators]
  df_var = replaceNanAndInf(df_var)

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
      "grangerGroup": getFalseVerificationResult(varIndicators),
      "cointJohansenVerification": getFalseVerificationResult(varIndicators)
    }
    return sourceIndicatorsVerification
  
  # Source Indicators Verification Response 객체 생성 (공적분 검정은 일단 사용하지 않으므로, false)
  sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
    "grangerGroup": grangerVerificationResult,
    "cointJohansenVerification": getFalseVerificationResult(varIndicators) #cointJohansenVerificationResult
  }
  return sourceIndicatorsVerification

def getSingleResult(df: pd.DataFrame, targetIndicatorId: str):
  print('ARIMA')
  customForecastIndicator = forecast.runArima(df, targetIndicatorId, int(len(df)/2))
  forecastdata = customForecastIndicator[targetIndicatorId].to_dict()
  forecastValuesWithoutDates = list(forecastdata.values())
  values = []
  currentDate = datetime.datetime.now()
  for i in range(len(forecastValuesWithoutDates)):
    forecastDate = (currentDate + datetime.timedelta(days=i)).strftime("%Y%m%d")
    forecastValue = ForecastValue(value=forecastValuesWithoutDates[i], date=forecastDate)
    values.append(forecastValue)
  return values

def getMultiResult(df: pd.DataFrame, validIndicatorIds: list[str], targetIndicatorId: str):
  print('VAR')
  customForecastIndicator = forecast.runVar(df, validIndicatorIds, int(len(df)/2))
  for id in validIndicatorIds:
    if id == targetIndicatorId:
      forecastdata = customForecastIndicator[id].to_dict()
      forecastValuesWithoutDates = list(forecastdata.values())
      values = []
      currentDate = datetime.datetime.now()
      for i in range(len(forecastValuesWithoutDates)):
        forecastDate = (currentDate + datetime.timedelta(days=i)).strftime("%Y%m%d")
        forecastValue = ForecastValue(value=forecastValuesWithoutDates[i], date= forecastDate)
        values.append(forecastValue)
      return values

def getIndicatorValue(indicatorId:str, indicatorType: str, startDate:str) -> pd.DataFrame:
  req = requests.get(f'http://{BASE_URL}?indicatorId={indicatorId}&interval=day&indicatorType={indicatorType}&startDate={startDate}')
  data = req.json()
  print(data)
  values = data['values']
  df = pd.DataFrame(values)
  df['date'] = pd.to_datetime(df['date'])
  df['value'] = df['value'].astype(float)
  return df

def getIndicatorDtoFromDB(indicatorId:str, indicatorType: str, db: Session) -> IndicatorDto:
  if indicatorType == 'forex_pairs' or indicatorType == 'cryptocurrencies':
    query = text(f"SELECT id, symbol FROM public.{indicatorType} WHERE id = '{indicatorId}'")
    result = db.execute(query).fetchone()
    if result:
      return IndicatorDto(id=str(result[0]), name='currency_base', ticker=result[1])
  else:
    query = text(f"SELECT id, name, symbol FROM public.{indicatorType} WHERE id = '{indicatorId}'")
    result = db.execute(query).fetchone()
    if result:
      return IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
    
def replaceNanAndInf(df: pd.DataFrame):
  df.fillna(method='ffill', inplace=True)
  df.replace([np.inf, -np.inf], np.nan, inplace=True)
  df.fillna(df.max(), inplace=True)
  return df

def getFalseVerificationResult(varIndicators: list[str]):
  falseResult:list[Verification] = []
  for varIndicator in varIndicators:
    ver: Verification = {"indicatorId": varIndicator.id, "verification": "False"}
    falseResult.append(ver)
  return falseResult