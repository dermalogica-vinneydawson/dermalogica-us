from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    button_text = "Find Your Product"  # Updated button text
    return render_template('index.html', button_text=button_text)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/snippets/<path:filename>')
def serve_snippets(filename):
    return send_from_directory('snippets', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
