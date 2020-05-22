import {Injectable} from '@angular/core';
import {Job} from '../interfaces/Job';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {ErrorHandlerService} from './error-handler.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private url = `${environment.api}/jobs`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {
  }

  find(id: number): Observable<Job> {
    const url = `${this.url}/${id}`;
    return this.http.get<Job>(url).pipe(
      tap(_ => console.log(`fetched job id=${id}`)),
      catchError(this.errorHandler.handle<Job>(`find id=${id}`))
    );
  }

  all(params: { status?: string, search?: string }): Observable<Job[]> {
    return this.http.get<Job[]>(this.url, {params}).pipe(
      tap(_ => console.log('fetched jobs')),
      catchError(this.errorHandler.handle<Job[]>('all', []))
    );
  }

  update(job: Job): Observable<any> {
    return this.http.post<Job>(this.url, job, this.httpOptions).pipe(
      tap((updatedJob: Job) => console.log(`updated job => id=${updatedJob.id}`)),
      catchError(this.errorHandler.handle<Job>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.url}/${id}`;

    return this.http.delete<Job>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted job id=${id}`)),
      catchError(this.errorHandler.handle<any>('delete'))
    );
  }

  dequeue(id: number): Observable<any> {
    const url = `${this.url}/${id}/dequeue`;
    return this.http.get(url).pipe(
      tap(_ => console.log('job dequeue')),
      catchError(this.errorHandler.handle<any>('dequeue'))
    );
  }

  queued(id: number, status: string): Observable<any> {
    const url = `${this.url}/${id}/queued`;
    return this.http.get(url, {
      params: { status }
    }).pipe(
      tap(_ => console.log('job paused')),
      catchError(this.errorHandler.handle<any>('pause'))
    );
  }
}
