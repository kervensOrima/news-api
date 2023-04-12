import { Request, Response, NextFunction } from "express";
import { addCategoryService, deleteNewsService, findCategoryByName, publishedService, showNews } from "./news.service";
import { apiResponseError, apiSuccessResponse } from "../config/apiResponse";
import { categorySchemas, newsSchemas } from "./news.schema";
import slugify from "slugify";


export async function addCategoryController(req: Request, resp: Response) {
    try {
        const categoryRequest = categorySchemas.parse(req.body)
        /** check the cvategory name does not exist */
        const category = await findCategoryByName(categoryRequest.name)
        if (category) {
            return resp.status(208).json(apiResponseError(`category name already exist`, 208, null))
        }
        addCategoryService(categoryRequest).then(categoryResponse => {
            return resp.status(201).json(apiSuccessResponse(`new category added`, 201, categoryResponse))
        })
            .catch(err => {
                return resp.status(500).json(apiResponseError(`internal server error`, 500, err))
            })
    } catch (error: any) {
        return resp.status(402).json(apiResponseError(`Field error`, 402, error.issues))
    }
}

export async function publishedController(req: Request, resp: Response) {
    try {
        const { ...newsrequest } = newsSchemas.parse(req.body)

        newsrequest.slug = slugify(newsrequest.title)

        publishedService(newsrequest).then(news => {
            return resp.status(201).json(apiSuccessResponse(`news added succesfully`, 201, news))
        })
            .catch(err => {
                console.log(err)
                return resp.status(500).json(apiResponseError(`Internal server error`, 500, err))
            })

    } catch (error: any) {
        return resp.status(402).json(apiResponseError(`Field error`, 402, error.issues))
    }
}


export function newsListController(req: Request, resp: Response) {

}


export function updatePublishedController(req: Request, resp: Response) {

}

export function deleteNewsController(req: Request, resp: Response) {
    const id: string = req.params.id
    deleteNewsService(id)
        .then(news => {
            return resp.json(apiSuccessResponse(`${news.title} sucessfully deleted`, 200, news))
        })
        .catch(error => {
            return resp.status(500).json(apiResponseError('internal server error, while deleting the news post', 500, error))
        })
}

export const searchNews = (req: Request, resp: Response) => {
    const page = req.query.page ?? 1
    const size = req.query.size ?? 18
    const published = req.query.published
    const q: string = req.query.query?.toString() ?? ""

    showNews(Number(page), Number(size), q, Boolean(published))
        .then(news => {
            return resp.status(200).json(apiSuccessResponse(`succesfully search data`, 200, news))
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError(`Internal server error`, 500, err))
        })
}
