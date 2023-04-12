import { Router } from "express";
import { addCategoryController, commentController, commentListController, getCommentsByAuthorController, publishedController, searchNews, updateNewsController } from "./news.controller";
import { authenticated  } from '../config/auth.token'

export const router = Router()


/** published one news */
router.post('', publishedController)

/** get news */
router.get('', searchNews)


router.put('', updateNewsController)


/** add new category without any news */
router.post('/categories/', addCategoryController)


router.post('/comments/', commentController)


/** see list of comments */
router.get('/comments/', authenticated , commentListController)


/** get comments for the author */
router.get('/author/:author_id/news-comments/', getCommentsByAuthorController)
