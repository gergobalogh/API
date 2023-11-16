import {Houston, FileTransport} from "houston"
export const Logger = new Houston([
    new FileTransport('./logs')
])
