import { an, is, namedSchema } from "yup-decorator";

@namedSchema(CreateMessageRestInput.name)
export class CreateMessageRestInput {
    // @ts-ignore
    constructor({text, chatId, pockId}) {
        this.text = text
        this.chatId = chatId
        this.pockId = pockId
    }

    @is(an.string().required())
    text: string

    @is(an.string().notRequired().nullable())
    chatId?: string

    @is(an.string().notRequired().nullable())
    pockId?: string
}