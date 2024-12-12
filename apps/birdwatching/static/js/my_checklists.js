"use strict";

const app = {
    data() {
        return {
            checklists: Pchecklists, // Parse the JSON string passed from backend
        };
    },
    methods: {
        enableEdit(sighting) {
            // Enable editing for the row
            sighting.isEditing = true;
            sighting.newCount = sighting.observation_count;
        },
        saveEdit(sighting) {
            // Save the updated count to the backend
            axios
                .post(`/birdwatching/edit_sighting/${sighting.id}`, {
                    observation_count: sighting.newCount,
                })
                .then(() => {
                    // Update the UI with the new count
                    sighting.isEditing = false;
                    sighting.observation_count = sighting.newCount;
                    alert("Count updated successfully!");
                })
                .catch((error) => {
                    console.error("Failed to save changes:", error);
                    alert("Error saving changes.");
                });
        },
        deleteSighting(id) {
            axios
                .delete(`/birdwatching/delete_sighting/${id}`)
                .then(() => {
                    // Remove the deleted sighting from the UI
                    this.checklists = this.checklists.map(group => ({
                        date: group.date,
                        sightings: group.sightings.filter(s => s.id !== id),
                    })).filter(group => group.sightings.length > 0);
                })
                .catch((error) => {
                    console.error("Error deleting sighting:", error);
                    alert("Failed to delete sighting.");
                });
        },
        
    },
};

// Mount the Vue app
Vue.createApp(app).mount("#app");
