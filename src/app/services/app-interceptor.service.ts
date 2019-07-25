import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as $ from 'jquery';



@Injectable({
  providedIn :'root'
}) 
export class AppInterceptorService implements HttpInterceptor{

  headers : HttpHeaders

constructor( ) {}


handleError(error : HttpErrorResponse) {

    return throwError(error)
}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


if(req.method === "GET") {

  this.headers = new HttpHeaders ({
    'Content-Type'    : 'application/json;odata=verbose',
    'Accept'          : 'application/json;odata=verbose',
  //'X-RequestDigest' : $("#__REQUESTDIGEST").val(),
    'IF-MATCH'        : '*',   // Optional for GET Requests
                    
  })
}

 if(req.method === "POST") {
  console.log("inside post")
  this.headers = new HttpHeaders ({
    'Content-Type'    : 'application/json;odata=verbose',
    'Accept'          : 'application/json;odata=verbose',
    'X-RequestDigest' : $("#__REQUESTDIGEST").val(),
    'X-HTTP-Method'   : 'MERGE',
    'IF-MATCH'        : '*',   // Required for POST Requests
                    
  })
}



 const options = {'headers' : this.headers,'report-progress' : true}

 const clone = req.clone(options)

    return next.handle(clone)
    .pipe(
        retry (1),      // If req failed, it will retry for 1 one more time 
        catchError(this.handleError)
    )
}

}