import moment from "moment";

export function formatMedicineSchedule(schedules: Date[]) {
  return schedules.map((schedule, index) => {
    return `${moment(schedule).format("HH:mm")} ${index !== schedules.length - 1 ? " / " : ""}`;
  });
}
