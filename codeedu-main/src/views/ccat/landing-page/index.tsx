import { FunctionComponent, useCallback, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserProfile, useUpdateCCIStartDate, useCCITimeslots } from "@/hooks/data/useGettingStarted";
import { useEffect } from "react";

const CCATLandingPage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const { data: timeslotsData } = useCCITimeslots();

  const apiDates = Array.isArray(timeslotsData) && timeslotsData.length > 0
    ? timeslotsData.map(d => typeof d === 'string' ? d : (d.date || d.timeslot || String(d)))
    : [];

  const defaultDates = Array.from({ length: 5 }, (_, i) =>
    dayjs().add(1 + i * 2, 'day').format('DD MMM, YYYY')
  );

  const dates = apiDates.length > 0 ? apiDates : defaultDates;

  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);

  useEffect(() => {
    if (dates && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, [dates.join(',')]);

  const { data: userProfile } = useUserProfile();
  const { mutate: updateCCI } = useUpdateCCIStartDate();

  const onFrameButtonClick = useCallback(() => {
    if (!userProfile) return;

    if ((userProfile.completed_hrs || 0) < 10) {
      setIsDialogOpen(true);
    } else {
      if (userProfile.cci_start_date) {
        navigate('/cci');
      } else {
        setIsLockDialogOpen(true);
      }
    }
  }, [userProfile, navigate]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '2880px', margin: '0 auto', backgroundColor: '#000' }}>
      <div style={{ position: 'relative', marginTop: '-80px' }}>
        <img src="/ccat.png" alt="CCAT Landing Page Design" style={{ width: '100%', display: 'block' }} />

        {/* Top Start Now button — transparent overlay over the yellow button in the image */}
        <button
          onClick={onFrameButtonClick}
          style={{
            position: 'absolute',
            top: '12.5%',
            left: '3%',
            width: '18%',
            height: '2.5%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
          }}
          aria-label="Start Now - Top"
        />

        {/* Bottom Start Now button — transparent overlay over the yellow button in the image */}
        <button
          onClick={onFrameButtonClick}
          style={{
            position: 'absolute',
            top: '94%',
            left: '3%',
            width: '18%',
            height: '2.5%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
          }}
          aria-label="Start Now - Bottom"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#606060] border-none sm:max-w-2xl px-6 py-12 flex flex-col items-center text-center gap-6 rounded-3xl z-[200]">
          <DialogTitle className="text-white text-3xl md:text-[38px] font-bold mt-2 leading-tight">
            Keep Going to Unlock This Stage
          </DialogTitle>
          <div className="flex flex-col text-white text-[20px] md:text-[22px] tracking-wide font-light gap-1 mb-4">
            <span>You still need to complete {Math.max(0, 24 - (userProfile?.completed_hrs || 0))} hours to</span>
            <span>attempt the CCIQ Test.</span>
            <span>(Atleast 24 Hours on the platform)</span>
          </div>
          <button
            onClick={() => {
              setIsDialogOpen(false);
            }}
            className="flex flex-col items-center justify-center bg-[#fcee0a] hover:bg-[#ffe500] text-black font-medium rounded-xl px-12 py-3 transition-colors"
          >
            <span className="text-xl leading-none">↗</span>
            <span className="leading-tight text-[18px]">Continue<br />Learning</span>
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent className="bg-[#606060] border-none sm:max-w-[900px] px-6 py-12 flex flex-col items-center text-center gap-8 rounded-3xl z-[200]">
          <DialogTitle className="text-white text-3xl md:text-[42px] font-bold mt-2 leading-tight">
            Lock Your CCI Moment
          </DialogTitle>
          <div className="flex flex-col text-white text-[18px] md:text-[20px] tracking-wide font-light gap-1">
            <span>Pick a date and time when you can focus, think freely,</span>
            <span>and give your best. (12 hours window)</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {dates.map((date, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center rounded-xl px-6 py-4 cursor-pointer transition-all ${selectedDate === date ? 'border border-[#fcee0a] text-[#fcee0a] bg-[#393939]' : 'border border-transparent text-white bg-[#444444] hover:bg-[#555555]'}`}
                style={{ minWidth: '125px' }}
              >
                <span className="font-medium text-lg leading-tight">{date.split(',')[0]},</span>
                <span className="font-medium text-lg leading-tight">{date.split(',')[1].trim()}</span>
              </div>
            ))}
          </div>

          <div className="flex items-stretch gap-6 mt-4">
            <button
              onClick={() => setIsLockDialogOpen(false)}
              className="flex items-center justify-center bg-[#a3a3a3] hover:bg-[#b0b0b0] text-black font-medium rounded-xl px-10 transition-colors"
            >
              <span className="leading-tight text-[18px]">Not<br />Now</span>
            </button>

            <button
              onClick={() => {
                const formattedDate = dayjs(selectedDate, 'DD MMM, YYYY').format('YYYY-MM-DD HH:mm:ss');
                updateCCI(formattedDate, {
                  onSuccess: () => {
                    setIsLockDialogOpen(false);
                    navigate('/cci');
                  }
                });
              }}
              className="flex flex-col items-center justify-center bg-[#fcee0a] hover:bg-[#ffe500] text-black font-medium rounded-xl px-10 py-3 transition-colors"
            >
              <span className="text-xl leading-none">↗</span>
              <span className="leading-tight text-[18px]">Confirm<br />& Start</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CCATLandingPage;

