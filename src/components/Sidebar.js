import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import TeamMembers from "./TeamMembers";
export default function Sidebar() {
    return (
        <aside className="border p-5 w-64">
            <CreateEventButton />
            <SmallCalendar />
            <TeamMembers />
        </aside>
    );
}
