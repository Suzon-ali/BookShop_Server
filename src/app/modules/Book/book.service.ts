import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TBook } from './book.interface';
import { Book } from './book.model';
import { bookSearchFields } from './book.constant';

const creatBookIntoDB = async (payload: TBook) => {
  const title = payload?.title;
  const author = payload?.author;

  const isBookAlreadyExist = await Book.findOne({ title : title, author: author });
  if (isBookAlreadyExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This book already Exist!', '');
  }
  const newBook = new Book(payload);
  const result = await newBook.save();
  return result;
};

const getAllBooksFromDB = async (query: Record<string, unknown>) => {
  const bookQuery = new QueryBuilder(Book.find().populate('author'), query)
    .search(bookSearchFields.bookSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await bookQuery.modelQuery;
  return result;
};

const getAllBooksLengthFromDB = async () => {
  const result = await Book.find();
  return result.length;
};

const updateBookIntoDB = async (id: string, payload: Partial<TBook>) => {
  const result = await Book.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

const deleteBookFromDB = async (id: string) => {
  const result = await Book.findByIdAndUpdate({ _id: id }, { isDeleted: true });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Book not found', '');
  }
  return result;
};

const getSingleBookFromDB = async (id: string) => {
  const result = await Book.findById({ _id: id }).populate('author');
  return result;
};

export const BookServices = {
  getAllBooksFromDB,
  creatBookIntoDB,
  updateBookIntoDB,
  deleteBookFromDB,
  getSingleBookFromDB,
  getAllBooksLengthFromDB,
};
