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
            markers: [], // Store placed markers
            
            //rectangle stuff
            placingRectangle: false,
            drawing_coords: [],  // Array to store rectangle coordinates
            drawing_polygons: [], 
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

            this.map.on('zoomstart', () => {
                setTimeout(() => {
                    // Ensure all popups are closed and the map state is settled before zooming
                    this.map.closePopup();
                }, 100); // Adjust the timeout duration (100ms in this example)
            });

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
            
            if (this.placingRectangle) {
                this.toggleRectanglePlacement();
            }
            this.placingMarker = !this.placingMarker;
        },

        removeMarker: function(index) {
            const marker = this.markers[index];
            if (marker) {
                this.map.removeLayer(marker);
                this.markers.splice(index, 1); // Remove from the markers array
            }
        },

        //rectangle stuff

        

        toggleRectanglePlacement: function() {
            if (this.placingMarker) {
                this.toggleMarkerPlacement();
            }
            this.placingRectangle = !this.placingRectangle;
            if (this.placingRectangle) {
                // Reset the drawing state for a new rectangle
                this.drawing_coords = [];
                this.map.on('click', this.click_listener);  // Start capturing clicks for the new rectangle
                this.map.on('mousemove', this.mousemove_listener);  // Start updating the rectangle preview
            } else {
                // Stop drawing rectangles
                this.map.off('click', this.click_listener);
                this.map.off('mousemove', this.mousemove_listener);  // Stop updating the rectangle preview
                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);  // Remove preview rectangle when done
                }
            }
        },
        
        // Event listener to handle click for drawing the rectangle
        click_listener: function (e) {
            // Add points to the rectangle, up to 2 points
            if (this.drawing_coords.length < 2) {
                this.drawing_coords.push(e.latlng);
            }
        
            // If two points are set, complete the rectangle
            if (this.drawing_coords.length === 2) {
                // Get the two points (corners of the rectangle)
                const point1 = this.drawing_coords[0];
                const point2 = this.drawing_coords[1];
        
                // Determine the bounds of the rectangle
                const bounds = L.latLngBounds(point1, point2);
        
                // Create a rectangle using the bounds
                const rectangle = L.rectangle(bounds, { color: 'blue', weight: 2 }).addTo(this.map);
        
                // Store the rectangle for future interactions
                this.drawing_polygons.push(rectangle);
        
                // Optionally, add functionality to remove or edit rectangles
               /* rectangle.on('mouseover', () => {
                    rectangle.bindPopup(`
                        <button>Add Checklist</button>
                        <button onclick="app.vue.removeRectangle(${this.drawing_polygons.indexOf(rectangle)})">Delete Rectangle</button>
                    `).openPopup();
                });
                */

                rectangle.on('mouseover', () => {
                    // Remove any existing popups on the rectangle before binding a new one
                    const latlngs = rectangle.getBounds();

                    rectangle.unbindPopup(); // Remove any previous popup bindings
                    // Get the coordinates of the two corners (top-left and bottom-right)
                    const topLeft = latlngs.getNorthWest();
                    const bottomRight = latlngs.getSouthEast();
                    const coordinates = `${topLeft.lat},${topLeft.lng},${bottomRight.lat},${bottomRight.lng}`;
                    


                    rectangle.bindPopup(`
                        <button onclick="window.location.href='/birdwatching/location?coords=${encodeURIComponent(coordinates)}'">Check Location Stats</button>
                        <button onclick="app.vue.removeRectangle(${this.drawing_polygons.indexOf(rectangle)})">Delete Rectangle</button>
                    `).openPopup();
                });
                

             

        
                // Reset drawing state for the next rectangle
                this.drawing_coords = [];
                // Remove the preview rectangle once the final rectangle is drawn
                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);
                }
            }
        },
        
        // Event listener to handle mouse movement for previewing the rectangle
        mousemove_listener: function (e) {
            // If the first point is set, we can update the preview rectangle
            if (this.drawing_coords.length === 1) {
                const point1 = this.drawing_coords[0];
                const point2 = e.latlng;
        
                // Determine the bounds of the preview rectangle
                const bounds = L.latLngBounds(point1, point2);
        
                // If a temporary rectangle exists, update its position
                if (this.previewRectangle) {
                    this.previewRectangle.setBounds(bounds);
                } else {
                    // Create a new temporary rectangle to preview
                    this.previewRectangle = L.rectangle(bounds, { color: 'blue', weight: 2, opacity: 0.5 }).addTo(this.map);
                }
            }
        },
        
        // Remove a rectangle from the map
        removeRectangle: function(index) {
            const rectangle = this.drawing_polygons[index];
            if (rectangle) {
                this.map.removeLayer(rectangle);
                this.drawing_polygons.splice(index, 1); // Remove from the markers array
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
            filter_search: [],
            placingMarker: false, // Flag to track if user is in "place marker" mode
            markers: [], // Store placed markers
            
            // rectangle stuff
            placingRectangle: false,
            drawing_coords: [],  // Array to store rectangle coordinates
            drawing_polygons: [],
            previewRectangle: null, // Store the preview rectangle
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
                return;
            }

            let maxTotalCount = Math.max(...this.total.map(item => item[2]));
            console.log(this.total[0]);
            
            // Add the heatmap layer to the map
            var heat = L.heatLayer(this.total, {
                radius: 24,  // Controls the size of the heatmap radius
                minOpacity: 0.4,
                maxZoom: 18,
                gradient: {
                    0.2: 'blue', 
                    0.5: 'cyan',  
                    0.7: 'lime',  
                    0.8: 'yellow', 
                    1.0: 'red'
                },
                max: maxTotalCount,
                blur: 15,
            }).addTo(this.map); // Use this.map, not 'map'
        },

       

        init: function() {
            this.map = L.map('map', {
                center: [51.505, -0.09],
                zoom: 13,
            });
        
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(this.map);
        
            this.map.on('load', () => {
                console.log("Map loaded!");
                this.locateUser();  // Ensure user location is set after map is ready
            });
        
            setTimeout(() => {
                window.dispatchEvent(new Event("resize"));
            }, 100);
        },
        
        
        locateUser: function() {
            if (navigator.geolocation) {
                // Get the user's current position
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
        
                        // Ensure the map is fully loaded before changing the view
                        this.map.setView([lat, lng], 15);  // Set the zoom level to 15
        
                        // Optionally, add a marker to indicate the user's location
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
        

        placeMarker: function(e) {
            if (this.placingMarker) {
                const latLng = e.latlng;

                const birdIcon = L.icon({
                    iconUrl: 'icons/bird.png', 
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50],
                });

                const marker = L.marker(latLng, { icon: birdIcon }).addTo(this.map);
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
            if (this.placingRectangle) {
                this.toggleRectanglePlacement();
            }
            this.placingMarker = !this.placingMarker;
        },

        removeMarker: function(index) {
            const marker = this.markers[index];
            if (marker) {
                this.map.removeLayer(marker);
                this.markers.splice(index, 1);
            }
        },

        // Rectangle stuff
        toggleRectanglePlacement: function() {
            if (this.placingMarker) {
                this.toggleMarkerPlacement();
            }
            this.placingRectangle = !this.placingRectangle;
            if (this.placingRectangle) {
                // Reset the drawing state for a new rectangle
                this.drawing_coords = [];
                this.map.on('click', this.click_listener);  // Start capturing clicks for the new rectangle
                this.map.on('mousemove', this.mousemove_listener);  // Start updating the rectangle preview
            } else {
                // Stop drawing rectangles
                this.map.off('click', this.click_listener);
                this.map.off('mousemove', this.mousemove_listener);
                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);  // Remove preview rectangle when done
                }
            }
        },

        click_listener: function (e) {
            // Add points to the rectangle, up to 2 points
            if (this.drawing_coords.length < 2) {
                this.drawing_coords.push(e.latlng);
            }

            // If two points are set, complete the rectangle
            if (this.drawing_coords.length === 2) {
                const point1 = this.drawing_coords[0];
                const point2 = this.drawing_coords[1];
                const bounds = L.latLngBounds(point1, point2);
                const rectangle = L.rectangle(bounds, { color: 'blue', weight: 2 }).addTo(this.map);
                this.drawing_polygons.push(rectangle);

                rectangle.on('mouseover', () => {
                    rectangle.bindPopup(`
                        <button>Add Checklist</button>
                        <button onclick="app.vue.removeRectangle(${this.drawing_polygons.indexOf(rectangle)})">Delete Rectangle</button>
                    `).openPopup();
                });

                this.drawing_coords = [];
                // Remove the preview rectangle once the final rectangle is drawn
                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);
                }
            }
        },

        mousemove_listener: function (e) {
            if (this.drawing_coords.length === 1) {
                const point1 = this.drawing_coords[0];
                const point2 = e.latlng;
                const bounds = L.latLngBounds(point1, point2);

                if (this.previewRectangle) {
                    this.previewRectangle.setBounds(bounds);
                } else {
                    // Create a new temporary rectangle to preview
                    this.previewRectangle = L.rectangle(bounds, { color: 'blue', weight: 2, opacity: 0.5 }).addTo(this.map);
                }
            }
        },

        removeRectangle: function(index) {
            const rectangle = this.drawing_polygons[index];
            if (rectangle) {
                this.map.removeLayer(rectangle);
                this.drawing_polygons.splice(index, 1);
            }
        },

    },

    mounted: function () {
        this.$nextTick(() => {
            this.init();  // Initialize the map
            // Ensure map is initialized before interacting with it
            if (this.map) {
                this.locateUser();
            } else {
                console.warn("Map is not initialized yet.");
            }
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