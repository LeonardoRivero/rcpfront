import { Notify, Loading } from 'quasar';
import HttpStatusCodes from 'src/Application/Utilities/HttpStatusCodes';
import { Messages } from 'src/Application/Utilities/Messages';

const messages = Messages.getInstance();
export async function http(request: RequestInfo): Promise<Response> {
  try {
    Loading.show();
    console.log(request);
    const response: Response = await fetch(request);
    console.log(response);
    Loading.hide();
    return response;
  } catch (err: any) {
    Loading.hide();

    if (err.name === 'TimeoutError') {
      throw Error('Timeout: It took more than 5 seconds to get the result!');
    } else if (err.name === 'AbortError') {
      throw Error('Fetch aborted by user action');
    } else if (err.name === 'TypeError') {
      throw Error('AbortSignal.timeout() method is not supported');
    } else {
      throw Error(`Error: type: ${err.name}, message: ${err.message}`);
    }
  }
}
export async function GET(
  path: string,
  args: RequestInit = {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
): Promise<Response> {
  const response = await http(new Request(path, args));
  return response;
}
export async function POST(
  path: string,
  body: unknown,
  args: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
): Promise<Response> {
  return await http(new Request(path, args));
}
export async function PUT(
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
): Promise<Response> {
  return await http(new Request(path, args));
}
export async function DELETE(
  path: string,
  args: RequestInit = { method: 'DELETE' }
): Promise<Response> {
  return await http(new Request(path, args));
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
