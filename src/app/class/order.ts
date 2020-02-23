import { Injectable } from '@angular/core';
import { User } from './user';
import { OrderDetail } from './order-detail';
@Injectable({
    providedIn: 'root'
})
export class Order {
    private _id: number;
    private _orderNumber: number;
    private _price: number;
    private _fullName: String;
    private _address: String;
    private _phone: number;
    private _payment: String;
    private _shipping: number;
    private _status: String;
    private _orderDetails: OrderDetail[];
    private _user: User;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    
    public get orderNumber(): number {
        return this._orderNumber;
    }
    public set orderNumber(value: number) {
        this._orderNumber = value;
    }
    
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    
    public get fullName(): String {
        return this._fullName;
    }
    public set fullName(value: String) {
        this._fullName = value;
    }
    
    public get address(): String {
        return this._address;
    }
    public set address(value: String) {
        this._address = value;
    }
    
    public get phone(): number {
        return this._phone;
    }
    public set phone(value: number) {
        this._phone = value;
    }
    
    public get payment(): String {
        return this._payment;
    }
    public set payment(value: String) {
        this._payment = value;
    }
    private _date: String;
    public get date(): String {
        return this._date;
    }
    public set date(value: String) {
        this._date = value;
    }
    
    public get user(): User {
        return this._user;
    }
    public set user(value: User) {
        this._user = value;
    }
    public get orderDetails(): OrderDetail[] {
        return this._orderDetails;
    }
    public set orderDetails(value: OrderDetail[]) {
        this._orderDetails = value;
    }
    public get shipping(): number {
        return this._shipping;
    }
    public set shipping(value: number) {
        this._shipping = value;
    }
    public get status(): String {
        return this._status;
    }
    public set status(value: String) {
        this._status = value;
    }
}
