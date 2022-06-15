import { IncomingMessage, ServerResponse } from 'http';
import Url from './url.js';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

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
  public url: Url | undefined;
  public request: IncomingMessage | undefined;
  public response: ServerResponse | undefined;

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

      res.writeHead(responseCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`Resourse ${req.url} is not found\n${(err as Error).stack}`);
    }
  }

  private getRoute(method: HttpMethod): IRoute<T> {
    const route = this.routes.find((r: IRoute<T>) => r.method === method && this.url?.compare(r.url));
    if (route === undefined) {
      throw new Error(`Route ${JSON.stringify(this.url)} no found`);
    }
    return route;
  }

  public onError(req: IncomingMessage, res: ServerResponse, err: Error) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(`Resourse ${req.url} is not found\n${err.stack}`);
  }

  public onSuccess<T>(res: ServerResponse, data: T): void {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
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