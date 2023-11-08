import logger from "../lib/logging/logger.ts";
import createDataBaseClient from "../lib/db/createDataBaseClient.ts";
// @ts-ignore
import {Client} from "mariadb";



const getOrderStatus = async(invoiceId: number) => {
    logger.logDb('Running query to get order status for invoiceId: ' + invoiceId)
    const client: Client = await createDataBaseClient('mariadb', 'root', 'auximus', 'logistics_wh')
    const orderStatus = await client.query(
        'SELECT os.description FROM rc_order o JOIN order_status os ON o.order_status = os.id WHERE order_id = ? LIMIT 1',
        [Number(invoiceId)]
    );
    return orderStatus[0].description

}
export {
    getOrderStatus
}

