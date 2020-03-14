import { Injectable } from '@angular/core';
import { Category} from './category';
import { Product } from './product';
@Injectable({
    providedIn: 'root'
})
export class Subcategory {
    private _id: number;
    private _name: String;
    private _gender: String;
    private _category: Category;
    private _products: Product[] = [];
    private _position: number;
    private _minified: boolean;
    public get minified(): boolean {
        return this._minified;
    }
    public get position(): number {
        return this._position;
    }
    public set position(value: number) {
        this._position = value;
    }
    public set minified(value: boolean) {
        this._minified = value;
    }
    public get products(): Product[] {
        return this._products;
    }
    public set products(value: Product[]) {
        this._products = value;
    }
    public get category(): Category {
        return this._category;
    }
    public set category(value: Category) {
        this._category = value;
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
    
    public get gender(): String {
        return this._gender;
    }
    public set gender(value: String) {
        this._gender = value;
    }
    
}
