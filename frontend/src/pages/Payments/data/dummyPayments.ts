export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded";

export type Payment = {
  id: string;
  bookingId: string;
  clientName: string;
  route: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
  driverName?: string;
  vehicle?: string;
  stripeStatus?: string;
  cardLast4?: string;
  timeline?: { label: string; date: string }[];
};

export const DUMMY_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    bookingId: "BKG-001",
    clientName: "Marcus Vane",
    route: "LHR → Mayfair",
    amount: 285,
    paymentStatus: "paid",
    paymentMethod: "Card",
    date: "2026-03-14",
    driverName: "Marcus",
    vehicle: "BMW 7 Series",
    stripeStatus: "succeeded",
    cardLast4: "4242",
    timeline: [
      { label: "Payment intent created", date: "2026-03-14T09:00:00Z" },
      { label: "Charge succeeded", date: "2026-03-14T09:01:22Z" },
    ],
  },
  {
    id: "pay-2",
    bookingId: "BKG-002",
    clientName: "Alexandre Dubois",
    route: "Hotel → City",
    amount: 320,
    paymentStatus: "authorized",
    paymentMethod: "Card",
    date: "2026-03-14",
    driverName: "Clara",
    vehicle: "Mercedes S-Class",
    stripeStatus: "requires_capture",
    cardLast4: "5556",
    timeline: [
      { label: "Payment authorized", date: "2026-03-14T14:05:00Z" },
    ],
  },
  {
    id: "pay-3",
    bookingId: "BKG-003",
    clientName: "Sarah Chen",
    route: "Heathrow → Knightsbridge",
    amount: 195,
    paymentStatus: "paid",
    paymentMethod: "Card",
    date: "2026-03-13",
    driverName: "Clara",
    vehicle: "Audi A8",
    stripeStatus: "succeeded",
    cardLast4: "4242",
    timeline: [
      { label: "Payment intent created", date: "2026-03-13T08:30:00Z" },
      { label: "Charge succeeded", date: "2026-03-13T08:31:05Z" },
    ],
  },
  {
    id: "pay-4",
    bookingId: "BKG-004",
    clientName: "James Wilson",
    route: "Gatwick → Canary Wharf",
    amount: 410,
    paymentStatus: "failed",
    paymentMethod: "Card",
    date: "2026-03-13",
    stripeStatus: "failed",
    cardLast4: "0002",
    timeline: [
      { label: "Payment intent created", date: "2026-03-13T12:00:00Z" },
      { label: "Charge failed — card declined", date: "2026-03-13T12:00:15Z" },
    ],
  },
  {
    id: "pay-5",
    bookingId: "BKG-005",
    clientName: "Elena Petrova",
    route: "St Pancras → Westminster",
    amount: 150,
    paymentStatus: "pending",
    paymentMethod: "Payment link",
    date: "2026-03-14",
    driverName: "Marcus",
    vehicle: "BMW 7 Series",
    stripeStatus: "requires_payment_method",
    timeline: [{ label: "Payment link sent", date: "2026-03-14T10:00:00Z" }],
  },
  {
    id: "pay-6",
    bookingId: "BKG-006",
    clientName: "Michael Brown",
    route: "LHR → Shoreditch",
    amount: 220,
    paymentStatus: "refunded",
    paymentMethod: "Card",
    date: "2026-03-12",
    driverName: "Clara",
    stripeStatus: "refunded",
    cardLast4: "4242",
    timeline: [
      { label: "Charge succeeded", date: "2026-03-12T11:30:00Z" },
      { label: "Refund processed", date: "2026-03-12T16:45:00Z" },
    ],
  },
  {
    id: "pay-7",
    bookingId: "BKG-007",
    clientName: "Olivia Green",
    route: "Paddington → Chelsea",
    amount: 95,
    paymentStatus: "pending",
    paymentMethod: "Payment link",
    date: "2026-03-15",
    stripeStatus: "requires_payment_method",
    timeline: [{ label: "Payment link sent", date: "2026-03-15T18:30:00Z" }],
  },
  {
    id: "pay-8",
    bookingId: "BKG-008",
    clientName: "David Lee",
    route: "City → Stratford",
    amount: 380,
    paymentStatus: "paid",
    paymentMethod: "Card",
    date: "2026-03-14",
    driverName: "Marcus",
    vehicle: "BMW 7 Series",
    stripeStatus: "succeeded",
    cardLast4: "8888",
    timeline: [
      { label: "Payment intent created", date: "2026-03-14T08:00:00Z" },
      { label: "Charge succeeded", date: "2026-03-14T08:01:40Z" },
    ],
  },
];
