import { Notify } from 'quasar';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { Messages } from 'src/scripts/Constants';

const messages = new Messages();

export interface HttpResponse<T> extends Response {
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
export async function GET<T>(
  path: string,
  args: RequestInit = { method: 'GET' }
): Promise<HttpResponse<T>> {
  const response = await http<T>(new Request(path, args));
  return response;
}
export async function POST<T>(
  path: string,
  body: unknown,
  args: RequestInit = {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
export async function PUT<T>(
  path: string,
  body: unknown,
  args: RequestInit = {
    method: 'PUT',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
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
  if (response.status == HttpStatusCodes.CREATED) {
    Notify.create({
      type: 'positive',
      message: messages.successMessage,
      position: 'top-right',
      timeout: 2000,
    });
  }
}
