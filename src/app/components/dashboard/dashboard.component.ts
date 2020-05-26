import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardService} from '../../services/dashboard.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  observers: Subscription[] = [];

  totals = [
    {
      number: 0,
      title: 'total jobs',
      color: 'text-primary',
      link: '/jobs'
    },
    {
      number: 0,
      title: 'success',
      color: 'text-success'
    },
    {
      number: 0,
      title: 'failed',
      color: 'text-danger'
    },
    {
      number: 0,
      title: 'in progress',
      color: 'text-info'
    }
  ];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getStatistics();
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  getStatistics() {
    this.observers.push(this.dashboardService.statistics().subscribe((statistics) => {
      this.totals[0].number = statistics.jobs.count as number;
      this.totals[1].number = statistics.success.count as number;
      this.totals[2].number = statistics.failed.count as number;
      this.totals[3].number = statistics.in_progress.count as number;
    }));
  }

}
