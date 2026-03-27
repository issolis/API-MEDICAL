import express from 'express';
import cors from 'cors';

import userRoutes from './src/modules/users/user.routes.js';
import userRoleRoutes from './src/modules/user_role/user_role.routes.js';
import roleRoutes from './src/modules/role/role.routes.js'


const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use(cors());

app.use('/users', userRoutes);
app.use('/user-roles', userRoleRoutes);
app.use('/roles', roleRoutes)

app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});