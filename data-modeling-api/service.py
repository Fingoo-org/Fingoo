from sqlalchemy.orm import Session
from sqlalchemy import text
from dtos import IndicatorDto, ForecastIndicatorDto, SourceIndicatorsVerificationResponse, ForecastValue
import pandas as pd
from verificationModule import verification
from forecastModule import forecast
import datetime
import requests
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

def predict(targetIndicatorId:str, sourceIndicatorIds: list[str], weights: list[str], db: Session) -> ForecastIndicatorDto:
  # 데이터베이스로부터 Indicator 정보 가져오기
  sourceIndicators: list[IndicatorDto] = []
  for sourceIndicatorId in sourceIndicatorIds:
    # 직접 SQL 쿼리를 사용하여 Indicator 데이터를 가져옴
    query = text(f"SELECT id, name, ticker FROM public.indicator WHERE id = '{sourceIndicatorId}'")
    result = db.execute(query).fetchone()

    if result:
      # 쿼리 결과를 IndicatorDto로 변환하여 리스트에 추가
      indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
      sourceIndicators.append(indicatorDto)

  nameList = []
  for sourceIndicator in sourceIndicators:
    nameList.append(sourceIndicator.name)
  print(nameList)
  for sourceIndicator in sourceIndicators:
    if sourceIndicator.id == targetIndicatorId:
      targetIndicatorName = sourceIndicator.name

  #데이터 받아오기 -> nest: request(interval(day), indicatorId)
  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)
  for sourceIndicator in sourceIndicatorIds:
    req = requests.get(f'http://host.docker.internal:8000/api/numerical-guidance/indicators/live?interval=day&indicatorId={sourceIndicator}')
    data = req.json()
    print(data['values'])
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  sourceDataFrames = {}
  for name, df in zip(nameList, APIList):
    sourceDataFrames[name] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [sourceIndicator.name for sourceIndicator in sourceIndicators]
  df_var = df_var.dropna()

  for indicator, weight in zip(df_var, weights):
    if weight != 'none':
      parts = weight.split('/')
      theta = float(parts[0])
      totalCount = int(parts[1])
      df_var = verification.applyWeight(df_var, indicator, totalCount, theta)
            
  # granger
  grangerDf = verification.grangerVerification(df_var)
  checkDf = verification.findSignificantValues(grangerDf)
  grangerGroup = verification.findInfluentialGroups(checkDf)

  # var
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
        "name": name,
        "values": values
        }
  return result


def sourceIndicatorsVerification(targetIndicatorId:str, sourceIndicatorIds: list[str], weights: list[str], db: Session) ->  SourceIndicatorsVerificationResponse:
  # 데이터베이스로부터 Indicator 정보 가져오기
  sourceIndicators: list[IndicatorDto] = []
  for sourceIndicatorId in sourceIndicatorIds:
    # 직접 SQL 쿼리를 사용하여 Indicator 데이터를 가져옴
    query = text(f"SELECT id, name, ticker FROM public.indicator WHERE id = '{sourceIndicatorId}'")
    result = db.execute(query).fetchone()

    if result:
      # 쿼리 결과를 IndicatorDto로 변환하여 리스트에 추가
      indicatorDto = IndicatorDto(id=str(result[0]), name=result[1], ticker=result[2])
      sourceIndicators.append(indicatorDto)

  nameList = []
  for sourceIndicator in sourceIndicators:
    nameList.append(sourceIndicator.name)

  for sourceIndicator in sourceIndicators:
    if sourceIndicator.id == targetIndicatorId:
      targetIndicatorName = sourceIndicator.name

  #데이터 받아오기 -> nest: request(interval(day), indicatorId)
  APIList = []
  session = requests.Session()
  retry = Retry(connect=10, backoff_factor=1)
  adapter = HTTPAdapter(max_retries=retry)
  session.mount('http://', adapter)
  for sourceIndicator in sourceIndicatorIds:
    req = requests.get(f'http://host.docker.internal:8000/api/numerical-guidance/indicators/live?interval=day&indicatorId={sourceIndicator}')
    data = req.json()
    print(data['values'])
    values = data['values']
    df = pd.DataFrame(values)

    df['date'] = pd.to_datetime(df['date'])
    df['value'] = df['value'].astype(float)
    APIList.append(df)

  sourceDataFrames = {}
  for name, df in zip(nameList, APIList):
    sourceDataFrames[name] = df.set_index('date')['value']

  df_var = pd.DataFrame(sourceDataFrames)

  df_var.columns = [sourceIndicator.name for sourceIndicator in sourceIndicators]
  df_var = df_var.dropna()

  for indicator, weight in zip(df_var, weights):
    if weight != 'none':
      parts = weight.split('/')
      theta = float(parts[0])
      totalCount = int(parts[1])
      df_var = verification.applyWeight(df_var, indicator, totalCount, theta)
            
  # granger
  try: 
    grangerDf = verification.grangerVerification(df_var)
    checkDf = verification.findSignificantValues(grangerDf)
    grangerGroup = verification.findInfluentialGroups(checkDf)
  except Exception:
    sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
      "grangerGroup": ['granger 검정 결과 데이터간 연관성을 확인할 수 없습니다.'],
      "cointJohansenVerification": ['공적분 결과 데이터간 연관성을 확인할 수 없습니다.']
    }
    return sourceIndicatorsVerification

  # coint jojansen
  try:
    cointJohansenVerification = verification.cointJohansenVerification(df_var, grangerGroup)
    cointJohansenVerificationList = [str(item) for item in cointJohansenVerification]
  except Exception:
    sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
      "grangerGroup": grangerGroup,
      "cointJohansenVerification": ['공적분 결과 데이터간 연관성을 확인할 수 없습니다.']
    }
    return sourceIndicatorsVerification
  
  # Source Indicators Verification Response 객체 생성
  sourceIndicatorsVerification: SourceIndicatorsVerificationResponse = {
    "grangerGroup": grangerGroup,
    "cointJohansenVerification": cointJohansenVerificationList
  }
  return sourceIndicatorsVerification