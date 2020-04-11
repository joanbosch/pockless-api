import { an, is, namedSchema } from "yup-decorator";
import { Validator } from "../../../common/models/validator";

@namedSchema(CreateUserRestInput.name)
export class CreateUserRestInput extends Validator {
    // @ts-ignore
    constructor({id, name, birthDate, mail, profileImageUrl, radiusVisibility, accentColor}) {
        super();
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.mail = mail;
        this.profileImageUrl = profileImageUrl;
        this.radiusVisibility = radiusVisibility;
        this.accentColor = accentColor;
    }

    @is(an.string().required())
    id: string

    @is(an.string().required())
    name: string

    @is(an.string().required())
    birthDate: string

    @is(an.string().required().email())
    mail: string

    @is(an.string().required().url())
    profileImageUrl: string
    // settings

    @is(an.number().notRequired().min(1).max(20))
    radiusVisibility: number

    @is(an.string().notRequired())
    accentColor: string
}


