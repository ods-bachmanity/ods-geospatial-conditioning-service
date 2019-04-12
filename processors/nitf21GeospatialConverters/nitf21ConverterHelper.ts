import { BaseProcessor } from 'syber-server';
import { Utilities } from '../../common';
import { ValidationErrorSchema } from '../../schemas/validationErrorSchema';

export class Nitf21ConverterHelper extends BaseProcessor {

    public populateCoordResults( arrCoords: any, coordType: string) {
        this.executionContext.document.geoJson = Object.assign({}, this.executionContext.document.geoJson, Utilities.toGeoJSON(arrCoords));
        this.executionContext.document.wkt = Utilities.toWkt(arrCoords);
        this.executionContext.document.mbr = Utilities.toMbr(arrCoords);
        this.executionContext.document.coordType = coordType;
    }

    public populateProcResults(processors: any) {
        this.executionContext.document.ODS = this.executionContext.document.ODS || {};
        this.executionContext.document.ODS.Processors = this.executionContext.document.ODS.Processors || {};
        this.executionContext.document.ODS.Processors = Object.assign({}, this.executionContext.document.ODS.Processors, processors);
    }

    public getValidationResult(className: string): ValidationErrorSchema {
        const validationResult = new ValidationErrorSchema();

        if (!(this.executionContext.document.wkt) || !((this.executionContext.document.wkt).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted wkt is empty in processor ${className}`;
        }
        if (!(this.executionContext.document.geoJson) || !((this.executionContext.document.geoJson.coordinates).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted geoJson is empty in processor ${className}`;
        }
        if (!(this.executionContext.document.mbr) || !((this.executionContext.document.mbr).length > 0)) {
            validationResult.errors = true;
            validationResult.errString += `\nFormatted mbr is empty in processor ${className}`;
        }

        return validationResult;
    }
}
