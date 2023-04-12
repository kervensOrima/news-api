
export function apiSuccessResponse(message: string, code: number, data: any) {
    return {
        message: message,
        data: data,
        timestamp: new Date(),
        success: true,
        code: code
    }
}

export const apiResponseError = (message: string, code: number, error: any | Error) => {
    return {
        message: message,
        code: code,
        error: error,
        timestamp: new Date(),
        success: false
    }
}
