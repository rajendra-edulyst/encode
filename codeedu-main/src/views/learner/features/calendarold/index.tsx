import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./components/CustomToolbar";
import Modal from "./components/Modal";
import ShowModal from "./components/ShowModal";
import "./index.css";
import { fetchEvents, createEvent, deleteEvent } from './services/CalendarService';
import { useEventStore } from './store/CalendarStore';

const localizer = momentLocalizer(moment);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    link?: string;
}

const Calendar: React.FC = () => {

    const { events, setEvents } = useEventStore();

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const events = await fetchEvents();
                console.log('Fetched Events:', events);
                const formattedEvents = events.map((event) => ({
                    ...event,
                    start: moment(event.start).startOf('day').toDate(),
                    end: moment(event.end).startOf('day').toDate(),
                }));

                console.log('Formatted Events:', formattedEvents);
                setEvents(formattedEvents); // Set the formatted events
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };
        loadEvents();
    }, [setEvents]);


    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState<View>("month");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);



    const handleSelectEvent = (event: Event) => {
        setCurrentEvent(event);
        setShowDetailsModal(true);
    };

    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        // const normalizedStart = moment(start).startOf('day').toDate();
        // const normalizedEnd = moment(end).endOf('day').toDate();

        setSelectedSlot({ start: start, end: end });
        setShowModal(true);
    };


    const handleAddEvent = async (newEvent: Event) => {
        try {
            const addedEvent = await createEvent(newEvent);

            if (addedEvent) {
                alert('Event added successfully');
                setEvents([...events, newEvent]);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    };


    const handleEditEvent = (updatedEvent: Event) => {
        setShowModal(false);
    };

    const handleDeleteEvent = (eventId: string) => {
        setShowModal(false);
        deleteEvent(eventId);

        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);

        setCurrentEvent(null);
        setSelectedSlot(null);
    };

    const defaultValues = currentEvent ? currentEvent : selectedSlot ? {
        title: "", description: "", link: "", ...selectedSlot
    } : undefined;

    return (
        <div className=" bg-white border dark:bg-gray-800 p-4 rounded">
            {/* Modal for Show Details */}
            {showDetailsModal && (
                <ShowModal
                    isOpen={showDetailsModal}
                    event={currentEvent!}
                    onClose={() => setShowDetailsModal(false)}
                    onEdit={() => setShowModal(true)}
                    onDelete={() => handleDeleteEvent(currentEvent!.id)}
                />
            )}

            {/* Modal for Add/Edit */}

            {showModal && (
                <Modal
                    isOpen={showModal}
                    defaultValues={defaultValues}
                    onDelete={currentEvent ? () => handleDeleteEvent(currentEvent.id) : undefined}
                    onSave={currentEvent ? handleEditEvent : handleAddEvent}
                    onClose={() => setShowModal(false)}
                />
            )}
            <div style={{ height: "100vh" }}>
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
                    onNavigate={setCurrentDate}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                />
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
