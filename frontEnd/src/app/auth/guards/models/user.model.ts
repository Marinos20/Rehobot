// 1fevrier 2025 il est 2h mais je code toujours

import { Post } from "src/app/home/components/models/Post";

export type Role = 'admin' | 'premium' | 'user';
export interface User {
    id: number;
    firstName : string;
    lastName: string;
    email: string;
    role: Role;
    posts : Post[];


}