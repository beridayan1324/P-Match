import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const DIALECT = process.env.DB_DIALECT || 'sqlite';

let sequelize: Sequelize;

if (DIALECT === 'sqlite') {
    const storage = process.env.SQLITE_STORAGE || 'database.sqlite';
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage,
        logging: false,
    });
} else {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('DATABASE_URL is required for non-sqlite dialects.');
        process.exit(1);
    }
    sequelize = new Sequelize(databaseUrl, {
        dialect: DIALECT as any,
        logging: false,
    });
}

export default sequelize;