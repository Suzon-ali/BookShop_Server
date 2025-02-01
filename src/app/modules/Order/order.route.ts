import express from 'express'
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { bookValidationSchemas } from '../Book/book.validation';
import { BookControllers } from '../Book/book.controller';
import { orderValidationSchemas } from './order.validation';
import { OrderControllers } from './order.controller';

const router = express.Router();

//create order
router.post(
  '/',
  validateRequest(orderValidationSchemas.orderValidationSchema),
  OrderControllers.createOrder,
);

//get All Orders
router.get('/', BookControllers.getAllBooks);
router.get(
  '/total-book-count',
  auth(USER_ROLE.admin),
  BookControllers.getBookLength,
);

//get single order by Id
router.get('/:id', BookControllers.getSingleBookById);

//update order
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.updateSingleBook,
);

//delete order
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(bookValidationSchemas.bookUpdateValidationSchema),
  BookControllers.deleteBook,
);

export const BookRoutes = router;