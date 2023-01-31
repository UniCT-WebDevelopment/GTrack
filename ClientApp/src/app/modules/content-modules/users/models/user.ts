
export interface User {
    uid: string,
    name: string,
    surname: string,
    email: string,
    phoneNumber: string,
    password?: string,
    lastLogin?: Date,
    lastLogout?: Date,
    jwtToken?: string
    role: string
}

export enum RoleType {
    ADMIN = 'admin',
    OPERATOR = 'operator',
}