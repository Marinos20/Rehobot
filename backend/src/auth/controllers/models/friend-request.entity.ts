import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;


}