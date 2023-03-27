import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import { logger, logEvents } from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import corsOptions from '../config/corsOptions';
import router from './routes/index';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import teamRouter from './routes/team.routes';
import projectRouter from './routes/project.routes';
import ticketRouter from './routes/ticket.routes';
import connectDB from '../config/db';

const app = express();

const PORT = config.get('port');

// connect to database
connectDB();

// middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

// routes
app.use('/', router);
// app.use('/auth', authRouter);
app.use('/user', userRouter);
// app.use('/team', teamRouter);
// app.use('/project', projectRouter);
// app.use('/ticket', ticketRouter);

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

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', error => {
	console.log(error);
	logEvents(
		`${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
		'mongoErrLog.log'
	);
});