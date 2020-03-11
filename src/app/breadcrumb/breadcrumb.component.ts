import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from '../interface/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumbs:Breadcrumb[];
  constructor() { }

  ngOnInit() {
  }
}
