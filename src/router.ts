import cluster from 'cluster';
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import Url from './url.js';
import { HttpError, NonExistentEndpointError, InvalidRequestError } from './errors.js';
import { HttpMethod, HttpCodes } from './common/constants.js';
import { IUserService } from './users/user.interface.js';

interface IRoute<T> {
  method: HttpMethod,
  url: string,
  processor: IRouteProcessor<T>,
}

export interface IProcessResult<T> {
  data: T | undefined,
  responseCode: number,
}

export interface IRouteProcessor<T> {
  (this: Router<T>): Promise<IProcessResult<T>>
}

export class Router<T> {
  private routes: IRoute<T>[];
  public url?: Url;
  public request?: IncomingMessage;
  public response?: ServerResponse;
  public userService?: IUserService;

  constructor() {
    this.routes = [];
  }

  public process = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const logMessage = (method: HttpMethod, code: number): void => {
      if (cluster.isWorker)
        console.log(`Worker ${cluster.worker?.id} processed ${method} request with code ${code}`);
    }
    try {
      this.url = new Url(req.url);
      this.request = req;
      this.response = res;
      this.checkRequestHeaders();
      
      const { processor } = this.getRoute(req.method as HttpMethod);
      const { data, responseCode } = await processor.call(this);
      logMessage(req.method as HttpMethod, responseCode);
      this.setResponse(
        responseCode,
        { 'Content-Type': 'application/json' },
        data
      );
    } catch (err) {
      const { httpErrorMessage, httpResponseCode } = err as HttpError;
      logMessage(req.method as HttpMethod, httpResponseCode);
      this.setResponse(
        httpResponseCode || HttpCodes.BAD_REQUEST,
        { 'Content-Type': 'text/html; charset=UTF-8' },
        httpErrorMessage
      );
    }
  }

  private checkRequestHeaders() {
    const { headers, method } = this.request as IncomingMessage;
    const { POST, PUT } = HttpMethod;
    if ((method === POST || method === PUT) && headers['content-type'] !== 'application/json') {
      throw new InvalidRequestError();
    }
  }

  private setResponse(code: number, headers: OutgoingHttpHeaders, data: T | string | undefined) {
    this.response?.writeHead(code, headers);
    this.response?.end(typeof data === 'string' ? data : JSON.stringify(data));
  }

  private getRoute(method: HttpMethod): IRoute<T> {
    const route = this.routes.find((r: IRoute<T>) => r.method === method && this.url?.compare(r.url));
    if (route === undefined) {
      throw new NonExistentEndpointError(this.url?.url);
    }
    return route;
  }

  private addRoute(route: IRoute<T>) {
    this.routes.push(route);
  }

  public get(url: string, processor: IRouteProcessor<T>): void {
    this.addRoute({ method: HttpMethod.GET, url, processor });
  }
  
  public post(url: string, processor: IRouteProcessor<T>): void {
    this.addRoute({ method: HttpMethod.POST, url, processor });
  }

  public put(url: string, processor: IRouteProcessor<T>): void {
    this.addRoute({ method: HttpMethod.PUT, url, processor });
  }

  public delete(url: string, processor: IRouteProcessor<T>): void {
    this.addRoute({ method: HttpMethod.DELETE, url, processor });
  }
}