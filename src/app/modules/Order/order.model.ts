import { model, Schema } from 'mongoose';
import { OrderModel, TOrder } from './order.interface';

export const OrderSchema = new Schema<TOrder, OrderModel>(
  {
    author: { type: String, ref: 'User', required: true },
    items: [
      {
        bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'cash_on_delivery'],
      required: true,
    },
  },
  { timestamps: true },
);

//middlewares

// OrderSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
//   this.where({ isDeleted: { $ne: true }, isPublished: { $ne: false } });
//   next();
// });

// OrderSchema.pre('aggregate', function (next) {
//   const pipeline = this.pipeline();
//   pipeline.unshift({
//     $match: { isDeleted: { $ne: true }, isPublished: { $ne: false } },
//   });
//   next();
// });

export const Order = model<TOrder, OrderModel>('Order', OrderSchema);
