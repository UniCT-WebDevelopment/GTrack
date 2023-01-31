export interface fuelCost {
    uid: string, 
    trip?: string,
    price: number,
    paymentDetails : string, 
    payedBy: string,
    type: string, //it will be set by the service as fuel
    date: Date
}
