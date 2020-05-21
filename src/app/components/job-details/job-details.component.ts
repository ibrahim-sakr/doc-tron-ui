import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JobService} from '../../services/job.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {conditionalValidator} from '../validators/conditionalValidator';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {
  observers: Subscription[] = [];

  jobForm = this.fb.group({
    id: [+this.route.snapshot.paramMap.get('id')],
    name: ['job name', Validators.required],
    description: ['job description'],
    queued: [true],
    scheduled: ['* * * * *', Validators.required],
    worker: this.fb.group({
      type: ['http', Validators.required],
      url: ['http://127.0.0.1:5000/job_1', [this.requireIf('http')]],
      body: ['{}', [this.requireIf('http')]],
      host: ['', [this.requireIf('ssh')]],
      port: ['', [this.requireIf('ssh')]],
      username: ['', [this.requireIf('ssh')]],
      password: ['', [this.requireIf('ssh')]],
      command: ['', [this.requireIf('ssh')]],
      privateKey: ['', [this.requireIf('ssh')]],
      passphrase: ['', [this.requireIf('ssh')]]
    })
  });

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getJob();

    this.observers.push(this.jobForm.get('worker.type').valueChanges
      .subscribe(value => {
        const formGroup = this.jobForm.get('worker') as FormGroup;
        // tslint:disable-next-line:forin
        for (const inner in formGroup.controls) {
          if (inner === 'type') {
            continue;
          }

          formGroup.get(inner).updateValueAndValidity();
        }
      }));
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  getJob() {
    if (!this.jobForm.get('id').value) {
      return;
    }

    this.observers.push(this.jobService.find(this.jobForm.get('id').value).subscribe(job => {
      job.queued = !!job.queued;
      this.jobForm.patchValue(job);
    }));
  }

  update() {
    const data = this.jobForm.value;
    data.worker = this.extractWorkerData(data.worker);
    this.observers.push(this.jobService.update(this.jobForm.value).subscribe(job => {
      if (!this.jobForm.get('id').value) {
        // new job created
        // redirect to all job page
        return this.router.navigate(['/jobs']);
      }

      // old job updated
      this.jobForm.patchValue(job);
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

      this.jobService.dequeue(this.jobForm.get('id').value);
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

      this.observers.push(this.jobService.delete(this.jobForm.get('id').value).subscribe(() => {
        this.router.navigate(['/jobs']);
      }));
    });
  }

  requireIf(value: string) {
    return conditionalValidator(
      () => this.jobForm.get('worker.type').value === value,
      Validators.compose([
        Validators.required
      ])
    );
  }

  extractWorkerData(worker: any) {
    if (worker.type === 'http') {
      return {
        type: worker.type,
        url: worker.url,
        body: worker.body
      };
    }
    if (worker.type === 'ssh') {
      return {
        type: worker.type,
        host: worker.host,
        port: worker.port,
        username: worker.username,
        password: worker.password,
        command: worker.command,
        privateKey: worker.privateKey,
        passphrase: worker.passphrase
      };
    }
  }
}
