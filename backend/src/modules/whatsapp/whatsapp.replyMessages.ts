import {
  findBookingById,
  listBookings as listBookingsRows,
  listCompletedBookings,
  parseCandidateDriverIdsJson,
} from "../booking/booking.repository.js";
import {
  getBookingByIdService,
  listBookingsService,
  updateBookingService,
} from "../booking/booking.service.js";
import {
  sendBookingAcceptedEmail,
  sendBookingAllRejectedEmail,
} from "../booking/booking.emails.js";
import {
  getDriverEarningsSummary,
  requestDriverManualPayout,
  syncCompletedTransfersForDriver,
} from "../stripe/stripeEarnings.service.js";
import { formatBookingDateTimeZone } from "./formatBookingTime.js";
import type {
  ProcessableMessage,
  WhatsAppReplyPayload,
} from "./whatsapp.types.js";
import { getDriverByPhone, setDriverOnlineStatus } from "../driver/driver.service.js";

export const WHATSAPP_REPLY_MESSAGES = {
  welcomeHint: "Напиши «menu» або «привіт» — покажемо меню.",

  currentTrip:
    "📍 Current trip:\nNice → Monaco\nClient: John\nStatus: On the way",
  earning: "Ваш дохід оновлено.",
  trips: "🚗 You have 2 active trips:\n1. Nice → Monaco\n2. Cannes → Airport",
  profile: "👤 Name: Nazar\nCar: BMW 5 Series\nRating: 4.9⭐",
  history: "🔍 History: You can see your past trips here.",
  help: [
    "Доступні команди (приклад):",
    "• привіт / menu — одне повідомлення з текстом і меню",
    "• обери пункт у списку нижче",
  ].join("\n"),

  online: "🟢 You are now ONLINE",
  offline: "🔴 You are now OFFLINE",

  tripRejected:
    "Ви відхилили поїздку. Статус: відхилено. Якщо це помилка — напишіть у підтримку.",
  tripAccepted:
    "Ви прийняли поїздку. Статус: прийнято. Якщо це помилка — напишіть у підтримку.",

  menu: "📋 Driver menu\n\nSelect an option below",
  defaultEcho: 'Ти написав: "{{text}}". Це відповідь за замовчуванням.',
} as const;

function formatTripDate(date: Date): string {
  const { date: d, time } = formatBookingDateTimeZone(new Date(date));
  return `${d} ${time}`;
}

function formatDeadlineTime(date: Date | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

async function buildTripsListReply(
  driverId: string,
): Promise<WhatsAppReplyPayload> {
  const all = await listBookingsService({ driverId });
  const trips = all.filter((t) => t.status === "assigned");
  const paidTrips = trips.filter((t) => t.paymentStatus === "paid");
  const unpaidTrips = trips.filter((t) => t.paymentStatus === "unpaid");

  if (trips.length === 0) {
    return { body: "🚗 No assigned trips." };
  }

  const rowsPaid = paidTrips.slice(0, 10).map((trip) => ({
    id: `TRIP_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `${formatTripDate(trip.bookingAt)} • Confirmed`.slice(0, 72),
  }));
  const rowsUnpaid = unpaidTrips.slice(0, 10).map((trip) => ({
    id: `TRIP_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `${formatTripDate(trip.bookingAt)} • Awaiting payment`.slice(0, 72),
  }));

  const bodyText = [
    "🚗 My trips",
    "",
    `✅ Paid: ${paidTrips.length}`,
    `💰 Awaiting payment: ${unpaidTrips.length}`,
    "",
    "Select a trip to view details",
  ].join("\n");

  const sections: Array<{
    title: string;
    rows: Array<{ id: string; title: string; description: string }>;
  }> = [];
  if (rowsPaid.length) sections.push({ title: "✅ Paid Trips", rows: rowsPaid });
  if (rowsUnpaid.length)
    sections.push({ title: "💰 Awaiting Payment", rows: rowsUnpaid });

  return {
    body: bodyText,
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: "View trips",
        sections: [
          ...sections,
          {
            title: "Navigation",
            rows: [
              {
                id: "PENDING_TRIPS",
                title: "📋 Pending Trips",
                description: "Awaiting your response",
              },
              {
                id: "MENU_MAIN",
                title: "⬅ Back to menu",
                description: "",
              },
            ],
          },
        ],
      },
    },

  };
}

