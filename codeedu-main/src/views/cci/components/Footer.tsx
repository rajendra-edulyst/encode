import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export type FooterType = {
  className?: string;
};

const Footer: FunctionComponent<FooterType> = ({ className = "" }) => {
  return (
    <footer
      className={`self-stretch flex flex-col items-center justify-center py-[50px] px-5 box-border relative isolate gap-9 w-full shrink-0 text-center text-num-32 text-white font-jacques-pro mq725:gap-[18px] ${className}`}
    >
      <div className="w-full h-[440.5px] absolute !!m-[0 important] right-[0px] bottom-[-211.5px] left-[0px] bg-black border-dimgray-200 border-solid border-t-[1px] box-border shrink-0" />
      <div className="self-stretch flex items-center justify-center gap-5 w-full shrink-0 flex-wrap">
        <h2 className="m-0 relative text-[length:inherit] font-normal font-inherit whitespace-pre-wrap inline-block z-[1] mq1000:text-num-26 mq450:text-num-19 text-center w-full">
          <Link to="/help-center?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
        </h2>
        {/*<h2 className="m-0 w-[338px] relative text-[length:inherit] font-normal font-inherit inline-block max-w-full z-[1] mq1000:text-num-26 mq450:text-num-19">
          Attempts Left: 2/3
        </h2>*/}
      </div>
      <div className="flex items-center justify-center py-num-01 px-5 box-border w-full shrink-0 text-num-20">
        <div className="self-stretch flex items-center justify-center p-num-10 box-border gap-2.5 max-w-full">
          <img
            className="w-6 relative max-h-full"
            alt=""
            src="/cci/copyright.svg"
          />
          <h3 className="m-0 relative text-[length:inherit] font-normal font-inherit inline-block mq450:text-num-16 text-center">
            Copyrights 2026 All rights reserved by CODE EDU
          </h3>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
