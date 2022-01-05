import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abceconomia',
  templateUrl: './abceconomia.component.html',
  styleUrls: ['./abceconomia.component.scss']
})
export class AbceconomiaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
