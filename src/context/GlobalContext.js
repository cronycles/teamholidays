import React from "react";

const GlobalContext = React.createContext({
    monthIndex: 0,
    setMonthIndex: index => {},
    smallCalendarMonth: 0,
    setSmallCalendarMonth: index => {},
    daySelected: null,
    setDaySelected: day => {},
    showEventModal: false,
    setShowEventModal: () => {},
    showTeamModal: false,
    setShowTeamModal: () => {},
    dispatchCalEvent: ({ type, payload }) => {},
    savedEvents: [],
    selectedEvent: null,
    setSelectedEvent: () => {},
    setTeamMembers: () => {},
    teamMembers: [],
    selectedTeamId: 1,
    setSelectedTeamId: () => {},
    updateTeamMember: () => {},
    calendarConfig: {},
    teamsConfig: {},
});

export default GlobalContext;
