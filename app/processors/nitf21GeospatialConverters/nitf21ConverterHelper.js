"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syber_server_1 = require("syber-server");
const common_1 = require("../../common");
const validationErrorSchema_1 = require("../../schemas/validationErrorSchema");
class Nitf21ConverterHelper extends syber_server_1.BaseProcessor {
    populateCoordResults(arrCoords, coordType) {
        this.executionContext.document.geoJson = Object.assign({}, this.executionContext.document.geoJson, common_1.Utilities.toGeoJSON(arrCoords));
        this.executionContext.document.wkt = common_1.Utilities.toWkt(arrCoords);
        this.executionContext.document.mbr = common_1.Utilities.toMbr(arrCoords);
        this.executionContext.document.coordType = coordType;
    }
    populateProcResults(processors) {
        this.executionContext.document.ODS = this.executionContext.document.ODS || {};
        this.executionContext.document.ODS.Processors = this.executionContext.document.ODS.Processors || {};
        this.executionContext.document.ODS.Processors = Object.assign({}, this.executionContext.document.ODS.Processors, processors);
    }
    getValidationResult(className) {
        const validationResult = new validationErrorSchema_1.ValidationErrorSchema();
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
exports.Nitf21ConverterHelper = Nitf21ConverterHelper;
