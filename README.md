# Bird Watching App

## Overview
This project was developed as a school assignment to explore modern web development using **Vue.js, Py4Web, Bulma, and SQL**. The goal was to create a functional bird-watching app inspired by [eBird.org](https://ebird.org/). Through this project, we gained experience in **responsive one-page applications, map integration, user interactions, and backend data processing**.

## Features
The app includes the following main pages:

- **Home Page** – Displays an interactive map with bird density data and navigation options.
- **Checklist Page** – Allows users to log bird sightings and track them over time.
- **Statistics Page** – Provides users with personal bird-watching data, trends, and insights.
- **Location Page** – Displays species data and visualizations for specific regions.

## Technologies Used
- **Frontend:** Vue.js, Bulma CSS
- **Backend:** Py4Web, SQL
- **Data Visualization:** D3.js / Chart.js
- **Mapping:** Leaflet.js (or relevant map library)

## Project Breakdown
### Home Page (Interactive Map)
- Displays bird density based on sightings.
- Users can select a species to filter sightings on the map.
- Clicking a region provides detailed statistics about that area.

### Checklist Page
- Users can log bird sightings by selecting species and entering counts.
- Data is stored securely in the backend and displayed in a personal log.
- Users can view, edit, or delete their submitted checklists.

### Statistics Page
- Displays a table of species a user has recorded.
- Includes an interactive map and a graph to visualize bird-watching trends over time.

### Location Page
- Provides insights into bird activity for a selected region.
- Displays a list of species sighted, top contributors, and observation trends.

## Development Process
- **Database Setup:** Designed schema for storing species, sightings, and user checklists.
- **Frontend Implementation:** Built responsive pages using Vue.js and Bulma.
- **Backend Development:** Developed API endpoints and data processing using Py4Web and SQL.
- **Data Visualization:** Integrated interactive graphs using Chart.js / D3.js.

## How to Run the Project
1. Clone the repository:  
   ```sh
   git clone https://github.com/yourusername/bird-watching-app.git
   ```
2. Navigate to the project directory:  
   ```sh
   cd bird-watching-app
   ```
3. Install dependencies:  
   ```sh
   pip install -r requirements.txt  # Install Python dependencies
   npm install  # Install Vue.js dependencies
   ```
4. Start the backend server:  
   ```sh
   py4web run apps
   ```
5. Start the frontend:  
   ```sh
   npm run dev
   ```
6. Open the app in your browser at `http://localhost:8080/`

## License
This project was developed for educational purposes and is open for further improvements and contributions.
