import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';

const routes: Routes = [
  { path: '', component: TodoListComponent },        // /todo
  { path: 'new', component: TodoFormComponent },     // /todo/new
  { path: ':id/edit', component: TodoFormComponent },// /todo/5/edit
  { path: ':id/view', component: TodoDetailComponent } // /todo/5/view
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
