import { LatLong } from "../lat-long"

describe('LatLong', () => {
    describe('given a LatLong object with valid values', () => {
        const latLong = new LatLong({
            latitude: 50,
            longitude: 60
        })

        it('should return true when validating', function () {
            expect(latLong.validate()).toBeTruthy()
        });
    })
    describe('given a LatLong object with invalid values', () => {
        const latLong = new LatLong({
            latitude: 500,
            longitude: 60
        })

        it('should return false when validating', function () {
            expect(latLong.validate()).toBeFalsy()
        });
    })

    describe('given a LatLong object with fields missing', () => {
        // @ts-ignore
        const latLong = new LatLong({
            longitude: 60
        })

        it('should return false when validating', function () {
            expect(latLong.validate()).toBeFalsy()
        });
    })
})
