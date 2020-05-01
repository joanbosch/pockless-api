import {Category} from "../actions/send-message";

export interface Message {
    id?: string

    //Title of the message, it is not required
    title: string,

    //Content of the message, it is not required for all cases
    content: string,

    //Category of the message, it is required
    type: Category

    //Extra things to add
    extra: any

}