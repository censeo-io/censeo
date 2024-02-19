import 'jest-preset-angular/setup-jest';
import { TextDecoder, TextEncoder } from 'util';

// Workaround for https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.TextDecoder = TextDecoder;
