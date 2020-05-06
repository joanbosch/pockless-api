/**
 * Type of the ChatMessage
 *
 * It has no validator as it is an outgoing object (database -> external device).
 */
export class ChatMessage {
    // @ts-ignore
    constructor({id, text, senderId, read, date, chatId}) {
        this.id = id
        this.text = text
        this.senderId = senderId
        this.read = read
        this.date = date
        this.chatId = chatId
    }

    id: string

    text: string

    senderId: string

    read: boolean

    date: number

    chatId: string
}