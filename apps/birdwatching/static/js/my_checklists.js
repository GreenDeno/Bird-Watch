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
            console.log("Saving sighting:", sighting); // Debug to check the current sighting object
            axios.post(`/birdwatching/edit_sighting/${sighting.id}`, {
                observation_count: sighting.newCount, // Pass the new count value
            }).then((response) => {
                console.log("Save response:", response.data); // Debug to confirm backend response
                sighting.isEditing = false; // Exit editing mode
                sighting.observation_count = sighting.newCount; // Update UI with the new count
                alert("Changes saved successfully!");
            }).catch((error) => {
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
    // mounted() {
    //     axios.get("/birdwatching/my_checklists").then((response) => {
    //         this.checklists = response.data.checklists;
    //     }).catch((error) => {
    //         console.error("Failed to load checklists:", error);
    //     });
    // },
};
// console.log(Pchecklists);

// Mount the Vue app
Vue.createApp(app).mount("#app");
