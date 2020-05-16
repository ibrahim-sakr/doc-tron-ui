import {Component, OnDestroy, OnInit} from '@angular/core';
import {Job} from '../../interfaces/Job';
import {ActivatedRoute, Router} from '@angular/router';
import {JobService} from '../../services/job.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  observers: Subscription[] = [];
  id: number = +this.route.snapshot.paramMap.get('id');
  job: Job = {
    name: '',
    queued: false,
    scheduled: '',
    worker: {
      type: ''
    }
  };

  constructor(private route: ActivatedRoute, private jobService: JobService, private router: Router) {
  }

  ngOnInit(): void {
    this.getJob();
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  getJob() {
    if (!this.id) {
      return;
    }

    this.observers.push(this.jobService.find(this.id).subscribe(job => {
      this.job = job;
    }));
  }

  update() {
    this.observers.push(this.jobService.update(this.job).subscribe(job => {
      this.job = job;
    }));
  }

  dequeue() {
    Swal.fire({
      title: 'Run Job',
      showCancelButton: true,
      html: 'run job now!'
    }).then(result => {
      if (result.dismiss) {
        return;
      }

      this.jobService.dequeue(this.job.id);
    });
  }

  delete() {
    Swal.fire({
      title: 'Deleting Job',
      showCancelButton: true,
      html: 'you are about to delete a job, it\'s undone operation.<br>Are you Sure!'
    }).then(result => {
      if (result.dismiss) {
        return;
      }

      this.observers.push(this.jobService.delete(this.job.id).subscribe(() => {
        this.router.navigate(['/jobs']);
      }));
    });
  }
}
