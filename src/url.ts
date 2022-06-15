
export default class Url {
  public readonly url: string = '';
  public parts: string[] | [];
  
  constructor(urlStr: string = '') {
    this.url = urlStr;
    this.parts = this.url.split('/');
  }

  public compare(urlTemplate: string = ''): boolean {
    const tplParts: string[] = urlTemplate.split('/');
    return this.parts.every((part: string, i: number) => {
      return /^\{(.*)\}$/.test(tplParts[i]) || part === tplParts[i];
    })
  }

  public getUserId(): string {
    return this.parts[this.parts.length - 1];
  }
}