import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { bookValidationSchemas } from './book.validation';
import { BookControllers } from './book.controller';

const router = express.Router();

//create book
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(bookValidationSchemas.bookValidationSchema),
  BookControllers.createBook,
);

//get All Books
router.get('/', BookControllers.getAllBooks);
router.get('/total-book-count', auth(USER_ROLE.admin), BookControllers.getBookLength);

//get single books by Id
router.get('/:id', BookControllers.getSingleBookById);

//update book
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.updateSingleBook,
);

//delete book
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.deleteBook,
);

export const BookRoutes = router;
