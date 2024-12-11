const EXPRESS = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cookieParser = require('cookie-parser');

const APP = EXPRESS();
const PORT = 5000;
const PUBLIC = path.join(__dirname, "public");

// Initialize the database
const dbPromise = open({
    filename: path.join(__dirname, 'data.sqlite'),
    driver: sqlite3.Database
});

// Middleware to attach the database to the request object
APP.use(async (req, res, next) => {
    req.db = await dbPromise;
    next();
});

// Middleware for parsing URL-encoded data (form data)
APP.use(EXPRESS.urlencoded({ extended: true }));

// Middleware for parsing JSON data
APP.use(EXPRESS.json());

// Middleware for cookie parsing
APP.use(cookieParser());

// Initialize the database tables
async function initDB() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            session_token TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
}

// Function to get the session state from cookies
async function getSessionState(req) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        return await req.db.get("SELECT * FROM sessions WHERE session_token = ?", [sessionId]);
    }
    return null;
}

// Initialize the database
initDB().catch(err => console.error(err));

// Routes
APP.get('/', async (req, res) => {
    const sessionState = await getSessionState(req);
    if (sessionState) {
        return res.sendFile(path.join(PUBLIC, "home.html"));
    }
    return res.redirect('/login');
});

APP.get('/register', (req, res) => {
    res.sendFile(path.join(PUBLIC, "register.html"));
});

APP.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    try {
        await req.db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
        res.redirect('/login');
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).send("Username already exists.");
        }
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

APP.get('/login', (req, res) => {
    res.sendFile(path.join(PUBLIC, "login.html"));
});

APP.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    const user = await req.db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (user && password === user.password) {
        const sessionToken = uuidv4();
        await req.db.run("INSERT INTO sessions (user_id, session_token) VALUES (?, ?)", [user.id, sessionToken]);
        res.cookie('sessionId', sessionToken);
        return res.redirect('/'); // Redirect to home after successful login
    } else {
        return res.status(401).send("Invalid username or password.");
    }
});

APP.get('/logout', async (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
        await req.db.run("DELETE FROM sessions WHERE session_token = ?", [sessionId]);
        res.clearCookie('sessionId');
    }

    res.redirect('/login'); // Redirect to login page
});

// Serve static files
APP.use(EXPRESS.static(PUBLIC));

// Start the server
APP.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
