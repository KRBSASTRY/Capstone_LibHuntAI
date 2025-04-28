LibHunt AI - Web Application

LibHunt AI is a platform for discovering, comparing, and evaluating open-source libraries. It provides real-time metadata and allows developers to find the best libraries based on their needs.

Table of Contents

Prerequisites
Installation
How to Use the Web Application
Basic User Flows
Admin Panel
Library Search
Library Comparison
Technologies Used
Contributing
Public Deployment URL
License
Prerequisites

Make sure you have the following installed before running the application:

Node.js (v14.x or higher)
npm (v6.x or higher)
Additionally, if you wish to deploy or run the project locally:

MongoDB Atlas account for cloud database (optional for cloud deployment)
Vercel (for frontend deployment)
Render (for backend deployment)
Installation

1. Clone the repository
git clone https://github.com/YOUR_USERNAME/LibHunt_AI_Capstone.git
2. Install dependencies
Navigate to the project folder and run the following commands:

Backend:

cd backend
npm install
Frontend:

cd frontend
npm install
3. Set up environment variables
Make sure to create a .env file in the backend folder with the following keys:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
For deployment on Render, follow their deployment instructions to link your repository and set environment variables.

How to Use the Web Application

Start the Backend:
cd backend
npm start
Start the Frontend:
cd frontend
npm start
Open the application by navigating to http://localhost:3000 in your web browser.
Basic User Flows

Admin Panel
Admin Role: Only accessible to admins, this panel allows full CRUD operations on the library data.
Login: Admins use the JWT-based login to access the Admin Panel.
Library Management: Admins can create, update, and delete library entries.
Manage Metadata: Admins can ensure that the metadata is up-to-date, adding new data or modifying existing data.
Library Search
Search Libraries:
Users can search for libraries by name, category, or description. The search results are dynamically fetched from the backend in real-time.
Filter: Users can filter the results based on categories such as License, OS Support, Dependencies, etc.
Sorting: Users can sort search results by Most Popular, Last Updated, or Bundle Size.
Detailed View:
Users can click on a library to view more details like:
Library Description: Overview of the library.
Licenses: The type of license the library is released under.
Download Count, Stars: Popularity and activity metrics.
Dependencies and Usage: How the library is used and the dependencies it has.
Library Comparison
Compare Libraries:
Users can select two libraries to compare side-by-side. The comparison includes:
Bundle Size
Download Count
Dependencies
Licenses
Last Updated
Users can compare up to two libraries at a time to see which one fits their needs better.

Technologies Used

Frontend: React, Tailwind CSS, Vite
Backend: Node.js, Express, MongoDB (via Mongoose)
APIs: npm, GitHub, Libraries.io, Bundlephobia
Authentication: JWT (JSON Web Tokens)
Deployment: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)
Contributing

We welcome contributions! Please follow the guidelines below if you’d like to contribute:

Fork the repository.
Create a new branch for your feature.
Write tests for your changes.
Submit a Pull Request.
Public Deployment URL

The platform is deployed publicly and can be accessed at:

Public Deployment URL: https://capstone-lib-hunt-ai.vercel.app
This live URL allows users to interact with the platform in real-time and provide feedback for further improvements.

