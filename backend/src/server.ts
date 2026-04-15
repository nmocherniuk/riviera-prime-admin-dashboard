import "dotenv/config";
import app from "./app.js";
import { startDriverDeadlineFallbackWatcher } from "./modules/booking/booking.deadlineFallback.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startDriverDeadlineFallbackWatcher();
