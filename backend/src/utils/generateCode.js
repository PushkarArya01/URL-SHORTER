import crypto from "crypto"

/**
 * Generate a  6 character  long unique code for urls.
   which contain a-z , A-Z and 0-9
 */

const generateCode = () => {
 const mainString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    let shortCode = ""

    for (let i = 0; i < 6; i++) {
        shortCode += mainString.charAt(Math.floor(Math.random() * 62))
    }

    return shortCode
}

export default generateCode