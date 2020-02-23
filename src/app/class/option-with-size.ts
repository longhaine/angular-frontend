import { Injectable } from '@angular/core';
import { ProductOption } from './product-option';
import { Size } from './size';
@Injectable({
    providedIn: 'root'
})
export class OptionWithSize {
    private _id: number;
    private _productOption: ProductOption;
    private _size: Size;
    private _quantity: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get productOption(): ProductOption {
        return this._productOption;
    }
    public set productOption(value: ProductOption) {
        this._productOption = value;
    }
    
    public get size(): Size {
        return this._size;
    }
    public set size(value: Size) {
        this._size = value;
    }
     
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
}
