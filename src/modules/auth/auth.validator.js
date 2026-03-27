import { RequestValidator } from "../../shared/request.validator.js"


export class AuthValidator{

    static async validateLogin(req, res, next){
        try {
            
            RequestValidator.requireFields(req.body, ["id", "password"]);
            RequestValidator.validateInteger(req.body.id, "id"); 
            RequestValidator.validateString(req.body.password, "password"); 

            next(); 
            
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}