import { Injectable } from '@angular/core';
import { Subcategory } from './subcategory';
@Injectable({
    providedIn: 'root'
})
export class Category {
    private _id: number;
    private _name: String;
    private _subCategories: Subcategory[] = [];
    
    public get subCategories(): Subcategory[] {
        return this._subCategories;
    }
    public set subCategories(value: Subcategory[]) {
        this._subCategories = value;
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
}
