import {KeyValuePair} from "../key-value-pair.type";

export class GeoLocation {
    country: KeyValuePair<string, string>;
    region: KeyValuePair<string, string>;
    city: string;
    timeZone: string;
    latitude: number;
    longitude: number;
}
