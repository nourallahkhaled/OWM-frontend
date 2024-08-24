export interface User {
    userId: string;
    //id: string;
    _id: string;
    userName: string;
    //username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    address?: string;
    apartmentNumber?: string;
    //apartmentNo?: string;
    role?: string;
    // meterIDs?: string[];
    meters?: string[];
    gender: string;
    phoneNumber?: string;
}
