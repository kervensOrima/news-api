import { Router } from "express";
import { addCategoryController, publishedController, searchNews } from "./news.controller";


export const router = Router()


/** published one news */
router.post('' , publishedController)

/** get news */
router.get('', searchNews)


/** add new category without any news */
router.post('/categories/', addCategoryController)

