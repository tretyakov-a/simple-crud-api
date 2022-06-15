
export default class Url {
  private readonly url: string = '';
  public location: string = '';
  public id?: string = '';
  
  public parse(urlStr: string = ''): void {
    const match = urlStr.match(/^\/api\/users(?:\/(.*)){0,1}$/);
    if (!match) {
      throw new Error(`Resourse ${this.url} not found`);
    }
    const [ location, id ] = match;
    this.location = location;
    this.id = id;
  };

}