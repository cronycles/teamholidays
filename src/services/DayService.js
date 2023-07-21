

const DayService = (calendarConfig) => {
    function isDateIntensive(dateInMilliseconds) {
        const stringDate = getStringDateFromMillisecondEpochDate(dateInMilliseconds);
        let outcome = false;
        if (calendarConfig?.isFridayAlwayIntensive && isDateFriday(stringDate)) {
            outcome = true;
        } else {
            const isDateInsideSummerIntensivePeriod = isDateIncludedIntoRange(
                stringDate,
                calendarConfig?.summerIntensiveDaysStartDate,
                calendarConfig?.summerIntensiveDaysEndDate
            );
            if (isDateInsideSummerIntensivePeriod) {
                outcome = true;
            } else {
                outcome = calendarConfig?.otherIntensiveDays?.includes(stringDate);
            }
        }
        return outcome;
    }

    function isDateOff(dateInMilliseconds) {
        let outcome = false;
        const stringDate = getStringDateFromMillisecondEpochDate(dateInMilliseconds);

        if (calendarConfig?.isWeekendAlwayOff && isDateWeekend(stringDate)) {
            outcome = true;
        } else {
            outcome = calendarConfig?.otherOffDays?.includes(stringDate);
        }

        return outcome;
    }

    function getStringDateFromMillisecondEpochDate(dateInMilliseconds) {
        const date = new Date(dateInMilliseconds);
        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        const joined = [year, month, day].join("/");
        return joined;
    }

    function isDateFriday(stringDate) {
        const date = new Date(stringDate);
        const stringDay = date.getDay();
        return stringDay == 5;
    }

    function isDateWeekend(stringDate) {
        const date = new Date(stringDate);
        const stringDay = date.getDay();
        return stringDay == 6 || stringDay == 0;
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
        isDateIntensive,
        isDateOff,
    };
};

export default DayService;
