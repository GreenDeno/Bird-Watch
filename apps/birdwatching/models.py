"""
This file defines the database models
"""

import datetime
import os, csv

from .common import db, Field, auth
from pydal.validators import *

current_dir = os.path.dirname(os.path.abspath(__file__))

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


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

    Field('observation_date', 'date'),
    Field('observation_time', 'time'),
    Field('observation_duration', 'integer'),

    Field('observer_id', 'string')
)

# Populate sample data for testing if databases are empty
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
            if row[6]:
                observation_duration = int(float(row[6]))
            else:
                observation_duration = 0

            db.checklists.insert(
                sample_event_identifier=row[0],
                latitude=row[1],
                longitude=row[2],
                observation_date=row[3],
                observation_time=row[4],
                observation_duration=observation_duration,
                observer_id=row[5],
            )

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