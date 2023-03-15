import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { logger } from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import corsOptions from './config/corsOptions';
import router from './routes/root';

const app = express();

const PORT = process.env.PORT || 3500;

// middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', router);

// deal with 404 errors
app.all('*', (req, res) => {
	res.status(404);

	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ message: '404 Not Found' });
	} else {
		res.type('txt').send('404 Not Found');
	}
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));