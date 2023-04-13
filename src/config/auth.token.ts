
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
    console.log('First')

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

export function checkRoles(authorities: string[]) {
    return (req: Request, resp: Response, next: NextFunction) => {
        console.log('Last')

        const authorization = req.headers.authorization

        if (authorization) {
            const token = authorization.split(" ")[1]

            jsonwebtoken.verify(token, SECRET, (err: any, decodeToken: any) => {
                if (err) {
                    return resp.status(403).json('Error to access')
                }

                const author = decodeToken.author
                const authority = author.authority

                // console.log(authorities)
                // console.log(author)
                // console.log(authority)

                let access = false

                if (authority) {
                    authority.forEach((e: any) => {
                        if (authorities.includes(e)) {
                            access = true
                        }
                    });

                    if (!access)
                        return resp.status(403).json(apiResponseError(`Access denied`, 403, null))
                    else {
                        next()
                    }
                }
            })
        }

    }
}
