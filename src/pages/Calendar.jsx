import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import Loading from "../components/common/Loading";
import { formatDate } from "../utils/helpers";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const VIEWS = ["Month", "Week", "Day"];

function toDateKey(date) {
  return date.toISOString().split("T")[0];
}

export default function Calendar() {
  const { tasks, projects, isLoading } = useApp();
  const [view, setView] = useState("Month");
  const [cursor, setCursor] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Build a map of date -> events (tasks + project deadlines) for quick lookup.
  const eventsByDate = useMemo(() => {
    const map = {};
    tasks
      .filter((t) => t.dueDate)
      .forEach((t) => {
        const key = t.dueDate;
        map[key] = map[key] || [];
        map[key].push({ type: "task", title: t.title, data: t });
      });
    projects
      .filter((p) => p.endDate)
      .forEach((p) => {
        const key = p.endDate;
        map[key] = map[key] || [];
        map[key].push({ type: "project", title: `${p.name} due`, data: p });
      });
    return map;
  }, [tasks, projects]);

  if (isLoading) return <Loading />;

  function goPrev() {
    const next = new Date(cursor);
    if (view === "Month") next.setMonth(next.getMonth() - 1);
    else if (view === "Week") next.setDate(next.getDate() - 7);
    else next.setDate(next.getDate() - 1);
    setCursor(next);
  }
  function goNext() {
    const next = new Date(cursor);
    if (view === "Month") next.setMonth(next.getMonth() + 1);
    else if (view === "Week") next.setDate(next.getDate() + 7);
    else next.setDate(next.getDate() + 1);
    setCursor(next);
  }
  function goToday() {
    setCursor(new Date());
  }

  const todayKey = toDateKey(new Date());

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Task and project deadlines at a glance.</p>
        </div>
        <div className="page-actions">
          {VIEWS.map((v) => (
            <button
              key={v}
              className={`btn btn-sm ${view === v ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="card card-padded">
        <div className="flex-between mb-16">
          <div className="flex-gap">
            <button className="btn-icon" onClick={goPrev}><ChevronLeft size={18} /></button>
            <button className="btn-icon" onClick={goNext}><ChevronRight size={18} /></button>
            <button className="btn btn-secondary btn-sm" onClick={goToday}>Today</button>
          </div>
          <h3 style={{ fontWeight: 700 }}>
            {view === "Month" && cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}
            {view === "Week" && `Week of ${formatDate(startOfWeek(cursor))}`}
            {view === "Day" && cursor.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </h3>
        </div>

        {view === "Month" && (
          <MonthView cursor={cursor} eventsByDate={eventsByDate} todayKey={todayKey} onSelectEvent={setSelectedEvent} />
        )}
        {view === "Week" && (
          <WeekView cursor={cursor} eventsByDate={eventsByDate} todayKey={todayKey} onSelectEvent={setSelectedEvent} />
        )}
        {view === "Day" && (
          <DayView cursor={cursor} eventsByDate={eventsByDate} onSelectEvent={setSelectedEvent} />
        )}
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || ""}
      >
        {selectedEvent?.type === "task" && (
          <div>
            <div className="flex-gap mb-16">
              <Badge label={selectedEvent.data.status} />
              <Badge label={selectedEvent.data.priority} />
            </div>
            <p className="text-muted">{selectedEvent.data.description || "No description."}</p>
            <p className="text-sm text-muted mt-16">Due {formatDate(selectedEvent.data.dueDate)}</p>
          </div>
        )}
        {selectedEvent?.type === "project" && (
          <div>
            <Badge label={selectedEvent.data.status} />
            <p className="text-muted mt-16">{selectedEvent.data.description}</p>
            <p className="text-sm text-muted mt-16">Due {formatDate(selectedEvent.data.endDate)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function MonthView({ cursor, eventsByDate, todayKey, onSelectEvent }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    cells.push(date);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-sm text-muted" style={{ textAlign: "center", fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {cells.map((date) => {
          const key = toDateKey(date);
          const isCurrentMonth = date.getMonth() === month;
          const events = eventsByDate[key] || [];
          return (
            <div
              key={key}
              style={{
                minHeight: 90,
                minWidth: 0,
                overflow: "hidden",
                padding: 6,
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                backgroundColor: key === todayKey ? "var(--color-primary-light)" : isCurrentMonth ? "#fff" : "#fafbfc",
                opacity: isCurrentMonth ? 1 : 0.5,
              }}
            >
              <div className="text-sm" style={{ fontWeight: key === todayKey ? 700 : 500 }}>{date.getDate()}</div>
              {events.slice(0, 2).map((ev, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectEvent(ev)}
                  className="text-sm"
                  style={{
                    marginTop: 4,
                    padding: "2px 6px",
                    borderRadius: 4,
                    backgroundColor: ev.type === "project" ? "var(--color-purple-light)" : "var(--color-primary-light)",
                    color: ev.type === "project" ? "var(--color-purple)" : "var(--color-primary)",
                    fontSize: 11.5,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {ev.title}
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-sm text-muted" style={{ fontSize: 11 }}>+{events.length - 2} more</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ cursor, eventsByDate, todayKey, onSelectEvent }) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
      {days.map((date) => {
        const key = toDateKey(date);
        const events = eventsByDate[key] || [];
        return (
          <div
            key={key}
            style={{
              minHeight: 160,
              minWidth: 0,
              overflow: "hidden",
              padding: 10,
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              backgroundColor: key === todayKey ? "var(--color-primary-light)" : "#fff",
            }}
          >
            <div className="text-sm text-muted">{WEEKDAYS[date.getDay()]}</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{date.getDate()}</div>
            {events.map((ev, idx) => (
              <div
                key={idx}
                onClick={() => onSelectEvent(ev)}
                className="text-sm"
                style={{
                  marginTop: 4,
                  padding: "4px 6px",
                  borderRadius: 4,
                  backgroundColor: ev.type === "project" ? "var(--color-purple-light)" : "var(--color-primary-light)",
                  color: ev.type === "project" ? "var(--color-purple)" : "var(--color-primary)",
                  cursor: "pointer",
                }}
              >
                {ev.title}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function DayView({ cursor, eventsByDate, onSelectEvent }) {
  const key = toDateKey(cursor);
  const events = eventsByDate[key] || [];

  if (events.length === 0) {
    return <p className="text-muted">No tasks or deadlines on this day.</p>;
  }

  return (
    <ul>
      {events.map((ev, idx) => (
        <li
          key={idx}
          onClick={() => onSelectEvent(ev)}
          className="flex-between"
          style={{ padding: "14px 0", borderBottom: "1px solid var(--color-border)", cursor: "pointer" }}
        >
          <span style={{ fontWeight: 600 }}>{ev.title}</span>
          <Badge label={ev.type === "project" ? "Project" : "Task"} variant={ev.type === "project" ? "badge-purple" : "badge-blue"} />
        </li>
      ))}
    </ul>
  );
}
