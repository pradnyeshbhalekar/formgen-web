from flask import Flask, request, jsonify, send_from_directory
from pyformgen.react_generator import generate_react_form  # ✅ CORRECT
import tempfile
from flask_cors import CORS

import os

app = Flask(__name__)
CORS(app) 

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/generatedOutput', methods=['POST'])
def generate_output():
    try:
        json_schema = request.get_json()


        with tempfile.NamedTemporaryFile(delete=False, suffix=".jsx") as tmp_file:
            output_path = tmp_file.name

        generate_react_form(json_schema, output_path)


        with open(output_path, 'r') as f:
            jsx_code = f.read()

        os.remove(output_path)

        return jsonify({'jsx': jsx_code})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)