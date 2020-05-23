import {an, is, namedSchema} from "yup-decorator";

@namedSchema(ReportPockRestInput.name)
export class ReportPockRestInput {
    // @ts-ignore
    constructor({motive}) {
        this.motive = motive;
    }

    @is(an.string().notRequired())
    motive?: string
}