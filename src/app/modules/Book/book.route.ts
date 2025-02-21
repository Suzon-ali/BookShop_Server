import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookControllers } from './book.controller';
import { bookValidationSchemas } from './book.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

//create book
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(bookValidationSchemas.bookValidationSchema),
  BookControllers.createBook,
);

//get All Books
router.get('/', BookControllers.getAllBooks);
router.get(
  '/total-book-count',
  auth(USER_ROLE.admin),
  BookControllers.getBookLength,
);

//get single books by Id
router.get('/:id', BookControllers.getSingleBookById);

//update book
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.updateSingleBook,
);

//delete book
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.deleteBook,
);

export const BookRoutes = router;
