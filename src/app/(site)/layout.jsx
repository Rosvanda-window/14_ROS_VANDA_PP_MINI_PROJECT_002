import FooterComponent from "../../components/FooterComponent";
import NavbarComponent from "../../components/NavbarComponent";

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarComponent />
      <main className="flex-1">{children}</main>
      <FooterComponent />
    </div>
  );
}