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

def predict(targetIndicatorId:str, sourceIndicatorIds: list[str], weights: list[int], db: Session) -> ForecastIndicatorDto:
  # 데이터베이스로부터 Indicator 정보 가져오기
  varIndicators: list[IndicatorDto] = []
  # 재료 지표에 타겟 인디케이터 포함(var 관점에서는 재료지표와 타겟 지표가 모두 있어야 함)
  sourceIndicatorIds.append(targetIndicatorId)
  for sourceIndicatorId in sourceIndicatorIds:
    # 직접 SQL 쿼리를 사용하여 Indicator 데이터를 가져옴
    query = text(f"SELECT id, name, ticker FROM public.indicator WHERE id = '{sourceIndicatorId}'")
    result = db.execute(query).fetchone()

    if result:
      # 쿼리 결과를 IndicatorDto로 변환하여 리스트에 추가
      indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
      varIndicators.append(indicatorDto)
  
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

  for sourceIndicatorId in sourceIndicatorIds:
    req = requests.get(f'http://{BASE_URL}?interval=day&indicatorId={sourceIndicatorId}')
    data = req.json()
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  targetIndicatorReq = requests.get(f'http://{BASE_URL}?interval=day&indicatorId={targetIndicatorId}')
  targetIndicatorData = targetIndicatorReq.json()
  targetIndicatorValues = targetIndicatorData['values']
  targetIndicatorDf = pd.DataFrame(targetIndicatorValues)
  targetIndicatorDf['date'] = pd.to_datetime(df['date'])
  targetIndicatorDf['value'] = targetIndicatorDf['value'].astype(float)
  APIList.append(targetIndicatorDf)

  sourceDataFrames = {}
  for name, df in zip(nameList, APIList):
    sourceDataFrames[name] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [varIndicator.name for varIndicator in varIndicators]
  
  weights.append(0)
  for indicator, weight in zip(df_var, weights):
    weight = int(weight)
    df_var = verification.applyWeight(df_var, indicator, weight)
            
  # granger
  grangerDf = verification.grangerVerification(df_var)
  checkDf = verification.findSignificantValues(grangerDf)
  grangerGroup = verification.findInfluentialGroups(checkDf)

  # var
  try: 
    if len(grangerGroup) >= 2:
      print('Var')
      customForecastIndicator = forecast.runVar(df_var, grangerGroup, int(len(df_var)/2))
      for name in grangerGroup:
        if name == targetIndicatorName:
          forecastdata = customForecastIndicator[name].to_dict()
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
    else:
      return predictWithoutTargetIndicator(targetIndicatorId, db)
  except Exception as error:
    print(f'Error: {error}')
    # arima
    return predictWithoutTargetIndicator(targetIndicatorId, db)
  
def predictWithoutTargetIndicator(targetIndicatorId:str, db: Session) -> ForecastIndicatorDto:
  findTargetIndicatorQuery = text(f"SELECT id, name, ticker FROM public.indicator WHERE id = '{targetIndicatorId}'")

  sourceIndicators: list[IndicatorDto] = []

  findTargetIndicatorResult = db.execute(findTargetIndicatorQuery).fetchone()
  if findTargetIndicatorResult:
    targetIndicatorDto = IndicatorDto(id=str(findTargetIndicatorResult[0]), name=findTargetIndicatorResult[1], ticker=findTargetIndicatorResult[2])
    sourceIndicators.append(targetIndicatorDto)

  nameList = []
  for sourceIndicator in sourceIndicators:
    nameList.append(sourceIndicator.name)

  for sourceIndicator in sourceIndicators:
    if sourceIndicator.id == targetIndicatorId:
      targetIndicatorName = sourceIndicator.name

  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)

  targetIndicatorReq = requests.get(f'http://{BASE_URL}?interval=day&indicatorId={targetIndicatorId}')
  targetIndicatorData = targetIndicatorReq.json()
  targetIndicatorValues = targetIndicatorData['values']
  targetIndicatorDf = pd.DataFrame(targetIndicatorValues)
  targetIndicatorDf['date'] = pd.to_datetime(targetIndicatorDf['date'])
  targetIndicatorDf['value'] = targetIndicatorDf['value'].astype(float)
  APIList.append(targetIndicatorDf)

  sourceDataFrames = {}
  for name, df in zip(nameList, APIList):
    sourceDataFrames[name] = df.set_index('date')['value']

  df_arima = pd.DataFrame(sourceDataFrames)

  df_arima.columns = [sourceIndicator.name for sourceIndicator in sourceIndicators]
  
  weights = []
  weights.append(0)
  for indicator, weight in zip(df_arima, weights):
    weight = int(weight)
    df_arima = verification.applyWeight(df_arima, indicator, weight)

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

