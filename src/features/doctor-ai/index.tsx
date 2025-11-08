import { DoctorAIProvider } from "./context/DoctorAIContext";
import DoctorAIPage from "./pages/DoctorAIPage";

/**
 * Wrapper component that provides DoctorAI context to the page
 */
export default function DoctorAIPageWithProvider() {
  return (
    <DoctorAIProvider>
      <DoctorAIPage />
    </DoctorAIProvider>
  );
}

