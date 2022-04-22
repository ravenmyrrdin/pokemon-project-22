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
        // https://www.emailregex.com/
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
    }
    /***
    * https://joshtronic.com/2020/02/17/converting-integers-to-roman-numerals-with-typescript/
    */
    public static numberToRoman(original: number)
    {
        const map = {1: "i", 5: "v", 10: "x"}

        if (original < 1 || original > 3999) {
        throw new Error('Error: Input integer limited to 1 through 3,999');
        }
    
        const numerals = [
        ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'], // 1-9
        ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'], // 10-90
        ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'], // 100-900
        ['M', 'MM', 'MMM'], // 1000-3000
        ];
    
        // TODO: Could expand to support fractions, simply rounding for now
        const digits = Math.round(original).toString().split('');
        let position = (digits.length - 1);
    
        return digits.reduce((roman, digit) => {
        if (digit !== '0') {
            roman += numerals[position][parseInt(digit) - 1];
        }
    
        position -= 1;
    
        return roman.toLowerCase();
        }, '');
    }
}