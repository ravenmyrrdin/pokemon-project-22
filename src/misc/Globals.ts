import fs from "fs"

export class Globals
{
    
    public static readonly fs = fs;
    public static readonly fileSystem = require("file-system");
    public static readonly projectRoot: string = (__dirname.match(/^(.*?)(?=(\/|\\)(src))/) as any)[0];
}
