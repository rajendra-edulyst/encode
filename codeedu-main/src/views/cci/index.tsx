import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import ContentArea from "./components/ContentArea";
import { CCIProvider } from "@/context/CCIContext";

const CCATDashboardStage2Done: FunctionComponent = () => {
  return (
    <CCIProvider>
      <div className="w-full min-h-screen bg-black text-white font-jacques-pro flex flex-col items-center">
        <main className="w-full max-w-[1300px] flex flex-col items-center gap-10 py-10 px-6 box-border">
          <ContentArea />
        </main>
        <footer className="w-full max-w-[1300px] mt-auto py-8 px-6 border-t border-[#333] flex flex-col gap-6 text-sm text-gray-400">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              <Link to="/help-center?cci=1" className="hover:text-white cursor-pointer" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" className="hover:text-white cursor-pointer" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
            </div>
          </div>
          <div className="text-center mt-4">
            © Copyrights 2026 All rights reserved by CODE EDU
          </div>
        </footer>
      </div>
    </CCIProvider>
  );
};

export default CCATDashboardStage2Done;
