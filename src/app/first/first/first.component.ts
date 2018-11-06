import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}
