import ReactDOM from "react-dom/client";

import { App } from "./App";

// @ts-expect-error Property 'toJSON' does not exist on type 'BigInt'
BigInt.prototype.toJSON = function() { return this.toString(); };

ReactDOM
    .createRoot( document.getElementById("app") as Element )
    .render(<App />);
