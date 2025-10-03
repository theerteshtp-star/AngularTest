import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services/todo.service';

@Component({ selector: 'app-todo-detail', template: `<div class="p-4" *ngIf="todo">
  <h3>{{todo.title}}</h3>
  <p>{{todo.description}}</p>
  <p>Status: {{todo.completed ? 'Done' : 'Pending'}}</p>
</div>` })
export class TodoDetailComponent implements OnInit {
  todo: any;
  constructor(private route: ActivatedRoute, private svc: TodoService) {}
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) this.svc.get(id).subscribe(t => this.todo = t);
  }
}
