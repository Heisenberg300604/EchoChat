import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './lib/prisma';
import { verifyToken } from './lib/auth';

const app = express();
const server = http.createServer(app);