import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Address {
    private _id: number;
    private _address: String;
    private _phone: number;
    private _user_id: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get address(): String {
        return this._address;
    }
    public set address(value: String) {
        this._address = value;
    }
    
    public get phone(): number {
        return this._phone;
    }
    public set phone(value: number) {
        this._phone = value;
    }
    
    public get user_id(): number {
        return this._user_id;
    }
    public set user_id(value: number) {
        this._user_id = value;
    }
}
