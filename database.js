// Database Simulation using LocalStorage
class GalaxEyeDB {
    constructor() {
        this.init();
    }

    init() {
        // Initialize database structure if not exists
        if (!localStorage.getItem('galaxeye_users')) {
            localStorage.setItem('galaxeye_users', JSON.stringify([]));
        }
        if (!localStorage.getItem('galaxeye_aois')) {
            localStorage.setItem('galaxeye_aois', JSON.stringify([]));
        }
        if (!localStorage.getItem('galaxeye_sessions')) {
            localStorage.setItem('galaxeye_sessions', JSON.stringify([]));
        }
        if (!localStorage.getItem('galaxeye_settings')) {
            localStorage.setItem('galaxeye_settings', JSON.stringify({}));
        }
        
        // Create demo user if not exists
        this.createDemoUser();
    }

    createDemoUser() {
        const users = this.getUsers();
        const demoExists = users.find(u => u.email === 'demo@galaxeye.space');
        
        if (!demoExists) {
            const demoUser = {
                id: this.generateId(),
                fullName: 'Demo User',
                email: 'demo@galaxeye.space',
                password: 'demo123', // In production, this would be hashed
                phone: '+919876543210',
                organization: 'GalaxEye Space',
                address: 'Bangalore, India',
                subscriptions: ['sar', 'multispectral'],
                status: 'approved',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginAttempts: 0,
                isLocked: false
            };
            users.push(demoUser);
            localStorage.setItem('galaxeye_users', JSON.stringify(users));
        }
    }

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // User Management
    getUsers() {
        return JSON.parse(localStorage.getItem('galaxeye_users') || '[]');
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: this.generateId(),
            ...userData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginAttempts: 0,
            isLocked: false
        };
        users.push(newUser);
        localStorage.setItem('galaxeye_users', JSON.stringify(users));
        return newUser;
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('galaxeye_users', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    authenticateUser(email, password) {
        const user = this.getUserByEmail(email);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.isLocked) {
            return { success: false, message: 'Account is locked. Please reset your password.' };
        }

        if (user.password !== password) {
            // Increment login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            if (user.loginAttempts >= 4) {
                user.isLocked = true;
                this.updateUser(user.id, user);
                return { success: false, message: 'Account locked due to multiple failed attempts' };
            }
            
            this.updateUser(user.id, user);
            return { 
                success: false, 
                message: 'Invalid password', 
                attempts: user.loginAttempts 
            };
        }

        // Successful login
        user.loginAttempts = 0;
        user.lastLogin = new Date().toISOString();
        this.updateUser(user.id, user);
        
        // Create session
        this.createSession(user.id);
        
        return { success: true, user };
    }

    // Session Management
    createSession(userId) {
        const sessions = JSON.parse(localStorage.getItem('galaxeye_sessions') || '[]');
        const session = {
            id: this.generateId(),
            userId,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours
            isActive: true
        };
        sessions.push(session);
        localStorage.setItem('galaxeye_sessions', JSON.stringify(sessions));
        localStorage.setItem('galaxeye_current_session', JSON.stringify(session));
        return session;
    }

    getCurrentSession() {
        const session = localStorage.getItem('galaxeye_current_session');
        if (!session) return null;
        
        const sessionData = JSON.parse(session);
        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (now > expiresAt) {
            this.endSession();
            return null;
        }
        
        return sessionData;
    }

    endSession() {
        localStorage.removeItem('galaxeye_current_session');
    }

    getCurrentUser() {
        const session = this.getCurrentSession();
        if (!session) return null;
        
        const users = this.getUsers();
        return users.find(u => u.id === session.userId);
    }

    // AOI Management
    getAOIs(userId = null) {
        const aois = JSON.parse(localStorage.getItem('galaxeye_aois') || '[]');
        if (userId) {
            return aois.filter(a => a.userId === userId);
        }
        return aois;
    }

    createAOI(aoiData) {
        const session = this.getCurrentSession();
        if (!session) return null;
        
        const aois = this.getAOIs();
        const newAOI = {
            id: this.generateId(),
            userId: session.userId,
            ...aoiData,
            createdAt: new Date().toISOString()
        };
        aois.push(newAOI);
        localStorage.setItem('galaxeye_aois', JSON.stringify(aois));
        return newAOI;
    }

    updateAOI(aoiId, updates) {
        const aois = this.getAOIs();
        const index = aois.findIndex(a => a.id === aoiId);
        if (index !== -1) {
            aois[index] = { ...aois[index], ...updates };
            localStorage.setItem('galaxeye_aois', JSON.stringify(aois));
            return aois[index];
        }
        return null;
    }

    deleteAOI(aoiId) {
        const aois = this.getAOIs();
        const filtered = aois.filter(a => a.id !== aoiId);
        localStorage.setItem('galaxeye_aois', JSON.stringify(filtered));
        return true;
    }

    // Settings Management
    getSettings() {
        return JSON.parse(localStorage.getItem('galaxeye_settings') || '{}');
    }

    updateSettings(settings) {
        const current = this.getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem('galaxeye_settings', JSON.stringify(updated));
        return updated;
    }

    // Statistics
    getStatistics(userId) {
        const aois = this.getAOIs(userId);
        const totalArea = aois.reduce((sum, aoi) => sum + (aoi.area || 0), 0);
        
        return {
            totalAOIs: aois.length,
            totalArea: totalArea,
            lastCreated: aois.length > 0 ? aois[aois.length - 1].createdAt : null
        };
    }

    // Export/Import
    exportData() {
        return {
            users: this.getUsers(),
            aois: this.getAOIs(),
            settings: this.getSettings(),
            exportedAt: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.users) localStorage.setItem('galaxeye_users', JSON.stringify(data.users));
        if (data.aois) localStorage.setItem('galaxeye_aois', JSON.stringify(data.aois));
        if (data.settings) localStorage.setItem('galaxeye_settings', JSON.stringify(data.settings));
    }

    clearAllData() {
        localStorage.removeItem('galaxeye_users');
        localStorage.removeItem('galaxeye_aois');
        localStorage.removeItem('galaxeye_sessions');
        localStorage.removeItem('galaxeye_settings');
        localStorage.removeItem('galaxeye_current_session');
        this.init();
    }
}

// Initialize database
const db = new GalaxEyeDB();

// Export for use in other scripts
window.GalaxEyeDB = db;