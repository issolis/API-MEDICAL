import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './src/modules/users/user.routes.js';
import userRoleRoutes from './src/modules/user_role/user_role.routes.js';
import roleRoutes from './src/modules/role/role.routes.js'
import doctorRoutes from "./src/modules/doctor/doctor.routes.js";
import surgeryRoutes from "./src/modules/surgery/surgery.routes.js"
import authRoutes from "./src/modules/auth/auth.routes.js";
import { authenticate } from './src/shared/auth.middleware.js';
import patientRoutes from "./src/modules/patient/patient.routes.js"

const app = express();
const PORT = 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));

app.use("/auth", authRoutes);

app.use("/users", authenticate, userRoutes);
app.use("/roles", authenticate, roleRoutes);
app.use("/user_role", authenticate, userRoleRoutes);
app.use("/doctors", authenticate, doctorRoutes);
app.use("/patient", authenticate, patientRoutes); 
app.use("/surgery", authenticate, surgeryRoutes); 

app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});