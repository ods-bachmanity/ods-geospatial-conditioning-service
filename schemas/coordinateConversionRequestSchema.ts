import { GeographicSourceCoordinateSchema,
    UTMSourceCoordinateSchema,
    SourceCoordinateStringSchema } from './';

export class CoordinateConversionRequestSchema {
    public lonRange: number = 0;
    public leadingZeros: boolean = false;
    public signHemisphere: number = 0;
    public geodeiticUnits: number = 2;
    public sourceDatum: string = 'WGE';
    public sourceHeightType: number = 0;
    public sourceZone: boolean = false;
    public targetDatum: string = 'WGE';
    public targetCoordinateType: number = 10;
    public targetHeightType: number = 0;
    public targetZone: boolean = false;

    public sourceCoordinateType: number = -1;
    public sourceCoordinates: Array<GeographicSourceCoordinateSchema|UTMSourceCoordinateSchema|SourceCoordinateStringSchema> = [];
}
