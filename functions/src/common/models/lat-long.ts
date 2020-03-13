import * as yup from 'yup';

/**
 * Latitude-Longitude type
 */
export type LatLong = {

    latitude: number

    longitude: number
}

/**
 * Validator of the {@link LatLong type}.
 *
 * Validates that all the information contained in a LatLong object
 * is correct.
 */
export const LatLongValidator = yup.object().shape({
    latitude: yup.number().required().min(-90).max(90),
    longitude: yup.number().required().min(-180).max(180)
})

/**
 * Sync validator for a LatLong object.
 *
 * @param object    Object to validate against {@link #LatLongValidator}
 */
export const validateLatLong = (object: LatLong) => LatLongValidator.isValidSync(object)

