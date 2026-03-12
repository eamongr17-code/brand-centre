import Navbar from "@/components/Navbar";
import AuthGate from "@/components/AuthGate";
import { PortalProvider } from "@/lib/portal-context";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider mode="owner" brandScope={null}>
      <AuthGate requireOwner>
        <Navbar />
        {children}
      </AuthGate>
    </PortalProvider>
  );
}
