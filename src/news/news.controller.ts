import { Request, Response, } from "express";
import { addCategoryService, commentListService, commentService, deleteNewsService, findByIdService, findCategoryByName, getCommentsByUser, publishedService, showNews, updateNewsService } from "./news.service";
import { apiResponseError, apiSuccessResponse } from "../config/apiResponse";
import { categorySchemas, commentSchemas, newsSchemas } from "./news.schema";
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




export async function updateNewsController(req: Request, resp: Response) {
    const id: string = req.params.id
    const news = await findByIdService(id)

    if (news === null) {
        return resp.status(404).json(apiResponseError(`news not found by this id`, 404, null))
    }

    updateNewsService(req.body, id)
        .then(newsResponse => {
            return resp.status(202).json(apiSuccessResponse(`successfully update`, 200, newsResponse))
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError(`Internal server error`, 500, err))
        })
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

export const commentController = (req: Request, resp: Response) => {
    try {
        const { ...commentRequest } = commentSchemas.parse(req.body)

        commentService(commentRequest).then(comment => {
            return resp.status(201).json(apiSuccessResponse(`comment susccessfully added`, 201, comment))
        })
            .catch(err => {
                return resp.status(500).json(apiResponseError(`Internal server error`, 500, err))
            })

    } catch (error: any) {
        return resp.status(402).json(apiResponseError(`Field error`, 402, error.issues))
    }

}

export const commentListController = (req: Request, resp: Response) => {
    const page = req.query.page ?? 1
    const size = req.query.size ?? 18
    const q = req.query.query?.toString() ?? ""

    commentListService(Number(page), Number(size), q)
        .then(comments => {
            return resp.json(apiSuccessResponse(`list comments results`, 200, comments))
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError(`Internal server error`, 500, err))
        })
}


export const getCommentsByAuthorController = (req: Request, resp: Response) => {
    const page = req.query.page ?? 1
    const size = req.query.size ?? 18
    const auhtor_id = req.params.author_id

    getCommentsByUser(auhtor_id, Number(page), Number(size))
        .then(author => {
            if (!author) {
                return resp.status(404).json(apiResponseError(`Author not found!!!`, 404, null))
            }
            return resp.json(apiSuccessResponse(`author successfully find in the database`, 200, author))
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError(`Internal server eror`, 500, err))
        })
}
