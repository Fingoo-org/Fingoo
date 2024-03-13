from pydantic import BaseModel
import requests
import pandas as pd

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
    name: str
    values: list[ForecastValue]
    
class SourceIndicatorsVerificationResponse(BaseModel):
    grangerVerification: list[str]
    cointJohansenVerification: list[str]

class SourceIndicatorIdAndWeight(BaseModel):
    sourceIndicatorId: str
    weight: float
    
class SourceIndicatorIdAndWeightList(BaseModel):
    indicators: list[SourceIndicatorIdAndWeight]