import { Injectable } from '@angular/core';
import { POST_METHOD } from '../utils/https-requests';
import { environment } from '../../../environments/environment';
import { LoginResponseFail, LoginResponseSuccess } from '../models/auth.model';
environment
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  async login(email: string | "", password: string | ""): Promise<LoginResponseFail | LoginResponseSuccess | undefined> {

    if (email == undefined || email == "" || password == undefined || password == "") {
      return undefined;
    }

    const response = await POST_METHOD("https://panel.panelspcontrol.online/api/v1/User/LogIn",
      {
        "email": email,
        "password": password
      }, false
    )

    localStorage.setItem("permissions", JSON.stringify({
      "p1": response.p1,
      "p2": response.p2,
      "p3": response.p3,
      "p4": response.p4,
      "p5": response.p5,
      "p6": response.p6,
      "p7": response.p7,
      "p8": response.p8,
      "p9": response.p9,
      "p10": response.p10,
    }))

    localStorage.setItem("USER", JSON.stringify({
      "name": response.name,
      "lastName": response.lastName
    }))

    if (response.isSuccess) {
      return response;
    }

    return response;

  }



}
