/**
 * @module src.misc
 */
import path from 'path';

/**
 * Global required module imports.
 */
export class Globals
{
    private constructor() {}
    public static readonly fs = require("fs");
    public static readonly fileSystem = require("file-system");
    public static readonly projectRoot: string = path.dirname(path.dirname(__dirname));
    public static readonly refreshDoc: boolean = false;
}
