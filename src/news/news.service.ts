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