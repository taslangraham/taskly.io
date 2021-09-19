import { app } from "../app";
import { loadBodyParser } from "../middlewares/body-parser";
import { configureCors } from "../middlewares/cors";

// Initialize individual middlewares to be ran by default
loadBodyParser(app); // Loads applications's body parser configurations
configureCors(app); // Loads CORS config

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log("Your app is running on " + port);
});
