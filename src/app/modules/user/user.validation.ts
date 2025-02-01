import { z } from 'zod';
import { User } from './user.model';

const UserRegistrationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required!' })
      .email({ message: 'Invalid email format!' })
      .refine(
        async (email) => {
          const user = await User.findOne({ email });
          return !user;
        },
        { message: 'User already exist' },
      ),
    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, 'Password must be at least 6 characters'),
    name: z
      .string({ message: 'Name must be string' })
      .min(1, 'Name is required'),
  }),
});

// CartItem validation schema
const CartItemSchema = z.object({
  productId: z.string().nonempty('Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Order validation schema
const OrderSchema = z.object({
  orderId: z.string().nonempty('Order ID is required'),
  products: z.array(CartItemSchema).nonempty('Products cannot be empty'),
  totalAmount: z.number().min(0, 'Total amount must be at least 0'),
  orderDate: z.date(),
  status: z.enum(['Pending', 'Shipped', 'Delivered', 'Cancelled']),
});

// User validation schema
export const UserValidationSchema = z.object({
  id: z.string().nonempty('User ID is required'),
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^\+?\d{7,15}$/, 'Invalid phone number format')
    .optional(),
  role: z.enum(['user', 'admin']),
  cart: z.array(CartItemSchema).optional(),
  orders: z.array(OrderSchema).optional(),
  wishlist: z.array(z.string()).optional(),
});

const UserUpdateValidationSchema = z.object({
  body: UserValidationSchema.partial(),
});

export const UserValidationSchemas = {
  UserValidationSchema,
  UserUpdateValidationSchema,
  UserRegistrationSchema,
};
