import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Subsc } from './subsc';
import { User } from './user';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = '${environment.baseApiUrl}/sub-scribe'
  private stsUrl='${environment.baseApiUrl}/sub-scribe/update-status'
private logUrl='${environment.baseApiUrl}/sub-scribe/getaccesstoken'
private platforlUrl='${environment.baseApiUrl}/sub-scribe/get-sub-platform'
private productUrl='${environment.baseApiUrl}/sub-scribe/get-sub-duration'

  constructor(private httpClient:HttpClient) { }

  createSubscription(subscribtion: Subsc): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, subscribtion);

  }

  updateSubscription( subscribtion: Subsc): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}`, subscribtion);
  }

  deletesubscription(subscribtion: Subsc): Observable<any> {
    return this.httpClient.put(`${this.stsUrl}`,subscribtion);
  }

  getDetailsById(id: number,userName:string,modeOfPayment:string):Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}/${id}/${userName}/${modeOfPayment}`);
  }

  login(user:User):Observable<any>{
    return this.httpClient.post<any>(`${this.logUrl}`,user);

  }

  getPlatform():Observable<any>{
    return this.httpClient.get<any>(`${this.platforlUrl}`)
  }

  getProductNames():Observable<any>{
    return this.httpClient.get<any>(`${this.productUrl}`)
  }

}
