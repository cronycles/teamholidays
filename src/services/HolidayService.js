import { HttpHelper } from "../helpers/http.helper";

const HolidayService = () => {
    const url = "http://localhost:4000/holidays";
    const api = HttpHelper();

    const getHolidays = async () => {
        try {
            let outcome = [];
            const apiResult = await api //.get(`${url}?_expand=teamMember`)
                .get(url);
            if (apiResult) {
                outcome = apiResult;
            }
            return outcome;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    const saveNewHoliday = async holiday => {
        try {
            let outcome = null;
            const apiResult = await api.post(`${url}`, { body: holiday });
            if (apiResult) {
                outcome = getHolidays();
            }
            return outcome;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const updateHoliday = async holiday => {
        try {
            let outcome = null;
            const id = holiday.id;
            const apiResult = await api.put(`${url}/${id}`, { body: holiday });
            if (apiResult) {
                outcome = getHolidays();
            }
            return outcome;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const deleteHoliday = async holiday => {
        try {
            let outcome = null;
            const id = holiday.id;
            const apiResult = await api.del(`${url}/${id}`, {});
            if (apiResult) {
                outcome = getHolidays();
            }
            return outcome;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    return {
        getHolidays,
        saveNewHoliday,
        updateHoliday,
        deleteHoliday
    };
};

export default HolidayService;
