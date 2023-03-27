import type {
	Request,
	Response,
	NextFunction,
	ErrorRequestHandler,
} from 'express';
import type { AnyZodObject } from 'zod';

const validateResource =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			next();
		} catch (error: any) {
			return res.status(400).json(error.errors[0]);
		}
	};

export default validateResource;