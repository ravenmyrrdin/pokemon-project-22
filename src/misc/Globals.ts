
/**
 * Global required module imports.
 */
export class Globals
{
    private constructor() {}
    public static readonly fs = require("fs");
    public static readonly fileSystem = require("file-system");
    public static readonly projectRoot: string = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any)[0];
}
