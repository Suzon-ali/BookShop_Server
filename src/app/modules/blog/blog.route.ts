import express from 'express';
import { BlogControllers } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { blogValidationSchemas } from './blog.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

//create blog
router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(blogValidationSchemas.blogValidationSchema),
  BlogControllers.createBlog,
);

//get All Blogs
router.get('/', BlogControllers.getAllBlogs);
router.get('/total-blog-count', auth(USER_ROLE.admin), BlogControllers.getBlogLength);

//get single blogs by Id
router.get('/:id', BlogControllers.getSingleBlogById);

//update blog
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(blogValidationSchemas.blogUpdateValidationSchema),
  BlogControllers.updateSingleBlog,
);

//delete blog
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(blogValidationSchemas.blogUpdateValidationSchema),
  BlogControllers.deleteBlog,
);

export const BlogRoutes = router;
