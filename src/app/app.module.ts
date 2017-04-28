import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputListComponent } from './input-list/input-list.component';
import { ResultListComponent } from './result-list/result-list.component';
import { OptionStyleComponent } from './option-style/option-style.component';
import {IOptionService} from "./shared/model/ioption.service";


@NgModule({
  declarations: [
    AppComponent,
    InputListComponent,
    ResultListComponent,
    OptionStyleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [IOptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
