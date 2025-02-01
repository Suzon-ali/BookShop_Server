/* eslint-disable no-unused-vars */
import { Model } from "mongoose";

export type TOrder = {
  author: string;
  items: {
    bookId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery';
  createdAt: Date;
  updatedAt: Date;
};

export interface OrderModel extends Model<TOrder> {
    isOrderExistById(id: string): Promise<TOrder | null>;
}
  

