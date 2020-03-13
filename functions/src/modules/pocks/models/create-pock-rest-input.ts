import { LatLong, LatLongValidator } from "../../../common/models/lat-long";
import * as yup from 'yup';

export type CreatePockRestInput = {
    message: string

    location: LatLong

    chatAccess?: boolean

    category: string
}

const validator = yup.object().shape({
    message: yup.string().required(),
    location: LatLongValidator,
    chatAccess: yup.boolean().notRequired(),
    category: yup.string().required()
})

export const validateCreatePockRestInput = (object: CreatePockRestInput) => validator.isValidSync(object)







