import { Injectable } from '@angular/core';
import { POST_METHOD, PUT_METHOD, GET_METHOD, DELETE_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor() { }

  private devicesSubject = new BehaviorSubject<any>(undefined);
  devices$: Observable<any> = this.devicesSubject.asObservable();

  private playedPlaylistListSubject = new BehaviorSubject<any>(undefined);
  playedPlaylistList$: Observable<any> = this.playedPlaylistListSubject.asObservable();

  private playedArtistListSubject = new BehaviorSubject<any>(undefined);
  playedArtistList$: Observable<any> = this.playedArtistListSubject.asObservable();

  async getDevices(): Promise<void> {
    this.devicesSubject.next([]);
    await POST_METHOD("https://panel.panelspcontrol.online/api/v1/Device/Pagination",
      {
        "userId": 0,
        "first": 0,
        "rows": 200,
        "sortField": "id",
        "sortOrder": 1,
        "filters": ""
      }, true).then((response: any) => {
        this.devicesSubject.next(response.data);
      })
  }

  async getDevicesAdmin(): Promise<void> {
    this.devicesSubject.next([]);
    await POST_METHOD("https://panel.panelspcontrol.online/api/v1/Device/PaginationAllDevices",
      {
        "first": 0,
        "rows": 200,
        "sortField": "id",
        "sortOrder": 1,
        "filters": ""
      }, true).then((response: any) => {
        this.devicesSubject.next(response.data);
      })
  }

  async playPlaylist(devices: any[], playlist: any[]): Promise<void> {
    await POST_METHOD("https://panel.panelspcontrol.online/api/v1/PlayList/ToDevices",
      {
        "devices": devices,
        "playList": playlist
      }, true)
  }

  async playArtist(devices: any[], artists: any[]): Promise<void> {
    await POST_METHOD("https://panel.panelspcontrol.online/api/v1/Artist/ToDevices",
      {
        "devices": devices,
        "artists": artists
      }, true)
  }

  async changeDeviceName(deviceId: string, newName: string, ownerId: number): Promise<void> {
    await PUT_METHOD("https://panel.panelspcontrol.online/api/v1/Device/NameAndOwner",
      {
        "deviceId": deviceId,
        "name": newName,
        "ownerId": ownerId
      }
      , false)
  }
  async getListOfPlayingPlaylist(deviceId: string): Promise<void> {
    this.playedPlaylistListSubject.next([]);
    await GET_METHOD(`https://panel.panelspcontrol.online/api/v1/PlayList/ByDevice?device=${deviceId}`
      , false).then((response: any) => {
        this.playedPlaylistListSubject.next(response.data);
      })
  }

  async getListOfPlayingArtist(deviceId: string): Promise<void> {
    this.playedArtistListSubject.next([]);
    await GET_METHOD(`https://panel.panelspcontrol.online/api/v1/Artist/ByDevice?device=${deviceId}`
      , false).then((response: any) => {
        this.playedArtistListSubject.next(response.data);
      })
  }

  async deletePendingPlaylist(playlistId: string): Promise<void> {
    await DELETE_METHOD(`https://panel.panelspcontrol.online/api/v1/PlayList/ById?id=${playlistId}`
      , false);
  }

  async deletePendingArtist(artistId: string): Promise<void> {
    await DELETE_METHOD(`https://panel.panelspcontrol.online/api/v1/Artist/ById?id=${artistId}`
      , false);
  }


  async assignDeviceToUsers(devices: any, userId: number): Promise<void> {
    await PUT_METHOD(`https://panel.panelspcontrol.online/api/v1/Device/AssingToUser`,
      {
        "deviceId": devices,
        "userId": userId
      }
      , false);
  }
}
