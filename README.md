# Project Name

## Overview
This is a full-stack application for managing tourist attractions. The backend is built with NestJS, and the frontend uses React. The database is MySQL. The application allows users to create, update, delete, and view attractions, including their details such as location, rating, and images.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [REST API Documentation](#rest-api-documentation)
5. [Additional Notes](#additional-notes)

---

## Prerequisites
Before running the project, ensure you have the following installed:
- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

---

## Installation

1. **Clone the repository:**
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo

2. **Create .env files**
   Frontend (.env in frontend folder):

   VITE_REACT_APP_API_URL_DEV=http://localhost:8081/
   VITE_REACT_APP_API_URL_PROD=https://your-production-api-url.com
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here  

   Backend (.env in backend folder):
   MYSQL_ROOT_PASSWORD=123456
   MYSQL_DATABASE=test_db
   MYSQL_USER=YouAreNotHere
   MYSQL_PASSWORD=123456
   DB_HOST=db
   DB_PORT=3306
   DB_USERNAME=YouAreNotHere
   DB_PASSWORD=123456
   DB_NAME=test_db

3. **Start docker**
   docker-compose up --build

   

## Running the Application

Once the containers are up and running, you can access the application at the following URLs:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8081`
- **Database:** `mysql://YouAreNotHere:123456@localhost:3306/test_db`


## REST API Documentation

### Base URL
All API endpoints are relative to the base URL:
- Development: `http://localhost:8081/attractions`


### Endpoints

#### 1. Get All Attractions
- **URL:** `/attractions`
- **Method:** `GET`
- **Description:** Returns a list of all attractions.
- **Response:**
  ```json
  [
    {
      "id": "1",
      "name": "Eiffel Tower",
      "description": "Iconic landmark in Paris.",
      "photoUrl": "/uploads/image.jpg",
      "location": "Paris, France",
      "latitude": 48.8584,
      "longitude": 2.2945,
      "rating": [4, 5, 3],
      "isVisited": true
    }
  ]

  
#### 2. Create an Attraction
- **URL:** `/attractions`
- **Method:** `POST`
- **Description:** Creates a new attraction.
- **Request Body (JSON):**
  ```json
  {
    "name": "Statue of Liberty",
    "description": "Famous monument in New York.",
    "location": "New York, USA",
    "latitude": 40.6892,
    "longitude": -74.0445,
    "photoUrl": "/uploads/statue.jpg"
  }


#### 3. Update an Attraction
- **URL:** `/attractions/:id`
- **Method:** `PUT`
- **Description:** Updates an existing attraction by ID.
- **Path Parameters:**
  - `id`: The unique identifier of the attraction.
- **Request Body (JSON):**
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "rating": [4, 5, 3]
  }

#### 5. Delete an Attraction
- **URL:** `/attractions/:id`
- **Method:** `DELETE`
- **Description:** Delete attraction by ID.
- **Path Parameters:**
  - `id`: The unique identifier of the attraction.
- **Request Body (JSON):**
  ```json
{
  "message": "Attraction deleted successfully"
}

