export namespace StringTools 
{
    // Checks for the characters (&, <, >, ', ") and replaces them by there keycode value : &#CODE;
    export const htmlspecialchars = (str: string): string => str.replace(/[&<>'"]/g, i => `&#${i.charCodeAt(0)};`) 
}