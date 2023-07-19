export function encodeURIComponent(str: string) {
    const hexDigits = "0123456789ABCDEF"

    function isAlphaNumeric(char: string) {
        const code = char.charCodeAt(0)
        return (
            (code >= 48 && code <= 57) || // 0-9
            (code >= 65 && code <= 90) || // A-Z
            (code >= 97 && code <= 122) || // a-z
            code === 45 || // -
            code === 46 || // .
            code === 95 || // _
            code === 126 // ~
        )
    }

    function convertToUTF8(char: string) {
        let charCode = char.charCodeAt(0)

        // Single-byte characters (0-127) are represented as themselves
        if (charCode < 128) {
            return char
        }

        // Multi-byte characters need to be converted to UTF-8 encoding
        const bytes = []

        // Calculate the number of bytes required for the character
        let byteCount = 1
        if (charCode >= 2048) byteCount = 3
        else if (charCode >= 128) byteCount = 2

        // Build the bytes array
        for (let i = 0; i < byteCount; i++) {
            bytes.push(128 | (charCode & 63))
            charCode >>= 6
        }
        bytes.push((256 - (1 << (8 - byteCount))) | charCode)

        // Convert bytes to hexadecimal representation
        const hexArray = []
        for (let i = bytes.length - 1; i >= 0; i--) {
            const byte = bytes[i]
            const hex1 = hexDigits.charAt((byte >> 4) & 0x0f)
            const hex2 = hexDigits.charAt(byte & 0x0f)
            hexArray.push(`%${hex1}${hex2}`)
        }

        return hexArray.join("")
    }

    // Encode each character in the string
    const encodedChars = []
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i)
        if (isAlphaNumeric(char)) {
            encodedChars.push(char)
        } else {
            encodedChars.push(convertToUTF8(char))
        }
    }

    return encodedChars.join("")
}
