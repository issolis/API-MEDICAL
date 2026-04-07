import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {

    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.authToken;

    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return res.status(401).json({ error: "Token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

export function requireRole(allowedRoles) {
    return (req, res, next) => {

        if (!req.user || !req.user.roles) {
            return res.status(403).json({ error: "No roles found" });
        }
        console.log(req.body);

        const rolesArray = Array.isArray(allowedRoles)
            ? allowedRoles
            : [allowedRoles];

        const hasRole = req.user.roles.some(role =>
            rolesArray.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({ error: "Forbidden" });
        }


        console.log(hasRole); 

        next();
    };
}

export function requireSelfOrAdmin(paramName = "id") {
    return (req, res, next) => {

        const paramValue = req.params[paramName];

        if (!paramValue) {
            return res.status(400).json({ error: "Missing parameter" });
        }

        const paramId = parseInt(paramValue);

        if (isNaN(paramId)) {
            return res.status(400).json({ error: "Invalid parameter" });
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const isAdmin = user.roles.includes(1);
        const isSelf = user.id === paramId;

        if (!isAdmin && !isSelf) {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    };
}