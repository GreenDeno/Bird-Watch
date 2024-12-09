from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner

from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email

url_signer = URLSigner(session)

@action("stats")
@action.uses('stats.html', db, auth)
def stats():
    return dict(
        get_sightings_url = URL('get_user_sightings'),
    )

@action("get_user_sightings", method="GET")
@action.uses(db, auth.user)
def get_user_sightings():
    user_email = get_user_email()

    checklists = db(db.checklists.observer_id == user_email).select()
    sightings = []
    
    for checklist in checklists:
        sighting = db(db.sightings.sample_event_identifier == checklist.sample_event_identifier).select().first()

        name = sighting.specie_name
        count = sighting.observation_count
        position = [checklist.latitude, checklist.longitude]
        date = checklist.observation_date

    # return dict(sightings=sightings)

    # TESTING DATA
    return [
    {
        "name": "Eagle",
        "count": 7,
        "position": [35.2106, -115.4051],
        "date": "2021-09-10"
    },
    {
        "name": "Sparrow",
        "count": 2,
        "position": [35.7133, -123.6232],
        "date": "2021-09-21"
    },
    {
        "name": "Dove",
        "count": 6,
        "position": [37.7509, -120.9032],
        "date": "2021-09-11"
    },
    {
        "name": "Crow",
        "count": 7,
        "position": [37.4861, -116.8998],
        "date": "2021-09-05"
    },
    {
        "name": "Crow",
        "count": 1,
        "position": [35.4754, -122.5819],
        "date": "2021-09-20"
    },
    {
        "name": "Hawk",
        "count": 10,
        "position": [38.8561, -119.2971],
        "date": "2021-09-23"
    },
    {
        "name": "Pigeon",
        "count": 10,
        "position": [36.2837, -120.7492],
        "date": "2021-09-03"
    },
    {
        "name": "Owl",
        "count": 9,
        "position": [37.8627, -124.1436],
        "date": "2021-09-03"
    },
    {
        "name": "Owl",
        "count": 9,
        "position": [38.6476, -120.5623],
        "date": "2021-09-17"
    },
    {
        "name": "Pigeon",
        "count": 8,
        "position": [36.605, -122.6145],
        "date": "2021-09-24"
    },
    {
        "name": "Hawk",
        "count": 4,
        "position": [39.1462, -118.6397],
        "date": "2021-09-30"
    },
    {
        "name": "Pigeon",
        "count": 6,
        "position": [38.2927, -124.0384],
        "date": "2021-09-28"
    },
    {
        "name": "Robin",
        "count": 2,
        "position": [39.165, -120.8445],
        "date": "2021-09-18"
    },
    {
        "name": "Crow",
        "count": 9,
        "position": [37.7604, -123.384],
        "date": "2021-09-26"
    },
    {
        "name": "Crow",
        "count": 10,
        "position": [39.3626, -115.424],
        "date": "2021-09-08"
    },
    {
        "name": "Pigeon",
        "count": 7,
        "position": [37.5938, -115.9563],
        "date": "2021-09-27"
    },
    {
        "name": "Parrot",
        "count": 1,
        "position": [39.5291, -124.8909],
        "date": "2021-09-28"
    },
    {
        "name": "Sparrow",
        "count": 5,
        "position": [37.5073, -118.7656],
        "date": "2021-09-06"
    },
    {
        "name": "Sparrow",
        "count": 4,
        "position": [37.5346, -120.597],
        "date": "2021-09-02"
    },
    {
        "name": "Pigeon",
        "count": 7,
        "position": [35.786, -120.1434],
        "date": "2021-09-07"
    }
]