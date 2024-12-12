from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner
from datetime import datetime, date, time
from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email, handle_partial_date
import json
import html
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
    user_email = get_user_email()

    try:
        print("Data received from frontend:", data)
        current_date = datetime.now().date()

        # Find or create a checklist for today
        sample_event_identifier = f"event-{auth.current_user.get('id')}-{db(db.checklists).count() + 1}"
        checklist = db(
            (db.checklists.observer_id == user_email) & 
            (db.checklists.observation_date == current_date)
        ).select().first()

        if not checklist:
            checklist_id = db.checklists.insert(
                sample_event_identifier=sample_event_identifier,
                latitude=float(data.get("lat", 0)),
                longitude=float(data.get("lng", 0)),
                observation_date=current_date,
                observation_time=datetime.now().time(),
                observer_id=user_email,
            )
            checklist = db.checklists[checklist_id]
            print(f"Checklist created with ID: {checklist_id}")
        else:
            print(f"Checklist for today already exists with ID: {checklist.id}")

        # Insert or update sightings
        sightings = data.get("checklist", [])
        for sighting in sightings:
            species = sighting.get("species")
            count = int(sighting.get("count", 0))

            existing_sighting = db(
                (db.sightings.specie_name == species) &
                (db.sightings.sample_event_identifier == checklist.sample_event_identifier)
            ).select().first()

            if existing_sighting:
                # Update the existing sighting
                existing_sighting.update_record(
                    observation_count=existing_sighting.observation_count + count
                )
                print(f"Updated sighting for species {species} with new count {existing_sighting.observation_count}")
            else:
                # Insert a new sighting
                db.sightings.insert(
                    sample_event_identifier=checklist.sample_event_identifier,
                    specie_name=species,
                    observation_count=count,
                )
                print(f"New sighting inserted for species {species} with count {count}")

        return dict(success=True, message="Checklist submitted successfully.")
    except Exception as e:
        return dict(success=False, message=f"Error saving checklist: {e}")

    # try:
    #     print("Data received from frontend:", data)
    #     try:
    #         current_date = datetime.now().date()
    #         current_time = datetime.now().time()
    #         # Insert into the checklists table
    #         sample_event_identifier = f"event-{auth.current_user.get('id')}-{db(db.checklists).count() + 1}"
    #         checklist_id = db.checklists.insert(
    #             sample_event_identifier=sample_event_identifier,
    #             latitude=float(data.get("lat", 0)),
    #             longitude=float(data.get("lng", 0)),
    #             observation_date=current_date,
    #             observation_time=current_time,
    #             observer_id=auth.current_user.get('email'),
    #         )
    #         print(f"Checklist inserted with ID: {checklist_id}")
    #     except Exception as e:
    #         print(f"Error inserting checklist: {e}")

    #     # Insert sightings associated with the checklist
    #     try:
    #         sightings = data.get("checklist", [])
    #         print("Sightings data received:", sightings)  # Debug: Check if sightings data is received

    #         for sighting in sightings:
    #             print("Processing sighting:", sighting)  # Debug: Print each sighting being processed
    #             species = sighting.get("species")
    #             count = sighting.get("count", 0)

    #             # Insert the sighting into the database
    #             sighting_id = db.sightings.insert(
    #                 sample_event_identifier=sample_event_identifier,
    #                 specie_name=species,
    #                 observation_count=int(count),  # Ensure count is an integer
    #             )
    #             print(f"Sighting inserted with ID: {sighting_id}, {species} with count {count}")
    #     except Exception as e:
    #         print(f"Error inserting sightings: {e}")
    # except Exception as e:
    #     return dict(success=False, message=f"Error saving checklist: {e}")
    
@action("my_checklists")
@action.uses("my_checklists.html", db, auth)
def my_checklists():
    user_email = get_user_email()
    rows = db(
        (db.checklists.observer_id == user_email) &
        (db.sightings.sample_event_identifier == db.checklists.sample_event_identifier) &
        (db.checklists.observation_date != None)
    ).select(
        db.checklists.ALL,
        db.sightings.ALL,
        orderby=db.checklists.observation_date
    )

    # Group checklists by date
    grouped_checklists = {}
    for row in rows:
        date = row.checklists.observation_date
        if date not in grouped_checklists:
            grouped_checklists[date] = []

        grouped_checklists[date].append({
            "id": row.sightings.id,
            "specie_name": row.sightings.specie_name,
            "observation_count": row.sightings.observation_count,
        })

    # Prepare the final grouped data
    final_data = [
        {"date": str(date), "sightings": sightings}
        for date, sightings in grouped_checklists.items()
    ]
    # final_data = [
    # {"date": str(date) if date else "Unknown Date", "sightings": sightings}
    # for date, sightings in grouped_checklists.items()
