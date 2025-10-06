import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';

@Component({ selector: 'app-todo-detail', 
templateUrl:'./todo-detail.component.html' })
export class TodoDetailComponent implements OnInit {
  todo: any;
  constructor(private route: ActivatedRoute, private svc: TodoService) {}
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) this.svc.get(id).subscribe(t => this.todo = t);
  }
}
