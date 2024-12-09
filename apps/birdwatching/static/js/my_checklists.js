"use strict";

// document.querySelectorAll('.delete-button').forEach(button => {
//     button.addEventListener('click', (event) => {
//         const id = button.getAttribute('data-id');
//         deleteChecklist(id);
//     });
// });

let app = {
    data: {
        data: function () {
            return {
                checklists: Pchecklists, // Parse the JSON string passed from backend
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

// console.log("Checklists received from backend:", JSON.parse(checklists)); // Add this line to debug

app.vue = Vue.createApp(app.data).mount("#app");
