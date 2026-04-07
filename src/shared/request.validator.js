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
    static validateString(value, fieldName, { min = 1, max = 100 } = {}) {
        if (typeof value !== "string") {
            throw new Error(`${fieldName} must be a string`);
        }

        const trimmed = value.trim();

        if (trimmed.length < min) {
            throw new Error(`${fieldName} must be at least ${min} characters`);
        }

        if (trimmed.length > max) {
            throw new Error(`${fieldName} must be at most ${max} characters`);
        }

        return trimmed;
    }

    static validateIntegers(values, fieldName) {
        return values.map(num =>
            this.validateInteger(num, fieldName)
        );
    }
}