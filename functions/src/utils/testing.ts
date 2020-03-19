import { Server } from "typescript-rest";

/**
 * Lists all the paths of the server.
 *
 * Not suitable for PROD server, it is logged on every call.
 */
export const listPaths = () => {
    console.log('Listing found paths:')
    Server.getPaths().forEach(path => console.log('/api' + path))
}
