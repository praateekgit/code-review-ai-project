import { execSync } from "child_process";

export const runStaticAnalysis = () => {
    try {
        const output = execSync("eslint . --ext .js,.ts", { encoding: "utf-8" });
        return output;
    } catch (err: any) {
        return err.stdout?.toString();
    }
};
