from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner

from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email

import json

url_signer = URLSigner(session)

@action('location')
@action.uses('location.html', db, auth.user, url_signer, session)
def location():
    lat1, lng1, lat2, lng2 = request.query.get('coords', '').split(',')

    coords = [{'lat': lat1, 'lng': lng1}, {'lat': lat2, 'lng': lng2}]
    print('Parsed coords =', coords)
    return dict(
        get_bird_sightings_url = URL('get_bird_sightings'),
        coords = json.dumps(coords),
    )


@action('get_bird_sightings', method=['POST'])
@action.uses(db, auth.user, url_signer)
def get_bird_sightings():
    east = request.json.get('east')
    west = request.json.get('west')
    north = request.json.get('north')
    south = request.json.get('south')

    events = db(
        (db.checklists.longitude <= east) &
        (db.checklists.longitude >= west) &
        (db.checklists.latitude <= north) & 
        (db.checklists.latitude >= south) 
    ).select(db.checklists.sample_event_identifier)

    event_ids = [event.sample_event_identifier for event in events]
    sightings = db(db.sightings.sample_event_identifier.belongs(event_ids)).select()

    sightings_list = []
    for sighting in sightings:
        location = db(db.checklists.sample_event_identifier == sighting.sample_event_identifier).select().first()
        if location:
            sightings_list.append({
                'obs_id': location.observer_id,
                'date': location.observation_date,
                'intensity': int(sighting.observation_count),
                'species': sighting.specie_name,
                'lat': location.latitude,
                'lon': location.longitude,
            })

    return dict(sightings=sightings_list)
