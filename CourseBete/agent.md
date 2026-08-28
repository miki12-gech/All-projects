# CourseBete Project Guide

## Project Overview
CourseBete is a full-stack course management platform designed to provide a seamless learning experience, now powered by a robust Spring Boot backend.

## Tech Stack

### Frontend (`/client`)
- **Framework:** React 19 (via Vite 7)
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion 12
- **Icons:** Lucide React
- **Routing:** React Router Dom 7
- **HTTP Client:** Axios

### Backend (`/server`)
- **Framework:** Spring Boot 3.4.2 (Java 17)
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security & JWT 
- **Build Tool:** Maven

## Project Structure
- `client/`: Frontend application code
- `server/`: Spring Boot Backend
  - `src/main/java/com/coursebete/`: Java Source Code
    - `controller/`: REST API Endpoints
    - `service/`: Business Logic
    - `repository/`: Data Access Layer
    - `model/`: JPA Entities
    - `dto/`: Data Transfer Objects
    - `security/`: JWT & Auth Config
  - `src/main/resources/application.properties`: Configuration

## Setup Instructions

### Prerequisites
- JDK 17+ installed
- PostgreSQL installed or access to cloud DB
- Maven installed (optional if using IDE wrapper)

### Installation
1.  **Clone the repository.**
2.  **Install Frontend Dependencies:**
    ```bash
    cd client
    npm install
    ```
3.  **Setup Backend:**
    - Navigate to `server` directory.
    - Ensure `src/main/resources/application.properties` has correct DB credentials.
    - Build: `mvn clean install`

## Running the Project

### Start Backend
```bash
cd server
mvn spring-boot:run
```
(Or run `CourseBeteApplication.java` in your IDE)

### Start Frontend
```bash
cd client
npm run dev
```
