import internal from "node:stream";

export interface markerData {
    insertedOn: Date,
    name: string,
    markerID: string,
    filepathOne: string,
    filepathTwo: string,
    filepathThree: string,
}

export interface modelData {
    name: string,
    insertedOn: Date,
    modelID: string,
    filepath: string,
    texture: string,
}

export interface eventData {
    insertedOn: Date,
    eventID: string|null,
    eventName: string,
    marker_id: string,
    model_id: string,
    x_pos: number,
    y_pos: number,
    z_pos: number
}

export interface login {
    username:string,
    password:string
    role:string
}
