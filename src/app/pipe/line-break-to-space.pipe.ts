import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreakToSpace'
})
export class LineBreakToSpacePipe implements PipeTransform {

  transform(value:string): any {
    if(value === "T-Shirts"){
      return value;
    }
    return value.replace(/\-/g,' ');
  }

}
