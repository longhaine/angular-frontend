import { Injectable } from '@angular/core';
import { User } from './user';
import { OptionWithSize } from './option-with-size';
@Injectable({
    providedIn: 'root'
})
export class OrderDetail {
    private _id: number;
    private _user: User;
    private _optionWithSize: OptionWithSize;
    private _quantity: number;
    private _price: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get user(): User {
        return this._user;
    }
    public set user(value: User) {
        this._user = value;
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
}
