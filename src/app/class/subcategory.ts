import { Injectable } from '@angular/core';
import { Category} from './category';
@Injectable({
    providedIn: 'root'
})
export class Subcategory {
    private _id: number;
    private _name: String;
    private _gender: String;
    private _category: Category;
    
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
