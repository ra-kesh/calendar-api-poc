import { useState } from "react";
import "./App.css";

function App() {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [events, setEvents] = useState([]);

  const gapi = window.gapi;
  const CLIENT_ID =
    "48499269506-rasutoaalf2s5bg4bvse6d8ciua4k9pp.apps.googleusercontent.com";
  const API_KEY = "AIzaSyAV9uEXhGLhUAQ713SEpck4uqSowRIH5v8";
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  const addEventAfterValidation = (e) => {
    e.preventDefault();

    gapi.load("client:auth2", () => {
      console.log("loading client");

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load("calendar", "v3", () => console.log("loaded!"));

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          let event = {
            summary,
            location,
            description,
            start: {
              dateTime: `${startDate}:00+00:00`,
            },
            end: {
              dateTime: `${endDate}:00+00:00`,
            },
          };

          let request = gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          });

          request.execute((event) => {
            console.log(event);
            // window.open(event.htmlLink);
          });
        });
    });

    setSummary("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setEndDate("");
  };

  function loadEvents() {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response) => {
        setEvents(response.result.items);
        console.log("EVENTS: ", response.result.items);
      });
  }

  return (
    <div className="App">
      <h1>calendar</h1>
      <form onSubmit={addEventAfterValidation}>
        <label htmlFor="summary">summary</label>
        <br />
        <input
          type="text"
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <br />
        <label htmlFor="description">description</label>
        <br />
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label htmlFor="location">location</label>
        <br />
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <br />
        <label htmlFor="startDate">startDate</label>
        <br />
        <input
          type="datetime-local"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <br />
        <label htmlFor="endDate">endDate</label>
        <br />
        <input
          type="datetime-local"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <br />
        <button>Add Event</button>
      </form>

      <div>
        <h2>Events</h2>
        <button onClick={loadEvents}>Load events</button>
        {events?.map((event) => {
          return (
            <div key={event.id}>
              <h4>{event.summary}</h4>
              <div>{event.start.dateTime}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
