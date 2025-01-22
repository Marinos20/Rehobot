import { User } from "src/auth/controllers/models/user.interface";

export interface FeedPost {
    id? : number;
    body? : string;
    createAt? : Date;
    author? : User;
}