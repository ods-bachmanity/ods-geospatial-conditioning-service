"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kyber_server_1 = require("kyber-server");
class CountryCodeComposer extends kyber_server_1.BaseProcessor {
    fx(args) {
        const result = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.executionContext.raw.country = 'USA';
                return resolve({
                    successful: true
                });
            }
            catch (err) {
                console.error(`CountryCodeComposer: ${err}`);
                return reject({
                    successful: false,
                    message: `${err}`,
                    httpStatus: 500
                });
            }
        }));
        return result;
    }
}
exports.CountryCodeComposer = CountryCodeComposer;
