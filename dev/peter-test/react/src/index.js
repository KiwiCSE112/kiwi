import React from "react";
import ReactDOM from "react-dom";
import PeterTest from "./PeterTest.jsx";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<PeterTest color="blue" times="2"/>, document.getElementById("root"));
registerServiceWorker();