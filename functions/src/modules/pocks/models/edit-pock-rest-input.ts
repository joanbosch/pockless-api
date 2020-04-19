import { an, is, namedSchema } from "yup-decorator";

@namedSchema(EditPockRestInput.name)
export class EditPockRestInput {
    // @ts-ignore
    constructor({message, chatAccess, category, url}) {
        this.message = message;
        this.chatAccess = chatAccess ? chatAccess : false
        this.category = category
        this.mediaUrl = url
    }

    @is(an.string().notRequired())
    message?: string

    @is(an.boolean().notRequired())
    chatAccess?: boolean

    @is(an.string().notRequired())
    category?: string

    @is(an.string().notRequired().url())
    mediaUrl?: string
}