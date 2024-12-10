"use strict";

let app = {};

app.data = {
    data: function() {
        return {
            chartInstance: null,
            coords: coords || [],
            sightings: [],
            species_in_bounds: [],
            selectedRegion: 1,
            selectedSpecies: null,
            topContributors: {},
            totalChecklists: 0,
            totalSightings: 0,
            speciesData: [],
            graphData: [],
        };
    },
    methods: {
        fetchRegionData() {
            let p1 = this.coords[0];
            let p2 = this.coords[1];

            console.log("Fetch Region Data: ", this.coords);

            let north = Math.max(p1['lat'], p2['lat']);
            let south = Math.min(p1['lat'], p2['lat']);

            let west = Math.min(p1['lng'], p2['lng']);
            let east = Math.max(p1['lng'], p2['lng']);

            let map_bounds = {
                north: north,
                south: south,
                west: west,
                east: east
            };

            console.log(north, south, east, west);

            axios.post(get_bird_sightings_url, map_bounds)
                .then(response => {
                    this.sightings = response.data.sightings;

                    this.species_in_bounds = [...new Set(this.sightings.map(event => event.species))];
                    this.species_in_bounds.sort((a, b) => a.localeCompare(b));

                    for (let i = 0; i < this.sightings.length; i++){
                        let observer_id = this.sightings[i].obs_id;
                        let count = this.sightings[i].intensity;

                        if (this.topContributors.hasOwnProperty(observer_id)) {
                            this.topContributors[observer_id] += count;
                        } else {
                            this.topContributors[observer_id] = count;
                        }

                        this.totalSightings += count;
                    }

                    let sortedContributors = Object.entries(this.topContributors).sort((a, b) => b[1] - a[1]);
                    this.topContributors = Object.fromEntries(sortedContributors);

                    console.log("Top Contributors", this.topContributors);

                })
                .catch(error => console.error('Error fetching bird sightings', error));
        },

        fetchSpeciesData() {
            console.log("Selected Species =", this.selectedSpecies);
            for (let i = 0; i < this.sightings.length; i++) {
                let species = this.sightings[i].species;
                let date = this.sightings[i].date;
                let count = this.sightings[i].intensity;
                if (species === this.selectedSpecies) {
                    if (this.graphData.hasOwnProperty(date)) {
                        this.graphData[date] += count;
                    } else {
                        this.graphData[date] = count;
                    }
                }
            }
            
            this.drawGraph();
        },

        drawGraph() {
            const transformedData = Object.keys(this.graphData).map(date => ({
                date: date,
                count: this.graphData[date]
            })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
            const labels = transformedData.map(data => data.date);
            const data = transformedData.map(data => data.count);
        
            this.$nextTick(() => {
                const ctx = this.$refs.speciesGraph.getContext('2d');
                if (this.chartInstance) {
                    this.chartInstance.destroy();
                }
                this.chartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Number of Bird Sightings',
                            data: data,
                            backgroundColor: 'rgba(131, 234, 21, 0.2)',
                            borderColor: 'rgba(83, 200, 55, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            });
        },

        selectSpecies(speciesId) {
            this.selectedSpecies = speciesId;
            this.fetchSpeciesData();
        }
    },

    computed: {
        sightings: function() {
            return this.sightings;
        },

        contributorsList: function() {
            return this.topContributors;
        },

        totalSightingsUpdate: function() {
            return this.totalSightings;
        }
    },

    mounted() {
        this.fetchRegionData();
    },
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
};

app.load_data();
