/*"use strict";

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


app.data = {    
    data: function() {
        return {
            results: [],
            my_value: 1, 
            total:[],
        };
    },
    methods: {
        // Complete as you see fit.
        my_function: function() {
            // This is an example.
            this.my_value += 1;
        },

        get_data: function() {

        },

        updateHeatmap: function() {
            let maxTotalCount = Math.max(...this.total.map(item => item[2]));
            console.log(this.total[0]);
            var heat = L.heatLayer(this.total, {radius: 24,  // Controls the size of the heatmap radius
            minOpacity: 0.4,
            maxZoom: 18,  // Adjust as needed for zoom level
            gradient: {
              0.2: 'blue',   // Low intensity values (e.g., 0 to 2) will be blue
              0.4: 'cyan',   // Medium intensity values (e.g., 2 to 5) will be cyan
              0.6: 'lime',   // Higher intensity values (e.g., 5 to 7) will be lime
              0.8: 'yellow', // Even higher intensity values (e.g., 7 to 9) will be yellow
              1.0: 'red'     // Highest intensity values (e.g., 9 and above) will be red
            },
            max: maxTotalCount,
            blur: 15,
        }).addTo(this.map)
        },
  
        

  

    },

    mounted: function () {
        this.$nextTick(() => {
        var map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        setTimeout(function () {
            window.dispatchEvent(new Event("resize"));
         }, 100);

        
    

        let marker, circle, zoomed;
        navigator.geolocation.watchPosition(success);
        function success(pos) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        if (marker) {
            map.removeLayer(marker);

        }
        // Removes any existing marker and circule (new ones about to be set)
        marker = L.marker([lat, lng]).addTo(map);
        // Adds marker to the map and a circle for accuracy

        // Set zoom to boundaries of accuracy circle
        map.setView([lat, lng]);
        // Set map focus to current user position
        }



    });
        
        

    }
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
     
        axios.get(get_data_url).then(function (r) {
        app.vue.results = r.data.results;
        app.vue.user_email = r.data.user_email;   
        app.vue.total = r.data.total;

        app.vue.updateHeatmap();
    });
}

app.load_data();*/

/*
"use strict";

// This will be the object that will contain the Vue attributes
let app = {};

app.data = {
    data: function() {
        return {
            results: [],
            my_value: 1, 
            total: [],
            map: null,  // Add a property to store the map
        };
    },
    methods: {
        // Example function
        my_function: function() {
            this.my_value += 1;
        },

        get_data: function() {
            // Your function to load data
        },

        updateHeatmap: function() {
            if (!this.map || !this.total || this.total.length === 0) {
                console.warn("Map or data is not initialized properly.");
                return; // Avoid proceeding if map or data is not ready
            }

            let maxTotalCount = Math.max(...this.total.map(item => item[2]));
            console.log(this.total[0]);
            
            // Add the heatmap layer to the map
            var heat = L.heatLayer(this.total, {
                radius: 24,  // Controls the size of the heatmap radius
                minOpacity: 0.4,
                maxZoom: 18,  // Adjust as needed for zoom level
                gradient: {
                    0.2: 'blue',  // Low intensity values (e.g., 0 to 2) will be blue
                    0.5: 'cyan',  // Medium intensity values (e.g., 2 to 5) will be cyan
                    0.7: 'lime',  // Higher intensity values (e.g., 5 to 7) will be lime
                    0.8: 'yellow',// Even higher intensity values (e.g., 7 to 9) will be yellow
                    1.0: 'red'    // Highest intensity values (e.g., 9 and above) will be red
                },
                max: maxTotalCount,
                blur: 15,
            }).addTo(this.map); // Use this.map, not 'map'
        },

        locateUser: function() {
            if (navigator.geolocation) {
                // Get the user's current position
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        // Center the map on the user's location and zoom in
                        this.map.setView([lat, lng], 15);  // Set the zoom level to 15

                        // Optionally, add a marker to indicate the user's location
                        L.marker([lat, lng]).addTo(this.map).bindPopup('You are here').openPopup();
                    },
                    (error) => {
                        console.error('Error getting location', error);
                        alert('Could not retrieve your location');
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        },
    },

    mounted: function () {
        this.$nextTick(() => {
            // Initialize the map and store it in `this.map`
            this.map = L.map('map').setView([51.505, -0.09], 13);

            // Add tile layer to the map
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            // Optional: trigger resize after adding tile layer
            setTimeout(function () {
                window.dispatchEvent(new Event("resize"));
            }, 100);

            // You can now call updateHeatmap after the map is initialized
        });
    }
};

// Vue app initialization
app.vue = Vue.createApp(app.data).mount("#app");

// Load data and update the heatmap
app.load_data = function () {
    axios.get(get_data_url).then(function (r) {
        app.vue.results = r.data.results;
        app.vue.user_email = r.data.user_email;   
        app.vue.total = r.data.total;

        app.vue.updateHeatmap(); // Update the heatmap once the data is loaded
    });
}

// Trigger loading of data
app.load_data();

*/

