import React, { useState, useEffect, useReducer } from "react";
import dayjs from "dayjs";
import GlobalContext from "./GlobalContext";
import HolidayService from "../services/HolidayService";
import TeamMemberService from "../services/TeamMemberService";
import { useCookies } from "react-cookie";

function actionReducer(state, { type, payload }) {
    return {
        action: type,
        payload: payload,
    };
}

export default function ContextWrapper(props) {
    const holidayService = HolidayService();
    const [cookies, setCookie] = useCookies(["hctid"]);

    const [monthIndex, setMonthIndex] = useState(dayjs().month());
    const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
    const [daySelected, setDaySelected] = useState(dayjs());
    const [showEventModal, setShowEventModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(cookies.hctid ?? 1);
    const [teamMembers, setTeamMembers] = useState([]);
    const [savedEvents, setSavedEvents] = useState([]);
    const [callAction, dispatchCalEvent] = useReducer(actionReducer, { action: null, paylod: null });

    const [calendarConfig, setCalendarConfig] = useState({});
    const [teamsConfig, setTeamsConfig] = useState({});

    function getSelectedTeamMembers() {
        let outcome = [];
        if (teamsConfig?.teams) {
            for (let team of teamsConfig?.teams) {
                if (team.id == selectedTeamId) {
                    outcome = team.members;
                    break;
                }
            }
        }

        return outcome;
    }

    useEffect(() => {
        async function setDataFromCallAction() {
            switch (callAction.action) {
                case "push":
                    await holidayService.saveNewHoliday(callAction.payload);
                    return setSavedEvents([...savedEvents, callAction.payload]);
                case "update":
                    const updatedArray = [];
                    for (const savedEvent of savedEvents) {
                        if (savedEvent.id === callAction.payload.id) {
                            updatedArray.push(callAction.payload);
                        } else {
                            updatedArray.push(savedEvent);
                        }
                    }
                    await holidayService.updateHoliday(callAction.payload);
                    return setSavedEvents(updatedArray);
                case "delete":
                    const deletedArray = [];
                    for (const savedEvent of savedEvents) {
                        if (savedEvent.id !== callAction.payload.id) {
                            deletedArray.push(savedEvent);
                        }
                    }
                    await holidayService.deleteHoliday(callAction.payload);
                    return setSavedEvents(deletedArray);
                case "selectedTeam":
                    let teamId = callAction.payload;
                    setCookie("hctid", teamId);
                    setSelectedTeamId(teamId);
                    const profileData = await reloadProfile();
                    return dispatchCalEvent({ type: "reload", payload: profileData });
                case "reload":
                default:
                    let allHolidays = callAction.payload;
                    if (allHolidays && allHolidays.length > 0) {
                        allHolidays = allHolidays.filter(holiday => holiday.teamId == selectedTeamId);
                    }
                    return setSavedEvents(allHolidays);
            }
        }
        setDataFromCallAction();
    }, [callAction]);

    const fetchData = async () => {
        try {
            const data = await holidayService.getHolidays();
            var jsonString = JSON.stringify(data);
            const parsedEvents = jsonString ? JSON.parse(jsonString) : [];
            return parsedEvents;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const reloadProfile = async () => {
        try {
            let outcome = await fetchData();

            return outcome;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    async function loadConfigurations() {
        try {
            let currentYear = new Date().getFullYear();
            let calConf = await import(`../configuration/${currentYear}/calendar.config`);
            let teamsConf = await import(`../configuration/${currentYear}/teams.config`);
            setCalendarConfig(calConf);
            setTeamsConfig(teamsConf);
        } catch (e) {
            console.error("current year configuration not found. loaded past year one");
            let currentYear = new Date().getFullYear();
            currentYear -= 1;
            const calConf = await import(`../configuration/${currentYear}/calendar.config`);
            const teamsConf = await import(`../configuration/${currentYear}/teams.config`);
            setCalendarConfig(calConf);
            setTeamsConfig(teamsConf);
        }
    }

    useEffect(() => {
        async function reload() {
            await loadConfigurations();
            const profileData = await reloadProfile();
            dispatchCalEvent({ type: "reload", payload: profileData });
        }
        reload();
    }, []);

    useEffect(() => {
        setTeamMembers(prevTeamMembers => {
            const outcome = [];
            const teamMembers = getSelectedTeamMembers();
            if (teamMembers.length > 0) {
                for (const teamMember of teamMembers) {
                    const currentTeamMember = prevTeamMembers.find(tm => tm.id === teamMember.id);
                    teamMember.checked = currentTeamMember ? currentTeamMember.checked : true;
                    const teamMemberObject = TeamMemberService(
                        calendarConfig,
                        teamsConfig,
                        savedEvents
                    ).calculateTeamMemberData(teamMember);
                    if (!outcome.includes(teamMemberObject)) {
                        outcome.push(teamMemberObject);
                    }
                }
            }
            return outcome;
        });
    }, [savedEvents, teamsConfig, calendarConfig]);

    useEffect(() => {
        if (smallCalendarMonth !== null) {
            setMonthIndex(smallCalendarMonth);
        }
    }, [smallCalendarMonth]);

    useEffect(() => {
        if (!showEventModal) {
            setSelectedEvent(null);
        }
    }, [showEventModal]);

    function updateTeamMember(teamMember) {
        setTeamMembers(teamMembers.map(tm => (tm.id === teamMember.id ? teamMember : tm)));
    }

    return (
        <GlobalContext.Provider
            value={{
                monthIndex,
                setMonthIndex,
                smallCalendarMonth,
                setSmallCalendarMonth,
                daySelected,
                setDaySelected,
                showEventModal,
                setShowEventModal,
                showTeamModal,
                setShowTeamModal,
                dispatchCalEvent,
                selectedEvent,
                setSelectedEvent,
                savedEvents,
                setTeamMembers,
                teamMembers,
                updateTeamMember,
                selectedTeamId,
                setSelectedTeamId,
                calendarConfig,
                teamsConfig,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
}
