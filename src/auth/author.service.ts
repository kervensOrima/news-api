import bcrypt from 'bcrypt'

import { prisma } from "../config/config";
import { SECRET } from "../config/config";
import { generateToken } from '../config/auth.token';

export const getAuthorService = (author_id: string) => {
    return prisma.author.findUnique({
        where: {
            id: author_id
        },
        select: {
            id: true,
            accept: true,
            authority: true,
            email: true,
            username: true
        }
    })
}

export const updateAuthorService = (author: any, author_id: string) => {
    return prisma.author.update({
        data: author,
        where: {
            id: author_id
        },
        select: {
            id: true,
            email: true,
            username: true,
            accept: true,
            authority: true,
            _count: true
        }
    })
}



export const singupService = (author: any) => {
    return bcrypt.hash(author.password, 10).then(hash => {
        author.password = hash

        return prisma.author.create({
            data: author,
            select: {
                id: true,
                email: true,
                username: true,
                accept: true,
                authority: true,
            }
        })
    })
        .catch(err => {
            console.log(err)
            throw new Error(`${err.message}`)
        })

}

export const findAuthorByEmail = (username: string, email: string) => {
    return prisma.author.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ]
        }
    })
}


export const authorsService = (page: number, size: number) => {
    return prisma.author.findMany({
        take: size,
        skip: page,
        select: {
            id: true,
            accept: true,
            email: true,
            username: true,
            _count: true,
            authority: true,

        }
    })
}

export function deleteAuthorService(author_id: string) {
    return prisma.author.delete({
        where: {
            id: author_id
        },
        select: {
            id: true,
            email: true,
            username: true,
            accept: true,
            authority: true,
            _count: true
        }
    })
}


export function findAuthorById (author_id: string) {
    return prisma.author.findUnique({
        where:{
            id: author_id
        } ,
        select: {
            id: true ,
            username: true,
            email: true, 
            accept: true ,
            authority: true ,
        }
    })
}

