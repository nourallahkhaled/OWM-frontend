export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    address?: string;
    apartmentNo?: string;
    role?: string;
    meterIDs?: string[];
    gender: string;
    phoneNumber?: string;
}
