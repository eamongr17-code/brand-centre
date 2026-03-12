import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import { PortalProvider } from "@/lib/portal-context";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider mode="internal" brandScope={null}>
      <AuthGate>
        <Navbar />
        {children}
      </AuthGate>
    </PortalProvider>
  );
}
