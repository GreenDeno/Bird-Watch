"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


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

    Field('observation_date', 'datetime'),
    Field('observation_time', 'time'),
    Field('observation_duration', 'integer'),

    Field('observer_id', 'string')
)

db.commit()