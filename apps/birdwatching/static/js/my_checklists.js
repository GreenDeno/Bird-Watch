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
            sighting.newDate = sighting.observation_date;
            sighting.newCount = sighting.observation_count;
        },
        saveEdit(sighting, checklist) {
            // Save the updated data
            axios.post(`/birdwatching/edit_checklist/${checklist.id}`, {
                observation_date: sighting.newDate,
                observation_count: sighting.newCount,
            }).then(() => {
                sighting.isEditing = false;
                sighting.observation_date = sighting.newDate;
                sighting.observation_count = sighting.newCount;
                alert("Changes saved successfully!");
            }).catch((error) => {
                console.error("Failed to save changes:", error);
                alert("Error saving changes.");
            });
        },
        deleteChecklist(id) {
            axios.delete(`/birdwatching/delete_checklist/${id}`).then(() => {
                this.checklists = this.checklists.filter((c) => c.id !== id);
            }).catch((error) => {
                console.error("Failed to delete checklist:", error);
            });
        },
    },
};

// Mount the Vue app
Vue.createApp(app).mount("#app");
