
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/auth/controllers/models/user.entity";

@Entity('feed_post')
export class FeedPostEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ default : ''})
    body : string;

    //@Column({ type : 'timestamp', default: () => 'CURRENT_TIMESTAMPS'})
    @CreateDateColumn()
    createdAt : Date;

    
    @ManyToOne(()=> UserEntity, (userEntity) => userEntity.feedPosts)
    author : UserEntity;
}