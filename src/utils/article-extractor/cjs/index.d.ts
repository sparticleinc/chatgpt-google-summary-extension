// Type definitions

import { IOptions as SanitizeOptions } from "sanitize-html";

export interface Transformation {
  patterns: Array<RegExp>,
  pre?: (document: Document) => Document
  post?: (document: Document) => Document
}

export function addTransformations(transformations: Array<Transformation>): Number;
export function removeTransformations(options: Array<RegExp>): Number;

export function getSanitizeHtmlOptions(): SanitizeOptions;
export function setSanitizeHtmlOptions(options: SanitizeOptions): void;

/**
 * @param input url or html
 */

export interface ParserOptions {
  /**
   * to estimate time to read.
   * Default: 300
   */
  wordsPerMinute: number
  /**
   * max num of chars generated for description
   * Default: 210
   */
  descriptionTruncateLen: number
  /**
   * min num of chars required for description
   * Default: 180
   */
  descriptionLengthThreshold: number
  /**
   * min num of chars required for content
   * Default: 200
   */
  contentLengthThreshold: number
}

export interface ProxyConfig {
  target?: string;
  headers?: string[];
}

export interface FetchOptions {
  /**
   * list of request headers
   * default: null
   */
  headers?: string[];
  /**
   * the values to configure proxy
   * default: null
   */
  proxy?: ProxyConfig;
}

export interface ArticleData {
  url?: string;
  links?: string[];
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  content?: string;
  source?: string;
  published?: string;
  ttr?: number;
}

export function extract(input: string, parserOptions?: ParserOptions, fetchOptions?: FetchOptions): Promise<ArticleData|null>;

export function extractFromHtml(html: string, url?: string, parserOptions?: ParserOptions): Promise<ArticleData|null>;
