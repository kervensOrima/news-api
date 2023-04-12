
import jsonwebtoken from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { SECRET } from './config'
import { apiResponseError, apiSuccessResponse } from './apiResponse'

export function generateToken(data: any) {
    /*** password is valid, let s register the author token */
    return jsonwebtoken.sign({ author: data }, SECRET, { expiresIn: '1y' })
}


export function authenticated(req: Request, resp: Response, next: NextFunction) {

    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
        return resp.status(403).json(apiResponseError('no header authorization', 403, null))
    }

    const token = authorizationHeader.split(' ')[1]

    jsonwebtoken.verify(token, SECRET, (error: any, decodeToken: any) => {
        if (error) {
            return resp.status(500).json(apiResponseError('Error authenticated', 500, error.message))
        }

        const author = decodeToken.author

        if (req.body.user && req.body.author !== author) {
            return resp.status(402).json(apiResponseError('Error to authenticated auther', 402, null))
        } else {
            next()
        }
    })
}