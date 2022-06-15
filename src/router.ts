import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import Url from './url.js';
import { HttpError, NonExistentEndpointError } from './errors.js';
import { HttpMethod } from './common/constants.js';

interface IRoute<T> {
  method: HttpMethod,
  url: string,
  processor: IRouteProcessor<T>,
}

export interface IProcessResult<T> {
  data: T,
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

  constructor() {
    this.routes = [];
  }

  public process = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      this.url = new Url(req.url);
      this.request = req;
      this.response = res;
      const { processor } = this.getRoute(req.method as HttpMethod);
      const { data, responseCode } = await processor.call(this);

      this.setResponse(
        responseCode,
        { 'Content-Type': 'application/json' },
        data
      );
    } catch (err) {
      const { message, httpResponseCode } = err as HttpError;

      this.setResponse(
        httpResponseCode,
        { 'Content-Type': 'text/html; charset=UTF-8' },
        message
      );
    }
  }

  private setResponse(code: number, headers: OutgoingHttpHeaders, data: T | string) {
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