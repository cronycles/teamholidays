const TeamMemberService = (calendarConfig, teamsConfig, passedEvents) => {
    const savedEvents = passedEvents;

    function calculateTeamMemberData(teamMember) {
        let teamMemberObject = {};
        if (teamMember) {
            teamMemberObject.name = teamMember.name;
            teamMemberObject.color = teamMember.color;
            teamMemberObject.id = teamMember.id;
            teamMemberObject.hasDefaultSpecialWorkingHours = teamMember.hasDefaultSpecialWorkingHours;
            teamMemberObject.specialWorkingHours = teamMember.specialWorkingHours;
            teamMemberObject.teamId = getTeamIdByTeamMember(teamMember);
            teamMemberObject.checked = teamMember.checked;
            teamMemberObject.totalAvailableHours =
                teamMember.pastYearAvailableHours + calendarConfig.totalAvailableHours;
            teamMemberObject.spentHours = getSpentHoursByTeamMember(teamMember);
            teamMemberObject.spentDays = teamMemberObject.spentHours / calendarConfig.fullDayInHours;
            teamMemberObject.hoursLeft = teamMemberObject.totalAvailableHours - teamMemberObject.spentHours;
            teamMemberObject.daysLeft = teamMemberObject.hoursLeft / calendarConfig.fullDayInHours;

            teamMemberObject.totalAvailableHours = teamMemberObject.totalAvailableHours.toFixed(2);
            teamMemberObject.spentHours = teamMemberObject.spentHours.toFixed(2);
            teamMemberObject.spentDays = teamMemberObject.spentDays.toFixed(2);
            teamMemberObject.hoursLeft = teamMemberObject.hoursLeft.toFixed(2);
            teamMemberObject.daysLeft = teamMemberObject.daysLeft.toFixed(2);
        }
        return teamMemberObject;
    }

    function getTeamIdByTeamMember(teamMember) {
        let outcome = null;
        for (let team of teamsConfig.teams) {
            let foundMember = team.members.find(member => member.id === teamMember.id);
            if (foundMember) {
                outcome = team.id;
                break;
            }
        }

        return outcome;
    }

    function getSpentHoursByTeamMember(teamMember) {
        let outcome = 0;
        if (teamMember) {
            const teamMemberId = teamMember.id;
            const teamMemberEvents = getFilteredEventsByTeamMemberId(teamMemberId);
            if (teamMemberEvents && teamMemberEvents.length > 0) {
                for (const teamMemberEvent of teamMemberEvents) {
                    if (!teamMemberEvent.isProvisional) {
                        if (teamMemberEvent.isSpecialWorkingHours) {
                            if (teamMember.specialWorkingHours && teamMember.specialWorkingHours > 0) {
                                outcome += teamMember.specialWorkingHours;
                            } else {
                                outcome += calendarConfig.reducedDayInHours;
                            }
                        } else {
                            const stringDate = getStringDateFromMillisecondEpochDate(teamMemberEvent.day);
                            const isIntensive = isDateIntensive(stringDate);
                            if (isIntensive) {
                                outcome += calendarConfig.intensiveDayInHours;
                            } else {
                                outcome += calendarConfig.fullDayInHours;
                            }
                        }
                    }
                }
            }
        }
        return outcome;
    }

    function getFilteredEventsByTeamMemberId(teamMemberId) {
        let outcome = [];
        if (savedEvents && savedEvents.length > 0) {
            outcome = savedEvents.filter(event => event.teamMemberId === teamMemberId);
        }
        return outcome;
    }

    function getStringDateFromMillisecondEpochDate(dateInMilliseconds) {
        const date = new Date(dateInMilliseconds);
        const outcome =  date.getFullYear() + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
        return outcome;
    }

    function isDateIntensive(stringDate) {
        let outcome = false;
        if (isDateFriday(stringDate)) {
            outcome = true;
        } else {
            const isDateInsideSummerIntensivePeriod = isDateIncludedIntoRange(
                stringDate,
                calendarConfig.summerIntensiveDaysStartDate,
                calendarConfig.summerIntensiveDaysEndDate
            );
            if (isDateInsideSummerIntensivePeriod) {
                outcome = true;
            } else {
                outcome = calendarConfig.otherIntensiveDays.includes(stringDate);
            }
        }
        return outcome;
    }

    function isDateFriday(stringDate) {
        const date = new Date(stringDate);
        return date.getDay() == 5;
    }

    function isDateIncludedIntoRange(dateToCheck, dateRangeFrom, dateRangeTo) {
        var fDate, lDate, cDate;
        fDate = Date.parse(dateRangeFrom);
        lDate = Date.parse(dateRangeTo);
        cDate = Date.parse(dateToCheck);

        if (cDate <= lDate && cDate >= fDate) {
            return true;
        }
        return false;
    }

    return {
        calculateTeamMemberData,
        getTeamIdByTeamMember,
    };
};

export default TeamMemberService;
