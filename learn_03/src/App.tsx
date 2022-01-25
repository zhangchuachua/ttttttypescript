import React from 'react';
// import UseMemo from "./ pages/UseMemo/UseMemo";
import 'antd/dist/antd.css';
import TSUseRef from "./ReactHook with TS/TSUseRef";

// import UseState from "./ pages/useState/useState";
// import './App.css';
// import UseEffect from "./ pages/UseEffect/UseEffect";

function App(): React.ReactElement {
  return (
    <div className="App">
      {/*<UseState />*/}
      {/*<UseEffect />*/}
      {/*<UseMemo/>*/}
      <TSUseRef/>
    </div>
  );
}

export default App;
