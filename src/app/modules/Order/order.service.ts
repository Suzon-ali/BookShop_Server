import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDB = async (payload: TOrder) => {
  const newOrder = new Order(payload);
  const result = await newOrder.save();
  return result;
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const bookQuery = new QueryBuilder(Order.find().populate('author'), query)
    // .search(bookSearchFields.bookSearchableFields)
    // .filter()
    // .sort()
    // .paginate()
    // .fields();

  const result = await bookQuery.modelQuery;
  return result;
};


const updateOrderIntoDB = async (id: string, payload: Partial<TOrder>) => {
  const result = await Order.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

const deleteOrderFromDB = async (id: string) => {
  const result = await Order.findByIdAndUpdate({ _id: id }, { isDeleted: true });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Book not found', '');
  }
  return result;
};

const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById({ _id: id }).populate('author');
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  updateOrderIntoDB,
  deleteOrderFromDB,
  getSingleOrderFromDB
};
