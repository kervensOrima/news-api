import { prisma } from "../config/config";


export const deleteNewsService = (news_pk: string) => {
    return prisma.news.delete({
        where: {
            id: news_pk
        },
        select: {
            id: true,
            title: true,
            created_at: true,
            updated_at: true,
            published: true,
            slug: true,
            thumbnail_links: true,
            content: true,
            category: true,
            _count: true
        }
    })
}

export const addCategoryService = (category: any) => {
    return prisma.category.create({
        data: category,
        select: {
            id: true,
            name: true,
            _count: true
        }
    })
}


export const findCategoryByName = (name: string) => {
    return prisma.category.findFirst({
        where: {
            name: name
        },
        select: {
            id: true,
            name: true,
            _count: true,
        }
    })
}


export function publishedService(news: any) {
    return prisma.news.create({
        data: news,
        select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
            slug: true,
            published: true,
            thumbnail_links: true,
            updated_at: true,
            author: true,
            category: true,
        }
    })
}


export function updateNewsService(data: any, id: string) {
    return prisma.news.update({
        data: data,
        where: {
            id: id
        },
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            created_at: true,
            updated_at: true,
            published: true,
            _count: true,
            author: true,
            category: true,
            thumbnail_links: true,
        }
    })
}


export function showNews(page: number, size: number, query: string, published: boolean) {
    return prisma.news.findMany({
        where: {
            OR: [
                { content: { contains: query } },
                { title: { contains: query } },
                { slug: { contains: query } },
                { published }
            ],

        },
        skip: page,
        take: size,
        orderBy: {
            created_at: 'asc'
        },
        select: {
            id: true,
            content: true,
            title: true,
            slug: true,
            created_at: true,
            updated_at: true,
            published: true,
            thumbnail_links: true,
            author: true,
            category: true,
            _count: true,
        }
    })
}


export function findByIdService(id: string) {
    return prisma.news.findUnique({
        where: {
            id: id
        },
    })
}

export function commentService(comment: any) {
    return prisma.comment.create({
        data: comment,
        select: {
            id: true,
            body: true,
            published_date: true,
            news: true,
            author: true,
        }
    })
}

export function commentListService(page: number, size: number, query: string) {
    return prisma.comment.findMany({
        where: {
            body: { contains: query }
        },
        take: size,
        skip: page,
        select: {
            id: true,
            body: true,
            published_date: true,
            author: true,
            news: true,
        }
    })
}


// export function getCommentsByUser(author_id: string) {
//     return prisma.comment.findMany({
//         where: {
//             author: {
//                 id: author_id
//             }
//         }
//     })
// }

export function getCommentsByUser(author_id: string, page: number, size: number) {
    return prisma.author.findUnique({
        where: {
            id: author_id
        },
        select: {
            id: true,
            email: true,
            username: true,
            accept: true,
            authority: true,
            _count: true,
            comments: {
                skip: page,
                take: size,

            },
            news: {
                skip: page,
                take: size,
            }
        }
    })
}

