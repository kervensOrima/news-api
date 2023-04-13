
import { Request, Response } from 'express'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { apiResponseError } from './config/apiResponse'
import { router as authorRouter } from './auth/author.router'
import { router as newsRouter } from './news/news.router'

const app = express()
const PORT = 3000

const BASE_DIR = path.dirname(__dirname)
const RESSOURCES = path.join(BASE_DIR, "assets")


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Nom de votre API',
            version: '1.0.0',
            description: 'Description de votre API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            },
        ],
    },
    apis: ['./src/news/news.router.ts', './src/auth/author.router.ts'],
};



const swaggerSpec = swaggerJSDoc(swaggerOptions);


app
    .use(express.json())
    .use(bodyParser.json())
    .use(cors())
    .use(express.static(path.join(RESSOURCES)))
    .use('/api/authors/', authorRouter)
    .use('/api/news/', newsRouter)
    .use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    .use(morgan('dev'))



/** middleare for error 404 */
app.use((req: Request, resp: Response) => {
    const message = `Bad request, URL : ${req.url} not found!!! try later...`
    return resp.status(404).json(apiResponseError(message, 404, undefined))
})

app.listen(PORT, () => {
    console.log(`Server is running in : http://localhost${PORT}`)
})

