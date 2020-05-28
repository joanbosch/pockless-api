import {Category} from "../actions/send-message";

export class NotificationMessage {
    // @ts-ignore
    constructor({id,title,content,type}){
        this.id = id
        this.title = title
        this.content = content
        this.type = type

    }

    id: string

    title: string

    content: string

    type: Category
}