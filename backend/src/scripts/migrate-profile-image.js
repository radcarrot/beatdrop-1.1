import { query } from '../config/database.js';

// One-off migration: widen users.profile_image_url to TEXT so it can hold
// base64 data URLs. Previously this ran fire-and-forget on every server cold
// start; it belongs here as an idempotent, explicit migration instead.
const migrate = async () => {
    try {
        console.log('Migrating users.profile_image_url to TEXT...');
        await query('ALTER TABLE users ALTER COLUMN profile_image_url TYPE TEXT');
        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
