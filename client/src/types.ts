export interface ILogger {
  info(value: string, ...args: any): void
}

export interface INotifier {
  show(text: string): void
  showPermanent(text: string): void
  hideAll(): void
}