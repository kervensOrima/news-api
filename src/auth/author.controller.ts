import { NextFunction, Request, Response } from 'express'
import { getAuthorService, findAuthorByEmail, singupService, authorsService, updateAuthorService, findAuthorById } from './author.service'
import { apiResponseError, apiSuccessResponse } from '../config/apiResponse'
import { authorSchema } from './author.schemas'

import bcrypt from 'bcrypt'
import { generateToken } from '../config/auth.token'

export async function getAuthorController(req: Request, resp: Response, next: NextFunction) {
    const author_id: string = req.params.author_id
    try {
        const author = await getAuthorService(author_id)
        if (author === null) {
            const message = `author with pk ${author_id} not found!!!`
            return resp.status(404).json(apiResponseError(message, 404, null))
        }
        const message = `author with pk ${author_id} found successfully`
        return resp.status(200).json(apiSuccessResponse(message, 200, author))
    } catch (error) {
        next(error)
    }
}

export const signupController = async (req: Request, resp: Response) => {
    try {
        const authorRequest = authorSchema.parse(req.body)

        /** check the email address or the username */
        const author = await findAuthorByEmail(authorRequest.username || "", authorRequest.email)
        if (author != null) {
            const message = `${author.username} || ${author.email} Unauthorized!!!`
            return resp.status(409).json(apiResponseError(message, 409, null))
        }
        /** save the author */

        singupService(authorRequest).then(authorResponse => {
            return resp.status(201).json(apiSuccessResponse(`successfully created`, 201, authorResponse))
        })
    } catch (error: any) {
        const message = `Input error for author object`
        return resp.status(403).json(apiResponseError(message, 403, error))
    }
}

export const updateAuthorController = (req: Request, resp: Response) => {
    try {
        // const authorRequest = authorSchema.parse(req.body)
    } catch (error) {
        return resp.status(403).json(apiResponseError('fields error', 403, null))
    }
    const authorRequest = req.body
    const author_id = req.params.author_id

    updateAuthorService(authorRequest, author_id)
        .then(author => {
            return resp.status(202).json(apiSuccessResponse('author successfully update', 202, author))
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError('error while updating auhtor', 500, err))
        })
}


export const signinController = (req: Request, resp: Response, next: NextFunction) => {
    findAuthorByEmail(req.body.username, req.body.email)
        .then(author => {
            if (author === null) {
                return resp.status(404).json(apiResponseError(`${req.body.email} not found!!!`, 404, null))
            }

            return bcrypt.compare(req.body.password, author.password)
                .then(success => {
                    if (!success) {
                        return resp.status(401).json(apiResponseError('Unauthorized to connect', 401, null))
                    }
                    const token = generateToken(author)
                    author.password = ""
                    return resp.json(apiSuccessResponse('successfully authenticated', 200, { author: author, token: token }))
                })
        })
        .catch(err => {
            return resp.status(500).json(apiResponseError('Error while authenticate th author', 500, err))
        })
}


export const getAuthorsController = (req: Request, resp: Response) => {
    const page = req.params.page ?? 1
    const size = req.params.size ?? 18

    authorsService(Number(page), Number(size))
        .then(authors => {
            return resp.status(200).json(apiSuccessResponse('Successfully get author list', 200, authors))
        })
        .catch(error => {
            resp.status(500).json(apiResponseError('Error while loadign author list', 500, error))
        })
}

export const deleteAuthorController = (req: Request, resp: Response) => {
    const author_id: string = req.params.author_id

    findAuthorById(author_id)
        .then(author => {
            if (author === null) {
                return resp.status(404).json(apiResponseError('author not found', 404, null))
            }

            return resp.status(204).json(apiSuccessResponse('successfully delete', 204, author))
        })
        .catch(err => {
            resp.status(500).json(apiResponseError('Error while deleting author', 500, err))
        })
}