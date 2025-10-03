import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService, Todo } from '../../services/todo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({ selector: 'app-todo-form', templateUrl: './todo-form.component.html' })
export class TodoFormComponent implements OnInit {
  constructor(private fb: FormBuilder, private svc: TodoService, private route: ActivatedRoute, private router: Router) {}
  form!:FormGroup 
  id?: number;
  loading = false;

  

  ngOnInit() {
    this.form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    completed: [false]
  });
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loading = true;
      this.svc.get(this.id).subscribe(t => {
        this.form.patchValue(t); this.loading = false;
      }, () => this.loading = false);
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as Todo;
    if (this.id) {
      this.svc.update(this.id, payload).subscribe(()=> this.router.navigate(['/todo']));
    } else {
      this.svc.create(payload).subscribe(()=> this.router.navigate(['/todo']));
    }
  }
}
