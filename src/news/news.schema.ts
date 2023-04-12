import * as zod from 'zod'


export const categorySchemas = zod.object({
    id: zod.number().optional(),
    name: zod.string()
        .toLowerCase()
        .min(1, { message: 'category name required' })
        .max(50, { message: 'category name must have less than 50 characters' })
})

export const newsSchemas = zod.object({
    id: zod.string()
        .optional(),

    title: zod.string()
        .min(2, { message: 'title is required' }).toLowerCase(),

    slug: zod.string().toLowerCase()
        .optional(),

    content: zod.string().toLowerCase()
        .min(2, { message: "content is required" }).max(12000, { message: "much of text" }),

    thumbnail_links: zod.string().array().nonempty({ message: 'thumbnail required poto' })
        .min(1, { message: 'thumbnail must have a default value' })
        .max(10, { message: 'not much of this nt allow' })
        .default(["https://media4.s-nbcnews.com/i/newscms/2019_01/2705191/nbc-social-default_b6fa4fef0d31ca7e8bc7ff6d117ca9f4.png"]).optional(),

    published: zod.boolean()
        .default(false).optional(),

    created_at: zod.date().default(new Date())
        .optional(),

    updated_at: zod.date()
        .optional(),

    category_id: zod.number().min(1, { message: 'category id invalid' }),

    author_id: zod.string().uuid().optional()
})