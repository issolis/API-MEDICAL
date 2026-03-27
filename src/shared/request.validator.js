export class RequestValidator {

    static requireFields(obj, fields) {
        for (const field of fields) {
            if (obj[field] === undefined) {
                throw new Error(`${field} is required`);
            }
        }
    }

    static validateInteger(value, fieldName) {
        const num = Number(value);

        if (!Number.isInteger(num)) {
            throw new Error(`${fieldName} must be an integer`);
        }

        return num;
    }

    static validateIntegers(values, fieldName) {
        return values.map(num =>
            this.validateInteger(num, fieldName)
        );
    }
}