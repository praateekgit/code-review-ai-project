"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStaticAnalysis = void 0;
const child_process_1 = require("child_process");
const runStaticAnalysis = () => {
    try {
        const output = (0, child_process_1.execSync)("eslint . --ext .js,.ts", { encoding: "utf-8" });
        return output;
    }
    catch (err) {
        return err.stdout?.toString();
    }
};
exports.runStaticAnalysis = runStaticAnalysis;
