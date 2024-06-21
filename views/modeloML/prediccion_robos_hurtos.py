import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import numpy as np
import tkinter as tk
from tkinter import ttk, messagebox

# Ruta del archivo Excel
file_path = 'Delitos.xlsx'

# Intentar leer solo las columnas necesarias y un número limitado de filas para verificar la estructura
try:
    # Leer solo las primeras 1000 filas para verificar la estructura
    data_preview = pd.read_excel(file_path, usecols=['distrito', 'año', 'Mes', 'Tipo'], nrows=1000)
    print("Vista previa de los datos:\n", data_preview.head())
    
    # Ahora, leer el archivo completo
    data = pd.read_excel(file_path, usecols=['distrito', 'año', 'Mes', 'Tipo'])
    print("Datos cargados exitosamente.")
except Exception as e:
    print("Error al leer el archivo Excel:", e)
    data = pd.DataFrame()  # Crear un DataFrame vacío en caso de error

# Normalizar nombres de distritos y meses
data['distrito'] = data['distrito'].str.strip().str.lower().str.title()
data['Mes'] = data['Mes'].str.strip().str.capitalize()

# Verificar los distritos disponibles
distritos_disponibles = data['distrito'].unique()
print("Distritos disponibles:", distritos_disponibles)

# Filtrar datos por distrito y mes
def filtrar_datos(data, distrito, mes):
    print(f"Filtrando datos para el distrito: {distrito} y mes: {mes}")  # Agregar mensaje de depuración
    filtrados = data[(data['distrito'] == distrito) & (data['Mes'] == mes)]
    print(f"Datos filtrados:\n{filtrados.head()}")  # Mostrar los primeros 5 registros filtrados
    return filtrados

# Obtener datos de robos y hurtos por distrito y mes
def obtener_datos_distrito_mes(data, distrito, mes):
    df = filtrar_datos(data, distrito, mes)
    if df.empty:
        return pd.DataFrame()  # Devolver un DataFrame vacío si no hay datos para el distrito y mes seleccionados

    print(f"Datos filtrados para el distrito {distrito} y mes {mes}:\n{df}")

    # Obtener el rango de años disponible
    years = df['año'].unique()

    # Crear un DataFrame con todos los años posibles
    all_years = pd.DataFrame(years, columns=['año'])

    # Contar robos y hurtos por año
    df_robos = df[df['Tipo'] == 'robo'].groupby('año').size().reset_index(name='robos')
    df_hurtos = df[df['Tipo'] == 'hurto'].groupby('año').size().reset_index(name='hurtos')

    # Fusionar los datos de robos y hurtos con el DataFrame de todos los años posibles
    df = pd.merge(all_years, df_robos, on='año', how='left').fillna(0)
    df = pd.merge(df, df_hurtos, on='año', how='left').fillna(0)
    
    print(f"Datos procesados para el distrito {distrito} y mes {mes}:\n{df}")  # Mostrar los datos procesados
    return df

# Función para entrenar y predecir
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

# Función para graficar
def graficar_predicciones(años, robos, hurtos, pred_robos, pred_hurtos, distrito, mes):
    plt.figure(figsize=(10, 5))
    plt.plot(años, robos, marker='o', label='Robos históricos')
    plt.plot(años, hurtos, marker='x', label='Hurtos históricos')
    plt.plot([2025, 2026], pred_robos, marker='o', linestyle='--', label='Predicción Robos')
    plt.plot([2025, 2026], pred_hurtos, marker='x', linestyle='--', label='Predicción Hurtos')
    plt.title(f'Predicción de Robos y Hurtos en {distrito} - {mes}')
    plt.xlabel('Año')
    plt.ylabel('Número de incidentes')
    plt.legend()
    plt.grid(True)
    plt.show()

# Función para predecir y graficar
def predecir():
    distrito = combo_distrito.get()
    mes = combo_mes.get()  # Obtener el mes seleccionado desde Tkinter

    if not distrito or not mes:
        messagebox.showwarning("Advertencia", "Por favor seleccione un distrito y un mes")
        return

    datos = obtener_datos_distrito_mes(data, distrito, mes)
    if datos.empty:
        messagebox.showwarning("Advertencia", "No se encontraron datos para el distrito y mes seleccionados")
        return

    pred_robos, pred_hurtos = entrenar_y_predecir(datos, [2025, 2026])
    graficar_predicciones(datos['año'].tolist(), datos['robos'].tolist(), datos['hurtos'].tolist(), pred_robos, pred_hurtos, distrito, mes)

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Predicción de Robos y Hurtos")

# Crear el combo box para seleccionar el distrito
ttk.Label(ventana, text="Seleccione el distrito:").pack(pady=10)
combo_distrito = ttk.Combobox(ventana, values=list(distritos_disponibles))
combo_distrito.pack(pady=5)

# Crear el combo box para seleccionar el mes
ttk.Label(ventana, text="Seleccione el mes:").pack(pady=10)
combo_mes = ttk.Combobox(ventana, values=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
combo_mes.pack(pady=5)

# Crear el botón para predecir
btn_predecir = ttk.Button(ventana, text="Predecir", command=predecir)
btn_predecir.pack(pady=20)

# Ejecutar la aplicación
ventana.mainloop()