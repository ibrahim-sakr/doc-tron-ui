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
export class LogService {
  private url = `${environment.api}/logs`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {
  }

  find(id: number): Observable<Log> {
    const url = `${this.url}/${id}`;

    return this.http.get<Log>(url).pipe(
      tap(_ => console.log(`fetched log id=${id}`)),
      catchError(this.errorHandler.handle<Log>(`find id=${id}`))
    );
  }

  all(params: { status?: string, search?: string }): Observable<Log[]> {
    return this.http.get<Log[]>(this.url, {params}).pipe(
      tap(_ => console.log('fetched logs')),
      catchError(this.errorHandler.handle<Log[]>('all', []))
    );
  }
}
