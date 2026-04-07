import {
  findBookingById,
  parseCandidateDriverIdsJson,
} from "../booking/booking.repository.js";
import {
  listBookingsService,
  updateBookingService,
} from "../booking/booking.service.js";
import { getDriverByPhone } from "../driver/driver.service.js";
import type {
  ProcessableMessage,
  WhatsAppReplyPayload,
} from "./whatsapp.types.js";

export const WHATSAPP_REPLY_MESSAGES = {
  welcomeHint: "Напиши «menu» або «привіт» — покажемо меню.",

  currentTrip:
    "📍 Current trip:\nNice → Monaco\nClient: John\nStatus: On the way",
  earning: "Ваш дохід (даммі): 100 €. Деталі — на сайті або у менеджера.",
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

  defaultEcho: 'Ти написав: "{{text}}". Це відповідь за замовчуванням.',
} as const;

function parseAcceptBookingIdFromListRow(text: string): string | null {
  const id = text.split("_")[1]?.trim();
  return id && id.length > 0 ? id : null;
}

/** Text on the button that opens the list (≤ 20 characters). */
export async function buildReplyPayload(
  message: ProcessableMessage,
): Promise<WhatsAppReplyPayload> {
  const text = message.text?.trim();
  const lower = text?.toLowerCase();

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
    return { body: WHATSAPP_REPLY_MESSAGES.currentTrip };
  }

  if (text === "EARNING") {
    return { body: WHATSAPP_REPLY_MESSAGES.earning };
  }

  if (text === "TRIPS") {
    const driver = await getDriverByPhone(message.from);

    if (!driver) {
      return { body: "Driver not found." };
    }

    const trips = await listBookingsService({ driverId: driver.id });

    const tripsMessage = trips
      .map(
        (trip, idx) => `
🛫 *Trip #${idx + 1}*

*Client:* ${trip.clientName} (${trip.clientPhone})
*Email:* ${trip.clientEmail ?? "-"}
*Type:* ${trip.tripType}
*From → To:* ${trip.from} → ${trip.to}
*Vehicle:* ${trip.vehicleName} (${trip.vehicleClass})
*Booking Date:* ${new Date(trip.bookingAt).toLocaleString()}
*Duration:* ${trip.durationMin} min
*Status:* ${trip.status}
*Payment:* ${trip.paymentStatus}
*Notes:* ${trip.notesForDriver ?? "-"}
`,
      )
      .join("\n-----------------\n");

    return { body: tripsMessage };
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
    return { body: WHATSAPP_REPLY_MESSAGES.history };
  }
  if (text === "HELP") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }
  if (text === "ONLINE") {
    return { body: WHATSAPP_REPLY_MESSAGES.online };
  }
  if (text === "OFFLINE") {
    return { body: WHATSAPP_REPLY_MESSAGES.offline };
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

  if (lower === "help" || lower === "допомога" || lower === "?") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }

  return {
    body: WHATSAPP_REPLY_MESSAGES.defaultEcho.replace(
      "{{text}}",
      text?.length && text.length > 200
        ? `${text?.slice(0, 200)}…`
        : (text ?? ""),
    ),
  };
}
