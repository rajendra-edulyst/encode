import { FunctionComponent, useMemo, type CSSProperties } from "react";

export type PreparatoryGuidanceType = {
  className?: string;
  book4?: string;
  preparatoryGuidance?: string;

  /** Style props */
  preparatoryGuidanceWidth?: CSSProperties["width"];
};

const PreparatoryGuidance: FunctionComponent<PreparatoryGuidanceType> = ({
  className = "",
  book4,
  preparatoryGuidance,
  preparatoryGuidanceWidth,
}) => {
  const preparatoryGuidanceStyle: CSSProperties = useMemo(() => {
    return {
      width: preparatoryGuidanceWidth,
    };
  }, [preparatoryGuidanceWidth]);

  return (
    <div
      className={`self-stretch flex-1 rounded-num-20 bg-gray-100 flex items-start p-num-30 box-border gap-[13px] max-w-full text-left text-num-24 text-white font-jacques-pro mq725:min-w-full mq1050:min-h-[auto] mq450:flex-wrap ${className}`}
    >
      <div className="flex flex-col items-start pt-num-8 px-num-01 pb-num-01">
        <img
          className="w-[52px] relative max-h-full"
          loading="lazy"
          alt=""
          src={book4}
        />
      </div>
      <b
        className="w-[164px] relative inline-block min-h-[68px] mq450:text-num-19"
        style={preparatoryGuidanceStyle}
      >
        {preparatoryGuidance}
      </b>
    </div>
  );
};

export default PreparatoryGuidance;
