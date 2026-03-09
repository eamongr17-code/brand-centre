import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PassphraseGate from "@/components/PassphraseGate";
import { PortalProvider } from "@/lib/portal-context";

export default function RootInternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider mode="internal" brandScope={null}>
      <PassphraseGate>
        <Navbar />
        {children}
        <Footer />
      </PassphraseGate>
    </PortalProvider>
  );
}
