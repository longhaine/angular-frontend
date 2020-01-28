import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadCrumbInformation:{gender:string, subCategoryName:string};
  private gender:string;
  private subCategoryName:string;
  constructor() { }

  ngOnInit() {
    this.gender = this.breadCrumbInformation.gender;
    this.subCategoryName = this.breadCrumbInformation.subCategoryName;
  }

}
