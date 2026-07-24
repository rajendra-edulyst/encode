import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./components/CustomToolbar";
import ShowModal from "./components/ShowModal";
import "./index.css";
import { fetchEvents, deleteEvent } from './services/CalendarService';
import { useEventStore } from './store/CalendarStore';
import Breadcrumb from '@/components/breadcrumb'
import { Link, useNavigate } from 'react-router-dom';
import { Event } from './@types/calendar';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"

const localizer = momentLocalizer(moment);

const Calendar: React.FC = () => {

    const { events, setEvents } = useEventStore();
    const [CurrentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY-MM'));
    const navigate = useNavigate()

    const breadcrumbItems = [
        { label: 'Calendar' },
    ]

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState<View>("month");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pendingRequestCount, setPendingRequestCount] = useState<number>(0);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start_date: Date; end_date: Date } | null>(null);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSelectSlot = () => {
        navigate('/calendar/create');
    };

    const handleShowDetails = (event: Event) => {
        setCurrentEvent(event);
        setShowDetailsModal(true);
    };

    const handlecloseModal = () => {
        setShowModal(false);
        setShowDetailsModal(false);
        setCurrentEvent(null);
        setSelectedSlot(null);
    };

    const loadEvents = async () => {
        try {
            setLoading(true);
            const res = await fetchEvents(CurrentMonth);
            const events = res?.data;
            setPendingRequestCount(res?.pending_request);

            const formattedEvents = events.map((event) => ({
                ...event,
                start: new Date(event?.start?.replace(" ", "T")),
                end: new Date(event?.end?.replace(" ", "T")),
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };


    // const handleEditEvent = async (data: { start_date: Date; end_date: Date; title: string; description?: string; link?: string; purpose?: string }) => {
    //     if (currentEvent) {
    //         const updatedEvent: Event & { start_date: Date; end_date: Date } = {
    //             ...currentEvent,
    //             ...data,
    //             start_date: data.start_date,
    //             end_date: data.end_date,
    //         };
    //         // Update the event in the store
    //         setEvents(events.map(event =>
    //             event.id === currentEvent.id
    //                 ? { ...updatedEvent }
    //                 : event
    //         ));
    //     }
    //     await loadEvents();
    //     setShowModal(false);

    // };

    const handleDeleteEvent = async (eventId: string) => {
        setShowModal(false);
        await deleteEvent(eventId);

        const updatedEvents = events.filter((event) => String(event.id) !== String(eventId));
        setEvents(updatedEvents);

        await loadEvents();
        setCurrentEvent(null);
        setSelectedSlot(null);
        toast.success('Event deleted successfully');

    };



    useEffect(() => {
        loadEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentView, CurrentMonth]);


    return (

        <div>

            <Breadcrumb items={breadcrumbItems} />

            <div className="flex items-center mb-3 justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Calendar</h1>
                    <p className="text-sm text-gray-500">Manage your calendar</p>
                </div>


                <div className="flex gap-2">


                    <Link
                        to="/calendar/create"
                        className="relative bg-primary border text-gray-800 px-4 hover:bg-gray-100 py-2 rounded-md"
                    >
                        Add New Meeting
                    </Link>

                    <Link
                        to="/calendar/apply-for-mentor"
                        className="relative bg-primary border text-gray-800 px-4 hover:bg-gray-100 py-2 rounded-md"
                    >
                        Be a Mentor
                    </Link>



                    <Link
                        to="/calendar/sessions"
                        className="relative bg-primary border text-gray-800 px-4 hover:bg-gray-100 py-2 rounded-md"
                    >
                        Mentoring Sessions

                        {/* Badge */}
                        {pendingRequestCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {pendingRequestCount}
                            </span>
                        )}
                    </Link>

                </div>




            </div>

            <div className=" bg-white border dark:bg-gray-800 p-4 rounded">


                {/* Modal for Show Details */}
                {showDetailsModal && (
                    <ShowModal
                        isOpen={showDetailsModal}
                        event={currentEvent!}
                        onClose={handlecloseModal}
                        onEdit={() => setShowModal(true)}
                        onDelete={() => currentEvent && currentEvent.id && handleDeleteEvent(currentEvent.id)}
                    />
                )}

                {/* Modal for Add/Edit */}

                {/* {showModal && (
                    <Modal
                        isOpen={showModal}
                        defaultValues={defaultValues}
                        onDelete={currentEvent && currentEvent.id ? () => handleDeleteEvent(currentEvent.id!) : undefined}
                        onSave={currentEvent ? handleEditEvent : handleAddEvent}
                        onClose={() => setShowModal(false)}
                    />
                )} */}


                <div>
                    {loading ? (
                        <div className="flex justify-center bg-gray-100 items-center h-[70vh]">
                            <Skeleton className="h-70" />
                            Loading...
                        </div>
                    ) : (
                        <div style={{ height: "70vh" }}>
                            <BigCalendar
                                selectable
                                events={events}
                                step={60}
                                views={["month", "week", "day"]}
                                localizer={localizer}
                                defaultDate={currentDate}
                                date={currentDate}
                                view={currentView}
                                components={{ toolbar: CustomToolbar }}
                                eventPropGetter={eventStyleGetter}
                                onView={setCurrentView}
                                onNavigate={(newDate) => {
                                    setCurrentDate(newDate);
                                    setCurrentMonth(moment(newDate).format("YYYY-MM"));
                                }}
                                onSelectEvent={handleShowDetails}
                                onSelectSlot={handleSelectSlot}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>

    );
};


const eventStyleGetter = (event: Event, start: Date, end: Date, isSelected: boolean) => ({
    style: {
        backgroundColor: isSelected ? "lightblue" : "lightgreen",
        borderRadius: "5px",
        color: "black",
        padding: "5px",
    },
});

export default Calendar;
