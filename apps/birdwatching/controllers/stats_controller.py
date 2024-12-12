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
    total_sightings = []
    
    for checklist in checklists:
        sightings = db(db.sightings.sample_event_identifier == checklist.sample_event_identifier).select()

        for sighting in sightings:
            name = sighting.specie_name
            count = sighting.observation_count
            position = [checklist.latitude, checklist.longitude]
            date = checklist.observation_date

            if count > 0:
                total_sightings.append({
                    'name': name,
                    'count': count,
                    'position': position,
                    'date': date
                })

    return dict(sightings=total_sightings)