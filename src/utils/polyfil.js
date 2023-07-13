import { JSDOM } from "jsdom";

if (typeof self === "undefined") {
  global.self = new JSDOM().window;
}
