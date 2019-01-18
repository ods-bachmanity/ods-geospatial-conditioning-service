"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoordinateConversionRequestSchema {
    constructor() {
        this.lonRange = 0;
        this.leadingZeros = false;
        this.signHemisphere = 0;
        this.geodeiticUnits = 2;
        this.sourceDatum = 'WGE';
        this.sourceHeightType = 0;
        this.sourceZone = false;
        this.targetDatum = 'WGE';
        this.targetCoordinateType = 10;
        this.targetHeightType = 0;
        this.targetZone = false;
        this.sourceCoordinateType = -1;
        this.sourceCoordinates = [];
    }
}
exports.CoordinateConversionRequestSchema = CoordinateConversionRequestSchema;
