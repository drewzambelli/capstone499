
---

# Project Setup and Installation Guide

## Project Setup

### 1. Environment Configuration

#### Frontend

1. **Create .env File:**
   - Navigate to the `capstone499` root project folder.
   - Create a file named `.env`.

2. **Add Credentials and API Key:**
   - In the `.env` file, add the following lines:
     ```plaintext
     MONGO_USERNAME: "username"
     MONGO_PASSWORD: "password"
     VITE_GOOGLE_MAPS_API_KEY: "KEY-HERE"
     ```

#### Backend

1. **Create .env File:**
   - Navigate to the `backend` folder.
   - Create a file named `.env`.

2. **Add Credentials and API Key:**
   - In the `.env` file, add the following lines:
     ```plaintext
     MONGO_USERNAME: "username"
     MONGO_PASSWORD: "password"
     GOOGLE_MAPS_API_KEY: "KEY-HERE"
     ```

## Installation

### Terminal 1: Backend

1. Navigate to the backend directory:
   ```sh
   cd capstone499/backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the server:
   ```sh
   npm run server
   ```

### Terminal 2: Frontend

1. Navigate to the root directory of the project:
   ```sh
   cd capstone499
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

---


