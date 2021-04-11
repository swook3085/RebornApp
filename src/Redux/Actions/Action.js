import types from './Types';

export function dateModalOpen(dateOpen, dateType, title) {
  return {
    type: types.DATE_MODAL_OPEN,
    dateOpen,
    dateType,
    title
  };
}

export function dateModalChange(dateType, date) {
  if (dateType === '0') {
    return {
      type: types.STARTDATE_MODAL_CHANGE,
      date
    };
  } else if (dateType === '1') {
    return {
      type: types.ENDDATE_MODAL_CHANGE,
      date
    };
  }
}

export function dateModalAction(dateType) {
  if (dateType === '0') {
    return {
      type: types.STARTDATE_MODAL_ACTION,
    };
  } else if (dateType === '1') {
    return {
      type: types.ENDDATE_MODAL_ACTION,
    };
  }
}

export function dateModalClose() {
  return {
    type: types.DATE_MODAL_CLOSE,
  };
}