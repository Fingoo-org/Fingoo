from fastapi import HTTPException, Query
from fastapi import FastAPI
from service import predict, sourceIndicatorsVerification
from database import engine, Base, get_db

Base.metadata.create_all(bind=engine) 

app = FastAPI()
@app.get("/")
def hello() :
	return "Hello, Fingoo!"

@app.get("/api/var-api/custom-forecast-indicator/")
def loadPredictedIndicator(
    targetIndicatorId: str = Query(...),
    sourceIndicatorId: list[str] = Query(...),
    weight: list[int] = Query(...),
    ):
	
    prediction = predict(targetIndicatorId, sourceIndicatorId, weight, get_db())
    if not prediction:
        raise HTTPException(status_code=404, detail="No indicators found")
    return prediction

@app.get("/api/var-api/source-indicators-verification/")
def loadSourceIndicatorsVerification(
    targetIndicatorId: str = Query(...),
    sourceIndicatorId: list[str] = Query(...),
    weight: list[int] = Query(...),
    ):
	verificaion = sourceIndicatorsVerification(targetIndicatorId, sourceIndicatorId, weight, get_db())
	return verificaion