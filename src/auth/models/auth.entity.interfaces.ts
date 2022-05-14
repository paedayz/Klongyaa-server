export interface ISaveUserEntity {
    line_uid: string;
    email: string;
    username: string;
    hashPassword: string;
    hashRt?: string;
}