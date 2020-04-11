import { isValidSync } from "yup-decorator";

export class Validator {
    validate() {
        return isValidSync({object: this})
    }
}
