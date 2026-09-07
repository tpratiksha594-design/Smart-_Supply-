import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;
let isConnectedToMySQL = false;

export const initDbPool = async (): Promise<boolean> => {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'supplysync_db';
    const port = parseInt(process.env.DB_PORT || '3306', 10);

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection with a quick query
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnectedToMySQL = true;
    console.log(`[Database] Successfully connected to MySQL at ${host}:${port}/${database}`);
    return true;
  } catch (error) {
    console.warn(`[Database] Live MySQL connection failed or unavailable. Falling back to high-fidelity In-Memory Database Store.`);
    isConnectedToMySQL = false;
    pool = null;
    return false;
  }
};

export const getDbPool = () => pool;
export const checkIsMySQLConnected = () => isConnectedToMySQL;
