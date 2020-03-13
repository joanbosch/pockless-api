import { LatLong, LatLongValidator } from "../../../common/models/lat-long";
import * as yup from 'yup';

/**
 * Type for the input object of the endpoint /pocks
 */
export type CreatePockRestInput = {
    message: string

    location: LatLong

    chatAccess?: boolean

    category: string
}

/**
 * Validator of {@link CreatePockRestInput}
 *
 */
const validator = yup.object().shape({
    message: yup.string().required(),
    location: LatLongValidator,
    chatAccess: yup.boolean().notRequired(),
    category: yup.string().required()
})

/**
 * Validates synchronously that the {@param object} is correct.
 *
 * @param object       object of type {@link CreatePockRestInput} to validate
 */
export const validateCreatePockRestInput = (object: CreatePockRestInput) => validator.isValidSync(object)







