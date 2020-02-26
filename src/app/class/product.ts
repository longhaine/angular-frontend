import { Injectable } from '@angular/core';
import { Subcategory } from './subcategory';
import { ProductOption } from './product-option';
import { Filterable } from '../interface/filterable';
@Injectable({
    providedIn: 'root'
})
export class Product implements Filterable{
    getFilterable():String{
        return this._name;
    };
    private _id: number;
    private _name: String;
    private _gender: String;
    private _subCategory: Subcategory;
    private _productOptions: ProductOption[] = [];
    
    
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

    public get gender(): String {
        return this._gender;
    }
    public set gender(value: String) {
        this._gender = value;
    }

    public get subCategory(): Subcategory {
        return this._subCategory;
    }
    public set subCategory(value: Subcategory) {
        this._subCategory = value;
    }
    
    public get productOptions(): ProductOption[] {
        return this._productOptions;
    }
    public set productOptions(value: ProductOption[]) {
        this._productOptions = value;
    }
}
