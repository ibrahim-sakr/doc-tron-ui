import {Component, OnDestroy, OnInit} from '@angular/core';
import {Log} from '../../interfaces/Log';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LogService} from '../../services/log.service';
import {Job} from '../../interfaces/Job';
import {JobService} from '../../services/job.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  currentPage = 'all';
  searchQuery = '';
  delaySearch: any;
  logs: Log[] = [];
  jobs: Job[] = [];
  selectedJobIds: number[];
  observers: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private logService: LogService,
    private jobService: JobService
  ) {
  }

  ngOnInit(): void {
    this.watchQueryParams();
    this.getJobs();
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  watchQueryParams() {
    this.observers.push(this.route.queryParams.subscribe(params => {
      this.currentPage = params.status || 'all';
      this.searchQuery = params.search;
      this.getLogs(params);
    }));
  }

  getJobs() {
    this.observers.push(
      this.jobService.all({}).subscribe(jobs => {
        this.jobs = jobs;
      })
    );
  }

  search(query: number[]) {
    // delete old timeout
    clearTimeout(this.delaySearch);

    // create new one
    this.delaySearch = setTimeout(() => {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {
            jobs: query
          },
          queryParamsHandling: 'merge'
        });
    }, 1000);
  }

  jobSelected() {
    this.search(this.selectedJobIds);
  }

  getLogs(options: { status?: string, search?: string }): void {
    this.observers.push(this.logService.all(options).subscribe(logs => {
      this.logs = logs;
    }));
  }
}
