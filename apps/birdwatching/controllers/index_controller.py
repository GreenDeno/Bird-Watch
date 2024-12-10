"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from py4web.utils.url_signer import URLSigner

from ..common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from ..models import get_user_email

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth, auth.user, url_signer)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        get_data_url = URL('get_data', signer=url_signer),
    )

@action('get_data', method='GET')
@action.uses(db, session, auth, url_signer.verify())
def get_data():
    
    user_email = get_user_email()
    # Query the database for the relevant sightings and their associated locations
    results = db(
        (db.checklists.sample_event_identifier == db.sightings.sample_event_identifier) 
    ).select(
        db.sightings.specie_name,
        db.sightings.observation_count,
        db.checklists.latitude,
        db.checklists.longitude
    ).as_list()

    species = db().select(
        db.species.name,
    ).as_list() 

    species_names = [species_item['name'] for species_item in species]


  


    #print(results[0])
    # Initialize an empty dictionary to store the results
    location_dict = {}

    # Process the results and group by (latitude, longitude)
    for row in results:
    # Extract latitude, longitude, species name, and count
        lat, long, specie_name, count = row['checklists']['latitude'], row['checklists']['longitude'], row['sightings']['specie_name'], row['sightings']['observation_count']

        location_key = f"{lat},{long}"
    
    # Use (lat, long) as the key in location_dict
        if location_key not in location_dict:
            location_dict[location_key] = {
                'species_counts': {},
                'total_count': 0
            }

    # Count occurrences of species at the location
        if specie_name not in location_dict[location_key]['species_counts']:
            location_dict[location_key]['species_counts'][specie_name] = count
        else:
            location_dict[location_key]['species_counts'][specie_name] += count
    
        # Add to the total count for the location
        location_dict[location_key]['total_count'] += count

# Convert the dictionary to the required format
    final_results = [
        {
            'location_key': location_key,
            'species_counts': species_counts['species_counts'],  # Ensure no nesting of species_counts
            'total_count': species_counts['total_count']
        } 
        for location_key, species_counts in location_dict.items()
    ]
    
    # Output the final results
    #print("hello" + str(final_results))
    coordinates_and_totals = [
        [float(location_key.split(',')[0]), float(location_key.split(',')[1]), species_counts['total_count']]
        for location_key, species_counts in location_dict.items()
    ]
  

    return dict(results=final_results, user_email = user_email, total=coordinates_and_totals, species = species)