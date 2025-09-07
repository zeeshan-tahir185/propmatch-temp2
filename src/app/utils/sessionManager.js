// Session Management Utility for PropMatch
// Handles user session tracking, search history, and data persistence

import { v4 as uuidv4 } from 'uuid';

class SessionManager {
    constructor() {
        this.SESSION_KEY = 'propmatch-session';
        this.HISTORY_KEY = 'propmatch-search-history';
        this.MAX_HISTORY_ITEMS = 50;
        this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    /**
     * Initialize or get current session
     */
    initializeSession() {
        let session = this.getCurrentSession();
        
        if (!session || this.isSessionExpired(session)) {
            console.log('🔄 Creating new session...');
            session = this.createNewSession();
        } else {
            console.log('✅ Using existing session:', session.sessionId);
            // Update last activity
            session.lastActivity = new Date().toISOString();
            this.saveSession(session);
        }
        
        return session;
    }

    /**
     * Create a new session
     */
    createNewSession() {
        const session = {
            sessionId: uuidv4(),
            userId: this.getUserId(),
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            currentQuery: null,
            searchCount: 0
        };
        
        this.saveSession(session);
        console.log('✅ New session created:', session.sessionId);
        return session;
    }

    /**
     * Get current session from localStorage
     */
    getCurrentSession() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('❌ Error reading session data:', error);
            return null;
        }
    }

    /**
     * Save session to localStorage
     */
    saveSession(session) {
        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        } catch (error) {
            console.error('❌ Error saving session data:', error);
        }
    }

    /**
     * Check if session is expired
     */
    isSessionExpired(session) {
        if (!session || !session.lastActivity) return true;
        
        const lastActivity = new Date(session.lastActivity);
        const now = new Date();
        return (now - lastActivity) > this.SESSION_TIMEOUT;
    }

    /**
     * Get user ID from authentication token or create anonymous ID
     */
    getUserId() {
        // First try to get user_id from JWT token (if user is logged in)
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Decode JWT token to get user_id
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.user_id) {
                    console.log('✅ Using authenticated user ID:', payload.user_id);
                    return payload.user_id;
                }
            }
        } catch (error) {
            console.warn('⚠️ Could not decode JWT token for user_id:', error);
        }
        
        // Fallback to anonymous user ID (persistent across sessions)
        let userId = localStorage.getItem('propmatch-anonymous-user-id');
        if (!userId) {
            userId = 'anon_' + uuidv4();
            localStorage.setItem('propmatch-anonymous-user-id', userId);
            console.log('✅ New anonymous user ID created:', userId);
        }
        return userId;
    }

    /**
     * Start a new property search
     */
    startNewSearch(address) {
        const session = this.getCurrentSession();
        if (!session) {
            console.error('❌ No active session found');
            return null;
        }

        const queryId = uuidv4();
        
        // Update session with current query
        session.currentQuery = {
            queryId: queryId,
            address: address,
            startedAt: new Date().toISOString(),
            status: 'searching',
            steps: {
                addressSearch: false,
                propertyDetails: false,
                scoreAnalysis: false,
                reportGeneration: false,
                aiMessages: false
            }
        };
        session.searchCount += 1;
        session.lastActivity = new Date().toISOString();
        
        this.saveSession(session);
        console.log('🔍 New search started:', { queryId, address });
        
        return queryId;
    }

    /**
     * Update search progress
     */
    updateSearchStep(queryId, step, data = {}) {
        const session = this.getCurrentSession();
        if (!session || !session.currentQuery || session.currentQuery.queryId !== queryId) {
            console.error('❌ Query ID mismatch or no active session');
            return false;
        }

        session.currentQuery.steps[step] = true;
        session.currentQuery.lastUpdated = new Date().toISOString();
        session.lastActivity = new Date().toISOString();
        
        // Store step-specific data
        if (step === 'addressSearch' && data.suggestions) {
            session.currentQuery.suggestions = data.suggestions;
        } else if (step === 'propertyDetails' && data.propertyData) {
            session.currentQuery.propertyData = data.propertyData;
            session.currentQuery.propertyId = data.propertyId;
            session.currentQuery.confirmedAddress = data.confirmedAddress;
        } else if (step === 'scoreAnalysis' && data.scoreData) {
            session.currentQuery.scoreData = data.scoreData;
        }

        this.saveSession(session);
        console.log(`✅ Search step updated: ${step} for queryId: ${queryId}`);
        return true;
    }

    /**
     * Complete current search and add to history
     */
    completeSearch(queryId, finalData = {}) {
        const session = this.getCurrentSession();
        if (!session || !session.currentQuery || session.currentQuery.queryId !== queryId) {
            console.error('❌ Query ID mismatch or no active session');
            return false;
        }

        const completedSearch = {
            ...session.currentQuery,
            ...finalData,
            completedAt: new Date().toISOString(),
            status: 'completed'
        };

        // Add to search history
        this.addToSearchHistory(completedSearch);
        
        // Clear current query
        session.currentQuery = null;
        session.lastActivity = new Date().toISOString();
        
        this.saveSession(session);
        console.log('✅ Search completed and added to history:', queryId);
        return true;
    }

    /**
     * Get current query information
     */
    getCurrentQuery() {
        const session = this.getCurrentSession();
        return session ? session.currentQuery : null;
    }

    /**
     * Add search to history
     */
    addToSearchHistory(searchData) {
        try {
            let history = this.getSearchHistory();
            
            // Remove any existing entry for the same address to avoid duplicates
            history = history.filter(item => 
                item.confirmedAddress !== searchData.confirmedAddress ||
                item.queryId === searchData.queryId
            );
            
            // Add new entry at the beginning
            history.unshift(searchData);
            
            // Limit history size
            if (history.length > this.MAX_HISTORY_ITEMS) {
                history = history.slice(0, this.MAX_HISTORY_ITEMS);
            }
            
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
            console.log('✅ Search added to history:', searchData.confirmedAddress);
        } catch (error) {
            console.error('❌ Error adding to search history:', error);
        }
    }

    /**
     * Get search history
     */
    getSearchHistory() {
        try {
            const historyData = localStorage.getItem(this.HISTORY_KEY);
            return historyData ? JSON.parse(historyData) : [];
        } catch (error) {
            console.error('❌ Error reading search history:', error);
            return [];
        }
    }

    /**
     * Get latest search from history
     */
    getLatestSearch() {
        const history = this.getSearchHistory();
        return history.length > 0 ? history[0] : null;
    }

    /**
     * Find search in history by address
     */
    findSearchByAddress(address) {
        const history = this.getSearchHistory();
        return history.find(item => 
            item.confirmedAddress === address || 
            item.address === address
        );
    }

    /**
     * Clear all session data
     */
    clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        console.log('🗑️ Session cleared');
    }

    /**
     * Clear search history
     */
    clearHistory() {
        localStorage.removeItem(this.HISTORY_KEY);
        console.log('🗑️ Search history cleared');
    }

    /**
     * Get session statistics
     */
    getSessionStats() {
        const session = this.getCurrentSession();
        const history = this.getSearchHistory();
        
        return {
            sessionId: session ? session.sessionId : null,
            userId: this.getUserId(),
            sessionAge: session ? new Date() - new Date(session.createdAt) : 0,
            totalSearches: session ? session.searchCount : 0,
            historyCount: history.length,
            currentQuery: session ? session.currentQuery : null
        };
    }

    /**
     * Debug: Log current state
     */
    debugState() {
        const session = this.getCurrentSession();
        const history = this.getSearchHistory();
        const stats = this.getSessionStats();
        
        console.group('🔍 PropMatch Session Debug');
        console.log('Session:', session);
        console.log('History:', history);
        console.log('Stats:', stats);
        console.groupEnd();
    }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;

// Helper functions for easy access
export const initSession = () => sessionManager.initializeSession();
export const startSearch = (address) => sessionManager.startNewSearch(address);
export const updateStep = (queryId, step, data) => sessionManager.updateSearchStep(queryId, step, data);
export const completeSearch = (queryId, data) => sessionManager.completeSearch(queryId, data);
export const getCurrentQuery = () => sessionManager.getCurrentQuery();
export const getSearchHistory = () => sessionManager.getSearchHistory();
export const getLatestSearch = () => sessionManager.getLatestSearch();
export const findSearchByAddress = (address) => sessionManager.findSearchByAddress(address);
export const getSessionStats = () => sessionManager.getSessionStats();
