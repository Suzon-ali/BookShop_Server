# Blog Platform Backend

## Overview
The Blog Platform Backend is a robust backend system designed to support a blogging platform where users can create, update, and delete their blogs. It incorporates secure authentication, role-based access control, and a public API for reading blogs with advanced features like search, sort, and filter functionalities.

---

## Live URL
🚀 **Blog Platform Backend** https://assignment-3-blogs.vercel.app/api/

---

## Features

### User Roles
- **Admin**
  - Created manually in the database with predefined credentials.
  - Can delete any blog.
  - Can block any user by updating the `isBlocked` property.
  - Cannot update any blog.
- **User**
  - Can register and log in.
  - Can create, update, and delete their own blogs.
  - Cannot perform admin actions.

### Authentication & Authorization
- **Authentication**
  - Secure login functionality required for all write, update, and delete operations.
- **Authorization**
  - Role-based access control differentiates between Admin and User roles.

### Blog API
- **Public API** for reading blogs:
  - Returns blog title, content, author details, and other necessary information.
  - Supports **search**, **sorting**, and **filtering** functionalities to enhance user experience.

---

## Technologies Used

- **TypeScript**: For robust and scalable code.
- **Node.js**: Runtime environment.
- **Express.js**: Backend framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or above)
- **npm** or **yarn**
- **MongoDB**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Suzon-ali/blogs.git
   ```

2. Navigate to the project directory:
   ```bash
   cd blogs
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following variables:
   ```env
    DATABASE_URL=your_mongodb_connection_string
    NODE_ENV=development
    BCRYPT_SALT_ROUNDS=your_salt
    JWT_ACCESS_SECRET=your_jwt_access_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret
    JWT_ACCESS_EXPIRES_IN=your_access_expiration_time(in days ,ex. 1D)
    JWT_REFRESH_EXPIRES_IN=your_refresh_expiration_time(in days, ex. 365D)
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run start:dev
   ```

2. Access the API at [http://localhost:3000](http://localhost:3000).

---

## API Documentation

### Endpoints

#### Authentication
- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: Log in as a user.

#### Blogs
- **GET** `/blogs`: Get all blogs (public API with search, sorting, and filtering).
- **POST** `/blogs`: Create a new blog (User only).
- **PUT** `/blogs/:id`: Update a blog (User only, for their own blogs).
- **DELETE** `/blogs/:id`: Delete a blog (User for their own blogs, Admin for any blog).

#### Admin Actions
- **PATCH** `/admin/users/:userId/block`: Block a user.
- **DELETE** `/admin/blogs/:id`: Delete any blog.

---

## Folder Structure

```
blog-platform-backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middlewares/       # Authentication & authorization middleware
│   ├── utils/             # Utility functions
│   └── app.ts             # Express app setup
│   └── setver.ts          # Express server setup
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── README.md              # Documentation
```

---

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

---

## Additional Information
For additional documentation, you can refer to the official Express.js documentation and Mongoose documentation.

If you have any questions or run into issues, feel free to open an issue on the GitHub repository
