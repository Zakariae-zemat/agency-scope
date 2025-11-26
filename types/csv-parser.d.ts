declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface Options {
    separator?: string;
    newline?: string;
    quote?: string;
    escape?: string;
    headers?: boolean | string[];
    mapHeaders?: (args: { header: string; index: number }) => string | null;
    mapValues?: (args: { header: string; index: number; value: string }) => any;
    skipLines?: number;
    skipComments?: boolean | string;
    maxRowBytes?: number;
    strict?: boolean;
  }

  function csvParser(options?: Options): Transform;

  export = csvParser;
}
