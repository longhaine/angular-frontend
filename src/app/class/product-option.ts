import { Injectable } from '@angular/core';
import { Product } from './product';
import { OptionWithSize } from './option-with-size';
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
    private _link: String;
    private _product: Product;
    private _optionWithSizes: OptionWithSize[];
    // this images only used at products page
    private _images: string[];
    public get images(): string[] {
        return this._images;
    }
    public set images(value: string[]) {
        this._images = value;
    }
    public get optionWithSizes(): OptionWithSize[] {
        return this._optionWithSizes;
    }
    public set optionWithSizes(value: OptionWithSize[]) {
        this._optionWithSizes = value;
    }
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
    public get link(): String {
        return this._link;
    }
    public set link(value: String) {
        this._link = value;
    }
}
