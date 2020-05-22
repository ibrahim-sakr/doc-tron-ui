import {Component} from '@angular/core';
import {Event, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DocTron';
  page = 'dashboard';

  constructor(private router: Router) {
    this.monitorRouteChange();
  }

  monitorRouteChange() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        this.page = event.url.split('/')[1];
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
      }
    });
  }
}
