import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {LogService} from '../../services/log.service';
import {Log} from '../../interfaces/Log';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit, OnDestroy {
  observers: Subscription[] = [];
  log: Log;

  constructor(private logService: LogService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getLog();
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => {
      observer.unsubscribe();
    });
  }

  getLog() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.observers.push(
      this.logService.find(id).subscribe(log => {
        this.log = log;
      })
    );
  }

}
