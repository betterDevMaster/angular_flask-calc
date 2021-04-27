import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  private secretKey = CryptoJS.enc.Utf8.parse('dskjfh^%xcey$%f^*8oijhkasdhkjg67');
  private iv = CryptoJS.enc.Utf8.parse('rak^&4fghjjk%&Hi"');
  private options = {
    keySize: 128 / 8,
    iv: this.iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };

  encryptData(plainData: any): string {
    // return plainData;
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainData), this.secretKey, this.options).toString();
  }

  decryptData(cipherData: any): string {
    // return cipherData;
    return CryptoJS.AES.decrypt(cipherData, this.secretKey, this.options).toString(CryptoJS.enc.Utf8);
  }

  randomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

}
