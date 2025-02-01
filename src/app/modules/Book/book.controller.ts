/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Book } from './book.model';
import { BookServices } from './book.service';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const book = req?.body;
  const result = await BookServices.creatBookIntoDB(book);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Book created succesfully!',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.getAllBooksFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book fetched succesfully!',
    data: result,
  });
});

const getBookLength = catchAsync(async (req: Request, res: Response) => {
  const allBookLength = await BookServices.getAllBooksLengthFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book fetched succesfully!',
    data: allBookLength,
  });
});

const getSingleBookById = catchAsync(async (req: Request, res: Response) => {
  const result = await BookServices.getSingleBookFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book fetched succesfully!',
    data: result,
  });
});

const updateSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const currentUser = (req as any).user;

  //check if the id is valid objectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid id!', '');
  }

  //check if it's the same user updating it's own book
  if (currentUser.role !== 'admin') {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized!', '');
  }
  const result = await BookServices.updateBookIntoDB(id, payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Book updated succesfully!',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id;
  const currentUser = (req as any).user;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid ID!', '');
  }

  // Fetch the current book
  const currentBook = await Book.findById({ _id: id });

  // Check if the book exists
  if (!currentBook) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Book not found', '');
  }

  // Check if it's the same user or an authorized admin
  if (currentUser?.role !== 'admin') {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized Request!', '');
  }

  //ensure book is deleted
  const result = await BookServices.deleteBookFromDB(id);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Book deleted successfully!',
      data: null,
    });
  }
});

export const BookControllers = {
  createBook,
  getAllBooks,
  updateSingleBook,
  deleteBook,
  getSingleBookById,
  getBookLength,
};
