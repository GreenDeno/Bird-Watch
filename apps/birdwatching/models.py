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


### Define your table below
# me branch testing
# db.define_table('thing', Field('name'))
# this is just me checking testing something with git
## always commit your models to avoid problems later

db.commit()
