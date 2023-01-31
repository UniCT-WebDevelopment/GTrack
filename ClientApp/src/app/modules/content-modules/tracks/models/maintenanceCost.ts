export interface MaintenanceCost {
    uid: string, 
    code: string, 
    trip?: string,
    price: number,
    description?: string,
    paymentDetails : string, 
    payedBy: string,
    type: string, //it will be set by the service as trailer or truck
    date: Date,
    track: string
}


export enum MaintenanceType{
    Truck = "Truck",
    Trailer = "Trailer"
}