import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function Labels() {
    const { teamMembers, updateTeamMember, setShowTeamModal } = useContext(GlobalContext);
    function handleTeamMemberChange(teamMember, isChecked) {
        teamMember.checked = isChecked;
        updateTeamMember(teamMember);
    }

    return (
        <React.Fragment>
            <p className="text-gray-500 font-bold mt-10">Team Member</p>
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-sm font-light">
                                <tbody>
                                    {teamMembers.map((teamMember, idx) => (
                                        <tr key={idx} className="border-b dark:border-neutral-500">
                                            <td className="whitespace-nowrap font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={teamMember.checked}
                                                    onChange={e => {
                                                        handleTeamMemberChange(teamMember, !teamMember.checked);
                                                    }}
                                                    style={{ backgroundColor: `${teamMember.color}` }}
                                                    className={`form-checkbox h-5 w-5 rounded focus:ring-0 cursor-pointer`}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">{teamMember.name}</td>
                                            <td className="whitespace-nowrap px-4 py-2" style={{ cursor: "pointer" }}>
                                                <a href="#"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setShowTeamModal(true);
                                                    }}
                                                >
                                                    {teamMember.spentHours} ({teamMember.totalAvailableHours})
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
