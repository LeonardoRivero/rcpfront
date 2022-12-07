import { Notify } from 'quasar';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { Messages } from 'src/scripts/Constants';
import { Modal } from 'src/scripts/Notifications';

const messages = Messages.getInstance();
const modal = new Modal();
export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  modal.showLoading();
  const response: HttpResponse<T> = await fetch(request);
  console.log({ response });
  try {
    response.parsedBody = await response.json();
    console.log(response.parsedBody);
    modal.hideLoading();
  } catch (ex) {
    console.log(ex);
    modal.hideLoading();
    return response;
  }
  // if (!response.ok) {
  //   throw new Error(response.statusText);
  // }
  modal.hideLoading();
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
  args: RequestInit = { method: 'DELETE' }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function handleResponse(
  response: Response,
  customMessage?: string
) {
  let message = customMessage;
  if (customMessage == undefined) {
    message = response.statusText;
  }
  const timeoutModal = 2000;

  if (response.status == HttpStatusCodes.ACCEPTED) {
    Notify.create({
      type: 'positive',
      message: message,
      position: 'top-right',
      timeout: timeoutModal,
    });
  }
  if (response.status == HttpStatusCodes.NOT_FOUND) {
    Notify.create({
      type: 'negative',
      message: messages.errorMessage,
      position: 'top-right',
      timeout: timeoutModal,
    });
  }
  if (response.status == HttpStatusCodes.CREATED) {
    Notify.create({
      type: 'positive',
      message: messages.successMessage,
      position: 'top-right',
      timeout: timeoutModal,
    });
  }
  if (response.status == HttpStatusCodes.BAD_REQUEST) {
    Notify.create({
      type: 'negative',
      message: messages.errorMessage,
      position: 'top-right',
      timeout: timeoutModal,
    });
  }
  if (response.status == HttpStatusCodes.OK) {
    Notify.create({
      type: 'positive',
      message: message,
      position: 'top-right',
      timeout: timeoutModal,
    });
  }
}
