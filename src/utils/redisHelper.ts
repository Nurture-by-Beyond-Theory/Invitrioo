import express from "express";
// import nodemailer from "nodemailer";
// import {createClient} from "redis";
import Redis from "ioredis";
const router = express.Router();
// const redis = createClient({
// 	url: "redis://redis:6379",
// });
//  new Redis({
//   host: 'redis', // Service name in docker-compose
//   port: 6379
// }); // Connect to your Redis instance
const redis =  new Redis()

redis.on("connect", () => {
	console.log("Connected to Redis!");
});

redis.on("error", (err) => {
	console.error("Redis connection error:", err);
});

// Helper to store OTP in Redis
const storeOtpInRedis = async (
	email: string,
	otp: string,
	expiry: number
) => {
	const key = `otp:${email}`;
	// await redis.set(key, otp, "EX", expiry); // Set OTP with expiry in seconds
};

// Helper to get OTP from Redis
const getOtpFromRedis = async (email: string) => {
	const key = `otp:${email}`;
	return await redis.get(key); // Retrieve OTP
};

// Helper to delete OTP from Redis
const deleteOtpFromRedis = async (
	email: string
) => {
	const key = `otp:${email}`;
	await redis.del(key);
};


module.exports = {storeOtpInRedis, getOtpFromRedis, deleteOtpFromRedis}