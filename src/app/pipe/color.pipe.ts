import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(color: string): string {
    let array:string[] = color.split(" ");
    let colorCss = "-";
    for(let i = 0 ; i < array.length ; i++){
      colorCss = colorCss+"-"+array[i].charAt(0).toLowerCase() + array[i].slice(1);
    }
    return colorCss;
  }

}
