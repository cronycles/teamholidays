import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { useCookies } from "react-cookie";

export default function EventModal() {
    const [cookies, setCookie] = useCookies(["hcdu"]);
    const { setShowEventModal, daySelected, dispatchCalEvent, selectedEvent, teamMembers } = useContext(GlobalContext);
    const [isProvisional, setIsProvisional] = useState(selectedEvent ? selectedEvent.isProvisional : false);
    const [isSpecialWorkingHours, setIsSpecialWorkingHours] = useState(
        selectedEvent ? selectedEvent.isSpecialWorkingHours : false
    );
    const [selectedTeamMember, setSelectedTeamMember] = useState(() => {
        if (selectedEvent) {
            return teamMembers.find(tm => tm.id === selectedEvent.teamMemberId);
        } else {
            if (cookies.hcdu && cookies.hcdu > 0) {
                return teamMembers.find(tm => tm.id == cookies.hcdu);
            } else {
                return teamMembers[0];
            }
        }
    });

    useEffect(() => {
        const handleKeydown = e => {
            switch (e.key) {
                case "Escape":
                    setShowEventModal(false);
                    break;
                case "Enter":
                    executeSubmit();
                    setShowEventModal(false);
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
    }, []);

    function handleCloseClick() {
        setShowEventModal(false);
    }

    function handleTeamMemberClick(teamMember) {
        setCookie("hcdu", teamMember.id);
        setSelectedTeamMember(teamMember);
        changeCheckboxCheck(teamMember);
    }

    function handleSubmitClick(e) {
        e.preventDefault();
        executeSubmit();
        setShowEventModal(false);
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
    }
    return (
        <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
            <form className="bg-white rounded-lg shadow-2xl w-1/8" style={{ minWidth: "33vw" }}>
                <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="material-icons-outlined text-gray-400">drag_handle</span>
                    <div>
                        {selectedEvent && (
                            <span
                                onClick={handleDeleteClick}
                                className="material-icons-outlined text-gray-400 cursor-pointer"
                            >
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
                            {teamMembers.map((teamMember, i) => (
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
                                    {selectedTeamMember.name === teamMember.name && (
                                        <span className="material-icons-outlined text-white text-sm">check</span>
                                    )}
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
                            <label htmlFor="isSpecialWorkingHours"> Has special working hours</label>
                        </div>
                    </div>
                </div>
                <footer className="flex justify-end border-t p-3 mt-5">
                    <button
                        type="submit"
                        onClick={handleSubmitClick}
                        className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white"
                    >
                        Save
                    </button>
                </footer>
            </form>
        </div>
    );
}
