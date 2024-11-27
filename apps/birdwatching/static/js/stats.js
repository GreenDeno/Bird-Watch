"use strict";

function process_sightings_dataset(sightings) {
    if (!Array.isArray(sightings)) {
        return [];
    }

    // If there is only one point, pad the data
    if (sightings.length == 1) {
        const sighting = sightings[0];

        const new_date = new Date(sighting.date)
        new_date.setDate(new_date.getDate() + 1);

        sightings.push({
            date: new_date.toISOString().split('T')[0],
            count: 0,
        });
    }

    // Count sightings per date
    const sighting_counts = sightings.reduce((acc, sighting) => {
        const date = sighting.date.split('T')[0]; // Handle ISO date strings
        const count = sighting.count;
        acc[date] = (acc[date] || 0) + count;
        return acc;
    }, {});

    // Find min and max dates
    const dates = Object.keys(sighting_counts);
    const min_date = new Date(Math.min(...dates.map(date => new Date(date))));
    const max_date = new Date(Math.max(...dates.map(date => new Date(date))));

    // Generate full date range with counts
    const filled_sightings = [];
    let current_date = new Date(min_date);

    while (current_date <= max_date) {
        const date_string = current_date.toISOString().split('T')[0];
        filled_sightings.push({
            date: date_string,
            count: sighting_counts[date_string] || 0
        });
        
        current_date.setDate(current_date.getDate() + 1);
    }

    return filled_sightings;
}

function process_species_dataset(sightings) {
    if (!Array.isArray(sightings)) {
        return [];
    }

    // Group sightings by species name
    const species_map = sightings.reduce((acc, sighting) => {
        if (!acc[sighting.name]) {
            acc[sighting.name] = {
                name: sighting.name,
                total_count: 0,
                first_date: sighting.date,
                last_date: sighting.date,
                positions: []
            };
        }
        
        // Update total count
        acc[sighting.name].total_count += sighting.count;
        
        // Update first and last dates
        if (new Date(sighting.date) < new Date(acc[sighting.name].first_date)) {
            acc[sighting.name].first_date = sighting.date;
        }

        if (new Date(sighting.date) > new Date(acc[sighting.name].last_date)) {
            acc[sighting.name].last_date = sighting.date;
        }
        
        // Add position
        acc[sighting.name].positions.push(sighting.position);
        
        return acc;
    }, {});
    
    return Object.values(species_map);
}

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};

app.data = {    
    data: function() {
        return {
            activity_sightings: [],
            species_sightings: [],

            displayed_species: [],
            search_query: '',
            expanded_specie: null,

            map: null,
        };
    },

    methods: {
        create_sighting_chart: function() {
            let canvas = document.getElementById('activity-chart');
            let data_set = this.activity_sightings;

            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data_set.map(sighting => sighting.date),
                    datasets: [{
                        data: data_set.map(sighting => sighting.count),
                        borderWidth: 2,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        pointRadius: 3,
                        pointBackgroundColor: 'blue',
                        tension: 0.5, // Smooth curve
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Sightings'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            },
                        },
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Your Birdwatching Sightings',
                            font: {
                                size: 15,
                            } 
                        },
                        legend: {
                            display: false
                        },
                    }
                }
            });
        },

        update_species_map: function() {
            let map = this.map;

            if (!map) {
                return;
            }

            map.eachLayer(function (layer) {
                if (!layer._url) { // Check if the layer is not a tile layer
                    map.removeLayer(layer);
                }
            });

            if (!this.expanded_specie) {
                return;
            }

            let sighting_positions = this.species_sightings.find(species => species.name == this.expanded_specie).positions;
            if (!sighting_positions || sighting_positions.length == 0) {
                return;
            }

            map.__container = document.getElementById('map selected');

            // Add markers for each sighting position
            for (let position of sighting_positions) {
                L.marker(position).addTo(map);
            }

            // Fit map to bounds of sightings
            map.fitBounds(sighting_positions, {
                padding: [25, 25]
            });

            // Call resize to force map to update
            map.invalidateSize();
        },

        create_species_map: function() {
            if (this.map) {
                this.map.remove();
            }

            // Get map container
            let map_container = document.getElementById('map');
            if (!map_container) {
                return;
            }

            // Initialize the map and store it in `this.map`
            this.map = L.map(map_container, {
                zoomControl: false,
                attributionControl: false,
            }).setView([51.505, -0.09], 13);

            // Add tile layer to the map
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);
        },

        expand_displayed_specie: function(specie_name) {
            if (this.expanded_specie == specie_name) {
                this.expanded_specie = null;
            } else {
                this.expanded_specie = specie_name;

                // this.$nextTick(() => {
                // ALlow time for the map to fade in
                setTimeout(() => {
                    this.create_species_map();
                    this.update_species_map();
                }, 200);
            }
        },

        update_displayed_species: function() {
            // If there was no search query, display all species
            if (this.search_query == '') {
                this.displayed_species = this.species_sightings;
                return;
            }

            // Filter species by search query
            let displayed_species = [];

            for (let species of this.species_sightings) {
                if (species.name.toLowerCase().includes(this.search_query.toLowerCase())) {
                    displayed_species.push(species);
                }
            }

            this.displayed_species = displayed_species;
            this.expanded_specie = null;
        },

    },

    mounted: function() {
        this.$nextTick(() => {
            this.create_species_map();
        });
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(get_sightings_url).then(function(response) {
        let sightings = response.data;

        app.vue.activity_sightings = process_sightings_dataset(sightings);
        app.vue.species_sightings = process_species_dataset(sightings);

        app.vue.create_sighting_chart();
        app.vue.update_displayed_species();

        // for (let species of app.vue.species_sightings) {
        //     console.log(species.name, species.total_count, species.first_date, species.last_date, species.positions);
        // }

        // for (let sighting of app.vue.activity_sightings) {
        //     console.log(sighting.date, sighting.count);
        // }
    })
}

app.load_data();