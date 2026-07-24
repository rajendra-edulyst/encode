declare module 'qrcode' {
  // toDataURL returns a data URL as string
  export function toDataURL(
    text: string,
    options?: Record<string, unknown>
  ): Promise<string>;

  // toString returns string output (e.g. terminal QR code)
  export function toString(
    text: string,
    options?: Record<string, unknown>
  ): Promise<string>;

  // toCanvas draws QR on a canvas element
  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: Record<string, unknown>
  ): Promise<void>;

  // toFile saves QR to file (Node.js only)
  export function toFile(
    path: string,
    text: string,
    options?: Record<string, unknown>
  ): Promise<void>;
}
