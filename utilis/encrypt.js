
//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
   let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text.encryptedData, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

function sha256(password){
   let hashedBuffer = crypto.createHash("sha256").update(password).digest();
   return hashedBuffer.toString("hex")

}
// Text send to encrypt function
var hw = encrypt("klb@gmail.com")

let f = hw.iv;
let s = hw.encryptedData;

let str = f+"_"+s;
// console.log(str)
let arr = str.split("_")
// console.log(arr)


// let obj = {iv:arr[0],encryptedData:arr[1]}
// console.log(obj)
// console.log(decrypt(obj))

module.exports = {
    encrypt,
    decrypt,
    sha256
};