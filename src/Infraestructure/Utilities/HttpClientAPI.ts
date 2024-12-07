// import { Loading } from 'quasar';
import HttpStatusCode from 'src/Application/Utilities/HttpStatusCodes';
import { HTTPClient } from 'src/Domine/IPatterns';
import { AuthResponse } from 'src/Domine/Responses';
import { UserContext } from '../Mediators/UserContext';

export class ClientAPI implements HTTPClient {
  // public handlerUserState: IHandleUserState
  constructor() {
    // this.handlerUserState = {} as IHandleUserState
  }
  private async http(request: Request): Promise<Response> {
    const userContext = UserContext.getInstance(this)
    const infoLogin = userContext.getInfoUser()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    try {
      // Loading.show();
      const controller = new AbortController();
      request.headers.append('Authorization', `Bearer ${infoLogin.token}`)
      request.headers.append('Time-Zone', timezone);
      const id = setTimeout(() => controller.abort(), 25000);
      const response: Response = await fetch(request, {
        signal: controller.signal,
      });

      clearTimeout(id);
      // Loading.hide();

      if (response.status === HttpStatusCode.UNAUTHORIZED) {
        const responseRefresh = await this.refreshToken(infoLogin.refreshToken);
        const authResponse: AuthResponse = await responseRefresh.json()

        if (authResponse.token && authResponse.refreshToken) {
          userContext.saveInfoUser(authResponse)
          request.headers.append('Authorization', `Bearer ${authResponse.token}`);
          request.headers.append('Time-Zone', timezone);
          return await fetch(request);
        }
      }
      return response;
    } catch (err: any) {
      // Loading.hide();

      if (err.name === 'TimeoutError') {
        throw Error('Timeout: It took more than 5 seconds to get the result!');
      } else if (err.name === 'AbortError') {
        throw Error('Fetch aborted AbortSignal.timeout()');
      } else if (err.name === 'TypeError') {
        throw Error(err);
      } else {
        throw Error(`Error: type: ${err.name}, message: ${err.message}`);
      }
    }
  }

  private urlQueryParameter(urlBase: string, parameters: object): string {
    // urlBase = urlBase.concat('?');
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(parameters)) {
      if (Array.isArray(value)) {
        value.forEach(num => {
          params.append(key, num.toString());
        });
        return `${urlBase}?${params.toString()}`;
      }
      params.append(key, value.toString())
    }
    return `${urlBase}?${params.toString()}`;
  }

  private validateUrl(url: string) {
    if (url === undefined || url === '') {
      throw new URIError('url is undefined');
    }
  }

  async GET(path: string, queryparams?: object): Promise<Response> {
    this.validateUrl(path);
    const args: RequestInit = {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (queryparams != undefined) {
      path = this.urlQueryParameter(path, queryparams);
    }
    const response = await this.http(new Request(path, args));
    return response;
  }

  async POST(path: string, body: unknown): Promise<Response> {
    this.validateUrl(path);
    const args: RequestInit = {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return await this.http(new Request(path, args));
  }

  async PUT(path: string, body: unknown): Promise<Response> {
    this.validateUrl(path);
    const args: RequestInit = {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return await this.http(new Request(path, args));
  }

  async DELETE(path: string): Promise<Response> {
    this.validateUrl(path);
    const args: RequestInit = { method: 'DELETE' };
    return await this.http(new Request(path, args));
  }

  async logout(): Promise<Response> {
    const url = `${process.env.RCP}${process.env.LOGOUT}`;
    try {
      const response = await this.POST(url, null);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }

  async refreshToken(refresh_token: string): Promise<Response> {
    const url = `${process.env.RCP}${process.env.REFRESH_TOKEN}`;
    try {
      const response = await this.POST(url, refresh_token);
      return response;
    } catch (error) {
      throw Error(`Error in ${Object.name} : ${error}`);
    }
  }
}
