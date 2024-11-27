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
    return [
        {
            "name": "Bird 1",
            "count": 1,
            "position": [37.7749, -122.4194],
            "date": "2021-09-01"
        },
        {
            "name": "Bird 2",
            "count": 2,
            "position": [39, -123],
            "date": "2021-09-02"
        },
        {
            "name": "Bird 3",
            "count": 3,
            "position": [40, -124],
            "date": "2021-09-03"
        },
        {
            "name": "Bird 1",
            "count": 4,
            "position": [40, -123],
            "date": "2021-09-24"
        },
        {
            "name": "Bird 2",
            "count": 5,
            "position": [39.2, -122],
            "date": "2021-09-25"
        },

        {
            "name": "Bird 4",
            "count": 6,
            "position": [38, -121],
            "date": "2021-09-26"
        },
        {
            "name": "Bird 5",
            "count": 7,
            "position": [37.5, -120],
            "date": "2021-09-27"
        },
        {
            "name": "Bird 6",
            "count": 8,
            "position": [36.8, -119],
            "date": "2021-09-28"
        },
        {
            "name": "Bird 7",
            "count": 9,
            "position": [36.2, -118],
            "date": "2021-09-29"
        },
        {
            "name": "Bird 8",
            "count": 10,
            "position": [35.9, -117],
            "date": "2021-09-30"
        }
    ]