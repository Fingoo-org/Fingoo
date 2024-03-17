import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.vector_ar.vecm import coint_johansen
from statsmodels.tsa.stattools import grangercausalitytests

def applyWeight(df: pd.DataFrame, applyData, weight):
    if weight == 0:
      print('가중치가 적용되지 않았습니다.')
      return df
    else:
        totalCount = 10
        theta = weight/1000
        base = df[applyData].iloc[-(totalCount)]
        test = df[applyData].iloc[-(totalCount):-1]

        for i in range(len(test)):
            df.loc[df.index[-(totalCount) + i], applyData] = base

        for j in range(len(test)):
            data = df.loc[df.index[-(totalCount) + j - 1], applyData]
            df.loc[df.index[-(totalCount) + j], applyData] = data * (1 + theta)

        df.loc[df.index[-1], applyData] = df.loc[df.index[-2], applyData] * (1 + theta)

        return df

def getADFDataFrame(data): # data: traning data
    adfSample = adfuller(data, autolag='AIC')
    adfDf = pd.DataFrame(adfuller(data, autolag='AIC')[:4])
    adfDf.columns = ['Data']
    adfDf.index = ['stat','p_value','lag','observ']

    sig = pd.DataFrame(data={'Data':adfSample[4]['5%']}, index=['5%'])
    adfDf = pd.concat([adfDf, sig], axis=0)
    adfDf = adfDf.apply(lambda x : round(x, 2))
    return adfDf

def grangerVerification(df: pd.DataFrame):
    dfPairs = pd.DataFrame(data=np.zeros((len(df.columns), len(df.columns))),
                        columns = [x for x in df.columns],
                        index = [x for x in df.columns])
    maxlag = 5
    for colI, col in enumerate(df.columns):
        for idxI, idx in enumerate(df.columns):
            outs = grangercausalitytests(df[[col,idx]], maxlag=maxlag)
            pvalMin = np.min([round(outs[x][0]['ssr_chi2test'][1],2) for x in range(1, maxlag+1)])
            dfPairs.iloc[idxI, colI] = pvalMin
    return dfPairs

def findSignificantValues(grangerDf, threshold=0.05):
    significantPairs = []
    for i, row in grangerDf.iterrows():
        for j, p_value in row.items():
            if i != j and p_value < threshold:
                significantPairs.append((i, j, p_value))
    return significantPairs

def findInfluentialGroups(significantValues):
    influentialGroups = []
    for source, target, p_value in significantValues:
        if p_value <= 0.05:
            influentialGroups.append((source, target))
    result = [(x, y) for x, y in influentialGroups if (y, x) in influentialGroups]
    uniqueElements = set()
    for x, y in result:
        uniqueElements.add(x)
        uniqueElements.add(y)
    grangerGroup = list(uniqueElements)
    return grangerGroup

def cointJohansenVerification(df: pd.DataFrame, dataGroup):
    out = coint_johansen(df[dataGroup], 1, 1)
    stats = [round(x,2) for x in out.lr1]
    sigs = [round(x,2) for x in out.cvt[:, 1]]
    result = [x>y for x,y in zip(stats,sigs)]
    return result