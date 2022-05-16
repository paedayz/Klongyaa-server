import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({unique: true})
    lineUID: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    hashPassword: string;

    @Column({default: null})
    hashRt: string;

}