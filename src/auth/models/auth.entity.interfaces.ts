export interface ISaveUserEntity {
    lineUID: string;
    email: string;
    username: string;
    hashPassword: string;
    hashRt?: string;
}