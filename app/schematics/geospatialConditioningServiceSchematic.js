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
                class: common_1.ErrorResponse,
                httpStatus: 400,
                schema: schemas_1.ErrorResponseSchema,
            },
            {
                class: common_1.ErrorResponse,
                httpStatus: 404,
                schema: schemas_1.ErrorResponseSchema,
            },
            {
                class: common_1.ErrorResponse,
                httpStatus: 408,
                schema: schemas_1.ErrorResponseSchema,
            },
            {
                class: common_1.ErrorResponse,
                httpStatus: 500,
                schema: schemas_1.ErrorResponseSchema,
            },
            {
                class: common_1.ErrorResponse,
                httpStatus: 0,
                schema: schemas_1.ErrorResponseSchema,
            },
        ];
    }
}
exports.GeospatialConditioningServiceSchematic = GeospatialConditioningServiceSchematic;
