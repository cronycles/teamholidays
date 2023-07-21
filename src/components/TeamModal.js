import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function TeamModal() {
    const { setShowTeamModal, teamMembers } = useContext(GlobalContext);

    return (
        <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl w-1/8" style={{ minWidth: "33vw" }}>
                <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
                    <span className="material-icons-outlined text-gray-400">drag_handle</span>
                    <div>
                        <button onClick={() => setShowTeamModal(false)}>
                            <span className="material-icons-outlined text-gray-400">close</span>
                        </button>
                    </div>
                </header>
                <div className="p-3">
                    <div className="flex flex-col">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="min-w-full text-left text-sm font-light">
                                        <thead className="border-b font-medium dark:border-neutral-500">
                                            <tr>
                                                <th scope="col" className="px-6 py-6">
                                                    Team Member
                                                </th>
                                                <th scope="col" className="px-6 py-6">
                                                    Total Available Hours
                                                </th>
                                                <th scope="col" className="px-6 py-6">
                                                    Spent Hours
                                                </th>
                                                <th scope="col" className="px-6 py-6">
                                                    Spent Days
                                                </th>
                                                <th scope="col" className="px-6 py-6">
                                                    Hours left
                                                </th>
                                                <th scope="col" className="px-6 py-6">
                                                    Days left
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamMembers.map((teamMemberObject, i) => (
                                                <tr key={i} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.totalAvailableHours}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.spentHours}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.spentDays}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.hoursLeft}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {teamMemberObject.daysLeft}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
