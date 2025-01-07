import express from "express"
import user from "./routes/user.routes";
import event from "./routes/event.routes"
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./passport";
import { errorHandler } from "./errorHandler";
import cors from "cors"

dotenv.config();

const app = express();
const PORT = 3000

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow React-Vite app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add methods as needed
  credentials: true, // Allow cookies or authorization headers
};

// Apply CORS middleware
app.use(cors(corsOptions));
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

app.use("/auth", user)
app.use('/api', event)
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

