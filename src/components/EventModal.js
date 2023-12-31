import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { useCookies } from "react-cookie";

export default function EventModal() {
    const [cookies, setCookie] = useCookies(["hcdu"]);
    const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent, savedEvents, teamMembers } = useContext(GlobalContext);
    const [isProvisional, setIsProvisional] = useState(selectedEvent ? selectedEvent.isProvisional : false);
    const [availableTeamMembers, setAvailableTeamMembers] = useState(() => {
        let outcome = [];
        let teamMemberIdsOfTheDay = getTeamMemberIdListOfTheDay();
        for (const teamMember of teamMembers) {
            if(selectedEvent && selectedEvent.teamMemberId == teamMember.id) {
                outcome.push(teamMember);
            }
            else if (!teamMemberIdsOfTheDay.includes(teamMember.id)) {
                outcome.push(teamMember);
            }
        }
        return outcome;
    });
    const [selectedTeamMember, setSelectedTeamMember] = useState(() => {
        let outcome = null;
        if (selectedEvent) {
            outcome = availableTeamMembers.find(tm => tm.id === selectedEvent.teamMemberId);
        } else if (cookies.hcdu && cookies.hcdu > 0) {
            outcome = availableTeamMembers.find(tm => tm.id == cookies.hcdu);
        }
        return outcome ?? availableTeamMembers?.[0] ?? null;
    });
    const [isSubmitDisabled, setIsSubmitdisabled] = useState(availableTeamMembers == 0);

    const [isSpecialWorkingHours, setIsSpecialWorkingHours] = useState(() => {
        let outcome = false;
        if (selectedEvent) {
            outcome = selectedEvent.isSpecialWorkingHours;
        } else if (selectedTeamMember?.hasDefaultSpecialWorkingHours) {
            outcome = true;
        }
        return outcome;
    });
    const [specialWorkingHours, setSpecialWorkingHours] = useState(selectedTeamMember?.specialWorkingHours);

    useEffect(() => {
        setKeyboardShortcuts();
    }, []);

    function getTeamMemberIdListOfTheDay() {
        let outcome = [];
        if (savedEvents && savedEvents.length > 0) {
            const eventsOfTheDay = savedEvents.filter(evt => dayjs(evt.day).format("DD-MM-YY") === daySelected.format("DD-MM-YY"));
            for (const eventOfTheDay of eventsOfTheDay) {
                const teamMemberId = eventOfTheDay.teamMemberId;
                if (!outcome.includes(teamMemberId)) {
                    outcome.push(teamMemberId);
                }
            }
        }

        return outcome;
    }

    function setKeyboardShortcuts() {
        const handleKeydown = e => {
            switch (e.key) {
                case "Escape":
                    setShowEventModal(false);
                    break;
                case "Enter":
                    handleSubmitClick();
                    break;
                case "Delete":
                    if (selectedEvent) {
                        dispatchCalEvent({
                            type: "delete",
                            payload: selectedEvent,
                        });
                        setShowEventModal(false);
                    }
                    break;

                default:
                    break;
            }
        };
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }

    function handleCloseClick() {
        setShowEventModal(false);
    }

    function handleTeamMemberClick(teamMember) {
        setCookie("hcdu", teamMember.id);
        setSelectedTeamMember(teamMember);
        changeCheckboxCheck(teamMember);
    }

    function handleSubmitClick(e) {
        e?.preventDefault();
        if(!isSubmitDisabled) {
            executeSubmit();
            setShowEventModal(false);
        }
    }

    function handleDeleteClick() {
        dispatchCalEvent({
            type: "delete",
            payload: selectedEvent,
        });
        setShowEventModal(false);
    }

    function executeSubmit() {
        const calendarEvent = {
            isProvisional,
            isSpecialWorkingHours,
            teamMemberId: selectedTeamMember.id,
            teamId: selectedTeamMember.teamId,
            day: daySelected.valueOf(),
            id: selectedEvent ? selectedEvent.id : Date.now(),
        };
        if (selectedEvent) {
            dispatchCalEvent({ type: "update", payload: calendarEvent });
        } else {
            dispatchCalEvent({ type: "push", payload: calendarEvent });
        }
    }

    function changeCheckboxCheck(teamMember) {
        if (teamMember.hasDefaultSpecialWorkingHours) {
            setIsSpecialWorkingHours(true);
            document.getElementById("isSpecialWorkingHours").checked = true;
        } else {
            setIsSpecialWorkingHours(false);
            document.getElementById("isSpecialWorkingHours").checked = false;
        }
        setSpecialWorkingHours(teamMember.specialWorkingHours);
    }
    return (
        <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
            <form className="bg-white rounded-lg shadow-2xl w-1/8" style={{ minWidth: "33vw" }}>
                <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="material-icons-outlined text-gray-400">drag_handle</span>
                    <div>
                        {selectedEvent && (
                            <span onClick={handleDeleteClick} className="material-icons-outlined text-gray-400 cursor-pointer">
                                delete
                            </span>
                        )}
                        <button onClick={handleCloseClick}>
                            <span className="material-icons-outlined text-gray-400">close</span>
                        </button>
                    </div>
                </header>
                <div className="p-3">
                    <div className="grid grid-cols-1/5 items-end gap-y-7">
                        <span className="material-icons-outlined text-gray-400">people</span>

                        <div className="flex gap-x-2">
                            {availableTeamMembers.map((teamMember, i) => (
                                <span
                                    key={i}
                                    onClick={() => handleTeamMemberClick(teamMember)}
                                    style={{
                                        padding: "5px 10px",
                                        gap: "5px",
                                        color: "white",
                                        backgroundColor: `${teamMember.color}`,
                                    }}
                                    className={`rounded-full flex items-center justify-center cursor-pointer`}
                                >
                                    {selectedTeamMember.name === teamMember.name && <span className="material-icons-outlined text-white text-sm">check</span>}
                                    {teamMember.name}
                                </span>
                            ))}
                        </div>
                        <span className="material-icons-outlined text-gray-400">schedule</span>
                        <p>{daySelected.format("dddd, MMMM DD")}</p>
                        <span className="material-icons-outlined text-gray-400">lightbulb</span>
                        <div className="flex gap-x-2">
                            <input
                                type="checkbox"
                                id="isProvisional"
                                name="isProvisional"
                                defaultChecked={isProvisional}
                                onChange={e => setIsProvisional(e.target.checked)}
                                required
                            />
                            <label htmlFor="isProvisional"> Is Provisional</label>
                        </div>
                        <span className="material-icons-outlined text-gray-400">star</span>
                        <div className="flex gap-x-2">
                            <input
                                type="checkbox"
                                id="isSpecialWorkingHours"
                                name="isSpecialWorkingHours"
                                defaultChecked={isSpecialWorkingHours}
                                onChange={e => setIsSpecialWorkingHours(e.target.checked)}
                                required
                            />
                            <label htmlFor="isSpecialWorkingHours"> Has special working hours ({specialWorkingHours})</label>
                        </div>
                    </div>
                </div>
                <footer className="flex justify-end border-t p-3 mt-5">
                    <button type="submit" disabled={isSubmitDisabled} onClick={handleSubmitClick} className={
                        isSubmitDisabled ? "bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white opacity-50 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
                        }>
                        Save
                    </button>
                </footer>
            </form>
        </div>
    );
}
