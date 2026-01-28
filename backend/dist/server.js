"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const listing_routes_1 = __importDefault(require("./routes/listing.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const broker_routes_1 = __importDefault(require("./routes/broker.routes"));
const favorites_routes_1 = __importDefault(require("./routes/favorites.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const database_1 = require("./middleware/database");
const errorHandler_1 = require("./middleware/errorHandler");
const db_1 = require("./lib/db");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Import global types
require("./types");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use(database_1.databaseMiddleware);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/listings', listing_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/brokers', broker_routes_1.default);
app.use('/api', broker_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/messages', message_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/users/me/favorites', favorites_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
// Cron job to delete expired unverified users every day at midnight
node_cron_1.default.schedule('0 0 * * *', async () => {
    try {
        const expiredUsers = await db_1.db.delete(schema_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.phoneVerified, false), (0, drizzle_orm_1.gt)(schema_1.users.emailVerificationExpires, new Date())));
        console.log(`Deleted expired unverified users`);
    }
    catch (error) {
        console.error('Error deleting expired users:', error);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
