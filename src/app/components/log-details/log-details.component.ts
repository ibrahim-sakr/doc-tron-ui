import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {LogService} from '../../services/log.service';
import {Log} from '../../interfaces/Log';
import {ActivatedRoute} from '@angular/router';
import {TabsetComponent} from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  observers: Subscription[] = [];
  log: Log = {
    id: 0,
    status: '',
    output: '',
    error: '',
    job: {
      id: 0,
      name: ''
    },
    started_at: new Date(),
    finished_at: new Date()
  };

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

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
