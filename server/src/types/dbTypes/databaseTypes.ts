export interface markerData {
    insertedOn: Date,
    name: string,
    markerID: string,
    filepath: string,
}

export interface modelData {
    insertedOn: Date,
    markerID: string,
    filepath: string,
}

export interface eventData {
    insertedOn: Date,
    eventID: string|null,
    eventName: string,
}