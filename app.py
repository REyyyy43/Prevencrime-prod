from flask import Flask, render_template, request, jsonify
from train_model import obtener_datos_distrito_mes, entrenar_y_predecir
from utils import leer_datos

app = Flask(__name__, template_folder='templates', static_folder='static')

file_path = 'Delitos.xlsx'
data = leer_datos(file_path)
distritos_disponibles = data['distrito'].unique()

@app.route('/plot', methods=['POST'])
def plot():
    try:
        data_request = request.json
        distrito = data_request['distrito']
        mes = data_request['mes']

        if 'Mes' not in data.columns:
            raise KeyError("La columna 'Mes' no existe en el DataFrame.")

        datos = obtener_datos_distrito_mes(data, distrito, mes)
        if datos.empty:
            return jsonify({"error": "No data available for the specified district and month."})

        print("Datos procesados para entrenamiento:")
        print(datos)

        pred_robos, pred_hurtos = entrenar_y_predecir(datos, [2025, 2026])

        print("Predicciones de robos:", pred_robos)
        print("Predicciones de hurtos:", pred_hurtos)

        response_data = {
            'años': datos['año'].tolist(),
            'robos': datos['robos'].tolist(),
            'hurtos': datos['hurtos'].tolist(),
            'pred_robos': pred_robos.tolist(),
            'pred_hurtos': pred_hurtos.tolist()
        }

        return jsonify(response_data)
    except Exception as e:
        return str(e), 500

@app.route('/')
def index():
    return render_template('index.html', distritos=distritos_disponibles)

if __name__ == '__main__':
   app.run(port=5000, debug=True)