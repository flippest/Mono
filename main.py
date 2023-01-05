#!/usr/local/bin/python3

from flask import Flask, render_template, request, abort
import apiWrite2Sheets

app = Flask(__name__, static_url_path='', static_folder='build', template_folder='build')

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/write', methods=['POST'])
def write():
    data = request.json

    if data is None:
        app.logger.error('empty json')
        abort(400)

    event_name = data.get('eventName')
    badge_id = data.get('badgeID')
    check_type = data.get('checkType')

    if event_name is None or badge_id is None or check_type is None:
        app.logger.error(f'missing json fields: {data}')
        abort(400)
    
    try:
        apiWrite2Sheets.main(event_name, badge_id, check_type)
    except Exception as err:
        app.logger.error(err)
        abort(500)

    return '', 201

if __name__ == '__main__':
    app.run()
