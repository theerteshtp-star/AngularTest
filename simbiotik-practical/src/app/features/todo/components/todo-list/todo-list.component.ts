import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../services/todo.service';
import { RouterLink,RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
 
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  loading = false;
  error = '';

  constructor(private svc: TodoService) {}
  ngOnInit() { this.load(); }
  load() {
    this.loading = true; this.svc.list().subscribe({
      next: data => { this.todos = data; this.loading = false; },
      error: err => { this.error = 'Failed to load'; this.loading = false; }
    });
  }

  deleteTodo(id?: number) {
    if (!id) return;
    if (!confirm('Delete item?')) return;
    this.svc.delete(id).subscribe({ next: () => this.load(), error: () => alert('Delete failed') });
  }
}
