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
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("FAST_BASE_URL")

def predict(targetIndicatorId:str, targetIndicatorType: str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], weights: list[int], validIndicatorIds: list[str], db: Session) -> ForecastIndicatorDto:
  try:
    if not sourceIndicatorIds and not weights:
      df = preprocessSingleData(targetIndicatorId, targetIndicatorType, db)
      result: ForecastIndicatorDto = {"type": "single", "values": getSingleResult(df, targetIndicatorId)}
      return result
    else:
      noneWeighted = checkWeight(weights)
      df = preprocessMultiData(targetIndicatorId, targetIndicatorType, sourceIndicatorIds, sourceIndicatorsType, db)
      if len(validIndicatorIds) >= 2:
        if targetIndicatorId in validIndicatorIds:
          if noneWeighted == False:
            result: ForecastIndicatorDto = {"type": "multi", "values": getMultiResult(df, validIndicatorIds, targetIndicatorId)}
            return result
          else:
            print('가중치 적용 VAR 분석 시작')
            varResult = getMultiResult(df, validIndicatorIds, targetIndicatorId)
            applyIndicatorsAndWeights = getApplyIndicators(sourceIndicatorIds, weights, validIndicatorIds)
            weightedDf = applyWeight(df, applyIndicatorsAndWeights[0],applyIndicatorsAndWeights[1], len(varResult)+1)
            print('가중치 적용한 데이터프레임 생성 완료')
            weightedMultiValues = getWeightedResult(weightedDf, varResult, targetIndicatorId, len(varResult)+1)
            if len(weightedMultiValues)==0:
              print("가중치를 철회한 VAR")
              return {"type": "multi", "values": varResult}
            result: ForecastIndicatorDto = {"type": "multi", "values": weightedMultiValues}
            return result
        elif targetIndicatorId not in validIndicatorIds:
          result: ForecastIndicatorDto = {"type": "single", "values": getSingleResult(df, targetIndicatorId)}
          return result
      else:
        result: ForecastIndicatorDto = {"type": "single", "values": getSingleResult(df, targetIndicatorId)}
        return result
  except Exception as error:
    print(f'Error: {error}')
    result: ForecastIndicatorDto = {"type": "single", "values": getSingleResult(df, targetIndicatorId)}
    return result
  
def sourceIndicatorsVerification(targetIndicatorId:str, targetIndicatorType:str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], db: Session) ->  SourceIndicatorsVerificationResponse:
  varIndicators: list[IndicatorDto] = []
  sourceIndicatorIds.append(targetIndicatorId)
  sourceIndicatorsType.append(targetIndicatorType)

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    varIndicators.append(getIndicatorDtoFromDB(sourceIndicatorId, sourceIndicatorType, db))
  print(varIndicators)
  
  APIList = []
  startDate = (datetime.datetime.now()-datetime.timedelta(days=80)).strftime("%Y-%m-%d")

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
  
def preprocessMultiData(targetIndicatorId:str, targetIndicatorType: str, sourceIndicatorIds: list[str], sourceIndicatorsType: list[str], db: Session) -> pd.DataFrame:
  varIndicators: list[IndicatorDto] = []
  sourceIndicatorIds.append(targetIndicatorId)
  sourceIndicatorsType.append(targetIndicatorType)

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    varIndicators.append(getIndicatorDtoFromDB(sourceIndicatorId, sourceIndicatorType, db))
  print(varIndicators)
  
  APIList = []
  startDate = (datetime.datetime.now()-datetime.timedelta(days=80)).strftime("%Y-%m-%d")

  for sourceIndicatorId, sourceIndicatorType in zip(sourceIndicatorIds, sourceIndicatorsType):
    APIList.append(getIndicatorValue(sourceIndicatorId, sourceIndicatorType, startDate))

  sourceDataFrames = {}
  for sourceIndicatorId, df in zip(sourceIndicatorIds, APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)
  df_var.columns = [varIndicator.id for varIndicator in varIndicators]
  df_var = replaceNanAndInf(df_var)
  return df_var

def preprocessSingleData(targetIndicatorId:str, targetIndicatorType: str, db: Session) -> pd.DataFrame:
  sourceIndicators: list[IndicatorDto] = []
  sourceIndicators.append(getIndicatorDtoFromDB(targetIndicatorId, targetIndicatorType, db))

  APIList = []
  startDate = (datetime.datetime.now()-datetime.timedelta(days=80)).strftime("%Y-%m-%d")
  
  APIList.append(getIndicatorValue(targetIndicatorId, targetIndicatorType, startDate))
  sourceDataFrames = {}
  for sourceIndicatorId, df in zip([targetIndicatorId], APIList):
    sourceDataFrames[sourceIndicatorId] = df.set_index('date')['value']
  
  df_arima = pd.DataFrame(sourceDataFrames)
  df_arima.columns = [sourceIndicator.id for sourceIndicator in sourceIndicators]
  df_arima = replaceNanAndInf(df_arima)
  return df_arima

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

def getWeightedResult(df: pd.DataFrame, varResult:list, targetIndicatorId: str, totalCount:int):
  regressionData:list = forecast.runRegression(df, targetIndicatorId, totalCount)[0]
  if len(regressionData) == 0: return []

  varValueData = [fv.value for fv in varResult]
  if len(regressionData) != len(varValueData): raise ValueError("VAR 칼럼과 회귀분석 결과 칼럼의 길이가 맞지 않습니다.")

  weightedValuesWithoutDates = [0.5 * (reg + var) for reg, var in zip(regressionData, varValueData)]
  values = []
  currentDate = datetime.datetime.now()
  for i in range(len(weightedValuesWithoutDates)):
    forecastDate = (currentDate + datetime.timedelta(days=i)).strftime("%Y%m%d")
    forecastValue = ForecastValue(value=weightedValuesWithoutDates[i], date = forecastDate)
    values.append(forecastValue)
  print("가중치가 적용된 VAR")
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

def applyWeight(df: pd.DataFrame, applyIndicators:list[str], weights: list[int], totalCount: int):
    if not weights or len(applyIndicators) != len(weights):
      print('가중치 적용 지표와 입력된 가중치가 일치하지 않습니다.')
      return df
    else:
      newData = pd.DataFrame(columns=df.columns)
      for i in range(totalCount):
        newRow = df.iloc[-1].copy()
        for applyIndicator, weight in zip(applyIndicators, weights):
            theta = weight / 1000
            base = df[applyIndicator].iloc[-1]
            newRow[applyIndicator] = base * (1 + theta) ** (i + 1)
        newData = pd.concat([newData, newRow.to_frame().T], ignore_index=True)

    df = pd.concat([df, newData], ignore_index=True)
    print('가중치 적용 완료')
    return df

def getApplyIndicators(sourceIndicatorIds: list[str], weights: list[int], validIndicatorIds: list[str]):
  validIndicators = []
  validWeights = []
  for sourceIndicatorId, weight in zip(sourceIndicatorIds, weights):
    if sourceIndicatorId in validIndicatorIds:
      validIndicators.append(sourceIndicatorId)
      validWeights.append(weight)
  applyIndicators = []
  applyWeights = []
  for validIndicator, validWeight in zip(validIndicators, validWeights):
    if validWeight != 0:
      applyIndicators.append(validIndicator)
      applyWeights.append(validWeight)
  return applyIndicators, applyWeights

def checkWeight(weights: list[int]) -> bool:
  cnt = 0
  for weight in weights:
    if weight == 0: cnt+=1
  
  if cnt == len(weights) and sum(weights) == 0:
    return False