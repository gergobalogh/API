// @ts-ignore
import {Client} from "mariadb";


const createDataBaseClient = async (
    host: string,
    username: string,
    password: string,
    db: string
): Client => {
    const client = new Client();
    const connectionConfig = {
        hostname: host,
        username: username,
        password: password,
        db: db
    };

    return await client.connect(connectionConfig);
};

export default createDataBaseClient;