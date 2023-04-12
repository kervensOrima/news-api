
import { Request, Response } from 'express'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'


import { apiResponseError } from './config/apiResponse'
import { router as authorRouter } from './auth/author.router'
import { router as newsRouter } from './news/news.routes'



const app = express()
const PORT = 3000

const BASE_DIR = path.dirname(__dirname)
const RESSOURCES = path.join(BASE_DIR, "assets")

app
    .use(express.json())
    .use(bodyParser.json())
    .use(cors())
    .use(express.static(path.join(RESSOURCES)))
    .use('/api/authors/', authorRouter)
    .use('/api/news/', newsRouter)
    .use(morgan('dev'))



/** middleare for error 404 */
app.use((req: Request, resp: Response) => {
    const message = `Bad request, URL : ${req.url} not found!!! try later...`
    return resp.status(404).json(apiResponseError(message, 404, undefined))
})

app.listen(PORT, () => {
    console.log(`Server is running in : http://localhost${PORT}`)
})