import {Component, OnDestroy, OnInit} from '@angular/core';
import {JobService} from '../../services/job.service';
import {Job} from '../../interfaces/Job';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  loading = false;
  searchQuery: string = this.route.snapshot.queryParamMap.get('search');
  jobs: Job[] = [];
  queryParamsObserver: Subscription;
  allJobsObserver: Subscription;
  delaySearch: any;
  currentPage = 'all';

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.watchQueryParams();
  }

  ngOnDestroy(): void {
    this.queryParamsObserver.unsubscribe();
    this.allJobsObserver.unsubscribe();
  }

  watchQueryParams() {
    this.queryParamsObserver = this.route.queryParams.subscribe(params => {
      this.currentPage = params.status || 'all';
      this.searchQuery = params.search;
      this.getJobs(params);
    });
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

  getJobs(options: { status?: string, search?: string }): void {
    this.allJobsObserver = this.jobService.all(options).subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  dequeue(job: Job) {
    console.log(job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }

  pause(job: Job) {
    console.log(job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }

  delete(job: Job) {
    console.log(job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }
}
