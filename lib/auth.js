"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.requireAuth = requireAuth;
var jsonwebtoken_1 = require("jsonwebtoken");
var server_1 = require("next/server");
// Verify a JWT token and return the payload
function verifyToken(token) {
    try {
        var payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return payload;
    }
    catch (err) {
        return null;
    }
}
// Helper to protect API routes
function requireAuth(authorizationHeader) {
    if (!authorizationHeader) {
        return server_1.NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }
    var token = authorizationHeader.replace('Bearer ', '');
    var user = verifyToken(token);
    if (!user) {
        return server_1.NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return user;
}
