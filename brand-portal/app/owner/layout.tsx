import Navbar from "@/components/Navbar";
import OwnerGate from "@/components/OwnerGate";
import { PortalProvider } from "@/lib/portal-context";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider mode="owner" brandScope={null}>
      <OwnerGate>
        <Navbar />
        {children}
      </OwnerGate>
    </PortalProvider>
  );
}
