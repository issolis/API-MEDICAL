export class PatientValidator {

    static validateCreate(req, res, next) {
        try {
            const { fName, lName } = req.body;

            if (!fName || !lName) {
                throw new Error("Missing patient name");
            }

            if (typeof fName !== "string" || typeof lName !== "string") {
                throw new Error("Names must be strings");
            }

            req.body.fName = fName.trim();
            req.body.lName = lName.trim();

            if (!req.body.fName || !req.body.lName) {
                throw new Error("Invalid names");
            }

            next();

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}