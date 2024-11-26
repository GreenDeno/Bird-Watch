"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
            map: null,
            
            sighting_heat_layer: null,
            sighting_positions: [
                [51.505, -0.09],
                [51.51, -0.1],
                [51.51, -0.09],
                [51.51, -0.08],
            ]
        };
    },
    methods: {
        update_sighting_map: function() {
            if (!this.map) {
                return;
            }

            if (this.sighting_heat_layer) {
                this.map.removeLayer(this.sighting_heat_layer);
            }

            this.sighting_heat_layer = L.heatLayer(this.sighting_positions, {
                radius: 24,
                minOpacity: 0.4,
                gradient: {
                    0.2: 'blue',  // Low intensity values (e.g., 0 to 2) will be blue
                    0.5: 'cyan',  // Medium intensity values (e.g., 2 to 5) will be cyan
                    0.7: 'lime',  // Higher intensity values (e.g., 5 to 7) will be lime
                    0.8: 'yellow',// Even higher intensity values (e.g., 7 to 9) will be yellow
                    1.0: 'red'    // Highest intensity values (e.g., 9 and above) will be red
                },
                blur: 15,
            }).addTo(this.map);

            this.map.fitBounds(this.sighting_positions.map(point => [point[0], point[1]]), {
                padding: [5, 5], // Optional: adds some padding around the points
            });
        },

        init: function() {
            // Initialize the map and store it in `this.map`
            this.map = L.map('map', {
                zoomControl: false,
                attributionControl: false,
            }).setView([51.505, -0.09], 13);

            // Add tile layer to the map
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);
        },
    },

    mounted: function() {
        this.$nextTick(() => {
            this.init();
            this.update_sighting_map();
        });
    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
}

app.load_data();