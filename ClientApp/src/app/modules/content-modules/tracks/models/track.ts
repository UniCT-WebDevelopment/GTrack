import { Expiration } from "../../trips/models/models"

export interface Track {
    uid: string,
    licensePlate: string, 
    manufacturer: string
    model: string
    km: number
    type: TruckType,
    expiration: Expiration,
    vehicleTax: Date,
    inspection: Date
}

export enum TruckType {
    Trailer = "Trailer", 
    Truck = "Truck"
}