async function buildPendingTripsReply(
  driverId: string,
): Promise<WhatsAppReplyPayload> {
  const all = await listBookingsRows();
  const pending = all.filter((t) => {
    if (t.status !== "PENDING") return false;
    const rowCandidates = parseCandidateDriverIdsJson(t.candidateDriverIds);
    return rowCandidates.some(
      (c) => c.driverId === driverId && c.status.toLowerCase() === "pending",
    );
  });

  if (!pending.length) {
    return { body: "📋 No pending trips requiring response." };
  }

  const rows = pending.slice(0, 10).map((trip) => ({
    id: `PENDING_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `Accept until: ${formatDeadlineTime(trip.driverResponseDeadline ?? null)}`.slice(
      0,
      72,
    ),
  }));

  return {
    body: "📋 Pending Trips\nSelect a trip to ACCEPT or REJECT",
    interactive: {
      type: "list",
      body: { text: "📋 Pending Trips\nSelect a trip to ACCEPT or REJECT" },
      action: { button: "Pending trips", sections: [{ title: "Pending", rows }] },
    },
  };
}

async function buildTripDetailReply(
  bookingId: string,
): Promise<WhatsAppReplyPayload> {
  const trip = await getBookingByIdService(bookingId);
  if (!trip) {
    return { body: "Trip not found." };
  }

  const { date, time } = formatBookingDateTimeZone(new Date(trip.bookingAt));

  const bodyText = [
    `🛫 *Trip Details*`,
    ``,
    `*Client:* ${trip.clientName} (${trip.clientPhone})`,
    `*Email:* ${trip.clientEmail || "-"}`,
    `*Type:* ${trip.tripType}`,
    `*From → To:* ${trip.from} → ${trip.to}`,
    `*Vehicle:* ${trip.vehicleName ?? "-"} (${trip.vehicleClass ?? "-"})`,
    `*Booking Date:* ${date} ${time}`,
    `*Duration:* ${trip.durationMin} min`,
    `*Status:* ${trip.status}`,
    `*Payment:* ${trip.paymentStatus}`,
    `*Notes:* ${trip.notesForDriver || "-"}`,
  ].join("\n");

  const buttons: { type: "reply"; reply: { id: string; title: string } }[] = [];

  if (trip.status === "assigned") {
    buttons.push({
      type: "reply",
      reply: { id: `START_${trip.id}`, title: "🚀 Start Trip" },
    });
  }

  buttons.push({
    type: "reply",
    reply: { id: "TRIPS", title: "🚗 All Trips" },
  });

  return {
    body: bodyText,
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  };
}

const START_WINDOW_MIN = 30;

function canStartTrip(bookingAt: Date): boolean {
  const diffMin = (new Date(bookingAt).getTime() - Date.now()) / 60_000;
  return diffMin <= START_WINDOW_MIN;
}

async function handleStartTrip(
  message: ProcessableMessage,
  bookingId: string,
): Promise<WhatsAppReplyPayload> {
  const booking = await findBookingById(bookingId);
  if (!booking) {
    return { body: "Trip not found." };
  }

  const driver = await getDriverByPhone(message.from);
  if (!driver) {
    return { body: "Driver not found." };
  }

  if (booking.driverId !== driver.id) {
    return { body: "This trip is not assigned to you." };
  }

  if (booking.status === "IN_PROGRESS") {
    return { body: "Trip already in progress." };
  }

  if (booking.status !== "ASSIGNED") {
    return { body: "This trip cannot be started (current status: " + booking.status.toLowerCase() + ")." };
  }

  if (booking.paymentStatus !== "PAID") {
    return {
      body: "This trip is still unpaid. Start is allowed only after payment confirmation.",
    };
  }

  if (!canStartTrip(booking.bookingAt)) {

    return {
      body: "⏳ Too early to start this trip.\nYou can start it 30 minutes before pickup.",
    };
  }

  await updateBookingService(bookingId, { status: "in_progress" });

  return { body: "🚀 Trip started.\nDrive safely!" };
}

function parseAcceptBookingIdFromListRow(text: string): string | null {
  const id = text.split("_")[1]?.trim();
  return id && id.length > 0 ? id : null;
}

async function buildEarningsReply(driverId: string): Promise<WhatsAppReplyPayload> {
  await syncCompletedTransfersForDriver(driverId);
  const earnings = await getDriverEarningsSummary(driverId);
  const bodyText = [
    "💶 *Earnings*",
    "",
    `Total earned: ${earnings.totalEarned.toFixed(2)} ${earnings.currency}`,
    `Available to withdraw: ${earnings.availableBalance.toFixed(2)} ${earnings.currency}`,
    `Pending trips: ${earnings.pending.toFixed(2)} ${earnings.currency}`,
  ].join("\n");

  return {
    body: bodyText,
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "WITHDRAW", title: "💸 Withdraw" } },
          { type: "reply", reply: { id: "MENU_MAIN", title: "📋 Menu" } },
        ],
      },
    },
  };
}

/** Text on the button that opens the list (≤ 20 characters). */
export async function buildReplyPayload(
  message: ProcessableMessage,
): Promise<WhatsAppReplyPayload> {
  const text = message.text?.trim();
  const lower = text?.toLowerCase();

  if (text?.startsWith("TRIP_")) {
    const bookingId = text.slice("TRIP_".length).trim();
    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }
    return buildTripDetailReply(bookingId);
  }

  /** Must run before `PENDING_*` row handler: nav id is `PENDING_TRIPS` (also starts with PENDING_). */
  if (text === "PENDING_TRIPS") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    return buildPendingTripsReply(driver.id);
  }

  if (text?.startsWith("PENDING_")) {
    const bookingId = text.slice("PENDING_".length).trim();
    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }
    const booking = await findBookingById(bookingId);
    if (!booking) {
      return { body: "Trip not found." };
    }

    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    if (booking.status !== "PENDING") {
      return { body: "This offer is no longer pending." };
    }
    const candidates = parseCandidateDriverIdsJson(booking.candidateDriverIds);
    const mine = candidates.find(
      (c) =>
        c.driverId === driver.id &&
        c.status.toLowerCase() === "pending",
    );
    if (!mine) {
      return { body: "You have no pending offer for this trip." };
    }

    const { date, time } = formatBookingDateTimeZone(new Date(booking.bookingAt));
    const body = [
      `🚗 Trip: ${booking.from} → ${booking.to}`,
      `📅 Time: ${date} ${time}`,
      `⏳ Accept until: ${formatDeadlineTime(booking.driverResponseDeadline ?? null)}`,
    ].join("\n");

    return {
      body,
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: [
            { type: "reply", reply: { id: `ACCEPT_${booking.id}`, title: "✅ ACCEPT" } },
            { type: "reply", reply: { id: `REJECT_${booking.id}`, title: "❌ REJECT" } },
            { type: "reply", reply: { id: "PENDING_TRIPS", title: "📋 Pending Trips" } },
          ],
        },
      },
    };
  }

  if (text?.startsWith("START_")) {
    const bookingId = text.slice("START_".length).trim();
    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }
    return handleStartTrip(message, bookingId);
  }

  if (text?.startsWith("COMPLETE_")) {
    const bookingId = text.slice("COMPLETE_".length).trim();
    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }

    const booking = await findBookingById(bookingId);
    if (!booking) {
      return { body: "Trip not found." };
    }

    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }

    if (booking.driverId !== driver.id) {
      return { body: "This trip is not assigned to you." };
    }

    if (booking.status === "COMPLETED") {
      return { body: "This trip is already completed." };
    }

    if (booking.status !== "IN_PROGRESS") {
      return { body: "Only an in-progress trip can be completed." };
    }

    await updateBookingService(bookingId, { status: "completed" });

    return { body: "✅ Trip completed!\nThank you for a safe ride." };
  }

  if (text?.startsWith("ACCEPT")) {
    const bookingId = parseAcceptBookingIdFromListRow(text);

    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }

    try {
      const booking = await findBookingById(bookingId);
      if (!booking) {
        return { body: "Booking not found." };
      }

      if (!message.from) {
        return { body: "Could not determine sender phone number." };
      }

      const driver = await getDriverByPhone(message.from);
      if (!driver) {
        return { body: "Driver not found." };
      }

      if (
        booking.driverResponseDeadline &&
        new Date(booking.driverResponseDeadline).getTime() <= Date.now()
      ) {
        const candidates = parseCandidateDriverIdsJson(booking.candidateDriverIds);
        const nextCandidates = candidates.map((d) =>
          d.driverId === driver.id ? { ...d, status: "rejected" } : d,
        );
        const allRejected = nextCandidates.every((d) => d.status === "rejected");
        await updateBookingService(bookingId, {
          status: allRejected ? "cancelled" : "pending",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });
        return { body: "Offer expired. Response deadline has passed." };
      }

      if (booking.driverId === driver.id) {
        return { body: "You are already assigned to this booking" };
      }

      const bookingIsFree =
        booking.driverId === null && booking.status === "PENDING";
      if (!bookingIsFree) {
        return { body: "Booking already assigned to another driver" };
      }

      const candidates = parseCandidateDriverIdsJson(
        booking.candidateDriverIds,
      );
      await updateBookingService(bookingId, {
        status: "assigned",
        driverId: driver.id,
        candidateDriverIds: candidates.map((d) =>
          d.driverId !== driver.id
            ? { driverId: d.driverId, status: "rejected" }
            : { driverId: d.driverId, status: "accepted" },
        ),
      });

      void sendBookingAcceptedEmail({
        bookingId: booking.id,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        from: booking.from,
        to: booking.to,
        bookingAt: booking.bookingAt,
        durationMin: booking.durationMin,
      });

      return { body: WHATSAPP_REPLY_MESSAGES.tripAccepted };
    } catch (error) {
      console.error("[WhatsApp] accept trip:", error);
      return { body: "Could not accept trip. Please try again later." };
    }
  }

  if (text?.startsWith("REJECT")) {
    const bookingId = parseAcceptBookingIdFromListRow(text);
    if (!bookingId) {
      return { body: "Trip ID not specified." };
    }

    try {
      const booking = await findBookingById(bookingId);
      if (!booking) {
        return { body: "Booking not found." };
      }

      if (!message.from) {
        return { body: "Could not determine sender phone number." };
      }

      const driver = await getDriverByPhone(message.from);
      if (!driver) {
        return { body: "Driver not found." };
      }

      if (booking.driverId === driver.id) {
        return { body: "You are already assigned to this booking" };
      }

      if (booking.status === "CANCELLED") {
        return { body: "Booking is already cancelled" };
      }

      const bookingIsFree =
        booking.driverId === null && booking.status === "PENDING";
      if (!bookingIsFree) {
        return { body: "Booking already assigned to another driver" };
      }

      const candidates = parseCandidateDriverIdsJson(
        booking.candidateDriverIds,
      );

      const myEntry = candidates.find((d) => d.driverId === driver.id);
      if (!myEntry) {
        return { body: "You are not on the candidate list for this trip." };
      }
      if (myEntry.status !== "pending") {
        return { body: "You already responded to this offer." };
      }

      const nextCandidates = candidates.map((d) =>
        d.driverId === driver.id
          ? { driverId: d.driverId, status: "rejected" }
          : d,
      );

      const allRejected = nextCandidates.every((d) => d.status === "rejected");

      if (allRejected) {
        await updateBookingService(bookingId, {
          status: "cancelled",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });

        void sendBookingAllRejectedEmail({
          bookingId: booking.id,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          from: booking.from,
          to: booking.to,
          bookingAt: booking.bookingAt,
          durationMin: booking.durationMin,
        });
      } else {
        await updateBookingService(bookingId, {
          status: "pending",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });
      }

      return { body: WHATSAPP_REPLY_MESSAGES.tripRejected };
    } catch (error) {
      console.error("[WhatsApp] reject trip:", error);
      return { body: "Could not reject trip. Please try again later." };
    }
  }

  if (text === "CURRENT_TRIP") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }

    const trips = await listBookingsService({ driverId: driver.id });
    const current = trips.find((t) => t.status === "in_progress");

    if (!current) {
      return { body: "📍 No active trip right now." };
    }

    const { date, time } = formatBookingDateTimeZone(new Date(current.bookingAt));

    const bodyText = [
      `📍 *Current Trip*`,
      ``,
      `*Client:* ${current.clientName} (${current.clientPhone})`,
      `*From → To:* ${current.from} → ${current.to}`,
      `*Vehicle:* ${current.vehicleName ?? "-"} (${current.vehicleClass ?? "-"})`,
      `*Booking Date:* ${date} ${time}`,
      `*Duration:* ${current.durationMin} min`,
      `*Payment:* ${current.paymentStatus}`,
      `*Notes:* ${current.notesForDriver || "-"}`,
    ].join("\n");

    return {
      body: bodyText,
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: [
            { type: "reply", reply: { id: `COMPLETE_${current.id}`, title: "✅ Complete Trip" } },
            { type: "reply", reply: { id: "MENU_MAIN", title: "📋 Menu" } },
          ],
        },
      },
    };
  }

  if (text === "EARNING" || lower === "earning" || lower === "earnings") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    return buildEarningsReply(driver.id);
  }

  if (text === "WITHDRAW") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    await syncCompletedTransfersForDriver(driver.id);
    const payout = await requestDriverManualPayout(driver.id);
    if (payout.status === "no_funds") {
      return { body: "No available balance for payout." };
    }
    return {
      body: `✅ Your payout has been sent: ${payout.amount.toFixed(2)} EUR`,
    };
  }

  if (text === "TRIPS") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    return buildTripsListReply(driver.id);
  }

  if (text === "PROFILE") {
    const driver = await getDriverByPhone(message.from);

    if (!driver) {
      return { body: "Driver not found." };
    }

    const profileMessage = `
👤 *Your Profile*

*Name:* ${driver.name}
*Phone:* ${driver.phone}
*Email:* ${driver.email ?? "-"}
*Address:* ${driver.address ?? "-"}
*Status:* ${driver.status ? "🟢 Online" : "🔴 Offline"}

📄 *Documents*
Driver License: ${driver.driverLicenseProvided ? "✅" : "❌"}
VTC Card: ${driver.vtcCardProvided ? "✅" : "❌"}
Passport: ${driver.passportProvided ? "✅" : "❌"}
Medical Certificate: ${driver.medicalCertificateProvided ? "✅" : "❌"}
Insurance Proof: ${driver.insuranceProofProvided ? "✅" : "❌"}

🛣️ *Experience & Options*
Years of Driving: ${driver.drivingExperienceYears}
Base City: ${driver.baseCity ?? "-"}
Working Radius: ${driver.workingRadiusKm} km
Available for Night Trips: ${driver.acceptsNightTrips ? "✅" : "❌"}
Available for VIP Clients: ${driver.acceptsVipClients ? "✅" : "❌"}
Available for Airport Transfers: ${driver.acceptsAirportTransfers ? "✅" : "❌"}
`;

    return { body: profileMessage };
  }
  if (text === "HISTORY") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }

    const completed = await listCompletedBookings(driver.id);

    if (completed.length === 0) {
      return { body: "🔍 No completed trips yet." };
    }

    const lines = completed.map((t, idx) => {
      const { date, time } = formatBookingDateTimeZone(new Date(t.bookingAt));
      return [
        `*${idx + 1}.* ${t.from} → ${t.to}`,
        `   ${date} ${time} • ${t.vehicle?.vehicleName ?? "-"}`,
        `   ${t.clientName} • ${t.durationMin} min`,
      ].join("\n");
    });

    const body = [`🔍 *Trip History* (last ${completed.length})`, ...lines].join("\n\n");

    return { body };
  }
  if (text === "HELP") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }
  if (text === "ONLINE") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    if (driver.status === true) {
      return { body: "🟢 You are already online." };
    }
    await setDriverOnlineStatus(driver.id, true);
    return { body: WHATSAPP_REPLY_MESSAGES.online };
  }
  if (text === "OFFLINE") {
    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "Driver not found." };
    }
    if (driver.status === false) {
      return { body: "🔴 You are already offline." };
    }
    await setDriverOnlineStatus(driver.id, false);
    return { body: WHATSAPP_REPLY_MESSAGES.offline };
  }

  if (text?.startsWith("MENU_MAIN")) {
    return { body: WHATSAPP_REPLY_MESSAGES.menu };
  }

  if (
    lower === "hi" ||
    lower === "hello" ||
    lower?.startsWith("привіт") ||
    lower?.startsWith("privit") ||
    lower === "menu" ||
    lower === "меню"
  ) {
    return {
      body: "Вітаємо! Нижче — меню з опціями (відкрий кнопку «Меню»).",
    };
  }

  // if (lower === "help" || lower === "допомога" || lower === "?") {
  //   return { body: WHATSAPP_REPLY_MESSAGES.help };
  // }

  return {
    body: WHATSAPP_REPLY_MESSAGES.defaultEcho.replace(
      "{{text}}",
      text?.length && text.length > 200
        ? `${text?.slice(0, 200)}…`
        : (text ?? ""),
    ),
  };
}
