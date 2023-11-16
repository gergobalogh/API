import {Houston, ConsoleTransport} from "houston"
export const Logger = new Houston([
    new ConsoleTransport()
])
