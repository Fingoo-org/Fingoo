from pydantic import BaseModel
from typing import Union

class RsquaredResult(BaseModel):
    id: str
    rsquared: Union[float, str]

class IndicatorDto(BaseModel):
    id: str
    name: str
    ticker: str

class ForecastValue(BaseModel):
    value: float
    date: str
    def createNew(self, value, date):
        self.value = value
        self.date = date

class ForecastIndicatorDto(BaseModel):
    type: str
    values: list[ForecastValue]
    rsquaredResults: list[RsquaredResult]

class Verification(BaseModel):
    indicatorId: str
    verification: str
    
class SourceIndicatorsVerificationResponse(BaseModel):
    grangerVerification: list[Verification]
    cointJohansenVerification: list[Verification]

class SourceIndicatorIdAndWeight(BaseModel):
    sourceIndicatorId: str
    weight: float
    
class SourceIndicatorIdAndWeightList(BaseModel):
    indicators: list[SourceIndicatorIdAndWeight]

class RegressionModelAndRsquared(BaseModel):
    sourceIndicatorId: str
    values: list[float]
    rsquared: Union[float, str]