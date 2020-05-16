import {Component, OnDestroy, OnInit} from '@angular/core';
import {Log} from '../../interfaces/Log';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';
import {LogService} from '../../services/log.service';
import {Job} from '../../interfaces/Job';

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
    private logService: LogService) {
  }

  ngOnInit(): void {
    this.watchQueryParams();
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

  search(query: string) {
    // delete old timeout
    clearTimeout(this.delaySearch);

    // create new one
    this.delaySearch = setTimeout(() => {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {
            search: query.length > 2 ? query : null
          },
          queryParamsHandling: 'merge'
        });
    }, 600);
  }

  getLogs(options: { status?: string, search?: string }): void {
    this.observers.push(this.logService.all(options).subscribe(logs => {
      this.logs = logs;
    }));
  }
}
