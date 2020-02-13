import { Injectable } from '@angular/core';
import { Product } from './product';
@Injectable({
    providedIn: 'root'
})
export class ProductOption {
    private _id: number;
    private _name: String;
    private _color: String;
    private _price: number;
    private _image: String;
    private _numberOfImage: number;
    private _product: Product;
    public get product(): Product {
        return this._product;
    }
    public set product(value: Product) {
        this._product = value;
    }

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

    public get color(): String {
        return this._color;
    }
    public set color(value: String) {
        this._color = value;
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
