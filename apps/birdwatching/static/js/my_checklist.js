"use strict";

let app = {
    data: {
        data: function () {
            return {
                checklists: checklists, // This comes from the embedded template script
            };
        },
        methods: {
            deleteChecklist: function (id) {
                axios.delete(`/birdwatching/delete_checklist/${id}`).then(() => {
                    this.checklists = this.checklists.filter(c => c.id !== id);
                }).catch(error => {
                    console.error("Failed to delete checklist:", error);
                });
            },
            editChecklist: function (id) {
                window.location.href = `/birdwatching/edit_checklist/${id}`;
            },
        },
    },
};

console.log("Checklists received from backend:", checklists); // Add this line to debug

app.vue = Vue.createApp(app.data).mount("#app");
