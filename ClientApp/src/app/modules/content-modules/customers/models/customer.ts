import { Address } from "../../trips/models/models";

export interface Customer {
    uid: string,
    name: string,
    surname: string,
    email: string,
    phoneNumber: string,
    address?: Address,
    businessName: string
}