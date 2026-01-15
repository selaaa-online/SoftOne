import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing-module';
import { TaskDashboard } from './task-dashboard/task-dashboard';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';


@NgModule({
  declarations: [
    TaskDashboard,
    TaskList,
    TaskForm
  ],
  imports: [
    CommonModule,
    FormsModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
