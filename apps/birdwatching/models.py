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

if db(db.species).isempty():
    with open(os.path.join(current_dir, "samples", "species.csv"), 'r') as f:
        reader = csv.reader(f)
        next(reader) # skip header
        for row in reader:
            db.species.insert(name=row[0])
            
            
if db(db.checklists).isempty():
    with open(os.path.join(current_dir, "samples", "checklists.csv"), 'r') as f:
        reader = csv.reader(f)
        next(reader) # skip header
        for row in reader:
            try:
                observation_date = handle_partial_date(row[3])
                observation_duration = int(float(row[6])) if row[6] else 0
                if observation_date is None:
                    print(f"Skipping row due to invalid date: {row}")
                    continue  # Skip rows with invalid dates

                db.checklists.insert(
                sample_event_identifier=row[0],
                latitude=row[1],
                longitude=row[2],
                observation_date=observation_date,
                # observation_date=row[3],
                observation_time=row[4],
                # observation_duration=row[6],
                observation_duration=observation_duration,
                observer_id=row[5],
            )
            except ValueError as e:
                print(f"Date parsing error: {e} in row {row}")
                continue  # Skip invalid rows
            if row[6]:
                observation_duration = int(float(row[6]))
            else:
                observation_duration = 0
            # try:
            #     observation_date = handle_partial_date(row[3])  # Validate and correct the date
            # except ValueError:
            #     observation_date = None 

if db(db.sightings).isempty():
    with open(os.path.join(current_dir, "samples", "sightings.csv"), 'r') as f:
        reader = csv.reader(f)
        next(reader) # skip header
        for row in reader:
            if row[2] and row[2] != "X":
                observation_count = int(float(row[2]))
            else:
                observation_count = 0
            db.sightings.insert(
                sample_event_identifier=row[0],
                specie_name=row[1],
                observation_count=observation_count,
            )

db.commit()