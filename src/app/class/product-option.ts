import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ProductOption {
    private _id: number;
    private _name: String;
    private _price: number;
    private _image: String;
    private _numberOfImage: number;
    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get name(): String {
        return this._name;
    }
    public set name(value: String) {
        this._name = value;
    }
    
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    
    public get image(): String {
        return this._image;
    }
    public set image(value: String) {
        this._image = value;
    }
    
    public get numberOfImage(): number {
        return this._numberOfImage;
    }
    public set numberOfImage(value: number) {
        this._numberOfImage = value;
    }
}
