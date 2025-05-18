from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

# Inicializar a aplicação Flask
app = Flask(__name__)
CORS(app)

# Caminho para o modelo treinado
MODELO_PATH = os.path.join(os.path.dirname(__file__), 'modelo', 'model.pkl')

# Carregar o modelo
modelo = joblib.load(MODELO_PATH)

# Caminho para os CSV carregados
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))


@app.route('/prever', methods=['POST'])
def prever():
    dados = request.get_json()
    print("🔸 JSON recebido:", dados)

    nome_ficheiro = dados.get('ficheiro')
    print("🔹 Nome do ficheiro recebido:", nome_ficheiro)

    if not nome_ficheiro:
        return jsonify({'erro': 'Ficheiro não especificado'}), 400

    caminho_csv = os.path.join(UPLOAD_FOLDER, nome_ficheiro)
    print("🧾 Caminho final do CSV:", caminho_csv)

    if not os.path.exists(caminho_csv):
        print("❌ Ficheiro não encontrado:", caminho_csv)
        return jsonify({'erro': 'Ficheiro não encontrado'}), 404



    try:
        df = pd.read_csv(caminho_csv, sep=';', encoding='utf-8')
        previsoes = modelo.predict(df)

        df_resultado = df.copy()
        df_resultado['previsao'] = previsoes

        # Gerar ficheiro com resultados
        nome_saida = f'resultado_{nome_ficheiro}'
        caminho_saida = os.path.join(UPLOAD_FOLDER, nome_saida)
        df_resultado.to_csv(caminho_saida, sep=';', index=False)

        # Enviar amostra de 5 linhas com previsão
        amostra = df_resultado.head(5).to_dict(orient='records')
        return jsonify({'amostra': amostra, 'ficheiro_resultado': nome_saida})

    except Exception as e:
        return jsonify({'erro': f'Erro na previsão: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
