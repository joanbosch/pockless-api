import * as yup from 'yup';

/**
 * Type for the input object of the endpoint /pocks when editing a pock
 */
export type EditPockRestInput = {
    message: string

    chatAccess?: boolean

    category: string

    mediaUrl?: string
}

/**
 * Validator of {@link EditPockRestInput}
 *
 */
const validator = yup.object().shape({
    message: yup.string().required(),
    chatAccess: yup.boolean().notRequired(),
    category: yup.string().required(),
    mediaUrl: yup.string().notRequired().url()
})

/**
 * Validates synchronously that the {@param object} is correct.
 *
 * @param object       object of type {@link EditPockRestInput} to validate
 */
export const validateEditPockRestInput = (object: EditPockRestInput) => validator.isValidSync(object)