import { FunctionComponent } from "react";

export type HeaderType = {
  className?: string;
};

const Header: FunctionComponent<HeaderType> = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch bg-black border-dimgray-200 border-solid border-b-[1px] box-border flex items-start justify-between pt-[17px] pb-4 pl-[31px] pr-8 gap-5 top-[0] z-[99] sticky max-w-full text-center text-num-14 text-white font-jacques-pro ${className}`}
    >
      <div className="h-[126.5px] w-[1440px] relative bg-black border-dimgray-200 border-solid border-b-[1px] box-border hidden max-w-full shrink-0" />
      <img
        className="w-7 relative max-h-full hidden shrink-0"
        alt=""
        src="/cci/light-mode.svg"
      />
      <img
        className="w-[189px] relative max-h-full object-cover z-[1] shrink-0"
        loading="lazy"
        alt=""
        src="/cci/logo-light-full-1@2x.png"
      />
      <img
        className="cursor-pointer [border:none] p-num-01 bg-[transparent] w-10 relative max-h-full hidden shrink-0"
        alt=""
        src="/cci/notifications-unread.svg"
      />
      <img
        className="cursor-pointer [border:none] p-num-01 bg-[transparent] w-10 relative rounded-num-20 max-h-full object-cover hidden shrink-0"
        alt=""
        src="/cci/Rectangle-74@2x.png"
      />
      <div className="h-[73px] rounded-num-20 border-dimgray-300 border-solid border-[1px] box-border hidden items-center justify-center py-num-8 px-[19px] gap-[25px] shrink-0 text-left font-jacques-pro">
        <div className="relative">
          <div className="absolute top-[0px] left-[0px] rounded-num-50 bg-dimgray-300 w-full h-full" />
          <div className="absolute top-[16px] left-[12px] inline-block min-w-[28px]">
            75%
          </div>
          <div className="absolute top-[0px] left-[0px] rounded-num-50 bg-yellow-100 w-full h-full" />
        </div>
        <div className="relative text-[18px]">Complete your Profile</div>
      </div>
      <div className="h-[70px] rounded-num-20 border-dimgray-300 border-solid border-[2px] box-border hidden items-center justify-center py-num-10 px-[18px] max-w-full shrink-0 text-num-24">
        <div className="flex items-center justify-center gap-[30px] max-w-full">
          <div className="rounded-num-10 flex items-center justify-center py-num-20 px-num-22">
            <b className="relative leading-num-20 shrink-0">CREATE</b>
          </div>
          <div className="rounded-3xl flex items-center justify-center py-3 px-num-3">
            <b className="relative leading-num-20 shrink-0">CONNECT</b>
          </div>
          <div className="shadow-[0px_1px_3px_rgba(16,_24,_40,_0.1),_0px_1px_2px_rgba(16,_24,_40,_0.06)] rounded-num-10 flex items-center justify-center py-num-20 px-6">
            <b className="relative leading-num-20 shrink-0">COLLABORATE</b>
          </div>
          <div className="shadow-[0px_1px_3px_rgba(16,_24,_40,_0.1),_0px_1px_2px_rgba(16,_24,_40,_0.06)] rounded-num-10 bg-yellow-100 flex items-center justify-center py-num-20 px-6 text-black">
            <b className="relative leading-num-20 shrink-0">CCIQ</b>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start pt-[19px] px-num-01 pb-num-01 shrink-0 text-num-16 text-darkslategray font-jacques-pro">
        <div className="self-stretch flex-1 flex items-center gap-[17px]">
          <img
            className="w-9 relative max-h-full object-cover hidden shrink-0"
            alt=""
            src="/cci/Screenshot-2025-05-20-at-3-38-18-PM-2-removebg-preview-1@2x.png"
          />
          <img
            className="h-num-30 w-[30px] relative hidden shrink-0"
            alt=""
            src="/cci/lucide-history.svg"
          />
          <img
            className="h-num-30 w-[30px] relative shrink-0"
            alt=""
            src="/cci/lucide-bell.svg"
          />
          <img
            className="h-num-30 w-[30px] relative hidden shrink-0"
            alt=""
            src="/cci/lucide-chart-column-big.svg"
          />
          <div className="w-[79px] rounded bg-white border-goldenrod border-solid border-[1px] box-border overflow-hidden shrink-0 hidden flex-col items-start py-num-1 px-[11px]">
            <div className="flex items-center gap-1.5">
              <img className="h-6 w-6 relative" alt="" src="/cci/lucide-star.svg" />
              <div className="relative leading-[14px] font-medium">131</div>
            </div>
          </div>
          <img
            className="h-[54px] w-[54px] relative rounded-[199px] object-cover shrink-0"
            loading="lazy"
            alt=""
            src="/cci/Bell-Space@2x.png"
          />
        </div>
      </div>
      <b className="relative text-num-20 hidden shrink-0">BETA</b>
    </section>
  );
};

export default Header;
