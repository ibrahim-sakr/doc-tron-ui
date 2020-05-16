import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Log} from '../interfaces/Log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private url = 'http://127.0.0.1:3000/logs';

  constructor(private http: HttpClient) {
  }

  find(id: number): Observable<Log> {
    const url = `${this.url}/${id}`;

    return this.http.get<Log>(url).pipe(
      tap(_ => console.log(`fetched log id=${id}`)),
      catchError(this.handleError<Log>(`find id=${id}`))
    );
  }

  all(params: { status?: string, search?: string }): Observable<Log[]> {
    return this.http.get<Log[]>(this.url, {params}).pipe(
      tap(_ => console.log('fetched logs')),
      catchError(this.handleError<Log[]>('all', []))
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
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
