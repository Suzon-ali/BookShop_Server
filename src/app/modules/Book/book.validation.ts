import { z } from 'zod';

const bookValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    author: z
      .string()
      .trim()
      .min(2, 'Author must be at least 2 characters')
      .max(100, 'Author cannot exceed 100 characters'),
    price: z.number().min(0, 'Price must be a non-negative number'),
    category: z
      .string()
      .trim()
      .min(2, 'Category must be at least 2 characters')
      .max(50, 'Category cannot exceed 50 characters'),
    stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
    isDeleted: z.boolean().optional(),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    publishedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Published date must be a valid ISO date string',
    }),
  }),
});

const bookUpdateValidationSchema = z.object({
  body: bookValidationSchema.partial(),
});

export const bookValidationSchemas = {
  bookValidationSchema,
  bookUpdateValidationSchema,
};
