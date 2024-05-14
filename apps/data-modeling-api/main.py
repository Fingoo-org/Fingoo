from fastapi import HTTPException, Query
from fastapi import FastAPI
from service import predict, sourceIndicatorsVerification, predictWithoutTargetIndicator
from database import engine, Base, get_db

Base.metadata.create_all(bind=engine) 

app = FastAPI()
@app.get("/")
def hello() :
	return "Hello, Fingoo!"

@app.get("/api/var-api/custom-forecast-indicator/")
def loadPredictedIndicator(
    targetIndicatorId: str = Query(...),
    targetIndicatorType: str = Query(...),
    sourceIndicatorId: list[str] = Query(default = None),
    sourceIndicatorType: list[str] = Query(default = None),
    weight: list[int] = Query(default = None),
    ):
	
    if not sourceIndicatorId and not weight:
        prediction = predictWithoutTargetIndicator(targetIndicatorId, targetIndicatorType, get_db())
    else:
        prediction = predict(targetIndicatorId, targetIndicatorType, sourceIndicatorId, sourceIndicatorType, weight, get_db())

    return prediction

@app.get("/api/var-api/source-indicators-verification/")
def loadSourceIndicatorsVerification(
    targetIndicatorId: str = Query(...),
    targetIndicatorType: str = Query(...),
    sourceIndicatorId: list[str] = Query(default = None),
    sourceIndicatorType: list[str] = Query(default = None),
    weight: list[int] = Query(default = None),
    ):
	verificaion = sourceIndicatorsVerification(targetIndicatorId, targetIndicatorType, sourceIndicatorId, sourceIndicatorType, weight, get_db())
	return verificaion