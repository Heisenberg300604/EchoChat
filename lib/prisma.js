"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../app/generated/prisma");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new prisma_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
exports.default = prisma;
