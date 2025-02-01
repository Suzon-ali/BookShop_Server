import { z } from 'zod';

const blogValidationSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is requierd!' })
      .min(4, { message: 'Min 4 Charecters' }),
    content: z
      .string({ required_error: 'Content is requierd!' })
      .min(10, { message: 'Min 10 Charecters' }),

    isPublished: z.boolean({ invalid_type_error: 'Invalid type' }).optional(),
    isDeleted: z.boolean({ invalid_type_error: 'Invalid type' }).optional(),
  }),
});

const blogUpdateValidationSchema = z.object({
  body: blogValidationSchema.partial(),
});

export const blogValidationSchemas = {
  blogValidationSchema,
  blogUpdateValidationSchema,
};
