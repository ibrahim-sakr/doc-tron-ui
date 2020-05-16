import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { LogsComponent } from './components/logs/logs.component';
import { LogDetailsComponent } from './components/log-details/log-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/new', component: JobDetailsComponent },
  { path: 'jobs/:id', component: JobDetailsComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'logs/:id', component: LogDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
