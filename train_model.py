
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def filtrar_datos(data, distrito, mes):
    return data[(data['distrito'] == distrito) & (data['Mes'] == mes)]

def entrenar_y_predecir(datos, años_futuros):
    if datos.empty:
        return [], []

    X = datos['año'].values.reshape(-1, 1)
    y_robos = datos['robos'].values
    y_hurtos = datos['hurtos'].values

    modelo_robos = LinearRegression().fit(X, y_robos)
    modelo_hurtos = LinearRegression().fit(X, y_hurtos)

    años_futuros = np.array(años_futuros).reshape(-1, 1)
    pred_robos = modelo_robos.predict(años_futuros)
    pred_hurtos = modelo_hurtos.predict(años_futuros)

    return pred_robos, pred_hurtos

def obtener_datos_distrito_mes(data, distrito, mes):
    df = filtrar_datos(data, distrito, mes)
    if df.empty:
        return pd.DataFrame()

    # Obtener el rango de años disponible
    years = df['año'].unique()
    all_years = pd.DataFrame(years, columns=['año'])

    # Contar robos y hurtos por año
    df_robos = df[df['Tipo'] == 'robo'].groupby('año').size().reset_index(name='robos')
    df_hurtos = df[df['Tipo'] == 'hurto'].groupby('año').size().reset_index(name='hurtos')

    # Fusionar los datos de robos y hurtos con el DataFrame de todos los años posibles
    df = pd.merge(all_years, df_robos, on='año', how='left').fillna(0)
    df = pd.merge(df, df_hurtos, on='año', how='left').fillna(0)
    
    return df