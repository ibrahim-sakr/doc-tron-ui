import {Component, OnInit} from '@angular/core';
import {Job} from '../../interfaces/Job';
import {ActivatedRoute} from '@angular/router';
import {JobService} from '../../services/job.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  id: number = +this.route.snapshot.paramMap.get('id');
  job: Job = {
    name: '',
    queued: false,
    scheduled: '',
    worker: {
      type: ''
    }
  };

  constructor(private route: ActivatedRoute, private jobService: JobService) {
  }

  ngOnInit(): void {
    this.getJob();
  }

  getJob() {
    if (!this.id) {
      return;
    }

    this.jobService.find(this.id).subscribe(job => {
      this.job = job;
    });
  }

  update() {
    console.log(this.job);
  }

  dequeue() {
    console.log(this.job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }

  pause() {
    console.log(this.job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }

  delete() {
    console.log(this.job);
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }
}
