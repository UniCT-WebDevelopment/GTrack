

export interface Trip {
    uid: string,
    code: string,
    amount: number 
    earnings : number
    km: number
    durationHours: number
    driver: string
    track: string,
    trailer?: string,
    startDate : Date,
    endDate: Date,
    activeHoursPerDay : number
    category: TripCategories
}

export enum TripCategories {
    lineTrip = "Line Trip", 
    sortingTrip = "Sorting Trip"
}

export interface TripStage {
    uid: string,
    code: string,
    type: StageType 
    address: Address,
    trip: string,
    documents: string[],
    customer : string,
    date: Date,
    stateLog: TripStageStateLog[]
    _calculatedValue_packages? : number;
}

export enum StageType{
    delivery = "Delivery",
    withdraw = "Withdraw"
}
export interface TripStageStateLog{
    date: Date, 
    state: DeliveryState
}

export enum DeliveryState{
    inWithdraw = "In Withdraw",
    withdrawed = "Withdrawed",
    inWarehouse = "In Warehouse",
    inDelivery = "In Delivery",
    deliveried = "Deliveried"
}

export interface Address {   
    streetName: string,   
    streetNumber: string,
    city: string,
    postalCode: string,
    region: string, 
    state: string,
}

export interface Expiration {     
    effectiveDate: Date,
    cost: number,
    paymentMethod: PaymentType,
}


export interface Cost{
    uid: string, 
    code: string,
    trip?: string,
    description?: string, 
    price: number,
    paymentDetails : string, 
    payedBy: string,
    fuelStation? : string,//should be active only if necessary
    liters?: number, //should be active only if necessary
    startLocation?: string, //should be active only if necessary
    destination?: string //should be active only if necessary
    type: string, //CostType Enum
    date: Date
}

export enum Buyer {
    Company = "Company", 
    Driver = "Driver"
}

export enum PaymentType {
    Card = "Card", 
    Cash = "Cash"
}

export enum CostType{
    Truck = "Truck",
    Trailer = "Trailer",
    Driver= "Driver",
    Fuel= "Fuel",
    Telepass= "Telepass",
    Cross= "Cross",
    Other= "Other",
}

