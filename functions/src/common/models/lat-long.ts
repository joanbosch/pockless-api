import * as yup from 'yup';

export type LatLong = {

    latitude: number

    longitude: number
}

export const LatLongValidator = yup.object().shape({
    latitude: yup.number().required().min(-90).max(90),
    longitude: yup.number().required().min(-180).max(180)
})

export const validateLatLong = (object: LatLong) => LatLongValidator.isValidSync(object)

