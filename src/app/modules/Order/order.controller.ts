/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import { Order } from "./order.model";
import mongoose from "mongoose";
import AppError from "../../error/AppError";


const createOrder = catchAsync(async (req: Request, res: Response) => {
    const loggedInUser = (req as any).user;
    const order = {
      ...req.body,
      author: loggedInUser?.id,
    };
    const result = await OrderServices.createOrderIntoDB(order);
    const populatedResult = await result.populate('author');
  
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Order placed succesfully!',
      data: populatedResult,
    });
  });

  //Need to modify

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderServices.getAllOrdersFromDB(req.query);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Book fetched succesfully!',
      data: result,
    });
  });
  
  
  const getSingleOrderById = catchAsync(async (req: Request, res: Response) => {
    const result = await OrderServices.getSingleOrderFromDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Book fetched succesfully!',
      data: result,
    });
  });
  
  const updateSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;
    const currentUser = (req as any).user;
    const currentBook = await Order.findById({ _id: id });
  
    //check if the id is valid objectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid id!', '');
    }
  
    //check if it's the same user updating it's own book
    if (currentUser.author !== currentBook?.author?.toString()) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized Request! here',
        '',
      );
    }
    const result = await OrderServices.updateOrderIntoDB(id, payload);
    const populatedResult = await result?.populate('author');
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Book updated succesfully!',
      data: populatedResult,
    });
  });
  
  const deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const id = req?.params?.id;
    const currentUser = (req as any).user;
  
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid ID!', '');
    }
  
    // Fetch the current book
    const currentBook = await Order.findById({ _id: id });
  
    // Check if the book exists
    if (!currentBook) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Book not found', '');
    }
  
    // Check if it's the same user or an authorized admin
    if (currentUser?.author !== currentBook?.author?.toString()) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized Request!', '');
    }
  
    //ensure book is deleted
    const result = await OrderServices.deleteOrderFromDB(id);
  
    if (result) {
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Book deleted successfully!',
        data: null,
      });
    }
  });


  export const OrderControllers = {
    createOrder,
    getAllOrders,
    getSingleOrderById,
    updateSingleOrder,
    deleteOrder
  }