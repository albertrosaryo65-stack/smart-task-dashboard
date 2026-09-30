import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { UIProvider } from "./context/UIContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <UIProvider>
          <AppRoutes />
        </UIProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
