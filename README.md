# Simple Yeshiva Website Project

A simple web application built using Node.js and Express, designed as a boilerplate setup for a yeshiva coding project. This project provides basic user registration and login functionality, along with session management using cookies and SQLite for data storage.

## Features

- User registration and login
- Session management using cookies
- SQLite database for storing user credentials and sessions
- Basic error handling

## Project Structure

```
SimpleWebsiteYeshivaProject/
│
├── index.js              # Main server file containing application logic
├── package.json          # Project metadata and dependencies
├── data.sqlite           # SQLite database file (created automatically)
└── public/               # Directory for static files
    ├── home.html        # Home page HTML
    ├── login.html       # Login page HTML
    └── register.html    # Registration page HTML
```

## Prerequisites

Before running the application, please ensure that you have the following software installed on your machine:

* <b>[Node.js](https://nodejs.org/en/download/package-manager)</b>: This is essential for running the application. Node.js provides the JavaScript runtime environment needed to execute the server-side code.
* <b>[Visual Studio Code (VSCode)](https://code.visualstudio.com/Download)</b>: A powerful and user-friendly code editor that enhances your programming experience. VSCode offers features like syntax highlighting, debugging tools, and extensions that help you code more efficiently compared to traditional IDEs like Visual Studio.
Make sure to follow the installation instructions provided on the respective websites to set up these tools correctly.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/iTSiolinux/SimpleWebsiteYeshivaProject.git
   cd SimpleWebsiteYeshivaProject
   ```

2. **Install Dependencies**:
   Navigate to the project directory and install the required dependencies:
   ```bash
   npm install
   ```

3. **Run the Application**:
   You can start the server using the following command:
   ```bash
   npm start
   ```
   Alternatively, for development mode (with auto-reload), use:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open your web browser and navigate to `http://localhost:5000`. You should see the home page or be redirected to the login page if you are not logged in.

## Usage

* **Register**: Go to `/register` to create a new user account.
* **Login**: Go to `/login` to log in with your credentials.
* **Home**: Visit `/` to view your session ID. If you're not logged in, you'll be redirected to `/login`.
* **Logout**: `/logout` Click the logout link to end your session.