import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Toast } from './toast/toast';
import { Navbar } from './navbar/navbar';



@NgModule({
  declarations: [
    Toast,
    Navbar
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Toast,
    Navbar
  ]
})
export class SharedModule { }
