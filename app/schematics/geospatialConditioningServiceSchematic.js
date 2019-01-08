"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
const common_1 = require("../common");
const schemas_1 = require("../schemas");
class GeospatialConditioningServiceSchematic extends kyber_server_1.GlobalSchematic {
    constructor() {
        super(...arguments);
        this.responses = [
            {
                httpStatus: 400,
                class: common_1.ErrorResponse,
                schema: schemas_1.ErrorResponseSchema
            },
            {
                httpStatus: 404,
                class: common_1.ErrorResponse,
                schema: schemas_1.ErrorResponseSchema
            },
            {
                httpStatus: 408,
                class: common_1.ErrorResponse,
                schema: schemas_1.ErrorResponseSchema
            },
            {
                httpStatus: 500,
                class: common_1.ErrorResponse,
                schema: schemas_1.ErrorResponseSchema
            },
            {
                httpStatus: 0,
                class: common_1.ErrorResponse,
                schema: schemas_1.ErrorResponseSchema
            }
        ];
    }
}
exports.GeospatialConditioningServiceSchematic = GeospatialConditioningServiceSchematic;
