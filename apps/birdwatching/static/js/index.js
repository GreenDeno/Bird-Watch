"use strict";

let app = {};

app.data = {
    data: function() {
        return {
            results: [],
            my_value: 1, 
            total: [],
            map: null,  
            filter_search: [],
            placingMarker: false, 
            markers: [], 
            species: [],
            selected_species: [],
            placingRectangle: false,
            drawing_coords: [],  
            drawing_polygons: [], 
            searchQuery: '',
            heatmapLayer: null,
            user_email: "",
            infoModalVisible: false
        };
    },
    methods: {

        openInfoModal() {
            this.infoModalVisible = true;
        },
     
        closeInfoModal() {
            this.infoModalVisible = false;
        },

        locateUser: function() {
            if (navigator.geolocation) {
               
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        this.map.setView([lat, lng], 15);  

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
            this.map = L.map('map').setView([51.505, -0.09], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            setTimeout(function () {
                window.dispatchEvent(new Event("resize"));
            }, 100);

            this.map.on('click', this.placeMarker);

            this.map.on('zoomstart', () => {
                setTimeout(() => {
                    this.map.closePopup();
                    this.closeAllPopups();
                }, 100); 
            });
        },

        closeAllPopups: function() {
            this.markers.forEach(marker => {
                marker.closePopup();
            });
            if (this.infoModalVisible) {
                this.closeInfoModal(); 
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

                marker.on('mouseover', () => {
                    marker.bindPopup(`
                        <button class="delete-button" onclick="window.location.href='/birdwatching/checklist?lat=${latLng.lat}&lng=${latLng.lng}'">Add Checklist</button>
                        <button class="delete-button" onclick="app.vue.removeMarker(${this.markers.indexOf(marker)})">Delete Marker</button>
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

        mousemove_listener: function (e) {
            if (this.drawing_coords.length === 1) {
                const point1 = this.drawing_coords[0];
                const point2 = e.latlng;

                const bounds = L.latLngBounds(point1, point2);

                if (this.previewRectangle) {
                    this.previewRectangle.setBounds(bounds);
                } else {
                    this.previewRectangle = L.rectangle(bounds, { color: '#398DCD', weight: 2, opacity: 0.5 }).addTo(this.map);
                }
            }
        },

        toggleRectanglePlacement: function () {
            if (this.placingMarker) {
                this.toggleMarkerPlacement();
            }

            if (this.previewRectangle) {
                this.map.removeLayer(this.previewRectangle);
                this.previewRectangle = null; 
            }

            this.placingRectangle = !this.placingRectangle;

            if (this.placingRectangle) {
                this.drawing_coords = [];
                this.map.on('click', this.click_listener);  
                this.map.on('mousemove', this.mousemove_listener);  
            } else {
                this.map.off('click', this.click_listener);
                this.map.off('mousemove', this.mousemove_listener);

                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);
                    this.previewRectangle = null;
                }
            }
        },

        click_listener: function (e) {
            if (this.drawing_coords.length < 2) {
                this.drawing_coords.push(e.latlng);
            }

            if (this.drawing_coords.length === 2) {
                const point1 = this.drawing_coords[0];
                const point2 = this.drawing_coords[1];
                const bounds = L.latLngBounds(point1, point2);
                const rectangle = L.rectangle(bounds, { color: '#398DCD', weight: 2 }).addTo(this.map);

                this.drawing_polygons.push(rectangle);

                rectangle.on('mouseover', () => {
                    const latlngs = rectangle.getBounds();
                    rectangle.unbindPopup();
                    const topLeft = latlngs.getNorthWest();
                    const bottomRight = latlngs.getSouthEast();
                    const coordinates = `${topLeft.lat},${topLeft.lng},${bottomRight.lat},${bottomRight.lng}`;

                    rectangle.bindPopup(`
                        <button class="delete-button" onclick="window.location.href='/birdwatching/location?coords=${encodeURIComponent(coordinates)}'">Check Location Stats</button>
                        <button class="delete-button" onclick="app.vue.removeRectangle(${this.drawing_polygons.indexOf(rectangle)})">Delete Rectangle</button>
                    `).openPopup();
                });

                this.drawing_coords = [];
                if (this.previewRectangle) {
                    this.map.removeLayer(this.previewRectangle);
                    this.previewRectangle = null;
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
       
        updateHeatmap: function() {
            console.log("Update Heatmap triggered");
            if (!this.map || !this.results || this.results.length === 0) {
                console.warn("Map or data is not initialized properly.");
                return;
            }
        
            let selectedData = [];
        
            if (this.selected_species.length === 0) {
                this.results.forEach(location => {
                    const [lat, lng] = location.location_key.split(',').map(coord => parseFloat(coord));
                    const totalCount = location.total_count; 
                    selectedData.push([lat, lng, totalCount]);
                });
            } else {
                this.results.forEach(location => {
                    let filteredSpeciesCounts = {};
                    this.selected_species.forEach(species => {
                        if (location.species_counts[species]) {
                            filteredSpeciesCounts[species] = location.species_counts[species];
                        }
                    });
        
                    if (Object.keys(filteredSpeciesCounts).length > 0) {
                        const [lat, lng] = location.location_key.split(',').map(coord => parseFloat(coord));
                        const totalCount = Object.values(filteredSpeciesCounts).reduce((sum, count) => sum + count, 0);
                        selectedData.push([lat, lng, totalCount]);
                    }
                });
            }
        
            if (selectedData.length === 0) {
                console.warn("No data available for selected species.");
                return;
            }
        
            let maxTotalCount = Math.max(...selectedData.map(item => item[2])); 
        
            if (this.heatmapLayer) {
                this.map.removeLayer(this.heatmapLayer);
            }
        
            this.heatmapLayer = L.heatLayer(selectedData, {
                radius: 24,
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
            }).addTo(this.map);
        },
        
        
        clearAllMarkersAndRectangles: function () {
            this.markers.forEach(marker => {
                this.map.removeLayer(marker);
            });
            this.markers = []; 
            this.drawing_polygons.forEach(rectangle => {
                this.map.removeLayer(rectangle);
            });
            this.drawing_polygons = [];  
        },
        
        filterSpecies: function() {
            return this.species.filter(species => species.toLowerCase().includes(this.searchQuery.toLowerCase()));
        },
    
        toggleSpeciesSelection: function(speciesName) {
            const index = this.selected_species.indexOf(speciesName);
            if (index === -1) {
                this.selected_species.push(speciesName);
            } else {
                this.selected_species.splice(index, 1);
            }
        },

        handleEnterButtonClick: function() {
            this.searchQuery = '';
            this.updateHeatmap();
        },
    
        clearSelections: function() {
            this.selected_species = [];
            this.updateHeatmap(); 
        },

        deselectSpecies: function(species) {
            const index = this.selected_species.indexOf(species);
            if (index !== -1) {
                this.selected_species.splice(index, 1); 
            }
            this.updateHeatmap();
        },

        updateLocationLink: function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        // Construct the new link with lat and lng query parameters
                        const link = '/birdwatching/checklist?lat=' + lat + '&lng=' + lng;

                        // Update the href of the <a> link with the new URL
                        const locationLink = document.getElementById('location-link');
                        if (locationLink) {
                            locationLink.href = link;
                        }
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
            this.init();
            this.locateUser();
            this.updateLocationLink();
        });
    }
    
};

app.vue = Vue.createApp(app.data).mount("#app");

app.load_data = function () {
    axios.get(get_data_url).then(function (r) {
        app.vue.results = r.data.results;
        app.vue.user_email = r.data.user_email;   
        app.vue.total = r.data.total;
        app.vue.species = r.data.species.map(species => species.name);
        app.vue.updateHeatmap(); 
    });
}

app.load_data();

