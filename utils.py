import pandas as pd

def leer_datos(file_path):
    try:
        data = pd.read_excel(file_path, usecols=['distrito', 'año', 'Mes', 'Tipo'])
        data['distrito'] = data['distrito'].str.strip().str.lower().str.title()
        data['Mes'] = data['Mes'].str.strip().str.capitalize()
        return data
    except Exception as e:
        print("Error al leer el archivo Excel:", e)
        return pd.DataFrame()