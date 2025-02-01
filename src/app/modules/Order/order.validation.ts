import { z } from 'zod';

const orderValidationSchema = z.object({
  author: z.string().trim().min(1, 'User ID is required'), // User placing the order
  items: z
    .array(
      z.object({
        bookId: z.string().trim().min(1, 'Book ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        price: z.number().min(0, 'Price must be a non-negative number'),
      }),
    )
    .min(1, 'At least one item is required'),
  totalAmount: z.number().min(0, 'Total amount must be a non-negative number'),
  status: z
    .enum(['pending', 'shipped', 'delivered', 'cancelled'])
    .default('pending'),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
});

export const orderValidationSchemas = {
  orderValidationSchema,
};
