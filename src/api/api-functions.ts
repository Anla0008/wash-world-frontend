//------------HUSK AT KONVETER TIL TS------------//

//------------GET------------//

// // //Denne henter dummy events fra Dannie
// export async function getEvents() {
//   const events = await fetch("http://localhost:8080/events", {}).then((res) => res.json());
//   return events;
// }

//------------POST------------//
// export async function makeNewEvent({ title, description, date, locationId, artworkIds, userId, period }) {
//   const response = await fetch("http://localhost:8080/events", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ title, description, date, locationId, artworkIds, userId, period }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Fejlstatus:", response.status, errorText);
//     throw new Error(errorText); // sender den rigtige besked videre
//   }

//   return response.json();
// }

//------------PUT------------//
// // //Funktionen sender en PUT-request til det rigtige endpoint med antallet billetter i body.
// export async function updateTickets({ id, tickets }) {
//   const response = await fetch(`http://localhost:8080/events/${id}/book`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ tickets }),
//   });

//   return response.json();
// }

//------------PATCH------------//
// export async function updateEvent({ id, ...updatedFields }) {
//   const response = await fetch(`http://localhost:8080/events/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(updatedFields),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Fejl ved opdatering:", errorText);
//     throw new Error("Event kunne ikke opdateres");
//   }

//   return response.json();
// }

//------------DELETE------------//
// export async function deleteEvent(id) {
//   const response = await fetch(`http://localhost:8080/events/${id}`, {
//     method: "DELETE",
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Fejl ved sletning:", errorText);
//     throw new Error("Event kunne ikke slettes");
//   }

//   return response.json();
// }
