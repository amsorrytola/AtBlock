import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ConsolePage } from "./pages/ConsolePage";
import { LabPage } from "./pages/LabPage";
import { DocsIndexPage } from "./pages/DocsIndexPage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { CiteMathPage } from "./pages/CiteMathPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { GraphPage } from "./pages/GraphPage";
import { EnsPage } from "./pages/EnsPage";
import { ApiPage } from "./pages/ApiPage";
import { SecurityPage } from "./pages/SecurityPage";
import { QualifyPage } from "./pages/QualifyPage";
import { MetricsPage } from "./pages/MetricsPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="console" element={<ConsolePage />} />
        <Route path="lab" element={<LabPage />} />
        <Route path="docs" element={<DocsIndexPage />} />
        <Route path="docs/architecture" element={<ArchitecturePage />} />
        <Route path="docs/cite-math" element={<CiteMathPage />} />
        <Route path="docs/payments" element={<PaymentsPage />} />
        <Route path="docs/graph" element={<GraphPage />} />
        <Route path="docs/ens" element={<EnsPage />} />
        <Route path="docs/api" element={<ApiPage />} />
        <Route path="docs/security" element={<SecurityPage />} />
        <Route path="qualify" element={<QualifyPage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
