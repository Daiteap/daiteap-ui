import {default as format} from "date-fns/format";
import moment from "moment";

const DateFilter = function(date) {
  return format(new Date(date), "MMMM D, YYYY");
};

const FormatDateFilter = function(value) {
  if (value) {
    const date = moment(String(value)).format("DD MMM YYYY, HH:mm");
    if (date.startsWith("0")) {
      const newDate = date.substring(1);
      return newDate;
    }
    return date;
  }
};

export {DateFilter, FormatDateFilter};
