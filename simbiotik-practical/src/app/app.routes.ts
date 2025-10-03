import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    canActivate: [AuthGuard],
     children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      { path: 'todo', loadChildren: () => import('./features/todo/todo.module').then(m => m.TodoModule) },
      { path: 'weather', loadChildren: () => import('./features/weather/weather.module').then(m => m.WeatherModule) },
      { path: 'map', loadChildren: () => import('./features/map/map.module').then(m => m.MapModule) },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
