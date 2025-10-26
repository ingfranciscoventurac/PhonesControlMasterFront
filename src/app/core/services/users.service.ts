import { Injectable } from '@angular/core';
import { POST_METHOD, DELETE_METHOD, PUT_METHOD, GET_METHOD } from '../utils/https-requests';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  private usersSubject = new BehaviorSubject<any>(undefined);
  users$: Observable<any> = this.usersSubject.asObservable();

  private allActiveUsersSubject = new BehaviorSubject<any>(undefined);
  allActiveUsers$: Observable<any> = this.allActiveUsersSubject.asObservable();

  async getUsers(): Promise<void> {
    this.usersSubject.next([]);
    await POST_METHOD("https://pcapi.valoracatalog.com/api/v1/User/Pagination",
      {
        "first": 0,
        "rows": 200,
        "sortField": "id",
        "sortOrder": 1,
        "filters": ""
      }, true).then((response: any) => {
        this.usersSubject.next(response.data);
      })
  }

  async deleteUser(userId: string): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/ById?id=${userId}`, true);
  }

  async blockUser(userId: string): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/Bloquear?id=${userId}`, true);
  }

  async activateUser(userId: string): Promise<void> {
    await DELETE_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/Activar?id=${userId}`, true);
  }

  async createUser(newUserInfo: any): Promise<void> {
    await POST_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/Add`, newUserInfo, true);
  }

  async updateUser(updatedUserInfo: any): Promise<void> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/ById`, updatedUserInfo, true);
  }

  async updateUserPassword(updatedUserInfo: any): Promise<void> {
    await PUT_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/ChangePassword`, updatedUserInfo, true);
  }

  async getAllActiveUsers(): Promise<void> {
    this.allActiveUsersSubject.next(null);
    await GET_METHOD(`https://pcapi.valoracatalog.com/api/v1/User/AllActive`, true).then((response: any) => {
      this.allActiveUsersSubject.next(response.data);
    })
  }

}
