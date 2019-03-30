import { BaseProcessor } from 'kyber-server';
import { Utilities } from '../../common';
import { ValidationErrorSchema } from '../../schemas/validationErrorSchema';

export class Nitf21ConverterHelper extends BaseProcessor {

    public populateCoordResults( arrCoords: any, coordType: string) {
        this.executionContext.raw.geoJson = Object.assign({}, this.executionContext.raw.geoJson, Utilities.toGeoJSON(arrCoords));
        this.executionContext.raw.wkt = Utilities.toWkt(arrCoords);
        this.executionContext.raw.mbr = Utilities.toMbr(arrCoords);
        this.executionContext.raw.coordType = coordType;
    }

    public populateProcResults(processors: any) {
        this.executionContext.raw.ODS = this.executionContext.raw.ODS || {};
        this.executionContext.raw.ODS.Processors = this.executionContext.raw.ODS.Processors || {};
        this.executionContext.raw.ODS.Processors = Object.assign({}, this.executionContext.raw.ODS.Processors, processors);
    }

    public getValidationResult(className: string): ValidationErrorSchema {
        const validationResult = new ValidationErrorSchema();

        if (!(this.executionContext.raw.wkt) || !((this.executionContext.raw.wkt).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted wkt is empty in processor ${className}`;
        }
        if (!(this.executionContext.raw.geoJson) || !((this.executionContext.raw.geoJson.coordinates).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted geoJson is empty in processor ${className}`;
        }
        if (!(this.executionContext.raw.mbr) || !((this.executionContext.raw.mbr).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted mbr is empty in processor ${className}`;
        }

        return validationResult;
    }
}
