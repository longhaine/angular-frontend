import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Size {
    private _int: number;
    public get int(): number {
        return this._int;
    }
    public set int(value: number) {
        this._int = value;
    }
    private _code: String;
    public get code(): String {
        return this._code;
    }
    public set code(value: String) {
        this._code = value;
    }
    private _name: String;
    public get name(): String {
        return this._name;
    }
    public set name(value: String) {
        this._name = value;
    }
}
