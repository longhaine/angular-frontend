import { Injectable } from '@angular/core';
import {ProductOption} from './product-option';
import {User} from './user';
import { OptionWithSize } from './option-with-size';
@Injectable({
    providedIn: 'root'
})
export class Cart {
    private _id: number;
    private _optionWithSize: OptionWithSize;
    private _price: number;
    private _quantity: number;
    private _user: User;
    private _sessionId: String;
    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get optionWithSize(): OptionWithSize {
        return this._optionWithSize;
    }
    public set optionWithSize(value: OptionWithSize) {
        this._optionWithSize = value;
    }

    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
    
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    
    public get user(): User {
        return this._user;
    }
    public set user(value: User) {
        this._user = value;
    }
    
    public get sessionId(): String {
        return this._sessionId;
    }
    public set sessionId(value: String) {
        this._sessionId = value;
    }
}
