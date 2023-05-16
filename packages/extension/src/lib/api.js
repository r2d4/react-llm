import * as Comlink from "comlink";
import { createEndpoint } from "comlink-extension";

// eslint-disable-next-line no-undef
const obj = Comlink.wrap(createEndpoint(chrome.runtime.connect()));

export default obj;
