import { prevMonthYear } from '../../Util/Util';
import types from '../Actions/Types';

var startDate = prevMonthYear(3);
var endDate = prevMonthYear(0);

var initState = {
    dateModalSetting: {
        dateOpen : false,
        title : '',
        startDateInit: startDate,                                          // 시작 날짜
        startDate,                                                         // 시작 날짜
        endDateInit: endDate,                                              // 종료 날짜
        endDate,                                                           // 종료 날짜
        dateType : '0',
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.DATE_MODAL_OPEN:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    title : action.title,
                    dateOpen: action.dateOpen,
                    dateType : action.dateType,
                }
            }
        case types.DATE_MODAL_CLOSE:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    dateOpen: false
                }
            }
        case types.STARTDATE_MODAL_CHANGE:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    startDateInit: action.date
                }
            }
        case types.ENDDATE_MODAL_CHANGE:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    endDateInit: action.date
                }
            }
        case types.STARTDATE_MODAL_ACTION:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    startDate: state.dateModalSetting.startDateInit
                }
            }
        case types.ENDDATE_MODAL_ACTION:
            return {
                ...state,
                dateModalSetting: {
                    ...state.dateModalSetting,
                    endDate: state.dateModalSetting.endDateInit
                }
            }
        default:
        return state;
    }
};