import { Injectable } from '@angular/core';
import { Filterable } from '../interface/filterable';
@Injectable({
    providedIn: 'root'
})
export class Slide {
    filterable:Map<String,Filterable>
}
