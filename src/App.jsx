import { useState } from "react";
import Login from "./components/Login";
import SqlOptimizer from "./components/SqlOptimizer";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <SqlOptimizer/>
    </div>
  );
}

export default App;