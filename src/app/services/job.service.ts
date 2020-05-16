import {Injectable} from '@angular/core';
import {Job} from '../interfaces/Job';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private url = 'http://127.0.0.1:3000/jobs';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  find(id: number): Observable<Job> {
    const url = `${this.url}/${id}`;
    return this.http.get<Job>(url).pipe(
      tap(_ => console.log(`fetched job id=${id}`)),
      catchError(this.handleError<Job>(`find id=${id}`))
    );
  }

  all(params: { status?: string, search?: string }): Observable<Job[]> {
    return this.http.get<Job[]>(this.url, {params}).pipe(
      tap(_ => console.log('fetched jobs')),
      catchError(this.handleError<Job[]>('all', []))
    );
  }

  update(job: Job): Observable<any> {
    return this.http.post<Job>(this.url, job, this.httpOptions).pipe(
      tap((updatedJob: Job) => console.log(`updated job => id=${updatedJob.id}`)),
      catchError(this.handleError<Job>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.url}/${id}`;

    return this.http.delete<Job>(url, this.httpOptions).pipe(
      tap(_ => console.log(`deleted job id=${id}`)),
      catchError(this.handleError<any>('delete'))
    );
  }

  dequeue(id: number): Observable<any> {
    const url = `${this.url}/${id}/dequeue`;
    return this.http.get(url).pipe(
      tap(_ => console.log('job dequeue')),
      catchError(this.handleError<any>('all'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation}
    failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
