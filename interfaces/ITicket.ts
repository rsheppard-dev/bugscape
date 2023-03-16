import type { ObjectId } from 'mongoose';

interface ITicket {
	_id: ObjectId | string;
	userId: ObjectId | string;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export default ITicket;