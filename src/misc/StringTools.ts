/**
 * @module src.misc
 */
/**
 * String manipulation tools.
 */
export class StringTools 
{
    private constructor(){}

    // Checks for the characters (&, <, >, ', ") and replaces them by there keycode value : &#CODE;
    public static htmlspecialchars (str: string): string 
    {
        return  str.replace(/[&<>'"]/g, i => `&#${i.charCodeAt(0)};`) ;
    }

    public static isEmail(str: string): boolean 
    {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
    }
}