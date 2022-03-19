/**
 * Reserved for future logger, currently only prints line to console.
 */
export class Logger
{
    private constructor() { }
    //todo:  add logging

    public static log(message: string)
    {
        console.log(`[LOGGER]: ${message}`);
    }
}