def sourceIndicatorsVerification(targetIndicatorId:str, sourceIndicatorIds: list[str], weights: list[float], db: Session) ->  SourceIndicatorsVerificationResponse:
  # 데이터베이스로부터 Indicator 정보 가져오기
  varIndicators: list[IndicatorDto] = []
  sourceIndicatorIds.append(targetIndicatorId)
  for sourceIndicatorId in sourceIndicatorIds:
    # 직접 SQL 쿼리를 사용하여 Indicator 데이터를 가져옴
    query = text(f"SELECT id, name, ticker FROM public.indicator WHERE id = '{sourceIndicatorId}'")
    result = db.execute(query).fetchone()

    if result:
      # 쿼리 결과를 IndicatorDto로 변환하여 리스트에 추가
      indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
      varIndicators.append(indicatorDto)
  
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

  for sourceIndicatorId in sourceIndicatorIds:
    req = requests.get(f'http://{BASE_URL}?interval=day&indicatorId={sourceIndicatorId}')
    data = req.json()
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  targetIndicatorReq = requests.get(f'http://{BASE_URL}?interval=day&indicatorId={targetIndicatorId}')
  targetIndicatorData = targetIndicatorReq.json()
  targetIndicatorValues = targetIndicatorData['values']
  targetIndicatorDf = pd.DataFrame(targetIndicatorValues)
  targetIndicatorDf['date'] = pd.to_datetime(df['date'])
  targetIndicatorDf['value'] = targetIndicatorDf['value'].astype(float)
  APIList.append(targetIndicatorDf)

  sourceDataFrames = {}
  for name, df in zip(nameList, APIList):
    sourceDataFrames[name] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [varIndicator.name for varIndicator in varIndicators]
  df_var = df_var.fillna(method='backfill')
  
  weights.append(0)
  for indicator, weight in zip(df_var, weights):
    weight = int(weight)
    df_var = verification.applyWeight(df_var, indicator, weight)
            
  # granger
  grangerDf = verification.grangerVerification(df_var)
  checkDf = verification.findSignificantValues(grangerDf)
  grangerGroup = verification.findInfluentialGroups(checkDf)

  # granger
  try: 
    grangerDf = verification.grangerVerification(df_var)
    checkDf = verification.findSignificantValues(grangerDf)
    grangerGroup = verification.findInfluentialGroups(checkDf)
    print(f'Var Group: {grangerGroup}')
    grangerVerificationResult:list[Verification] = []
    for varIndicator in varIndicators:
      if varIndicator.name in grangerGroup:
        ver: Verification = {"indicatorId": varIndicator.id, "verification": "True"}
      else:
        ver: Verification = {"indicatorId": varIndicator.id, "verification": "False"}
      grangerVerificationResult.append(ver)
  except Exception:
    sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
      "grangerGroup": ['granger 검정 결과 데이터간 연관성을 확인할 수 없습니다.'],
      "cointJohansenVerification": ['공적분 결과 데이터간 연관성을 확인할 수 없습니다.']
    }

  # coint jojansen
  try:
    cointJohansenVerificationResult: list[Verification] = []
    cointJohansenVerification = verification.cointJohansenVerification(df_var, grangerGroup)
    cointJohansenVerificationList = [str(item) for item in cointJohansenVerification]
    for varIndicator in varIndicators:
      if varIndicator.name in cointJohansenVerificationList:
        ver: Verification = {'indicatorId': varIndicator.id, 'verification': 'True'}
      else:
        ver: Verification = {'indicatorId': varIndicator.id, 'verification': 'False'}
      cointJohansenVerificationResult.append(ver)
  except Exception:
    sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
      "grangerGroup": grangerVerificationResult,
      "cointJohansenVerification": ['공적분 결과 데이터간 연관성을 확인할 수 없습니다.']
    }
  
  # Source Indicators Verification Response 객체 생성
  sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
    "grangerGroup": grangerVerificationResult,
    "cointJohansenVerification": cointJohansenVerificationResult
  }
  return sourceIndicatorsVerification