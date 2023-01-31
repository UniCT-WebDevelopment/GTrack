import { IdentificableItem } from "src/app/modules/shared/generic/models/IdentificableItem";
import { DeliveryState, StageType } from "../../trips/models/models";

export interface Delivery extends IdentificableItem{
    uid: string,
    customer: string,
    inboundTrip?: string,
    outboundTrip?: string,
    inboundStage?: string,
    inboundStageCode?: string,
    outboundStage?: string,
    outboundStageCode?: string,
    inboundTripCode?: string, 
    outboundTripCode?: string
    packages?: number;
    deliveryType: StageType,
    stateLogs : DeliveryStateLog[]
    inboundDate?: Date, 
    outboundDate?: Date,
    sender?: string, 
    recipient?: string
}

export interface DeliveryStateLog{
    uid: string,
    delivery: string,
    date: Date, 
    state: DeliveryState
}