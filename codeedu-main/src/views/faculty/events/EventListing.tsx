import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/ShadcnInput'
import { Search, User } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/ShadcnButton'
import { Alert } from '@/components/ui';
import { useEventStore } from '@/store/learner/EventStore';
import { fetchEvent } from '@/services/learner/EventService';
import Loading from '@/components/shared/Loading';
import { Link } from 'react-router-dom'

const EventListing = () => {
  const [search, setSearch] = useState('')

  const { events, setEvents, loading, setLoading, error, setError } = useEventStore();
    useEffect(() => {
      setLoading(true);
      setError('');
      fetchEvent().then((eventData) => { setEvents(eventData) }).catch((error) => {
        setError('Failed to fetch events');
        console.log(error);
      }).finally(() => {
        setLoading(false);
      });
    }, [setEvents, setLoading, setError]);
  
    if (loading) {
      return <Loading loading={loading} />;
    }
  
    if (error) {
      return <Alert title={error} type="danger" />;
    }


  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search competition name..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
      </div>

      <div className="bg-white border rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Thumb</TableHead>
              <TableHead>Competition Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className='text-center'>Participants</TableHead>
              <TableHead className='text-center'>status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event, index) => (
              <TableRow key={event.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={event.image}
                    alt="event"
                    className="h-9 w-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className='capitalize'>{event.competition_level}</TableCell>
                <TableCell>{new Date(event?.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(event?.end_date).toLocaleDateString()}</TableCell>
                <TableCell className='text-center'>
                  <div className='flex items-center gap-2 justify-center'>
                  {event?.participants ?? 'N/A'} <User size={14} />

                  </div>
                  </TableCell>
                <TableCell className='text-center'>
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-2xl font-semibold ${
                      event?.status === 'Active'
                        ? 'bg-green-200 text-green-800'
                        : event?.status === 'Inactive'
                        ? 'bg-gray-200 text-gray-700'
                        : event?.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {event?.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/event-activity/${event.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default EventListing
