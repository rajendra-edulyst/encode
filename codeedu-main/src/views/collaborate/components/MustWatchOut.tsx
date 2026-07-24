import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEvents } from '@/hooks/data/collaborate/useEvents'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

const MustWatchOut = () => {
  const navigate = useNavigate()

  const params = React.useMemo(() => {
    const p = new URLSearchParams()
    p.append('is_assigned', '1')
    p.append('type', 'event')
    return p
  }, [])

  const { data: rawEvents = [], isLoading } = useEvents(params)

  const events = React.useMemo(() => {
    return rawEvents.filter((event) => String(event.must_watch_out) === '1' || event.must_watch_out === 1)
  }, [rawEvents])

  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)

  const handleNext = React.useCallback(() => {
    if (!events.length) return
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
  }, [events.length])

  const handlePrev = React.useCallback(() => {
    if (!events.length) return
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }, [events.length])

  React.useEffect(() => {
    if (!events.length) return

    const interval = setInterval(() => {
      handleNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [events.length, handleNext])

  if (isLoading) {
    return <div className="py-6 text-center text-neutral-400">Loading...</div>
  }

  if (events?.length === 0 || !events?.length) {
    return null
  }

  const currentEvent = events[currentIndex]
  const profile = currentEvent?.profiles?.[0]
  const image =
    currentEvent?.image ||
    currentEvent?.file ||
    profile?.image ||
    'https://via.placeholder.com/1200x500'

  const targetCategory = currentEvent?.event_category_name || 'Career Drive';
  const eventLink = (currentEvent?.event_group_name === 'Must Attend')
    ? `/must-attend/details/${currentEvent.id}?category=${targetCategory}`
    : `/agenda/details/${currentEvent.id}?category=${targetCategory}`;

  return (
    <Card className="border border-white/10 shadow-none rounded-[20px] overflow-hidden p-3 relative bg-[#1E1E1E] w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">
          <span className="text-codegreen">Must</span> <span className="text-white">Watchout</span>
        </h2>
        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={handlePrev}
            className="w-7 h-7 rounded-full border border-codegreen flex items-center justify-center text-codegreen hover:bg-codegreen/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full border border-codegreen flex items-center justify-center text-codegreen hover:bg-codegreen/10 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative w-full overflow-hidden rounded-[20px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentEvent.id || currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Link
              to={eventLink}
              onClick={(e) => {
                e.preventDefault();
                mixpanelService.track('Must Watchout Viewed', {
                  event_id: currentEvent.id,
                  profile_id: profile?.id,
                  profile_name: profile?.name
                });
                navigate(`/events/${profile?.id}`);
              }}
              className="block w-full relative bg-transparent"
            >
              <img
                src={image}
                alt={currentEvent.name || profile?.name || 'Event Banner'}
                className="w-full h-auto object-contain rounded-[20px]"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default MustWatchOut

