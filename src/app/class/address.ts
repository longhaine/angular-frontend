import { Injectable } from '@angular/core';
import { User } from './user';
@Injectable({
    providedIn: 'root'
})
export class Address {
    private _id: number;
    private _fullName: String;
    private _address: String;
    private _phone: String;
    private _selected: number;
    private _user: User;

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
    
    public get phone(): String {
        return this._phone;
    }
    public set phone(value: String) {
        this._phone = value;
    }

    public get fullName(): String {
        return this._fullName;
    }
    public set fullName(value: String) {
        this._fullName = value;
    }

    public get selected(): number {
        return this._selected;
    }
    public set selected(value: number) {
        this._selected = value;
    }

    public get user(): User {
        return this._user;
    }
    public set user(value: User) {
        this._user = value;
    }
}
