// 1fevrier 2025 il est 2h mais je code toujours

export type Role = 'admin' | 'premium' | 'user';
export interface User {
    id: string;
    firstName : string;
    lastName: string;
    email: string;
    role: Role;


}