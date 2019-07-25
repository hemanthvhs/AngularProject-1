import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';


import { AppComponent } from './app.component';
import { AppInterceptorService } from './services/app-interceptor.service';
import { SharepointService } from './services/sharepoint.service';
import { NewFormComponent } from './new-form/new-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { DisplayFormComponent } from './display-form/display-form.component';

import { SortPipe } from './pipes/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NewFormComponent,
    EditFormComponent,
    DisplayFormComponent,
    SortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
                SharepointService,
                {'provide' : HTTP_INTERCEPTORS,
                 'useClass' : AppInterceptorService,
                 'multi' : true},
          
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
