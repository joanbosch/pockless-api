import { LatLong, validateLatLong } from "../lat-long"

describe('LatLong', () => {
    describe('given a LatLong object with valid values', () => {
        const latLong: LatLong = {
            latitude: 50,
            longitude: 60
        }

        it('should return true when validating', function () {
            expect(validateLatLong(latLong)).toBeTruthy()
        });
    })
    describe('given a LatLong object with invalid values', () => {
        const latLong: LatLong = {
            latitude: 500,
            longitude: 60
        }

        it('should return false when validating', function () {
            expect(validateLatLong(latLong)).toBeFalsy()
        });
    })

    describe('given a LatLong object with fields missing', () => {
        const latLong = {
            latitude: 500
        }

        it('should return false when validating', function () {
            // @ts-ignore
            expect(validateLatLong(latLong)).toBeFalsy()
        });
    })
})