"use strict";

// This will be the object that will contain the Vue attributes
let app = {};

app.data = {
    data: function() {
        return {
            results: [],
            my_value: 1, 
            total: [],
            map: null,  // Add a property to store the map
            filter_search: [],
            placingMarker: false, // Flag to track if user is in "place marker" mode
            markers: [] // Store placed markers
        };
    },
    methods: {
        // Example function
        my_function: function() {
            this.my_value += 1;
        },

        get_data: function() {
            // Your function to load data
        },

        updateHeatmap: function() {
            if (!this.map || !this.total || this.total.length === 0) {
                console.warn("Map or data is not initialized properly.");
                return; // Avoid proceeding if map or data is not ready
            }

            let maxTotalCount = Math.max(...this.total.map(item => item[2]));
            console.log(this.total[0]);
            
            // Add the heatmap layer to the map
            var heat = L.heatLayer(this.total, {
                radius: 24,  // Controls the size of the heatmap radius
                minOpacity: 0.4,
                maxZoom: 18,  // Adjust as needed for zoom level
                gradient: {
                    0.2: 'blue',  // Low intensity values (e.g., 0 to 2) will be blue
                    0.5: 'cyan',  // Medium intensity values (e.g., 2 to 5) will be cyan
                    0.7: 'lime',  // Higher intensity values (e.g., 5 to 7) will be lime
                    0.8: 'yellow',// Even higher intensity values (e.g., 7 to 9) will be yellow
                    1.0: 'red'    // Highest intensity values (e.g., 9 and above) will be red
                },
                max: maxTotalCount,
                blur: 15,
            }).addTo(this.map); // Use this.map, not 'map'
        },


        locateUser: function() {
            if (navigator.geolocation) {
                // Get the user's current position
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        // Center the map on the user's location and zoom in
                        this.map.setView([lat, lng], 15);  // Set the zoom level to 15

                        // Optionally, add a marker to indicate the user's location
                        //L.marker([lat, lng]).addTo(this.map).bindPopup('You are here').openPopup();
                        L.marker([lat, lng]).addTo(this.map);
                    },
                    (error) => {
                        console.error('Error getting location', error);
                        alert('Could not retrieve your location');
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        },

        init: function() {
            // Initialize the map and store it in `this.map`
            this.map = L.map('map').setView([51.505, -0.09], 13);

            // Add tile layer to the map
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            // Optional: trigger resize after adding tile layer
            setTimeout(function () {
                window.dispatchEvent(new Event("resize"));
            }, 100);

            this.map.on('click', this.placeMarker);
        },

        placeMarker: function(e) {
            if (this.placingMarker) {
                const latLng = e.latlng;

                const birdIcon = L.icon({
                    iconUrl: 'icons/bird.png', // Path to your custom image
                    iconSize: [50, 50], // Size of the icon (adjust as needed)
                    iconAnchor: [25, 50], // The point of the icon that will be at the marker's location (adjust as needed)
                    popupAnchor: [0, -50], // The point from which the popup will open (adjust if needed)
                });

                const marker = L.marker(latLng, { icon: birdIcon }).addTo(this.map);

                // Store the marker for future interactions
                this.markers.push(marker);

                // Add hover interaction for the marker
                marker.on('mouseover', () => {
                    marker.bindPopup(`
                        <button onclick="window.location.href='/birdwatching/checklist?lat=${latLng.lat}&lng=${latLng.lng}'">Add Checklist</button>
                        <button onclick="app.vue.removeMarker(${this.markers.indexOf(marker)})">Delete Marker</button>
                    `).openPopup();
                });
            }
        },

        toggleMarkerPlacement: function() {
            this.placingMarker = !this.placingMarker;
        },

        removeMarker: function(index) {
            const marker = this.markers[index];
            if (marker) {
                this.map.removeLayer(marker);
                this.markers.splice(index, 1); // Remove from the markers array
            }
        },
    },

    mounted: function () {
        this.$nextTick(() => {
            // Initialize the map by calling the init method
            this.init();
            this.locateUser();
        });
    }
};

// Vue app initialization
app.vue = Vue.createApp(app.data).mount("#app");

// Load data and update the heatmap
app.load_data = function () {
    axios.get(get_data_url).then(function (r) {
        app.vue.results = r.data.results;
        app.vue.user_email = r.data.user_email;   
        app.vue.total = r.data.total;

        app.vue.updateHeatmap(); // Update the heatmap once the data is loaded
    });
}

// Trigger loading of data
app.load_data();


