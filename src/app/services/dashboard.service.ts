import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Log} from '../interfaces/Log';
import {ErrorHandlerService} from './error-handler.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = `${environment.api}/dashboard`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  statistics(): Observable<any> {
    const url = `${this.url}/statistics`;
    return this.http.get(url).pipe(
      tap(_ => console.log(`statistics fetched`)),
      catchError(this.errorHandler.handle(`statistics`))
    );
  }
}
