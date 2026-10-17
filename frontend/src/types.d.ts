declare module 'typed.js' {
  interface TypedOptions {
    strings?: string[];
    typeSpeed?: number;
    backSpeed?: number;
    backDelay?: number;
    startDelay?: number;
    loop?: boolean;
    showCursor?: boolean;
    cursorChar?: string;
    autoInsertCss?: boolean;
  }

  export default class Typed {
    constructor(element: string | Element, options: TypedOptions);
    destroy(): void;
    start(): void;
    stop(): void;
    toggle(): void;
    reset(restart?: boolean): void;
  }
}
