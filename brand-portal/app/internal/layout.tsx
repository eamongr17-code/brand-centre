import Navbar from "@/components/Navbar";
import PassphraseGate from "@/components/PassphraseGate";
import { PortalProvider } from "@/lib/portal-context";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider mode="internal" brandScope={null}>
      <PassphraseGate>
        <Navbar />
        {children}
      </PassphraseGate>
    </PortalProvider>
  );
}
