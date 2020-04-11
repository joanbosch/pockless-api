import { an, is, namedSchema, nested } from "yup-decorator";
import { LatLong } from "../../../common/models/lat-long";


@namedSchema(CreatePockRestInput.name)
export class CreatePockRestInput {
    // @ts-ignore
    constructor({message, location, chatAccess, category, url}) {
        this.message = message;
        this.location = new LatLong(location)
        this.chatAccess = chatAccess ? chatAccess : false
        this.category = category
        this.mediaUrl = url
    }

    @is(an.string().required())
    message: string

    @nested()
    location: LatLong

    @is(an.boolean().notRequired())
    chatAccess?: boolean

    @is(an.string().required())
    category: string

    @is(an.string().notRequired().url())
    mediaUrl?: string
}








