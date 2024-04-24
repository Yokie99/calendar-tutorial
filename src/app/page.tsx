"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { EventSourceInput } from '@fullcalendar/core/index.js'

import AddEventModal from './Components/AddEventModal'
import DeleteEventModal from './Components/DeleteEventModal'
import { start } from 'repl'

export default function Home() {


  interface Event {
    title: string;
    start: string;
    end:string;
    allDay: boolean;
    id: number;
    //color
    //program
    //
  }
  const [events, setEvents] = useState([
    { title: 'event 1', id: '1' },
    { title: 'event 2', id: '2' },
    { title: 'event 3', id: '3' },
    { title: 'event 4', id: '4' },
    { title: 'event 5', id: '5' },
  ])

  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number>(999999999)
  const [newEvent, setNewEvent] = useState<Event>({
    title: '',
    start: '',
    end: '',
    allDay: false,
    id: 0
  })

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("")

  // useEffect(() => {
  //   let draggableEl = document.getElementById('draggable-el')
  //   if (draggableEl) {
  //     new Draggable(draggableEl, {
  //       itemSelector: ".fc-event",
  //       eventData: function (eventEl) {
  //         let title = eventEl.getAttribute("title")
  //         let id = eventEl.getAttribute("data")
  //         let start = eventEl.getAttribute("start")
  //         return { title, id, start }
  //       }
  //     })
  //   }
  // }, [])

  function handleDateClick(arg: { dateStr: any, allDay: boolean }) {
    setNewEvent({ ...newEvent, start: arg.dateStr, allDay: arg.allDay, id: new Date().getTime() })
    setShowModal(true)

    setStartTime(arg.dateStr + " ")
    setEndTime(arg.dateStr + " ")
    const test = allEvents

    console.log(test)
    
  }
  function addEvent(data: DropArg) {
    const event = { ...newEvent, start: data.date.toISOString(), title: data.draggedEl.innerText, allDay: data.allDay, id: new Date().getTime() }
    setAllEvents([...allEvents, event])
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true)
    setIdToDelete(Number(data.event.id))
  }

  function handleDelete() {
    setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
    setShowDeleteModal(false)
    setIdToDelete(999999)
  }

  function handleCloseModal() {
    setShowModal(false)
    setNewEvent({
      title: '',
      start: '',
      end: '',
      allDay: false,
      id: 0
    })
    setStartTime("")
    setEndTime("")
    setShowDeleteModal(false)
    setIdToDelete(9999999)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value
    })
  }
  const handleEndTimeChange = (time:string): void => {
    setNewEvent({
      ...newEvent,
      end: (endTime + time ),
      allDay: false,
    })
  }
  const handleStartTimeChange = (time:string): void => {
    setNewEvent({
      ...newEvent,
      start: (startTime + time),
      allDay: false,
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAllEvents([...allEvents, newEvent])
    setShowModal(false)
    console.log(newEvent)
    setNewEvent({
      title: '',
      start: '',
      end: '',
      allDay: false,
      id: 0
    })
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>

      <main className="p-20 h-full">
        
          
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin
              ]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
            />
          

        <AddEventModal 
          showModal={showModal}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
          handleTitleChange={handleTitleChange}
          handleEndTimeChange={handleEndTimeChange}
          handleStartTimeChange={handleStartTimeChange}
          newEvent={newEvent}
          handleCloseModal={handleCloseModal}
        />
        <DeleteEventModal
         showDeleteModal={showDeleteModal}
         setShowDeleteModal={setShowDeleteModal}
         handleDelete={handleDelete}
         handleCloseModal={handleCloseModal}
         eventData={allEvents.filter(obj => obj.id === idToDelete)[0]}
        />


        
        
      </main>


    </>
  )
}
