import { Address } from "../../trips/models/models";

export interface Package {
    uid: string,
    code: string,
    measures: Measures,
    description: string,
    inboundStageUid: string | null,
    outboundStageUid: string | null,
    inboundTripUid: string | null,
    outboundTripUid: string | null,
    creationDate: Date,
    type: PackageType,
    estimatedDestinationArea: string,
    estimatedDestinationAddress : Address
}

export interface Measures{
    weight: number,
    length: number,
    height: number,
    width: number,
}

export enum PackageType {
    pedane = "Pedane",
    package = "Package"
}