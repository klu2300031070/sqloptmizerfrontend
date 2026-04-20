import { useState } from "react";
import Login from "./components/Login";
import SqlOptimizer from "./components/SqlOptimizer";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <SqlOptimizer user={user} />
      )}
    </div>
  );
}

export default App;