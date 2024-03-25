from pydantic import BaseModel

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
    values: list[ForecastValue]

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