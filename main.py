from flask import Flask, render_template, jsonify, request
import pytz
from datetime import datetime
import os
import pycountry
from collections import defaultdict

app = Flask(__name__)
COUNTRY_TIMEZONES = defaultdict(list)
COUNTRY_NAMES = {}
for timezone in pytz.all_timezones:
    try:
        country_code = timezone.split('/')[-2] if '/' in timezone else None
        if country_code and len(country_code) == 2:
            try:
                country = pycountry.countries.get(alpha_2=country_code)
                if country:
                    COUNTRY_TIMEZONES[country.name.lower()].append(timezone)
                    COUNTRY_NAMES[country.name.lower()] = country.name
            except:
                pass
    except:
        continue
TIMEZONES = sorted([tz for tz in pytz.all_timezones])
ALL_LOCATIONS = {tz.lower(): tz for tz in TIMEZONES}
ALL_LOCATIONS.update({name.lower(): name for name in COUNTRY_NAMES.values()})
@app.route('/')
def index():
    return render_template('selection.html')
@app.route('/analog')
def analog():
    return render_template('analog.html')
@app.route('/alarm')
def alarm():
    return render_template('alarm.html')
@app.route('/stopwatch')
def stopwatch():
    return render_template('stopwatch.html')
@app.route('/timer')
def timer():
    return render_template('timer.html')
@app.route('/world')
def world():
    return render_template('world.html')
@app.route('/binary')
def binary():
    return render_template('binary.html')
@app.route('/digital')
def digital():
    return render_template('digital.html')   
@app.route('/calendar')
def calendar():
    return render_template('calendar.html')
@app.route('/get_time')
def get_time():
    timezone_str = request.args.get('timezone', 'UTC')
    try:
        if timezone_str.lower() in COUNTRY_TIMEZONES:
            timezone_str = COUNTRY_TIMEZONES[timezone_str.lower()][0]
        timezone = pytz.timezone(timezone_str)
        current_time = datetime.now(timezone)
        return jsonify({
            'time': current_time.strftime('%H:%M:%S'),
            'date': current_time.strftime('%Y-%m-%d'),
            'timezone': timezone_str
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@app.route('/search_locations')
def search_locations():
    query = request.args.get('q', '').lower()
    if len(query) < 2:
        return jsonify([])
    results = []
    seen = set()
    for country_name in COUNTRY_NAMES:
        if query in country_name and country_name not in seen:
            results.append({
                'name': COUNTRY_NAMES[country_name],
                'type': 'country',
                'timezones': COUNTRY_TIMEZONES[country_name]
            })
            seen.add(country_name)
    for tz in TIMEZONES:
        tz_lower = tz.lower()
        if query in tz_lower and tz not in seen:
            city = tz.split('/')[-1].replace('_', ' ')
            results.append({
                'name': city,
                'type': 'city',
                'timezone': tz
            })
            seen.add(tz)
    return jsonify(results[:10])
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)