import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  addMonths,
  isSameDay,
} from "date-fns"; /* functions to manipulate dates */

export const Calendar = () => {
  const [selectedDay, setSelectedDay] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date()); /* state to keep track of the currently displayed month */
  const today = new Date();
  const days = eachDayOfInterval({/* get all days of the current month */
    start: startOfMonth(new Date()) /* get the first day of the month */,
    end: endOfMonth(new Date()) /* get the last day of the month */,
  });

  return (
    <div className="container">
      {/* Header with month navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
          ←
        </button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          →
        </button>
      </div>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "8px",
          marginTop: "10px",
        }}
      >
        {days.map((day) => {
          const isSelected = selectedDay && isSameDay(selectedDay, day,); /* check if the current day is the selected day */
          const isToday = isSameDay(today, day,); /* check if the current day is today */
          return (
            <div>
              <button
                key={day.toISOString()} /* stringify the date to use as a unique key */
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: "10px",
                  minWidth: "60px",
                  border: isSelected ? "2px solid blue" : "1px solid gray",
                  backgroundColor: isToday ? "#e0f2ff" : "white",
                  fontWeight: isToday ? "bold" : "normal",
                }}
              >
                {format(day, "dd") /* get the only day of the month */}
              </button>
              {isSelected ? (<div class="card-body">This is some text within a card body.</div>) : <p></p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
