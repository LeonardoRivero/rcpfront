import { Notify } from 'quasar';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { Messages } from 'src/scripts/Constants';

const messages = new Messages();

interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);
  console.log({ response });
  try {
    response.parsedBody = await response.json();
  } catch (ex) {
    return response;
  }
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
export async function get<T>(
  path: string,
  args: RequestInit = { method: 'get' }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
export async function post<T>(
  path: string,
  body: unknown,
  args: RequestInit = { method: 'post', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
export async function put<T>(
  path: string,
  body: unknown,
  args: RequestInit = { method: 'put', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
export async function DELETE<T>(
  path: string,
  body: unknown,
  args: RequestInit = { method: 'DELETE', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
export async function handleResponse(response: Response) {
  if (response.status == HttpStatusCodes.ACCEPTED) {
    Notify.create({
      type: 'positive',
      message: response.statusText,
      position: 'top-right',
      timeout: 2000,
    });
  }
  if (response.status == HttpStatusCodes.NOT_FOUND) {
    Notify.create({
      type: 'negative',
      message: messages.errorMessage,
      position: 'top-right',
      timeout: 2000,
    });
  }
}
