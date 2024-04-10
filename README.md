# Node.js Express API with JWT Authentication, CRUD Operations, and File Upload/Download

## Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
  - [User Authentication](#user-authentication)
  - [Product CRUD Operations](#product-crud-operations)
  - [File Upload/Download Operations](#file-uploaddownload-operations)
- [Error Handling](#error-handling)
- [Models](#models)
  - [User Model](#user-model)
  - [User Products Model](#user-products-model)
  - [File Detail Model](#file-detail-model)
  - [Token Blacklist Model](#token-blacklist-model)

## Overview

This repository contains a Node.js API built with Express.js, providing user authentication using JWT (JSON Web Tokens), CRUD (Create, Read, Update, Delete) operations for products, and file upload/download functionalities.

## Technologies Used

- **Node.js**: A JavaScript runtime for building the server-side application.
- **Express.js**: A fast, unopinionated, and minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database used to store user and product data.
- **jsonwebtoken**: A library to generate and verify JSON Web Tokens for user authentication.
- **bcrypt**: A library to hash and compare passwords securely.
- **multer**: A middleware for handling `multipart/form-data`, used for file upload.
- **mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

## Project Structure
```
.
├── index.js
├── routes
│   ├── auth-routes.js
│   ├── productRoutes.js
│   └── file-routes.js
├── controllers
│   ├── auth-controller.js
│   ├── product-controller.js
│   └── file-controller.js
├── middlewares
│   └── auth-middleware.js
├── models
│   ├── user-model.js
│   ├── user-product-model.js
│   ├── file-model.js
│   └── token-blacklist-model.js
├── constants
│   └── constants.js
└── utils
    ├── error-handler.js
    └── file-storage-config.js
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sabari570/Backend-Task-2-JWT-authenticated-APIs-for-user-product-and-file-manipulation-.git
```

2. Navigate to the project directory:

```bash
cd nodejs-express-jwt-crud
```

3. Install dependencies:

```bash
npm install
```

## Configuration

Create a \`.env\` file in the root directory and add the following:

```env
JWT_ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key
JWT_REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key
PORT=port_number_to_run_the_server
```

## Running the Application

```bash
npm run dev
```

## Endpoints

### User Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate and login a user
- `POST /api/auth/regenerate-token`: Refresh the JWT token
- `POST /api/auth/logout`: Logout a user

### Product CRUD Operations

- `POST /api/products/create-product`: Create a new product
- `GET /api/products/fetch-products`: Fetch all products for a user
- `GET /api/products/fetch-product/:id`: Fetch a single product by ID
- `PUT /api/products/update-product/:id`: Update a product by ID
- `DELETE /api/products/delete-product/:id`: Delete a product by ID

### File Upload/Download Operations

- `POST /api/file/upload-file`: Upload a file
- `GET /api/file/download-file/:fileId`: Download a file by ID

## Error Handling

Errors are handled using a custom error handler utility (`error-handler.js`) which formats the error messages.

## Models

### User Model

The mongoose model for the User schema.

### User Products Model

The mongoose model for the UserProducts schema.

### File Detail Model

The mongoose model for storing file details related to the user.

### Token Blacklist Model

The mongoose model for storing the blacklisted tokens. These tokens expire after 1 hour.
