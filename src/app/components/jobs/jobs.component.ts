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
  searchQuery: string = this.route.snapshot.queryParamMap.get('search');
  jobs: Job[] = [];
  observers: Subscription[] = [];
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
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  watchQueryParams() {
    this.observers.push(this.route.queryParams.subscribe(params => {
      this.currentPage = params.status || 'all';
      this.searchQuery = params.search;
      this.getJobs(params);
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

  getJobs(options: { status?: string, search?: string }): void {
    this.observers.push(this.jobService.all(options).subscribe(jobs => {
      this.jobs = jobs;
    }));
  }

  dequeue(job: Job) {
    Swal.fire({
      title: 'Run Job',
      showCancelButton: true,
      html: 'run job now!'
    }).then(result => {
      if (result.dismiss) {
        return;
      }

      this.jobService.dequeue(job.id);
    });
  }

  pause(job: Job) {
    Swal.fire({
      title: 'Pause Job',
      showCancelButton: true,
      html: 'Are you Sure!'
    }).then(result => {
      if (result.dismiss) {
        return;
      }

      this.observers.push(this.jobService.update(job).subscribe(updatedJob => {
        job = updatedJob;
      }));
    });
  }

  delete(job: Job) {
    Swal.fire({
      title: 'Deleting Job',
      showCancelButton: true,
      html: 'you are about to delete a job, it\'s undone operation.<br>Are you Sure!'
    }).then(result => {
      if (result.dismiss) {
        return;
      }

      this.observers.push(this.jobService.delete(job.id).subscribe(() => {
        this.getJobs(this.route.snapshot.queryParams);
      }));
    });
  }
}
