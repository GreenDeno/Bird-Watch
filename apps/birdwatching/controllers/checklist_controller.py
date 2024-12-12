from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner
from datetime import datetime, date, time
from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email, handle_partial_date
import json
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

def validate_date(date_string):
    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError(f"Invalid date format: {date_string}")

@action("submit_checklist", method=["POST"])
@action.uses(db, auth)
def submit_checklist():
    data = request.json
    
    # checklist_date = data.get("observation_date")

    # observation_date = handle_partial_date(checklist_date)
    # if observation_date is None:
    #     return dict(success=False, message="Invalid date format.")

    try:
        print("Data received from frontend:", data)
        try:
            current_date = datetime.now().date()
            current_time = datetime.now().time()
            # Insert into the checklists table
            sample_event_identifier = f"event-{auth.current_user.get('id')}-{db(db.checklists).count() + 1}"
            checklist_id = db.checklists.insert(
                sample_event_identifier=sample_event_identifier,
                latitude=float(data.get("lat", 0)),
                longitude=float(data.get("lng", 0)),
                observation_date=current_date,
                observation_time=current_time,
                observer_id=auth.current_user.get('email'),
            )
            print(f"Checklist inserted with ID: {checklist_id}")
        except Exception as e:
            print(f"Error inserting checklist: {e}")

        # Insert sightings associated with the checklist
        try:
            sightings = data.get("checklist", [])
            print("Sightings data received:", sightings)  # Debug: Check if sightings data is received

            for sighting in sightings:
                print("Processing sighting:", sighting)  # Debug: Print each sighting being processed
                species = sighting.get("species")
                count = sighting.get("count", 0)

                # Insert the sighting into the database
                sighting_id = db.sightings.insert(
                    sample_event_identifier=sample_event_identifier,
                    specie_name=species,
                    observation_count=int(count),  # Ensure count is an integer
                )
                print(f"Sighting inserted with ID: {sighting_id}, {species} with count {count}")
        except Exception as e:
            print(f"Error inserting sightings: {e}")
    except Exception as e:
        return dict(success=False, message=f"Error saving checklist: {e}")
    
@action("my_checklists")
@action.uses("my_checklists.html", db, auth)
def my_checklists():
    user_email = get_user_email()
    logger.info(f"Current user email: {user_email}")

    # Fetch checklists for the logged-in user
    checklists = db(db.checklists.observer_id == user_email).select().as_list()

    # For each checklist, fetch associated sightings
    for checklist in checklists:
        checklist["sightings"] = db(
            db.sightings.sample_event_identifier == checklist["sample_event_identifier"]
        ).select(db.sightings.ALL).as_list()
        # sample_event_id = checklist["sample_event_identifier"]
        # sightings = db(db.sightings.sample_event_identifier == sample_event_id).select(
        #     db.sightings.specie_name,
        #     db.sightings.observation_count,
        # ).as_list()
        # checklist["sightings"] = sightings  # Add sightings to each checklist

    serialized_checklists = json.dumps(checklists, default=str)
    return dict(checklists=serialized_checklists)
    # rows = db(db.checklists.observer_id == user_email).select().as_list()
    # # logger.info(f"Retrieved checklists: {checklists}")
    # for checklist in rows:
    #     # print(checklist['observation_time'], checklist['observation_date'])
    #     if not checklist['observation_date']:
    #         checklist['observation_date'] = datetime(2024, 12, 4).date()

    #     if checklist['observation_time'] == checklist['observation_date'].strftime("%Y-%m-%d"):
    #         checklist['observation_time'] = "00:00:00"  # Default time if invalid
    #     # print(checklist['observation_time'], checklist['observation_date'])
    # serialized_rows = json.dumps(rows, default=str)
    # # print(serialized_rows)
    # return dict(checklists=serialized_rows)

@action("delete_checklist/<checklist_id:int>", method=["DELETE"])
@action.uses(db, auth)
def delete_checklist(checklist_id):
    user_email = get_user_email()
    # Ensure the checklist belongs to the logged-in user
# Ensure the checklist belongs to the logged-in user
    deleted_rows = db(
        (db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)).delete()
    if deleted_rows == 0:
        # If no rows were deleted, the checklist might not exist or belong to the user
        return dict(success=False, message="Checklist not found or access denied.")    
    return dict(success=True, message="Checklist deleted successfully.")

@action("edit_checklist/<checklist_id:int>", method=["GET", "POST"])
@action.uses("edit_checklist.html", db, auth)
def edit_checklist(checklist_id):
    user_email = get_user_email()
    checklist = db((db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)).select().first()
    if not checklist:
        abort(404)
    if request.method == "POST":
        data = request.json or request.POST
        # Update the checklist with the provided data
        db(
            (db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)
        ).update(
            sample_event_identifier=data.get("sample_event_identifier"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            observation_date=data.get("observation_date"),
            observation_time=data.get("observation_time"),
            observation_duration=data.get("observation_duration"),
        )
        return dict(success=True, message="Checklist updated successfully.")
    return dict(checklist=checklist)

@action("api/get_my_checklists", method=["GET"])
@action.uses(db, auth)
def get_my_checklists():
    user_email = get_user_email()
    checklists = db(db.checklists.observer_id == user_email).select().as_list()
    return dict(checklists=checklists)

