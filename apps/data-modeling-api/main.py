from fastapi import Depends, HTTPException, Query
from fastapi import FastAPI
from service import sourceIndicatorsVerification, predict
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from mangum import Mangum

Base.metadata.create_all(bind=engine) 

app = FastAPI()
@app.get("/")
def hello() :
	return "Hello, Fingoo! v4"

@app.get("/test")
def hello() :
	return "Hello, Fingoo test!"

@app.get("/api/var-api/custom-forecast-indicator")
def loadIndicatorValue(
    targetIndicatorId: str = Query(...),
    targetIndicatorType: str = Query(...),
    sourceIndicatorId: list[str] = Query(default = None),
    sourceIndicatorType: list[str] = Query(default = None),
    weight: list[int] = Query(default = None),
    validIndicatorId: list[str] = Query(default = None),
    db: Session = Depends(get_db)
    ):
      try:
        prediction = predict(targetIndicatorId, targetIndicatorType, sourceIndicatorId, sourceIndicatorType, weight, validIndicatorId, db)
        return prediction
      except Exception as error:
          raise HTTPException(status_code=500, detail=f"{str(error)}")

@app.get("/api/var-api/source-indicators-verification")
def loadSourceIndicatorsVerification(
    targetIndicatorId: str = Query(...),
    targetIndicatorType: str = Query(...),
    sourceIndicatorId: list[str] = Query(default = None),
    sourceIndicatorType: list[str] = Query(default = None),
    db: Session = Depends(get_db)
    ):
      try:
        verificaion = sourceIndicatorsVerification(targetIndicatorId, targetIndicatorType, sourceIndicatorId, sourceIndicatorType, db)
        return verificaion
      except Exception as error:
        raise HTTPException(status_code=500, detail=f"{str(error)}")

handler = Mangum(app)
