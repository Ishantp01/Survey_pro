# Backend Application

## Overview
This is a Node.js application built with Express, designed to handle user and form-related requests. It utilizes MongoDB for data storage and Mongoose for object modeling. The application is structured to separate concerns, making it easier to maintain and scale.

## Project Structure
```
backend-app
├── config
│   └── index.js
├── controllers
│   ├── user.controller.js
│   ├── form.controller.js
│   └── admin.controller.js
├── middlewares
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models
│   ├── user.model.js
│   └── form.model.js
├── routes
│   ├── user.routes.js
│   ├── form.routes.js
│   └── admin.routes.js
├── utils
│   ├── jwt.js
│   ├── password.js
│   └── response.js
├── views
│   └── index.ejs
├── app.js
├── server.js
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd backend-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

## Running the Application
To start the server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

## API Endpoints
- User-related endpoints are defined in `routes/user.routes.js`.
- Form-related endpoints are defined in `routes/form.routes.js`.
- Admin-related endpoints are defined in `routes/admin.routes.js`.

## Middleware
Custom middleware for authentication and error handling can be found in the `middlewares` directory.

## Utilities
Utility functions for JWT handling, password hashing, and standardized API responses are located in the `utils` directory.

## Views
The application uses EJS for rendering views, with the main template located in `views/index.ejs`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussion.

## License
This project is licensed under the MIT License.