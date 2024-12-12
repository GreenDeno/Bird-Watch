"""
This file defines the database models
"""

from datetime import date, datetime
import os, csv

from .common import db, Field, auth
from pydal.validators import *
# from pydal.helpers.methods import rawsql

current_dir = os.path.dirname(os.path.abspath(__file__))

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.utcnow()

def handle_partial_date(input_date):
    try:
        # If the input is None, return None
        if input_date is None:
            return None
        # If the input is already a datetime.date object, return it as is.
        if isinstance(input_date, date):
            return input_date
        # Ensure input is a string before processing.
        input_date = str(input_date)
        # Case: Full date in the format YYYY-MM-DD
        if len(input_date) == 10 and '-' in input_date:
            return datetime.strptime(input_date, "%Y-%m-%d").date()
        # Case: Partial date with only year and month, e.g., "2024-12-"
        elif len(input_date) == 7 and '-' in input_date:
            input_date = f"{input_date}-01"  # Default to the first day of the month
            return datetime.strptime(input_date, "%Y-%m-%d").date()
        # Case: Only year provided, e.g., "2024"
        elif len(input_date) == 4 and input_date.isdigit():
            input_date = f"{input_date}-01-01"  # Default to January 1st
            return datetime.strptime(input_date, "%Y-%m-%d").date()
        else:
            raise ValueError(f"Invalid date format: {input_date}")
    except ValueError as e:
        print(f"Error parsing date: {e}")
        return None

# Store the total different species of birds
db.define_table('species',
    Field('name', 'string', unique=True),
)

# Store the individual sighting events. These events contains:
#   - the sample event identifier (shared id of the checklist)
#   - the specie name sighted
#   - the observation count
#
db.define_table('sightings',
	Field('sample_event_identifier', 'string'),

    Field('specie_name', 'string'),
    Field('observation_count', 'integer', default=1),
)

# Store the checklist data. Each checklist contains:
#   - the sample event identifier (unique id of the checklist)
#   - the latitude and longitude of the observation
#   - the observation date and time
#   - the observer id (id of the user)
#
db.define_table('checklists',
    Field('sample_event_identifier', 'string'),

    Field('latitude', 'double'),
    Field('longitude', 'double'),

    Field('observation_date', 'string'),
    Field('observation_time', 'string'),
    Field('observation_duration', 'integer'),

    Field('observer_id', 'string')
)

db.commit()