import * as zod from 'zod'

enum Authority {
    BASIC = 'BASIC',
    ADMIN = "ADMIN",
    USER = "USER"
}

export const authorSchema = zod.object({
    id: zod.string().uuid().optional(),
    username: zod
        .string()
        .min(5, { message: 'username error minlenght' })
        .max(50, { message: 'username error maxlenght' })
        .toLowerCase()
    ,
    email: zod
        .string()
        .email({ message: 'email @address invalid' })
        .min(5, { message: 'email error minlenght' })
        .max(100, { message: 'email error maxlenght' })
        .toLowerCase()
    ,
    password: zod
        .string()
        .min(10, { message: 'password must be strong' })
    ,
    accept: zod.boolean().default(false),
    authority: zod.nativeEnum(Authority).default(Authority.BASIC).optional()
})