# ]

    # Return the data as JSON to the frontend
    return dict(checklists=json.dumps(final_data, default=str))
    # rows = db(
    #     (db.checklists.observer_id == user_email) &
    #     (db.sightings.sample_event_identifier == db.checklists.sample_event_identifier)
    # ).select(
    #     db.checklists.ALL,
    #     db.sightings.ALL,
    #     orderby=db.checklists.observation_date
    # )

    # # Group checklists by date
    # grouped_checklists = {}
    # for row in rows:
    #     date = row.checklists.observation_date
    #     if date not in grouped_checklists:
    #         grouped_checklists[date] = []

    #     grouped_checklists[date].append({
    #         "id": row.sightings.id,
    #         "specie_name": row.sightings.specie_name,
    #         "observation_count": row.sightings.observation_count,
    #     })

    # # Prepare the final grouped data
    # final_data = [
    #     {"date": str(date), "sightings": sightings}
    #     for date, sightings in grouped_checklists.items()
    # ]

    # # Return the data as JSON to the frontend
    # return dict(checklists=json.dumps(final_data, default=str))

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
    
    # Retrieve the checklist belonging to the logged-in user
    checklist = db(
        (db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)
    ).select().first()
    
    if not checklist:
        abort(404)

    if request.method == "POST":
        data = request.json or request.POST
        # Update the checklist details if provided
        db(
            (db.checklists.id == checklist_id) & (db.checklists.observer_id == user_email)
        ).update(
            latitude=data.get("latitude", checklist.latitude),
            longitude=data.get("longitude", checklist.longitude),
            observation_date=data.get("observation_date", checklist.observation_date),
            observation_time=data.get("observation_time", checklist.observation_time),
        )
        
        # Update the associated sightings based on the checklist
        sightings = data.get("sightings", [])
        for sighting in sightings:
            db(
                (db.sightings.id == sighting["id"]) &
                (db.sightings.sample_event_identifier == checklist.sample_event_identifier)
            ).update(
                observation_count=sighting.get("observation_count")
            )
        
        return dict(success=True, message="Checklist and sightings updated successfully.")

    # Return the checklist data with associated sightings for frontend editing
    sightings = db(
        db.sightings.sample_event_identifier == checklist.sample_event_identifier
    ).select()
    
    return dict(
        checklist=checklist,
        sightings=sightings.as_list(),
    )

@action("api/get_my_checklists", method=["GET"])
@action.uses(db, auth)
def get_my_checklists():
    user_email = get_user_email()
    checklists = db(db.checklists.observer_id == user_email).select().as_list()
    return dict(checklists=checklists)

@action("edit_sighting/<sighting_id:int>", method=["POST"])
@action.uses(db, auth)
def edit_sighting(sighting_id):
    data = request.json
    print(f"Received data for sighting_id {sighting_id}: {data}")  # Debug

    # Check if observation_count is provided and is valid
    new_count = data.get("observation_count")
    if new_count is None or not isinstance(new_count, int):
        print("Invalid observation_count received.")  # Debug
        return dict(success=False, message="Invalid data provided.")

    # Update the sighting record
    db(db.sightings.id == sighting_id).update(observation_count=new_count)
    print(f"Sighting {sighting_id} updated with count {new_count}.")  # Debug
    return dict(success=True, message="Sighting updated successfully.")

@action("delete_sighting/<sighting_id:int>", method=["DELETE"])
@action.uses(db, auth)
def delete_sighting(sighting_id):
    user_email = get_user_email()

    # # Validate that the sighting belongs to the logged-in user
    # sighting = db((db.sightings.id == sighting_id) &
    #               (db.sightings.sample_event_identifier == db.checklists.sample_event_identifier) &
    #               (db.checklists.observer_id == user_email)).select().first()

    # if not sighting:
    #     return dict(success=False, message="Sighting not found or unauthorized.")

    # # Delete the sighting
    # deleted_rows = db(db.sightings.id == sighting_id).delete()
    # if deleted_rows == 0:
    #     return dict(success=False, message="Failed to delete sighting.")
    
    # Retrieve the sighting and its associated checklist
    sighting = db(db.sightings.id == sighting_id).select().first()
    if not sighting:
        print(f"Sighting with ID {sighting_id} not found.")
        return dict(success=False, message="Sighting not found.")

    # Delete the sighting
    db(db.sightings.id == sighting_id).delete()
    print(f"Sighting with ID {sighting_id} not found.")

    # Check if the checklist has any remaining sightings
    sample_event_identifier = sighting.sample_event_identifier
    remaining_sightings = db(db.sightings.sample_event_identifier == sample_event_identifier).count()

    # If no sightings remain, delete the checklist
    if remaining_sightings == 0:
        db(db.checklists.sample_event_identifier == sample_event_identifier).delete()
    return dict(success=True, message="Sighting deleted successfully.")

