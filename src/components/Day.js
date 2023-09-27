import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import DayService from "../services/DayService";

export default function Day({ day, rowIdx }) {
    const [dayEvents, setDayEvents] = useState([]);
    const { setDaySelected, setShowEventModal, teamMembers, savedEvents, setSelectedEvent, calendarConfig } =
        useContext(GlobalContext);
    const dayService = DayService(calendarConfig);

    useEffect(() => {
        if (savedEvents && savedEvents.length > 0) {
            const eventsOfTheDay = savedEvents.filter(evt => dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY"));
            let eventsOfCheckedTeamMember = getOnlyEventsWithCheckedTeamMember(eventsOfTheDay);
            if (eventsOfCheckedTeamMember && eventsOfCheckedTeamMember.length > 0) {
                setDayEvents(eventsOfCheckedTeamMember);
            } else {
                setDayEvents([]);
            }
        } else {
            setDayEvents([]);
        }
    }, [savedEvents, day, teamMembers]);

    function getOnlyEventsWithCheckedTeamMember(events) {
        let outcome = [];
        for (const theEvent of events) {
            const teamMemberId = theEvent.teamMemberId;
            const teamMember = teamMembers.find(tm => tm.id == teamMemberId);
            if(teamMember?.checked) {
                outcome.push(theEvent);
            }
        }
        return outcome;
    }

    function handelDayClick() {
        setDaySelected(day);
        if (canShowEventModal()) {
            setShowEventModal(true);
        }
    }

    function canShowEventModal() {
        return !dayService.isDateOff(day);
    }

    function getDayBackgroundColor() {
        let outcome = "white";
        if (dayService.isDateOff(day)) {
            outcome = "#fceded";
        } else if (dayService.isDateIntensive(day)) {
            outcome = "#edfcf4";
        }
        return outcome;
    }

    function getCurrentDayClass() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "bg-blue-600 text-white rounded-full w-7" : "";
    }

    function getTeamMemberFromId(teamMemberId) {
        return teamMembers?.find(tm => tm.id === teamMemberId);
    }
    function getBackgroundStyle(theEvent) {
        let outcome = {};
        const teamMember = getTeamMemberFromId(theEvent.teamMemberId);
        if (teamMember) {
            outcome = { backgroundColor: `${teamMember.color}`, color: "white" };

            if (theEvent.isProvisional) {
                let stripeColor = invertHex(teamMember.color);
                outcome = {
                    background: `repeating-linear-gradient(45deg, ${teamMember.color}, ${teamMember.color} 5px, ${stripeColor} 10px, ${stripeColor} 10px)`,
                    color: "white",
                };
            }
        }
        return outcome;
    }

    function invertHex(hex) {
        var stringWithoutHash = hex.substring(1);
        let outcomeWithoutHash = (Number(`0x1${stringWithoutHash}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
        return `#${outcomeWithoutHash}`;
    }

    return (
        <div className="border border-gray-200 flex flex-col" style={{ backgroundColor: getDayBackgroundColor() }}>
            <header className="flex flex-col items-center">
                {rowIdx === 0 && <p className="text-sm mt-1">{day.format("ddd").toUpperCase()}</p>}
                <p className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}>{day.format("DD")}</p>
            </header>
            <div className="flex-1 cursor-pointer" onClick={handelDayClick}>
                {dayEvents.map((evt, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedEvent(evt)}
                        style={getBackgroundStyle(evt)}
                        className={`p-1 mr-3 text-sm rounded mb-1 truncate`}
                    >
                        {getTeamMemberFromId(evt.teamMemberId)?.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
