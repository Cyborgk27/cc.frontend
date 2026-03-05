export interface IBaseResponse<T> {
    isSuccess: boolean
    data: T
    count: number
    statusCode: number
    message: string
    statusCodeCat: string
    timeStamp: string
}

export interface ILoginResponse {
    token: string
    refreshToken: string
    email: string
    userName: string
    fullName: string
    roles: string[]
    permissions: string[]
    navigation: INavigation[]
}

export interface INavigation {
    name: string
    showName: string
    path: string
    icon: string
}