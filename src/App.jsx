// react router dom
import { BrowserRouter } from "react-router-dom";

// app routes
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
