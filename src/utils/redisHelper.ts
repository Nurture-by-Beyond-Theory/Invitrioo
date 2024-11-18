import express from "express";
// import nodemailer from "nodemailer";
import Redis from "ioredis";

const router = express.Router();
const redis = new Redis(); // Connect to your Redis instance


// Helper to store OTP in Redis
const storeOtpInRedis = async (
	email: string,
	otp: string,
	expiry: number
) => {
	const key = `otp:${email}`;
	await redis.set(key, otp, "EX", expiry); // Set OTP with expiry in seconds
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