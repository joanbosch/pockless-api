import { Server } from "typescript-rest";

export const listPaths = () => {
    console.log('Listing found paths:')
    Server.getPaths().forEach(path => console.log('/api' + path))
}
