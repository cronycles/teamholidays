import dayjs from "dayjs";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import GlobalContext from "../context/GlobalContext";
export default function CalendarHeader() {
    const { monthIndex, setMonthIndex, dispatchCalEvent, selectedTeamId, teamsConfig } = useContext(GlobalContext);
    function handlePrevMonth() {
        setMonthIndex(monthIndex - 1);
    }
    function handleNextMonth() {
        setMonthIndex(monthIndex + 1);
    }
    function handleReset() {
        setMonthIndex(monthIndex === dayjs().month() ? monthIndex + Math.random() : dayjs().month());
    }
    function handleTeamChange(event) {
        const number = Number(event.target.value);
        dispatchCalEvent({ type: "selectedTeam", payload: number });
    }
    return (
        <header className="px-4 py-2 flex items-center">
            <img src={logo} alt="calendar" className="mr-2 w-12 h-12" />
            <h1 className="mr-10 text-xl text-gray-500 fond-bold">Holidays Calendar</h1>
            <button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
                Today
            </button>
            <button onClick={handlePrevMonth}>
                <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">chevron_left</span>
            </button>
            <button onClick={handleNextMonth}>
                <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">chevron_right</span>
            </button>
            <h2 className="ml-4 text-xl text-gray-500 font-bold">
                {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </h2>
            <select id="teams" onChange={handleTeamChange} className="mx-20" value={selectedTeamId}>
                {teamsConfig?.teams?.map((team, idx) => (
                    <option key={idx} value={team.id}>
                        {team.name}
                    </option>
                ))}
            </select>
        </header>
    );
}
