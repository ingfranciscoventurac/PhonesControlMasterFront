import { Injectable } from '@angular/core';
import { GET_METHOD, POST_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor() { }

  private userInfoSubject = new BehaviorSubject<any>(undefined);
  userInfo$: Observable<any> = this.userInfoSubject.asObservable();

  private tracksSubject = new BehaviorSubject<any>(undefined);
  tracks$: Observable<any> = this.tracksSubject.asObservable();


  async getUserInfo(): Promise<any> {
    this.userInfoSubject.next([]);
    const response = await GET_METHOD("https://api.spotify.com/v1/me", true);
    this.userInfoSubject.next(response);
    return response;
  }

}
