import { an, is, namedSchema } from "yup-decorator";

@namedSchema(EditUserProfileRestInput.name)
export class EditUserProfileRestInput {
    // @ts-ignore
    constructor({name, profileImageUrl, radiusVisibility, accentColor}) {
        this.name = name
        this.profileImageUrl = profileImageUrl
        this.radiusVisibility = radiusVisibility
        this.accentColor = accentColor
    }

    @is(an.string().notRequired())
    name?: string

    @is(an.string().notRequired().url())
    profileImageUrl?: string
    // settings

    @is(an.number().notRequired().min(1).max(20))
    radiusVisibility?: number

    @is(an.string().notRequired())
    accentColor?: string
}