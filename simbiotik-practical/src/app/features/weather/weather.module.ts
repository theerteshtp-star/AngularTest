import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherRoutingModule } from './weather-routing.module';
import { AuthInterceptor } from '../../core/services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WeatherRoutingModule
  ],
})
export class WeatherModule { }
