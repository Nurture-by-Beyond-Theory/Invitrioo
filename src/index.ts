import express from "express"
import routes from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./passport";
import { errorHandler } from "./errorHandler";
dotenv.config();

const app = express();
const PORT = 3000

app.use(express.json())
// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);
// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req,res)=>{
  res.send("Welcome")
})

app.use("/auth", routes)
app.use(errorHandler)
mongoose
	.connect(process.env.MONGO_URI as string)
	.then(() => {
		app.listen(PORT, () =>
			console.log(
				`Server running on port ${PORT}`
			)
		);
	})
	.catch((err) =>
		console.error(
			"MongoDB connection error:",
			err
		)
	);

