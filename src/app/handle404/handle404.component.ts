import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-handle404',
  templateUrl: './handle404.component.html',
  styleUrls: ['./handle404.component.css']
})
export class Handle404Component implements OnInit {

  constructor(private title: Title) { }

  ngOnInit() {
    this.title.setTitle("Page Not Found | Everlane");
  }

}
