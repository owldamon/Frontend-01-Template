```js

function stringToNumber(str, radix = 10) {
    const hexReg = /^0x\w+$/gi
    const binaryReg = /^0b[0-1]+$/gi
    const octalReg = /^0o[0-7]+$/gi
    const negativeReg = /^[-+]\w+$/gi

    const hexStrTable = {
        a: 10,
        b: 11,
        c: 12,
        d: 13,
        e: 14,
        f: 15,
    }

    let strs = str.split('')
    let direction = 1
    let isHex = false
    let number = 0
    let fraction = 0
    let fPosition = 1
    let isAfterFraction = false

    if (str.match(negativeReg)) {
        if (str.match(/^-\w+/gi) && !str.match(/(0x|0b|0o)/gi)) {
            direction = -1
        }

        str = str.replace(/^[-+]/gi, '')
    }

    if (str.match(hexReg)) {
        isHex = true
        radix = 16
        strs = str.replace(/^0x/gi, '').split('')
    }

    if (str.match(binaryReg)) {
        radix = 2
        strs = str.replace(/^0b/gi, '').split('')
    }

    if (str.match(octalReg)) {
        radix = 8
        strs = str.replace(/^00/gi, '').split('')
    }

    strs.forEach((s) => {
        if (s !== '.' && !isAfterFraction) {
            const value = isHex && hexStrTable[s.toLowerCase()] ? hexStrTable[s.toLowerCase()] :
                s.codePointAt(0) - '0'.codePointAt(0)

            number = number * radix
            number = number + value;
        }

        if (s === '.' && radix === 10) {
            isAfterFraction = true
        }


        if (s !== '.' && isAfterFraction && radix === 10) {
            fraction = fraction * radix
            fPosition = fPosition * radix
            fraction = fraction + s.codePointAt(0) - '0'.codePointAt(0);
        }
    })


    return (number + fraction / fPosition) * direction
}






function numberToString(num, radix = 10) {
    const number = Math.abs(num)
    let direction = ''
    let integer = Math.floor(number);
    let fraction = number - integer;
    let string = '';

    const hexStrTable = {
        10: 'a',
        11: 'b',
        12: 'c',
        13: 'd',
        14: 'e',
        15: 'f',
    }

    if (Number.isNaN(num)) {
        return 'NaN'
    }

    if (num < 0) {
        direction = '-'
    }

    if (number === Infinity) {
        return `${direction}Infinity`
    }


    while (integer > 0) {
        const value =  radix < 35 && radix > 10 && hexStrTable[integer % radix] ? hexStrTable[integer % radix] : integer % radix
        string = String(value) + string;
        integer = Math.floor(integer / radix);
    }

    return fraction ? `${direction}${string}.${fraction}` : direction + string;
}

```
