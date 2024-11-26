from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner

from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email

url_signer = URLSigner(session)

@action("checklist")
@action.uses('checklist.html', db, auth)
def checklist():
    lat = request.params.get("lat")  # Retrieve latitude from query parameters
    lng = request.params.get("lng") 
    return dict(lat=lat, lng=lng)

@action("get_species", method=["GET"])
@action.uses(db, auth)
def get_species():
    species = db(db.species).select(orderby=db.species.name).as_list()
    return dict(species=species)

@action("submit_checklist", method=["POST"])
@action.uses(db, auth)
def submit_checklist():
    data = request.json
    logger.info(f"Received data: {data}")
    checklist = data.get("checklist")
    lat = data.get("lat")
    lng = data.get("lng")

    logger.info(f"Checklist: {checklist}, Latitude: {lat}, Longitude: {lng}")

    if not checklist:
        return dict(success=False, message="Checklist is empty.")

    if not lat or not lng:
        logger.error("Latitude or longitude is missing.")
        return dict(success=False, message="Latitude or longitude is missing.")

    try:
        event_id = f"event-{auth.current_user.get('id')}-{db(db.checklists).count() + 1}"

        # Insert the checklist
        db.checklists.insert(
            sample_event_identifier=event_id,
            latitude=lat,
            longitude=lng,
            observation_date=request.now.date(),
            observation_time=request.now.time(),
            observer_id=auth.current_user.get('email'),
        )

        # Insert the sightings for the checklist
        for item in checklist:
            if "species" not in item or "count" not in item:
                    logger.error(f"Invalid item in checklist: {item}")
                    return dict(success=False, message="Invalid checklist item format.")
            
            db.sightings.insert(
                sample_event_identifier=event_id,
                specie_name=item["species"],
                observation_count=item["count"]
            )

        return dict(success=True, message="Checklist submitted successfully.")
    except Exception as e:
        logger.error(f"Error processing checklist: {str(e)}")
        return dict(success=False, message="Error saving checklist.")
    
@action("my_checklists")
@action.uses("my_checklists.html", db, auth)
def my_checklists():
    user_email = get_user_email()
    logger.info(f"Current user email: {user_email}")
    checklists = db(db.checklists.observer_id == user_email).select().as_list()
    logger.info(f"Retrieved checklists: {checklists}")
    return dict(checklists=checklists)

@action("delete_checklist/<checklist_id:int>", method=["DELETE"])
@action.uses(db, auth)
def delete_checklist(checklist_id):
    user_email = get_user_email()
    # Ensure the checklist belongs to the logged-in user
    db((db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)).delete()
    return dict(success=True, message="Checklist deleted successfully.")

@action("edit_checklist/<checklist_id:int>")
@action.uses("edit_checklist.html", db, auth)
def edit_checklist(checklist_id):
    user_email = get_user_email()
    checklist = db((db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)).select().first()
    if not checklist:
        abort(404)
    return dict(checklist=checklist)

@action("api/get_my_checklists", method=["GET"])
@action.uses(db, auth)
def get_my_checklists():
    user_email = get_user_email()
    checklists = db(db.checklists.observer_id == user_email).select().as_list()
    return dict(checklists=checklists)

