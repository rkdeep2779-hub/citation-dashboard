import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
