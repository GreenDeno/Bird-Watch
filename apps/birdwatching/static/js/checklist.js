"use strict";

let app = {};

// Vue app for checklist
app.data = {
    data: function () {
        return {
            lat: lat, // Latitude passed from the backend
            lng: lng, // Longitude passed from the backend
            species: [],
            checklist: [],
            speciesSearch: "",
            speciesInput: {},
        };
    },
    methods: {
        loadSpecies: function () {
            axios.get("/birdwatching/get_species").then((response) => {
                this.species = response.data.species;
            }).catch((error) => {
                console.error("Failed to load species:", error);
            });
        },
        addSpeciesToChecklist: function (species, count) {
            const sanitizedCount = parseInt(count) || 0;
            if (!this.checklist.some(row => row.species === species)) {
                this.checklist.push({ species, count: sanitizedCount });
            }
            this.speciesInput[species] = ""; // Clear input for the species
        },
        incrementCount: function (index) {
            this.checklist[index].count++;
        },
        removeFromChecklist: function (index) {
            this.checklist.splice(index, 1);
        },
        submitChecklist: function () {
            console.log("Submitting checklist:", {
                checklist: this.checklist,
                lat: this.lat,
                lng: this.lng,
            });

            axios.post("/birdwatching/submit_checklist", {
                checklist: this.checklist,
                lat: this.lat,
                lng: this.lng,
            }).then(() => {
                alert("Checklist submitted successfully!");
                this.checklist = [];
            }).catch((error) => {
                console.error("Failed to submit checklist:", error);
                alert("Error submitting checklist.");
            });
        },
        goToMyChecklists: function () {
            window.location.href = "/birdwatching/my_checklists";
        },
    },
    mounted: function () {
        this.loadSpecies();
    },
};

app.vue = Vue.createApp(app.data).mount("#app");
