const { Pool } = require("pg");

const connectionString = process.env.POSTGRES_URI;
const pool = connectionString ? new Pool({ connectionString }) : null;

const connectDB = async () => {
    if (!pool) {
        console.warn("POSTGRES_URI is not configured. Continuing without PostgreSQL.");
        return false;
    }

    try {
        await pool.connect();
        console.log("PostgreSQL connected successfully");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS pdfs (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        return true;
    } catch (error) {
        console.warn("Database connection error: ", error.message || error);
        return false;
    }
};

module.exports = { pool, connectDB };
