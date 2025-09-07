/**
 * Centralized error handling utilities for PropMatch frontend
 */

/**
 * Handle API errors with graceful fallbacks and upgrade prompts
 * @param {Error} error - The error object from API call
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowDemo - Whether to show demo data on certain errors
 * @param {string} options.feature - Feature name for context
 * @returns {Object} - Error handling result
 */
export const handleApiError = async (error, options = {}) => {
    const { allowDemo = false, feature = 'feature' } = options;
    
    console.error(`❌ ${feature} failed:`, error);
    
    let errorMessage = 'Request failed. ';
    let fallbackToDemo = false;
    let showUpgradePrompt = false;
    let upgradeInfo = null;
    
    if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please try again.';
        fallbackToDemo = allowDemo;
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('CORS')) {
        errorMessage += 'Cannot connect to server. Please check your connection.';
        fallbackToDemo = allowDemo;
    } else if (error.message?.includes('HTTP 429') || (error.response?.status === 429)) {
        // Handle 429 Too Many Requests error
        try {
            let errorData = null;
            if (error.response) {
                errorData = await error.response.json();
            }
            
            const usageInfo = errorData?.detail?.usage_info || {};
            const displayName = usageInfo.display_name || feature;
            const current = usageInfo.current_count || 0;
            const limit = usageInfo.limit || 0;
            
            if (errorData?.detail?.trial_expired) {
                errorMessage = 'Your free trial has expired. Upgrade to a paid plan to continue using PropMatch.';
            } else {
                errorMessage = `You've reached your ${displayName.toLowerCase()} limit (${current}/${limit}). Upgrade your plan to continue using this feature.`;
            }
            
            showUpgradePrompt = true;
            upgradeInfo = {
                usageType: usageInfo.usage_type,
                displayName,
                current,
                limit,
                trialExpired: errorData?.detail?.trial_expired || false
            };
        } catch (parseError) {
            errorMessage = 'You\'ve reached your usage limit. Please upgrade your plan to continue.';
            showUpgradePrompt = true;
        }
    } else if (error.message?.includes('HTTP 5') || error.response?.status >= 500) {
        errorMessage += 'Server error. Please try again later.';
        fallbackToDemo = allowDemo;
    } else {
        errorMessage += error.message || 'An unexpected error occurred.';
        fallbackToDemo = allowDemo;
    }
    
    return {
        errorMessage,
        fallbackToDemo,
        showUpgradePrompt,
        upgradeInfo
    };
};

/**
 * Show error message to user with appropriate actions
 * @param {Object} errorResult - Result from handleApiError
 * @param {Object} options - Display options
 */
export const showErrorToUser = (errorResult, options = {}) => {
    const { errorMessage, showUpgradePrompt, upgradeInfo } = errorResult;
    const { customUpgradeHandler } = options;
    
    if (showUpgradePrompt) {
        const upgradeMessage = `${errorMessage}\n\nWould you like to upgrade your plan now?`;
        const shouldUpgrade = window.confirm(upgradeMessage);
        
        if (shouldUpgrade) {
            if (customUpgradeHandler) {
                customUpgradeHandler(upgradeInfo);
            } else {
                window.open('/pricing', '_blank');
            }
        }
    } else {
        alert(errorMessage);
    }
};

/**
 * Create a usage limit error component (React JSX)
 * @param {Object} upgradeInfo - Information about the usage limit
 * @param {Function} onUpgrade - Callback for upgrade action
 * @returns {JSX.Element}
 */
export const UsageLimitError = ({ upgradeInfo, onUpgrade, onClose }) => {
    const { displayName, current, limit, trialExpired } = upgradeInfo;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {trialExpired ? 'Trial Expired' : 'Usage Limit Reached'}
                    </h3>
                </div>
                
                <div className="mb-4">
                    {trialExpired ? (
                        <p className="text-gray-600">
                            Your free trial has expired. Upgrade to a paid plan to continue using PropMatch features.
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            You've reached your <strong>{displayName.toLowerCase()}</strong> limit ({current}/{limit}).
                            Upgrade your plan to continue using this feature.
                        </p>
                    )}
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onUpgrade}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Upgrade Plan
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
