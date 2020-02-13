import { Address } from './address';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class User {
    private _email: String;
    private _fullName: String;
    private _defaultAddress: number;
    private _addresses: Address[] = [];
    public get addresses(): Address[] {
        return this._addresses;
    }
    public set addresses(value: Address[]) {
        this._addresses = value;
    }
    public get email(): String {
        return this._email;
    }
    public set email(value: String) {
        this._email = value;
    }
    
    public get fullName(): String {
        return this._fullName;
    }
    public set fullName(value: String) {
        this._fullName = value;
    }
    
    public get defaultAddress(): number {
        return this._defaultAddress;
    }
    public set defaultAddress(value: number) {
        this._defaultAddress = value;
    }
}
