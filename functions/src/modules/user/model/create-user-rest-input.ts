import * as yup from "yup";

export type CreateUserRestInput = {
    id: string,
    name: string,
    birthDate: string
    mail: string,
    profileImageUrl: string,
    // settings
    radiusVisibility: number,
    accentColor: string
}

const validator = yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
    birthDate: yup.string().required(),
    mail: yup.string().required().email(),
    profileImageUrl: yup.string().notRequired().url(),
    radiusVisibility: yup.number().notRequired().min(1).max(20),
    accentColor: yup.string().notRequired()
})


/**
 * Validates synchronously that the {@param object} is correct.
 *
 * @param object       object of type {@link CreateUserRestInput} to validate
 */
export const validateCreateUserRestInput = (object: CreateUserRestInput) => validator.isValidSync(object)


