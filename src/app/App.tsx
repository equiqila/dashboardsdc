import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ExcelDataProvider } from "./data/ExcelDataContext";

export default function App() {
  return (
    <ExcelDataProvider>
      <RouterProvider router={router} />
    </ExcelDataProvider>
  );
}