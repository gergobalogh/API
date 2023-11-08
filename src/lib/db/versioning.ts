import createDataBaseClient from "./createDataBaseClient.ts";
import logger from '../logging/logger.ts'

const runVersioning = async (): Promise<void> => {
    const db = 'gpt_chatbot';
    const client = await createDataBaseClient('mariadb', 'root', 'auximus', db);

    try {
        logger.logDb('Running versioning')
        logger.logDb('Creating database')
        await client.execute (  `DROP DATABASE ${db}`);
        await client.execute ( `CREATE DATABASE IF NOT EXISTS ${db}`);
        await client.execute(`USE ${db}`);

        logger.logDb('Creating tables')
        await client.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS chat (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                language VARCHAR(20) DEFAULT NULL,
                success INT DEFAULT NULL COMMENT '0=fail;1=success',
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `);

        await client.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                chat_id INT,
                user_id INT,
                human_message TEXT NOT NULL,
                ai_message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (chat_id) REFERENCES chat(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        `);
    } catch (error) {
        console.log(error.message);
    }
};

export default runVersioning;