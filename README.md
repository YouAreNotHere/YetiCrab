# Project Name

## Overview
This is a full-stack application for managing tourist attractions. The backend is built with NestJS, and the frontend uses React. The database is MySQL. The application allows users to create, update, delete, and view attractions, including their details such as location, rating, and images.


## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Seed Data](#seed-data)
5. [Important Notes](#important-notes)
6. [REST API Documentation](#rest-api-documentation)


## Prerequisites
Before running the project, ensure you have the following installed:
- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)


## Installation

1. **Clone the repository:**
   git clone https://github.com/YouAreNotHere/YetiCrab.git
   cd your-repo

   

2. **Start docker**
  - type docker-compose up -d


## Running the Application

Once the containers are up and running, you can access the application at the following URLs:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8081`
- **Database:** `mysql://YouAreNotHere:123456@localhost:3306/app_db`

## Seed Data

The application includes **seed data** functionality to populate the database with initial attraction records. By default, this functionality is disabled. To enable it:

1. Uncomment the following lines in `app/backend/src/main.ts`:
   - Line 6: Import `seedAttractions`:
     ```typescript
     import { seedAttractions } from './attractions/attractions.seed';
     ```
   - Line 43: Call `seedAttractions()`:
     ```typescript
     await seedAttractions();
     ```

2. Ensure that the file `app/backend/src/attractions/attractions.seed.ts` is uncommented and contains the seed data logic.

3. Start the application. The seed data will be added to the database during initialization.

> **Note:** After the seed data is added, it is recommended to comment out the above lines again to prevent duplicate entries on subsequent runs.

---

## Important Notes

1. **Migration Execution Time:**
   After starting the containers, the backend may take up to **3 minutes** to become fully operational. This delay is due to the execution of database migrations. During this time, the backend may not respond to requests. Please wait until the migrations are complete before using the application.

2. **Database Cleanup:**
   If you need to reset the database or start with a clean slate, you can delete the Docker volume used by MySQL:
   ```bash
   docker-compose down -v
   docker-compose up -d

2. **Database initialization issues:**
  If problems occur during the database startup, follow these steps:
  Type docker exec -it db bash
  Type mysql -u YouAreNotHere -p (password: 123456)
  Type create database if not exists <DB_NAME> (DB_NAME is defined in docker-compose.yaml under services.db.environment.MYSQL_DATABASE)
  Run docker-compose down


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

