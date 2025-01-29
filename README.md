# Delivery Management System

Welcome to the Delivery Management System! This application is designed to streamline the process of managing deliveries, pickups, and returns, providing robust functionality to track and manage the entire delivery lifecycle.

# Deployed Link
https://delivery-management-system-hlw1.vercel.app/



## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Features](#features)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Introduction

This project aims to provide a comprehensive solution for managing delivery operations, including tracking packages, handling delivery exceptions, managing pickups, and tracking returns. The system offers functionalities to update assignment, update order, update partner and perform CRUD operations on various entities involved in the delivery process.

## Technologies Used

- **Frontend:**
  - React.js: A JavaScript library for building user interfaces.
  - TypeScript: A statically typed superset of JavaScript.
  - CSS / Tailwind Css: Styling the application.
  - MUI (Material Ui) : Used Componets and Tables

- **Backend:**
  - Node.js: A JavaScript runtime for building scalable network applications.
  - Express.js: A web application framework for Node.js.
  - MongoDB: A NoSQL database for storing application data.
  - Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js.
  -  TypeScript: A statically typed superset of JavaScript.


## Project Structure

The project is organized into two main directories:

- **client/**: Contains the frontend code.
- **server/**: Contains the backend code.

## Setup and Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Siddesh1214/Delivery-Management-System.git
   cd Delivery-Management-System
   ```

2. **Set up the backend:**

   ```bash
   cd server
   npm install
   ```

   - Create a `.env` file in the `server` directory and add the necessary environment variables (e.g., `MONGO_URI` for MongoDB connection, `PORT` for the server port, `CLIENT_URL`).

     ```bash
     ->.env
        MONGO_URI = 
        PORT = 3000
        CLIENT_URL = http://localhost:5173/
     ```
   - Start the backend server:

     ```bash
     npm install
     in terminal 1
     npm run watch    (to start typescript compilation)
     
     ```
     ```bash
     in terminal 2
     npm run dev     (to start the server)
     ```

3. **Set up the frontend:**

   ```bash
   cd client
   npm install
   ```

   - Start the frontend application:
     ```bash
     ->.env
        VITE_BASE_URL = http://localhost:3000/api/v1/
     ```

     ```bash
     npm run start
     ```

4. **Access the application:**

   - Open your browser and navigate to `http://localhost:5173` to interact with the frontend.
   - The backend server will be running on the port specified in your `.env` file (default is `http://localhost:3000`).

## Features

- **CRUD Operations:** Manage deliveries, pickups, and returns with full Create, Read, Update, and Delete functionality.
- **Database Integration:** Seamless integration with MongoDB for storing application data.
- **RESTful API:** Well-structured RESTful API endpoints for easy integration with frontend applications.

## Contributing

Contributions to the project are welcome! If you have any suggestions, bug fixes, or new features to propose, please feel free to open an issue or submit a pull request.

## Acknowledgements

Special thanks to all open-source libraries and resources that have helped in the development of this project.

