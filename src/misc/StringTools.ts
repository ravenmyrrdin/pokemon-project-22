/**
 * String manipulation tools.
 */
export class StringTools 
{
    private constructor(){}

    // Checks for the characters (&, <, >, ', ") and replaces them by there keycode value : &#CODE;
    public htmlspecialchars (str: string): string 
    {
        return  str.replace(/[&<>'"]/g, i => `&#${i.charCodeAt(0)};`) ;
    }
}