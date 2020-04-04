import { CreatePockRestInput } from "@/modules/pocks/models/create-pock-rest-input";
import * as yup from "yup";

export type CreateUserRestInput = {
    id: string,
    name: string,
    birthDate: number
    mail: string,
    profileImageUrl: string,
    // settings
    radiusVisibility: number
}

const validator = yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
    birthDate: yup.number().required(),
    mail: yup.number().required(),
    profileImageUrl: yup.string().required().url(),
    radiusVisibility: yup.number().notRequired()
})


/**
 * Validates synchronously that the {@param object} is correct.
 *
 * @param object       object of type {@link CreateUserRestInput} to validate
 */
export const validateCreateUserRestInput = (object: CreateUserRestInput) => validator.isValidSync(object)


