import { Component, OnInit } from '@angular/core';
import { globals } from '../globals';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private img = globals.server+"/img";

  constructor() {
    
  }

  ngOnInit() {
  }

}
