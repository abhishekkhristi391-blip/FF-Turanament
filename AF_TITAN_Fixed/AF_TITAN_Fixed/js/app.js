import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, set, update, push, query, orderByChild, equalTo, onValue, runTransaction, off, limitToLast, serverTimestamp, limitToFirst, onChildAdded } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCJZ6PFiIFY8iUzEKx-cSQBVRUs8TQn8ho",
    authDomain: "af-titan-esports-adda-82bd6.firebaseapp.com",
    databaseURL: "https://af-titan-esports-adda-82bd6-default-rtdb.firebaseio.com",
    projectId: "af-titan-esports-adda-82bd6",
    storageBucket: "af-titan-esports-adda-82bd6.firebasestorage.app",
    messagingSenderId: "1053626721749",
    appId: "1:1053626721749:web:a00e73b4abaec9815e895c"
};

const IMGBB_API_KEY = "7dc05d802b832f7591427a5937bd818c";

let app, db, auth;
try {
    if (!window.myFbApp) { window.myFbApp = initializeApp(firebaseConfig); }
    app = window.myFbApp;
    db = getDatabase(app);
    auth = getAuth(app);
    console.log("Firebase Initialized");
} catch (error) {
    console.error("Firebase initialization failed:", error);
    document.body.innerHTML = `<div class="alert alert-danger m-5 position-fixed top-0 start-0 end-0" style="z-index: 10000;">Critical Error: Could not connect. Check Firebase config & console. Error: ${error.message}</div>`;
}

// ==========================================
// 2. DOM ELEMENTS & GLOBALS
// ==========================================
const getElement = (id) => document.getElementById(id);
const querySel = (selector) => document.querySelector(selector);
const querySelAll = (selector) => document.querySelectorAll(selector);

const elements = {
    sections: querySelAll('.section'), bottomNavItems: querySelAll('.bottom-nav .nav-item'), globalLoader: getElement('globalLoaderEl'),
    headerBackBtn: getElement('headerBackBtnEl'), headerTitleContainer: getElement('headerTitleContainerEl'), headerGameTitle: getElement('headerGameTitleEl'), headerWalletChip: getElement('headerWalletChipEl'), headerChipBalance: getElement('headerChipBalanceEl'), headerUserGreeting: getElement('headerUserGreetingEl'), appLogo: getElement('appLogoEl'), notificationBtn: getElement('notificationBtnEl'), notificationBadge: querySel('.notification-badge'),
    loginSection: getElement('login-section'),
    emailLoginForm: getElement('emailLoginForm'), loginEmailInput: getElement('loginEmailInputEl'), loginPasswordInput: getElement('loginPasswordInputEl'), loginEmailBtn: getElement('loginEmailBtnEl'), showSignupToggleBtn: getElement('showSignupToggleBtnEl'), loginStatusMessage: getElement('loginStatusMessageEl'), forgotPasswordLink: getElement('forgotPasswordLinkEl'),
    emailSignupForm: getElement('emailSignupForm'), signupNameInput: getElement('signupNameInputEl'), signupEmailInput: getElement('signupEmailInputEl'), signupPasswordInput: getElement('signupPasswordInputEl'), signupReferralCodeInput: getElement('signupReferralCodeInputEl'), signupEmailBtn: getElement('signupEmailBtnEl'), showLoginToggleBtn: getElement('showLoginToggleBtnEl'), signupStatusMessage: getElement('signupStatusMessageEl'),
    homeSection: getElement('home-section'), promotionSlider: getElement('promotionSliderEl'), gamesList: getElement('gamesListEl'), myContestsList: getElement('myContestsListEl'), noContestsMessage: getElement('noContestsMessageEl'),
    tournamentsSection: getElement('tournaments-section'), tournamentsListContainer: getElement('tournamentsListContainerEl'), noTournamentsMessage: getElement('noTournamentsMessageEl'), tournamentTabs: querySelAll('.tournament-tabs .tab-item'),
    walletSection: getElement('wallet-section'), walletTotalBalance: getElement('walletTotalBalanceEl'), walletWinningCash: getElement('walletWinningCashEl'), walletBonusCash: getElement('walletBonusCashEl'), allTransactionsBtn: getElement('allTransactionsBtnEl'), withdrawBtn: getElement('withdrawBtnEl'), addAmountWalletBtn: getElement('addAmountWalletBtnEl'), recentTransactionsList: getElement('recentTransactionsListEl'), noTransactionsMessage: getElement('noTransactionsMessageEl'),
    earningsSection: getElement('earnings-section'), earningsTotal: getElement('earningsTotalEl'), earningsReferral: getElement('earningsReferralEl'), viewEarningsHistoryBtn: getElement('viewEarningsHistoryBtn'),
    profileSection: getElement('profile-section'), profileAvatar: getElement('profileAvatarEl'), profileName: getElement('profileNameEl'), profileEmail: getElement('profileEmailEl'), profileTotalMatches: getElement('profileTotalMatchesEl'), profileWonMatches: getElement('profileWonMatchesEl'), profileTotalEarnings: getElement('profileTotalEarningsEl'), logoutProfileBtn: getElement('logoutProfileBtnEl'), policyLinks: querySelAll('.profile-links a[data-policy], .profile-links button[data-policy]'), notificationSwitch: getElement('notificationSwitchEl'),
    leaderboardSection: getElement('leaderboard-section'), leaderboardListEl: getElement('leaderboardListEl'), noLeaderboardMessageEl: getElement('noLeaderboardMessageEl'),
    contactUsBtn: getElement('contactUsBtnEl'),
    rechargeSection: getElement('recharge-section'), rechargeStep1: getElement('recharge-step-1-amount'), rechargeStep2: getElement('recharge-step-2-method'), rechargeStep3: getElement('recharge-step-3-payment'), rechargeBalanceDisplay: getElement('rechargeBalanceDisplay'), rechargeAmountInput: getElement('rechargeAmountInput'), rechargePresetBtns: querySelAll('.amount-preset-btn'), rechargeStep1Status: getElement('rechargeStep1Status'), goToStep2Btn: getElement('goToStep2Btn'), rechargeAmountConfirm: getElement('rechargeAmountConfirm'), paymentOptionCards: querySelAll('.payment-option-card'), rechargeStep2Status: getElement('rechargeStep2Status'), goToStep3Btn: getElement('goToStep3Btn'), rechargeFinalAmount: getElement('rechargeFinalAmount'), rechargePaymentMode: getElement('rechargePaymentMode'), rechargeUpiId: getElement('rechargeUpiId'), rechargeQrCodeImg: getElement('rechargeQrCodeImg'), rechargeCopyAmtBtn: getElement('rechargeCopyAmtBtn'), rechargeCopyUpiBtn: getElement('rechargeCopyUpiBtn'), rechargeUtrInput: getElement('rechargeUtrInput'), rechargeStep3Status: getElement('rechargeStep3Status'), rechargeCancelBtn: getElement('rechargeCancelBtn'), rechargeSubmitBtn: getElement('rechargeSubmitBtn'),
    policyModalInstance: getElement('policyModalEl') ? new bootstrap.Modal(getElement('policyModalEl')) : null, policyModalTitle: getElement('policyModalTitleEl'), policyModalBody: getElement('policyModalBodyEl'),
    addAmountModalInstance: getElement('addAmountModalEl') ? new bootstrap.Modal(getElement('addAmountModalEl')) : null, modalUserEmail: getElement('modalUserEmailEl'),
    withdrawModalInstance: getElement('withdrawModalEl') ? new bootstrap.Modal(getElement('withdrawModalEl')) : null, withdrawModalBalance: getElement('withdrawModalBalanceEl'), withdrawAmountInput: getElement('withdrawAmountInputEl'), withdrawMethodInput: getElement('withdrawMethodInputEl'), minWithdrawAmount: getElement('minWithdrawAmountEl'), withdrawStatusMessage: getElement('withdrawStatusMessageEl'), submitWithdrawRequestBtn: getElement('submitWithdrawRequestBtnEl'),
    matchDetailsModalInstance: getElement('matchDetailsModalEl') ? new bootstrap.Modal(getElement('matchDetailsModalEl')) : null, matchDetailsModalTitle: getElement('matchDetailsModalTitleEl'), matchDetailsModalBody: getElement('matchDetailsModalBodyEl'),
    idPasswordModalInstance: getElement('idPasswordModalEl') ? new bootstrap.Modal(getElement('idPasswordModalEl')) : null, roomIdDisplay: getElement('roomIdDisplayEl'), roomPasswordDisplay: getElement('roomPasswordDisplayEl'),
    joinTournamentDetailsModalInstance: getElement('joinTournamentDetailsModal') ? new bootstrap.Modal(getElement('joinTournamentDetailsModal')) : null,
    joinFeeDisplayEl: getElement('joinFeeDisplayEl'),
    joinTournamentIdInput: getElement('joinTournamentIdInput'),
    joinTournamentFeeInput: getElement('joinTournamentFeeInput'),
    joinTournamentModeInput: getElement('joinTournamentModeInput'),
    joinUsernameInput: getElement('joinUsernameInput'),
    joinGameUidInput: getElement('joinGameUidInput'),
    joinGameLevelInput: getElement('joinGameLevelInput'),
    joinDuoFieldsContainer: getElement('joinDuoFieldsContainer'),
    joinTeammateUsernameInput: getElement('joinTeammateUsernameInput'),
    joinTeammateGameUidInput: getElement('joinTeammateGameUidInput'),
    joinTeammateLevelInput: getElement('joinTeammateLevelInput'),
    joinTournamentStatusMessage: getElement('joinTournamentStatusMessageEl'),
    confirmJoinBtn: getElement('confirmJoinBtn'),
    securityWarning: getElement('securityWarning'),
    notificationsModalInstance: getElement('notificationsModalEl') ? new bootstrap.Modal(getElement('notificationsModalEl')) : null,
    notificationsListEl: getElement('notificationsListEl'),
    notificationsEmptyMsgEl: getElement('notificationsEmptyMsgEl'),
    editNameBtnEl: getElement('editNameBtnEl'),
    editNameModalInstance: getElement('editNameModal') ? new bootstrap.Modal(getElement('editNameModal')) : null,
    editNameInput: getElement('editNameInput'),
    editNameStatusMessage: getElement('editNameStatusMessage'),
    saveNameChangeBtn: getElement('saveNameChangeBtn'),
    matchHistoryBtn: getElement('matchHistoryBtn'),
    matchHistoryModalInstance: getElement('matchHistoryModal') ? new bootstrap.Modal(getElement('matchHistoryModal')) : null,
    matchHistoryBodyEl: getElement('matchHistoryBodyEl'),
    tournamentChatModalInstance: getElement('tournamentChatModal') ? new bootstrap.Modal(getElement('tournamentChatModal')) : null,
    tournamentChatModalTitle: getElement('tournamentChatModalTitle'),
    chatMessagesEl: getElement('chatMessagesEl'),
    chatForm: getElement('chatForm'),
    chatMessageInput: getElement('chatMessageInput'),
    chatReplyContextEl: getElement('chatReplyContextEl'),
    replyToNameEl: getElement('replyToNameEl'),
    replyToMessageEl: getElement('replyToMessageEl'),
    cancelReplyBtn: getElement('cancelReplyBtn'),
    
    // NEW ELEMENTS
    uploadResultModalInstance: getElement('uploadResultModal') ? new bootstrap.Modal(getElement('uploadResultModal')) : null,
    rechargeScreenshotInput: getElement('rechargeScreenshotInput'),
    rechargeScreenshotStatus: getElement('rechargeScreenshotStatus'),
    joinTournamentMinLevelInput: getElement('joinTournamentMinLevelInput'),
    joinSlotNumberInput: getElement('joinSlotNumberInput'),
    joinSelectedSlotDisplayEl: getElement('joinSelectedSlotDisplayEl'),
    
    slotGridContainer: getElement('slotGridContainer'),
    roomDetailsInModal: getElement('roomDetailsInModal'),
    slotRoomId: getElement('slotRoomId'),
    slotRoomPass: getElement('slotRoomPass'),
    proceedToDetailsBtn: getElement('proceedToDetailsBtn'),

    // NEW MAINTENANCE ELEMENTS
    appBlockOverlay: getElement('appBlockOverlay'),
    blockIcon: getElement('blockIcon'),
    blockTitle: getElement('blockTitle'),
    blockMessage: getElement('blockMessage'),
    forceUpdateBtn: getElement('forceUpdateBtn'),
    
    // NEW SPIN ELEMENTS
    spinActionBtn: getElement('spinActionBtn'),
    spinStatusMsg: getElement('spinStatusMsg'),
    spinWheelEl: getElement('spinWheelEl'),
    spinBannerBtn: getElement('spinBannerBtn') 
};

let currentUser = null; let userProfile = {}; let currentSectionId = 'login-section'; let dbListeners = {};
let swiperInstance; let currentTournamentGameId = null; let appSettings = {};
let tempReferralCode = null;
let currentRechargeData = { amount: 0, paymentMethod: null, upiId: null };
let currentChatListener = null; 
let currentReply = null; 
let currentJoinBtnElement = null; 

// ==========================================
// 3. CORE FUNCTIONS & UTILS
// ==========================================

function getModal(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    return bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
}

function setupLiveStreamListener() {
    const liveBanner = document.getElementById('liveStreamBanner');
    if (liveBanner) {
        onValue(ref(db, 'settings/liveStream'), (snap) => {
            const data = snap.val();
            if (data && data.isLive && data.url) {
                liveBanner.style.display = 'flex';
                liveBanner.onclick = () => window.open(data.url, '_blank');
            } else {
                liveBanner.style.display = 'none';
            }
        });
    }
}

const showLoader = (show) => { if (elements.globalLoader) elements.globalLoader.style.display = show ? 'flex' : 'none'; };
function showStatusMessage(element, message, type = 'danger', autohide = true) { if (!element) return; element.innerHTML = message; element.className = `alert alert-${type} mt-3`; element.style.display = 'block'; element.setAttribute('role', 'alert'); if (autohide) { setTimeout(() => { if (element.innerHTML === message) element.style.display = 'none'; }, 5000); } }
function clearStatusMessage(element) { if (!element) return; element.style.display = 'none'; element.innerHTML = ''; element.removeAttribute('role'); }
function copyToClipboard(targetSelectorOrText, isText = false) { let textToCopy; if (isText) { textToCopy = targetSelectorOrText; } else { if (!targetSelectorOrText) { alert('Copy target not defined.'); return; } const targetElement = querySel(targetSelectorOrText); if (!targetElement) { alert('Element to copy from not found.'); return; } textToCopy = targetElement.textContent; } if (!textToCopy || textToCopy === 'N/A' || textToCopy.includes('placeholder')) { alert('Nothing to copy.'); return; } navigator.clipboard.writeText(textToCopy).then(() => alert('Copied!')).catch(err => { console.error('Failed to copy:', err); alert('Failed to copy.'); }); }

function shareReferral(code) {
    if (!code || code === 'N/A') return;
    const appName = appSettings.appName || "AF TITAN";
    const signupBonus = appSettings.signupBonus || 10;
    
    // Per Refer Bonus ₹1000 set kar diya hai!
    const referralBonus = 1000; 

    const shareText = `🚨 AF TITAN ESPORTS ADDA – PLAY & EARN 🚨\n\n` +
                      `Join India's Most Trusted Gaming Platform! 🎮\n\n` +
                      `✅ Free Joining Matches Everyday\n` +
                      `💰 Instant Sign Up Bonus: ₹${signupBonus}\n` +
                      `🌟 Per Refer Bonus: ₹${referralBonus} (Mega Chain Reward)\n\n` +
                      `👉 Use My Secret Invite Code: ${code}\n\n` +
                      `Download App Now From Our Official Website 👇\n` +
                      `https://afasjadop.github.io/AF-TITAN-ESPORTS-ADDA/?refer=${code}`;
    
    if (navigator.share) { 
        navigator.share({ title: `Join ${appName}!`, text: shareText })
            .catch((error) => console.log('Error sharing', error)); 
    } 
    else { 
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`; 
        window.open(whatsappUrl, '_blank'); 
    }
}

function sanitizeHTML(str) { if (str == null) return ''; str = String(str); const temp = document.createElement('div'); temp.textContent = str; return temp.innerHTML; }

function generateReferralCode(length = 8) { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let result = ''; for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length)); return result; }
const formatDate = (timestamp) => { if (!timestamp) return ''; const date = new Date(timestamp); const now = new Date(); const diffSeconds = Math.floor((now - date) / 1000); if (diffSeconds < 60) return 'Just now'; const diffMinutes = Math.floor(diffSeconds / 60); if (diffMinutes < 60) return `${diffMinutes}m ago`; const diffHours = Math.floor(diffMinutes / 60); if (diffHours < 24) return `${diffHours}h ago`; const diffDays = Math.floor(diffHours / 24); if (diffDays < 7) return `${diffDays}d ago`; return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };
const formatFullDateTime = (timestamp) => { if (!timestamp) return 'N/A'; const date = new Date(timestamp); return date.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); };
function getTimeRemaining(startTime) { if (!startTime) return 'TBA'; const now = Date.now(); const diff = startTime - now; if (diff <= 0) return 'Starting Soon'; const days = Math.floor(diff / 86400000); const hours = Math.floor((diff % 86400000) / 3600000); const minutes = Math.floor((diff % 3600000) / 60000); let o = ''; if (days > 0) o += `${days}d `; if (hours > 0 || days > 0) o += `${hours}h `; o += `${minutes}m`; return o.trim() || 'Now'; }
const removePlaceholders = (parentElement) => { if (!parentElement) return; parentElement.classList.remove('placeholder-glow'); parentElement.querySelectorAll('.placeholder').forEach(el => el.remove()); };

// GLOBAL EXPORT OF SHOWSECTION (For Smart Back Button and HTML onlicks)
window.showSection = function(sectionId, backSection = null) { 
    if (!auth || !sectionId || !elements.sections) return; 
    const targetSection = getElement(sectionId); 
    if (!targetSection) { 
        window.showSection(currentUser ? 'home-section' : 'login-section'); 
        return; 
    } 
    const protectedSections = ['home-section', 'wallet-section', 'earnings-section', 'profile-section', 'tournaments-section', 'recharge-section', 'leaderboard-section', 'spin-section', 'task-earn-section']; 
    const isLoggedIn = !!currentUser;
    if (protectedSections.includes(sectionId) && !isLoggedIn) { 
        window.showSection('login-section'); return; 
    } 
    if (sectionId === 'login-section' && isLoggedIn) { 
        window.showSection('home-section'); return; 
    } 
    elements.sections.forEach(sec => sec.classList.remove('active')); 
    targetSection.classList.add('active'); 
    currentSectionId = sectionId; 
    updateHeaderForSection(sectionId, backSection); 
    elements.bottomNavItems.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId)); 
    switch (sectionId) { 
        case 'home-section': loadHomePageData(); break; 
        case 'wallet-section': loadWalletData(); break; 
        case 'profile-section': loadProfileData(); break; 
        case 'earnings-section': loadEarningsData(); break; 
        case 'leaderboard-section': loadLeaderboardData(); break; 
        case 'tournaments-section': 
            if(currentTournamentGameId) { 
                const activeTab = querySel('.tournament-tabs .tab-item.active')?.dataset.status || 'upcoming'; 
                filterTournaments(currentTournamentGameId, activeTab); 
            } else { 
                elements.tournamentsListContainer.innerHTML = '<p class="text-secondary text-center mt-4">Select a game from Home page first.</p>'; 
            } 
            break; 
    } 
    if (sectionId === 'login-section') { toggleLoginForm(true); } 
    window.scrollTo(0, 0); 
}

function updateHeaderForSection(sectionId, backSection = null) { 
    const showBackButton = (sectionId === 'tournaments-section' || sectionId === 'recharge-section' || sectionId === 'spin-section' || sectionId === 'task-earn-section'); 
    const defaultTitleVisible = !showBackButton; 
    let gameTitleVisible = (sectionId === 'tournaments-section'); 
    let rechargeTitleVisible = (sectionId === 'recharge-section'); 
    let spinTitleVisible = (sectionId === 'spin-section' || sectionId === 'task-earn-section');
    
    if (elements.headerBackBtn) { 
        elements.headerBackBtn.style.display = showBackButton ? 'inline-block' : 'none'; 
        if(showBackButton) { 
            let targetBackSection = backSection; 
            if (!targetBackSection) { 
                targetBackSection = (sectionId === 'tournaments-section') ? 'home-section' : 'wallet-section'; 
            } 
            elements.headerBackBtn.onclick = () => window.showSection(targetBackSection); 
        } 
    } 
    if (elements.headerTitleContainer) elements.headerTitleContainer.style.display = defaultTitleVisible ? 'flex' : 'none'; 
    if (elements.headerGameTitle) elements.headerGameTitle.style.display = gameTitleVisible || rechargeTitleVisible || spinTitleVisible ? 'block' : 'none'; 
    if (gameTitleVisible && currentTournamentGameId && elements.headerGameTitle) { 
        const gameName = appSettings?.games?.[currentTournamentGameId]?.name || `Game`; 
        elements.headerGameTitle.textContent = gameName; 
    } else if (rechargeTitleVisible && elements.headerGameTitle) { 
        elements.headerGameTitle.textContent = 'Recharge'; 
    } else if (spinTitleVisible && elements.headerGameTitle) { 
        elements.headerGameTitle.textContent = 'Spin & Win'; 
    } else if (defaultTitleVisible && elements.headerUserGreeting) { 
        const nameToShow = userProfile?.displayName?.split(' ')[0] || (currentUser ? currentUser.email?.split('@')[0] : 'Guest') || 'Guest'; 
        elements.headerUserGreeting.textContent = nameToShow; 
    } 
}

function updateGlobalUI(isLoggedIn) { 
    if (elements.headerWalletChip) { 
        elements.headerWalletChip.style.display = isLoggedIn ? 'flex' : 'none'; 
        if (isLoggedIn) elements.headerWalletChip.onclick = () => window.showSection('wallet-section'); 
        else elements.headerWalletChip.onclick = null; 
    } 
    const coinChip = document.getElementById('headerCoinChipEl'); 
    if(coinChip) { 
        coinChip.style.display = isLoggedIn ? 'flex' : 'none'; 
        if(isLoggedIn) coinChip.onclick = () => window.showSection('task-earn-section'); 
        else coinChip.onclick = null; 
    }
    if (!isLoggedIn && elements.headerUserGreeting) elements.headerUserGreeting.textContent = 'Guest'; 
    if (!isLoggedIn && elements.headerChipBalance) elements.headerChipBalance.textContent = '0'; 
    elements.bottomNavItems.forEach(item => { 
        const section = item.dataset.section; 
        item.style.display = (section === 'home-section' || isLoggedIn) ? 'flex' : 'none'; 
    }); 
}
         
function populateUserInfo(user, profile) {
    if (!user || !profile) return;
    const displayName = profile.displayName || user.email?.split('@')[0] || 'User';
    const photoURL = profile.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0F172A&color=E2E8F0&bold=true&size=70`;
    const depositBalance = (profile.depositBalance || 0);
    const winningCash = (profile.winningCash || 0);
    const bonusCash = (profile.bonusCash || 0);
    const coinsBalance = (profile.coinsBalance || 0);
    const totalBalance = depositBalance + winningCash + bonusCash;
    const totalEarnings = (profile.totalEarnings || 0);
    const referralEarnings = (profile.referralEarnings || 0);
    const totalMatches = profile.totalMatches || 0;
    const wonMatches = profile.wonMatches || 0;
    const formatCurrency = (amount) => `${amount.toFixed(2)}`;

    if (elements.headerUserGreeting) elements.headerUserGreeting.textContent = displayName.split(' ')[0];
    if (elements.headerChipBalance) elements.headerChipBalance.textContent = Math.floor(totalBalance);
    
    // Coin Balance Update Logic
    const headerCoinEl = document.getElementById('headerCoinBalanceEl');
    if(headerCoinEl) headerCoinEl.textContent = coinsBalance;
    const taskCoinEl = document.getElementById('userCoinsDisplay');
    if(taskCoinEl) taskCoinEl.textContent = coinsBalance;

    if (elements.walletTotalBalance) { elements.walletTotalBalance.textContent = `₹${formatCurrency(depositBalance)}`; removePlaceholders(elements.walletTotalBalance.closest('.placeholder-glow')); }
    if (elements.walletWinningCash) { elements.walletWinningCash.textContent = `₹${formatCurrency(winningCash)}`; removePlaceholders(elements.walletWinningCash.closest('.placeholder-glow')); }
    if (elements.walletBonusCash) { elements.walletBonusCash.textContent = `₹${formatCurrency(bonusCash)}`; removePlaceholders(elements.walletBonusCash.closest('.placeholder-glow')); }
    if (elements.withdrawModalBalance) elements.withdrawModalBalance.textContent = `₹${formatCurrency(winningCash)}`;
    if (elements.rechargeBalanceDisplay) elements.rechargeBalanceDisplay.textContent = formatCurrency(depositBalance);
    if (elements.profileAvatar) elements.profileAvatar.src = photoURL;
    if (elements.profileName) { elements.profileName.textContent = displayName; removePlaceholders(elements.profileName.closest('.placeholder-glow')); }
    if (elements.profileEmail) { elements.profileEmail.textContent = user.email || 'N/A'; removePlaceholders(elements.profileEmail.closest('.placeholder-glow')); }
    if (elements.profileTotalMatches) { elements.profileTotalMatches.textContent = totalMatches; removePlaceholders(elements.profileTotalMatches.closest('.placeholder-glow')); }
    if (elements.profileWonMatches) { elements.profileWonMatches.textContent = wonMatches; removePlaceholders(elements.profileWonMatches.closest('.placeholder-glow')); }
    if (elements.profileTotalEarnings) { elements.profileTotalEarnings.textContent = `₹${formatCurrency(profile.totalEarnings || 0)}`; removePlaceholders(elements.profileTotalEarnings.closest('.placeholder-glow')); }
    if (elements.earningsTotal) { elements.earningsTotal.textContent = `₹${formatCurrency(totalEarnings)}`; removePlaceholders(elements.earningsTotal.closest('.placeholder-glow')); }
    if (elements.earningsReferral) { elements.earningsReferral.textContent = `₹${formatCurrency(referralEarnings)}`; removePlaceholders(elements.earningsReferral.closest('.placeholder-glow')); }
    if (elements.modalUserEmail) elements.modalUserEmail.textContent = user.email || 'N/A';
    
    // 🔥 YAHAN PE SPIN BUTTON RESET KA BUG FIX HAI 🔥
    const today = new Date().toLocaleDateString('en-IN');
    if (elements.spinActionBtn) {
        if(profile.lastSpinDate === today) {
            elements.spinActionBtn.disabled = true;
            elements.spinActionBtn.textContent = "SPUN";
            if(elements.spinStatusMsg) elements.spinStatusMsg.textContent = "You've spun today. Come back tomorrow!";
        } else {
            elements.spinActionBtn.disabled = false;
            elements.spinActionBtn.textContent = "SPIN";
            if(elements.spinStatusMsg) elements.spinStatusMsg.textContent = "Spin to Win!";
        }
    }
}

function toggleLoginForm(showLogin) { if (!elements.emailLoginForm || !elements.emailSignupForm) return; clearStatusMessage(elements.loginStatusMessage); clearStatusMessage(elements.signupStatusMessage); elements.emailLoginForm.style.display = showLogin ? 'block' : 'none'; elements.emailSignupForm.style.display = showLogin ? 'none' : 'block'; elements.emailLoginForm.reset(); elements.emailSignupForm.reset(); }

async function loginWithEmail() { if (!auth) return; const em = elements.loginEmailInput.value.trim(); const pw = elements.loginPasswordInput.value; if (!em || !pw) { showStatusMessage(elements.loginStatusMessage, 'Enter email & password.', 'warning'); return; } showLoader(true); clearStatusMessage(elements.loginStatusMessage); try { await signInWithEmailAndPassword(auth, em, pw); } catch (e) { showStatusMessage(elements.loginStatusMessage, `Error: ${e.message}`, 'danger'); } finally { showLoader(false); } }
async function resetPassword() { if (!auth) return; const em = elements.loginEmailInput.value.trim(); if (!em) { showStatusMessage(elements.loginStatusMessage, 'Enter email for password reset.', 'warning'); return; } showLoader(true); clearStatusMessage(elements.loginStatusMessage); try { await sendPasswordResetEmail(auth, em); showStatusMessage(elements.loginStatusMessage, 'Password reset email sent! Check inbox/spam.', 'success', false); } catch (e) { showStatusMessage(elements.loginStatusMessage, `Error: ${e.message}`, 'danger'); } finally { showLoader(false); } }
async function logoutUser() { if (!auth) return; try { showLoader(true); await signOut(auth); } catch (e) { alert(`Logout failed: ${e.message}`); showLoader(false); } }

async function handleAuthStateChange(user) {
    if (!auth || !db) { showLoader(false); return; }
    showLoader(true);
    detachAllDbListeners(); currentUser = user;
    const referralCodeFromSignup = tempReferralCode; tempReferralCode = null;
    
    if (user) {
        const userRef = ref(db, 'users/' + user.uid);
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                userProfile = snapshot.val();
                await update(userRef, { lastLogin: serverTimestamp() });
            } else {
                const signupBonus = appSettings.signupBonus ?? 10;
                const displayName = user.displayName || elements.signupNameInput.value.trim() || user.email?.split('@')[0] || 'User';

                const newUserProfile = {
                    uid: user.uid, displayName: displayName, email: user.email || null, photoURL: user.photoURL || null,
                    depositBalance: 0, winningCash: 0, bonusCash: signupBonus, totalMatches: 0, wonMatches: 0, totalEarnings: 0, referralEarnings: 0, createdAt: serverTimestamp(),
                    referralCode: generateReferralCode(), joinedTournaments: {}, isAdmin: false, lastCheckedNotifications: Date.now(), lastLogin: serverTimestamp()
                };

                if (referralCodeFromSignup) {
                    const q = query(ref(db, 'users'), orderByChild('referralCode'), equalTo(referralCodeFromSignup));
                    const referrerSnapshot = await get(q);
                    if (referrerSnapshot.exists()) {
                        const referrerData = referrerSnapshot.val();
                        const referrerId = Object.keys(referrerData)[0];
                        const pendingReferralRef = push(ref(db, 'pendingReferrals'));
                        await set(pendingReferralRef, {
                            referrerUid: referrerId,
                            referrerEmail: referrerData[referrerId].email || 'N/A',
                            referredUid: user.uid,
                            referredEmail: user.email,
                            status: 'pending',
                            timestamp: serverTimestamp()
                        });
                        newUserProfile.referredBy = referrerId;
                    }
                }
                
                await set(userRef, newUserProfile);
                userProfile = newUserProfile;
                if (signupBonus > 0) await recordTransaction(user.uid, 'signup_bonus', signupBonus, `Welcome Bonus`);
            }
            populateUserInfo(user, userProfile); setupRealtimeListeners(user.uid); updateGlobalUI(true);
            
            setupLiveStreamListener();
            
            loadAndDisplayNotifications();
            const targetSection = (currentSectionId === 'login-section' || !getElement(currentSectionId)) ? 'home-section' : currentSectionId;
            window.showSection(targetSection);
        } catch (error) { alert("Error loading profile. Logging out. " + error.message); try { await logoutUser(); } catch (logoutErr) {} }
    } else { currentUser = null; userProfile = {}; updateGlobalUI(false); window.showSection('login-section'); }
    showLoader(false);
}

function applyTheme(theme) { if (!theme) return; const root = document.documentElement; for (const [key, value] of Object.entries(theme)) { if (value) root.style.setProperty(`--${key}`, value); } }

// 🔥 USER APP MAGIC SCRIPT V2 START 🔥
setTimeout(() => {
    // 1. Pichle script ki wajah se jo design kharab hua tha, usko wapas pehle jaisa normal karna
    const oldContainer = document.getElementById('esportGamesContainer');
    if(oldContainer) {
        const wrapper = oldContainer.querySelector('.esport-content-wrapper');
        if(wrapper) {
            while(wrapper.firstChild) {
                oldContainer.parentNode.insertBefore(wrapper.firstChild, oldContainer);
            }
        }
        const oldParticles = document.getElementById('games-particles-js');
        if(oldParticles) oldParticles.remove();
        oldContainer.remove();
    }

    // 2. Poore App ko transparent karna taaki piche ka naya background dikhe
    document.body.style.backgroundColor = 'transparent';
    
    // 3. Sabse piche (Background Image) ka naya layer banana
    if (!document.getElementById('app-bg-layer')) {
        const bgLayer = document.createElement('div');
        bgLayer.id = 'app-bg-layer';
        bgLayer.style.position = 'fixed';
        bgLayer.style.top = '0'; 
        bgLayer.style.left = '0';
        bgLayer.style.width = '100vw'; 
        bgLayer.style.height = '100vh';
        bgLayer.style.zIndex = '-2';
        bgLayer.style.backgroundSize = 'cover';
        bgLayer.style.backgroundPosition = 'center';
        bgLayer.style.backgroundColor = 'var(--primary-bg)';
        document.body.appendChild(bgLayer);
    }

    // 4. Background ke theek aage (Particles) ka layer banana
    if (!document.getElementById('app-particles-layer')) {
        const particleLayer = document.createElement('div');
        particleLayer.id = 'app-particles-layer';
        particleLayer.style.position = 'fixed';
        particleLayer.style.top = '0'; 
        particleLayer.style.left = '0';
        particleLayer.style.width = '100vw'; 
        particleLayer.style.height = '100vh';
        particleLayer.style.zIndex = '-1';
        particleLayer.style.pointerEvents = 'none'; // Click block na kare
        document.body.appendChild(particleLayer);
    }

    // 5. Admin Panel se Color/Photo Catch karna aur screen par lagana
    onValue(ref(db, 'settings/esportGamesDesign'), (snap) => {
        const bgLayer = document.getElementById('app-bg-layer');
        const particleLayer = document.getElementById('app-particles-layer');
        if(!bgLayer || !particleLayer) return;

        let bgUrl = '';
        let colors = ["#00e5ff", "#3b82f6"];

        if(snap.exists()) {
            const data = snap.val();
            if(data.bgUrl) bgUrl = data.bgUrl;
            if(data.particleColors) colors = data.particleColors;
        }

        // Image lagana (Halka dark filter jisse aage ka text clearly padhne mein aaye)
        if(bgUrl) {
            bgLayer.style.backgroundImage = `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('${bgUrl}')`;
        } else {
            bgLayer.style.backgroundImage = 'none';
        }

        // Particles lagana
        particleLayer.innerHTML = '';
        if(typeof particlesJS === 'function') {
            particlesJS("app-particles-layer", {
                "particles": {
                    "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": colors },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": true },
                    "size": { "value": 4, "random": true },
                    "line_linked": { "enable": true, "distance": 130, "color": colors[0], "opacity": 0.25, "width": 1.5 },
                    "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
                },
                "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } },
                "retina_detect": true
            });
        }
    });
}, 1500);

// 👇 MEGA CHAIN LOGIC & TRACKING SCRIPT START 👇
setTimeout(() => {
    // 1. OPEN REFERRAL SECTION & LOAD DATA
    const openRefBtn = document.getElementById('openMegaChainBtn');
    if (openRefBtn) {
        openRefBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!currentUser) return;
            
            window.showSection('referral-section', 'profile-section');
            document.getElementById('mainReferralCodeDisplay').textContent = userProfile.referralCode || 'N/A';
            document.getElementById('totalReferralEarnedDisplay').textContent = '₹' + (userProfile.referralEarnings || 0).toFixed(2);
            
            // Admin ke set kiye hue amounts fetch karke instructions mein dikhana
            try {
                const chainSettingsSnap = await get(ref(db, 'settings/chainReferral'));
                if (chainSettingsSnap.exists()) {
                    const cs = chainSettingsSnap.val();
                    document.getElementById('uiMinDepAmt').textContent = '₹' + (cs.minDeposit || 50);
                    document.getElementById('uiLvl1Amt').textContent = '₹' + (cs.level1 || 10);
                    document.getElementById('uiLvl2Amt').textContent = '₹' + (cs.level2 || 3);
                    document.getElementById('uiLvl3Amt').textContent = '₹' + (cs.level3 || 2);
                }
            } catch (e) { console.log("Chain settings fetch error"); }

            // Fetch Network Counts
            try {
                const usersSnap = await get(ref(db, 'users'));
                let l1 = 0, l2 = 0, l3 = 0;
                if (usersSnap.exists()) {
                    usersSnap.forEach(child => {
                        const u = child.val();
                        if (u.level1Parent === currentUser.uid) l1++;
                        if (u.level2Parent === currentUser.uid) l2++;
                        if (u.level3Parent === currentUser.uid) l3++;
                    });
                }
                document.getElementById('refLvl1Count').textContent = l1;
                document.getElementById('refLvl2Count').textContent = l2;
                document.getElementById('refLvl3Count').textContent = l3;
                document.getElementById('totalNetworkCount').textContent = l1 + l2 + l3;
            } catch (error) {
                console.error("Error fetching network size", error);
            }
        });
    }

    // 2. SHARE BUTTON LOGIC
    const shareBtn = document.getElementById('mainShareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const code = document.getElementById('mainReferralCodeDisplay').textContent;
            if(typeof shareReferral === 'function') shareReferral(code);
        });
    }

    // 3. OVERRIDE SIGNUP TO SAVE 3 LEVELS
    if (typeof auth !== 'undefined' && document.getElementById('signupEmailBtnEl')) {
        const oldSignupBtn = document.getElementById('signupEmailBtnEl');
        // Remove old listeners by cloning
        const newSignupBtn = oldSignupBtn.cloneNode(true);
        oldSignupBtn.parentNode.replaceChild(newSignupBtn, oldSignupBtn);
        
        newSignupBtn.addEventListener('click', async () => {
            const name = document.getElementById('signupNameInputEl').value.trim(); 
            const em = document.getElementById('signupEmailInputEl').value.trim(); 
            const pw = document.getElementById('signupPasswordInputEl').value; 
            const statusMsg = document.getElementById('signupStatusMessageEl');
            
            if (!name || !em || !pw) { showStatusMessage(statusMsg, 'Name, Email and Password are required.', 'warning'); return; } 
            if (pw.length < 6) { showStatusMessage(statusMsg, 'Password must be at least 6 characters.', 'warning'); return; } 
            
            showLoader(true); clearStatusMessage(statusMsg); 
            const referralCodeEntered = document.getElementById('signupReferralCodeInputEl').value.trim();
            
            try { 
                const cred = await createUserWithEmailAndPassword(auth, em, pw); 
                const uid = cred.user.uid;
                const signupBonus = appSettings.signupBonus ?? 10;
                
                let l1Parent = null, l2Parent = null, l3Parent = null;

                // Mega Chain Search Logic (100% FIXED)
                if (referralCodeEntered) {
                    const q = query(ref(db, 'users'), orderByChild('referralCode'), equalTo(referralCodeEntered));
                    const refSnap = await get(q);
                    
                    if (refSnap.exists()) {
                        const refData = refSnap.val();
                        l1Parent = Object.keys(refData)[0]; // Sidha Referral
                        const l1User = refData[l1Parent];

                        if (l1User) {
                            if (l1User.level1Parent) { l2Parent = l1User.level1Parent; }
                            else if (l1User.referredBy) { l2Parent = l1User.referredBy; }
                            
                            if (l2Parent) {
                                const l2Snap = await get(ref(db, `users/${l2Parent}`));
                                if (l2Snap.exists()) {
                                    const l2User = l2Snap.val();
                                    if (l2User.level1Parent) { l3Parent = l2User.level1Parent; }
                                    else if (l2User.referredBy) { l3Parent = l2User.referredBy; }
                                }
                            }
                        }

                        // Purane system ko zinda rakhna taaki passbook na phate
                        await set(push(ref(db, 'pendingReferrals')), {
                                referrerUid: l1Parent,
                                referrerEmail: l1User.email || 'N/A',
                                referredUid: uid,
                                referredEmail: em,
                                status: 'pending',
                                timestamp: serverTimestamp()
                        });
                    } else {
                        console.log("Invalid Referral Code entered.");
                    }
                }

                // Save User Data (With Safe Fields)
                const newUserProfile = {
                        uid: uid, displayName: name, email: em,
                        depositBalance: 0, winningCash: 0, bonusCash: signupBonus, 
                        totalMatches: 0, wonMatches: 0, totalEarnings: 0, referralEarnings: 0, 
                        createdAt: serverTimestamp(), referralCode: generateReferralCode(), 
                        isAdmin: false, lastCheckedNotifications: Date.now(), lastLogin: serverTimestamp(),
                        referredBy: l1Parent || null, 
                        level1Parent: l1Parent || null, 
                        level2Parent: l2Parent || null, 
                        level3Parent: l3Parent || null
                };
                
                await set(ref(db, `users/${uid}`), newUserProfile);
                if (signupBonus > 0) await recordTransaction(uid, 'signup_bonus', signupBonus, `Welcome Bonus`);
                
                showLoader(false);
            } catch (e) { 
                showStatusMessage(statusMsg, `Error: ${e.message}`, 'danger'); 
                showLoader(false);
            }
        });
    }
}, 1500);

// 🔥 FINAL GLOBAL BACKGROUND PARTICLES (NO DESIGN CHANGE) START 🔥
setTimeout(() => {
    // 1. Purane kisi bhi particle div ko clean karna (Taki double na ho)
    ['global-app-particles', 'particle-canvas-fix'].forEach(id => {
        const el = document.getElementById(id); if(el) el.remove();
    });

    // 2. App ka Background Dark Blue karna aur Content ko aage lana
    document.body.style.backgroundColor = '#0F172A'; // Dark Blue Base
    const mainApp = document.getElementById('mainApp');
    if(mainApp) {
        mainApp.style.backgroundColor = 'transparent'; // Taki piche ke particles dikhein
        mainApp.style.position = 'relative';
        mainApp.style.zIndex = '1'; // Content aage rahega
    }

    // 3. Sabse peeche Particles ka Layer Banana (Sirf empty space ke liye)
    const pLayer = document.createElement('div');
    pLayer.id = 'global-app-particles';
    pLayer.style.position = 'fixed';
    pLayer.style.top = '0';
    pLayer.style.left = '0';
    pLayer.style.width = '100vw';
    pLayer.style.height = '100vh';
    pLayer.style.zIndex = '0'; // Sabse peeche!
    pLayer.style.pointerEvents = 'none'; // Click block na ho
    document.body.insertBefore(pLayer, document.body.firstChild);

    // Canvas size fix (Taki particles gayab na ho)
    const style = document.createElement('style');
    style.id = 'particle-canvas-fix';
    style.innerHTML = '#global-app-particles canvas { display: block; width: 100vw !important; height: 100vh !important; }';
    document.head.appendChild(style);

    // 4. Admin Panel se Color Catch Karna
    onValue(ref(db, 'settings/esportGamesDesign'), (snap) => {
        let colors = ["#00e5ff", "#3b82f6"]; // Default Blue Glow
        if(snap.exists() && snap.val().particleColors) {
            colors = snap.val().particleColors;
        }

        const particleDiv = document.getElementById('global-app-particles');
        if(!particleDiv) return;
        
        particleDiv.innerHTML = ''; 
        
        setTimeout(() => {
            if(typeof particlesJS === 'function') {
                particlesJS("global-app-particles", {
                    "particles": {
                        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                        "color": { "value": colors },
                        "shape": { "type": "circle" },
                        "opacity": { "value": 1, "random": false }, // Ekdum Solid Glow
                        "size": { "value": 4.5, "random": true },
                        "line_linked": { "enable": true, "distance": 130, "color": colors[0], "opacity": 1, "width": 2 }, 
                        "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
                    },
                    "interactivity": { "events": { "onhover": { "enable": false }, "onclick": { "enable": false } } },
                    "retina_detect": true
                });
                // Window resize hack
                window.dispatchEvent(new Event('resize'));
            }
        }, 300);
    });
}, 1000);

// 🚀 ULTRA-SAFE GAME-Z MAGIC SLIDER START 🚀
setTimeout(() => {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    // 1. Safe CSS inject karna (Deposit aur Withdraw dono ke liye)
    if (!document.getElementById('safe-magic-css')) {
        const style = document.createElement('style');
        style.id = 'safe-magic-css';
        style.innerHTML = `
            /* 👉 FIX 1: Deposit Section (Solid Background) 👈 */
            #rechargeSection, #paymentDetailsSection {
                background-color: #0F172A !important; 
                min-height: 100vh; z-index: 20 !important; position: relative;
            }
            .payment-method-details, .card, .qr-container, .deposit-container {
                background-color: #1E293B !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                z-index: 21 !important; position: relative;
            }

            /* 👉 FIX 2: WITHDRAW POPUP GLOW FIX (Touch pehle hi theek hai) 👈 */
            #withdrawFundsModal, .modal { 
                z-index: 999999 !important; 
                pointer-events: auto !important; 
            }
            
            /* Peeche ka parda thoda light dark kiya taaki glow saaf dikhe */
            .modal-backdrop, .modal-backdrop.show { 
                z-index: 999998 !important; 
                background-color: rgba(0, 0, 0, 0.7) !important; 
                opacity: 1 !important;
                pointer-events: none !important;
            }

            /* YAHAN SE AAYEGA MAST NEELA GLOW */
            #withdrawFundsModal .modal-content {
                background-color: #1E293B !important; /* Dabba ab dark nahi lagega */
                border: 1px solid #00e5ff !important; /* Neela border */
                box-shadow: 0px 0px 30px 5px rgba(0, 229, 255, 0.5) !important; /* Yeh raha Glow Effect! */
                border-radius: 16px !important;
                pointer-events: auto !important;
            }
            
            /* Header aur Body ko transparent kiya taaki dabba chamke */
            #withdrawFundsModal .modal-header,
            #withdrawFundsModal .modal-body {
                background-color: transparent !important;
                border: none !important;
            }

            /* 👉 FIX 3: Magic Ball Navigation (Aapka original slider) 👈 */
            #gamez-safe-ball {
                position: absolute; width: 44px; height: 44px;
                background: radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(0,229,255,0) 70%);
                border-radius: 50%; top: 8px; left: 0; z-index: 0;
                pointer-events: none; transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            #gamez-safe-ball::after {
                content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
                width: 15px; height: 3px; background: #00e5ff; border-radius: 10px; box-shadow: 0 0 8px #00e5ff;
            }
            .bottom-nav .nav-item { position: relative; z-index: 2 !important; background: transparent !important; }
            .bottom-nav .nav-item i { transition: transform 0.3s; }
            .bottom-nav .nav-item.active i { transform: translateY(-5px) scale(1.15); filter: drop-shadow(0 0 8px #00e5ff); color: #00e5ff !important; }
        `;
        document.head.appendChild(style);
    }

    // 2. Ball element logic
    let magicBall = document.getElementById('gamez-safe-ball');
    if (!magicBall) {
        magicBall = document.createElement('div');
        magicBall.id = 'gamez-safe-ball';
        nav.appendChild(magicBall);
    }

    const moveBall = () => {
        const activeItem = nav.querySelector('.nav-item.active');
        if (activeItem) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const offset = (itemRect.left - navRect.left) + (itemRect.width / 2) - 22;
            magicBall.style.transform = `translateX(${offset}px)`;
        }
    };

    setTimeout(moveBall, 300);
    const navItems = nav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => { setTimeout(moveBall, 50); });
    });
    window.addEventListener('resize', moveBall);

}, 2000); 

async function loadAppSettings() {
    try {
        const controlSnap = await get(ref(db, 'settings/appControl'));
        if (controlSnap.exists()) {
            const controlData = controlSnap.val();
            const overlay = elements.appBlockOverlay;
            const icon = elements.blockIcon;
            const title = elements.blockTitle;
            const msg = elements.blockMessage;
            const forceBtn = elements.forceUpdateBtn;

            // 👇 PERMANENT VERSION CONTROL SYSTEM 👇
            const MY_APP_VERSION = 4; // Is Naye App ka version 4 set kiya hai
            const serverVersion = controlData.latestVersion || 1; 

            // Agar database mein version humare app se bada hai, toh update screen dikhao
            if (serverVersion > MY_APP_VERSION) {
                overlay.style.display = 'flex';
                icon.className = "bi bi-cloud-download text-info";
                title.textContent = "Update Available";
                msg.textContent = "A new version of the app is available. Please update to continue playing.";
                forceBtn.style.display = 'inline-block';
                appSettings.updateUrl = controlData.updateUrl || '#';
                return; 
            } 
            // Agar version theek hai, par Admin ne Maintenance ON kiya hai
            else if (controlData.maintenanceMode) {
                overlay.style.display = 'flex';
                icon.className = "bi bi-tools text-warning";
                title.textContent = "Under Maintenance";
                msg.textContent = "We are currently upgrading our servers. Please check back after some time.";
                forceBtn.style.display = 'none';
                return; 
            } else {
                // Sab theek hai, app chalne do
                overlay.style.display = 'none';
            }
            // 👆 VERSION CONTROL END 👆
        }

        const settingsRef = ref(db, 'settings');
        const snapshot = await get(settingsRef);
        if (snapshot.exists()) {
            appSettings = snapshot.val() || {};
            if (appSettings.logoUrl && elements.appLogo) elements.appLogo.src = appSettings.logoUrl;
            if (appSettings.minWithdraw && elements.minWithdrawAmount) elements.minWithdrawAmount.textContent = appSettings.minWithdraw;
            if (appSettings.theme) applyTheme(appSettings.theme);
        } else {
            appSettings = { minWithdraw: 50, signupBonus: 10, referralBonus: 5, supportContact: '9389660753', upiDetails: 'aashif4412@ibl', qrCodeUrl: 'https://iili.io/FsMJsRV.md.png' };
        }
    } catch (e) { appSettings = { minWithdraw: 50, signupBonus: 10, referralBonus: 5, supportContact: '9389660753', upiDetails: 'aashif4412@ibl', qrCodeUrl: 'https://iili.io/FsMJsRV.md.png' }; }
}

async function uploadImageToImgBBUser(file, statusElement) {
    if (!file) throw new Error("File not selected.");
    if (statusElement) { statusElement.textContent = 'Uploading image...'; statusElement.style.display = 'block'; statusElement.style.color = 'var(--warning-color)'; }
    const formData = new FormData(); formData.append("image", file);
    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
        const data = await response.json();
        if (data.success) {
            if (statusElement) { statusElement.textContent = 'Upload complete!'; statusElement.style.color = 'var(--success-color)'; }
            return data.data.url;
        } else { throw new Error(data.error.message); }
    } catch (error) {
        if (statusElement) { statusElement.textContent = `Upload failed: ${error.message}`; statusElement.style.color = 'var(--danger-color)'; }
        throw error;
    }
}

function loadHomePageData() { 
    if (!currentUser) { 
        if(elements.promotionSlider?.querySelector('.swiper-wrapper')) elements.promotionSlider.querySelector('.swiper-wrapper').innerHTML = ''; 
        if(elements.gamesList) elements.gamesList.innerHTML = ''; 
        if(elements.myContestsList) elements.myContestsList.innerHTML = '<p class="text-secondary text-center">Login to view contests.</p>'; 
        return; 
    } 
    loadPromotions(); loadGames(); loadMyContests(); 
}

async function loadPromotions() { 
    if (!elements.promotionSlider) return; 
    const sliderWrapper = elements.promotionSlider.querySelector('.swiper-wrapper'); 
    if (!sliderWrapper) return; 
    sliderWrapper.classList.add('placeholder-glow'); 
    sliderWrapper.innerHTML = `<div class="swiper-slide"><span class="placeholder" style="height: 100%; border-radius: 10px; display: block; width: 100%;"></span></div>`; 
    const promoRef = ref(db, 'promotions'); 
    try { 
        const snapshot = await get(promoRef); 
        const promotions = snapshot.val() || {}; 
        const activePromotions = Object.values(promotions).filter(p => p.imageUrl); 
        removePlaceholders(elements.promotionSlider); 
        sliderWrapper.innerHTML = ''; 
        if (activePromotions.length > 0) { 
            elements.promotionSlider.style.display = 'block'; 
            activePromotions.forEach(promo => { 
                const slide = document.createElement('div'); 
                slide.className = 'swiper-slide'; 
                slide.innerHTML = promo.link ? `<a href="${promo.link}" target="_blank"><img src="${promo.imageUrl}" alt="Promo"></a>` : `<img src="${promo.imageUrl}" alt="Promo">`; 
                sliderWrapper.appendChild(slide); 
            }); 
            if (swiperInstance) swiperInstance.destroy(true, true); 
            swiperInstance = new Swiper(elements.promotionSlider, { loop: activePromotions.length > 1, autoplay: { delay: 3500, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, slidesPerView: 1 }); 
        } else { 
            elements.promotionSlider.style.display = 'none'; 
        } 
    } catch (e) { 
        removePlaceholders(elements.promotionSlider); 
        sliderWrapper.innerHTML = '<p class="text-danger text-center small p-3">Could not load promotions.</p>'; 
        elements.promotionSlider.style.display = 'block'; 
    } 
}

async function loadGames() { 
    if (!elements.gamesList) return; 
    elements.gamesList.classList.add('placeholder-glow'); 
    elements.gamesList.innerHTML = `<div class="col-6"><div class="game-card custom-card"><span class="placeholder d-block" style="height: 130px;"></span><span class="placeholder d-block mt-2 col-8 mx-auto" style="height: 20px;"></span></div></div> <div class="col-6"><div class="game-card custom-card"><span class="placeholder d-block" style="height: 130px;"></span><span class="placeholder d-block mt-2 col-8 mx-auto" style="height: 20px;"></span></div></div>`; 
    const gamesRef = ref(db, 'games'); 
    try { 
        const snapshot = await get(gamesRef); 
        const games = snapshot.val() || {}; 
        const activeGames = Object.entries(games).filter(([, game]) => game.imageUrl && game.name).sort(([, gameA], [, gameB]) => (gameA.order || 0) - (gameB.order || 0)); 
        removePlaceholders(elements.gamesList); 
        elements.gamesList.innerHTML = ''; 
        if (activeGames.length > 0) { 
            if (!appSettings.games) appSettings.games = {}; 
            activeGames.forEach(([gameId, game]) => { 
                appSettings.games[gameId] = { name: game.name }; 
                const col = document.createElement('div'); 
                col.className = 'col-6'; 
                col.innerHTML = `<div class="game-card custom-card" data-game-id="${gameId}" data-game-name="${game.name}"><img src="${game.imageUrl}" alt="${game.name}"><span>${game.name}</span></div>`; 
                col.querySelector('.game-card').addEventListener('click', () => { 
                    currentTournamentGameId = gameId; 
                    loadTournamentsForGame(gameId, game.name); 
                }); 
                elements.gamesList.appendChild(col); 
            }); 
        } else { 
            elements.gamesList.innerHTML = '<p class="text-secondary text-center col-12">No games available.</p>'; 
        } 
    } catch (e) { 
        removePlaceholders(elements.gamesList); 
        elements.gamesList.innerHTML = '<p class="text-danger text-center col-12">Could not load games.</p>'; 
    } 
}

function loadTournamentsForGame(gameId, gameName) { 
    if (!elements.tournamentsSection) return; 
    currentTournamentGameId = gameId; 
    elements.tournamentTabs.forEach(t => t.classList.remove('active')); 
    querySel('.tournament-tabs .tab-item[data-status="upcoming"]')?.classList.add('active'); 
    window.showSection('tournaments-section'); 
    filterTournaments(gameId, 'upcoming'); 
}

async function filterTournaments(gameId, status) { 
    if (!elements.tournamentsListContainer) return; 
    elements.tournamentsListContainer.innerHTML = ''; 
    elements.tournamentsListContainer.classList.add('placeholder-glow'); 
    elements.tournamentsListContainer.innerHTML = `<div class="tournament-card placeholder-glow mb-3"><div class="tournament-card-content"><span class="placeholder col-6"></span><span class="placeholder col-12 mt-2"></span><span class="placeholder col-10 mt-2"></span><div class="d-flex justify-content-between mt-3"><span class="placeholder col-4 h-30"></span><span class="placeholder col-4 h-30"></span></div></div></div>`; 
    elements.noTournamentsMessage.style.display = 'none'; 
    try { 
        const tQuery = query(ref(db, 'tournaments'), orderByChild('gameId'), equalTo(gameId)); 
        const s = await get(tQuery); 
        const allT = s.val() || {}; 
        const fT = Object.entries(allT).filter(([, t]) => t.status === status).sort(([, tA], [, tB]) => (tA.startTime || 0) - (tB.startTime || 0)); 
        removePlaceholders(elements.tournamentsListContainer); 
        elements.tournamentsListContainer.innerHTML = ''; 
        if (fT.length > 0) { 
            fT.forEach(([tId, t]) => { 
                const card = createTournamentCardElement(tId, t); 
                elements.tournamentsListContainer.appendChild(card); 
            }); 
        } else { 
            elements.noTournamentsMessage.style.display = 'block'; 
            elements.noTournamentsMessage.textContent = `No ${status} tournaments found.`; 
        } 
    } catch (e) { 
        removePlaceholders(elements.tournamentsListContainer); 
        elements.tournamentsListContainer.innerHTML = '<p class="text-danger tc mt-4">Could not load tournaments.</p>'; 
        elements.noTournamentsMessage.style.display = 'none'; 
    } 
}

async function handleOpenSlotModal(event) {
    if (!currentUser) { alert("Login to join."); window.showSection('login-section'); return; }
    currentJoinBtnElement = event.currentTarget; 
    const btn = currentJoinBtnElement;
    const tId = btn.dataset.tournamentId;

    const container = elements.slotGridContainer;
    container.innerHTML = `<div class="text-center w-100 p-4"><div class="spinner-border text-warning"></div></div>`;
    
    let slotModalInst = getModal('slotModal');
    slotModalInst.show();

    const roomBox = elements.roomDetailsInModal;
    const proceedBtn = elements.proceedToDetailsBtn;
    roomBox.style.display = 'none';
    proceedBtn.disabled = true;
    proceedBtn.textContent = 'Pick a slot to join';

    try {
        const tRef = ref(db, `tournaments/${tId}`);
        const tSnap = await get(tRef);
        if (!tSnap.exists()) { container.innerHTML = `<div class="text-danger tc">Tournament details not found.</div>`; return; }
        const tData = tSnap.val();
        
        let maxP = parseInt(tData.maxPlayers); 
        if(!maxP || maxP <= 0) maxP = 48; 

        const snapshot = await get(ref(db, `tournaments/${tId}/slots`));
        const bookedSlots = snapshot.val() || {};
        container.innerHTML = "";
        let userAlreadyJoinedSlot = null;

        for (let i = 1; i <= maxP; i++) {
            const data = bookedSlots[i];
            const box = document.createElement('div');
            box.className = `slot-box ${data ? 'booked' : ''}`;
            box.innerHTML = `<span class="slot-number">${i}</span><span class="slot-user">${data ? sanitizeHTML(data.name) : 'Empty'}</span>`;

            if (!data) {
                box.onclick = () => {
                    container.querySelectorAll('.slot-box').forEach(b => b.classList.remove('selected'));
                    box.classList.add('selected');
                    if(elements.joinSlotNumberInput) elements.joinSlotNumberInput.value = i;
                    if(elements.joinSelectedSlotDisplayEl) elements.joinSelectedSlotDisplayEl.textContent = i;
                    proceedBtn.disabled = false;
                    proceedBtn.textContent = `Proceed with Slot #${i}`;
                };
            } else if (data.uid === currentUser.uid) {
                userAlreadyJoinedSlot = i;
                box.style.border = "2px solid var(--accent-color)";
            }
            container.appendChild(box);
        }

        if (userAlreadyJoinedSlot) {
            proceedBtn.style.display = 'none';
            if (tData.showIdPass) {
                roomBox.style.display = 'block';
                elements.slotRoomId.textContent = tData.roomId || 'TBA';
                elements.slotRoomPass.textContent = tData.roomPassword || 'TBA';
            } else {
                roomBox.style.display = 'block';
                elements.slotRoomId.textContent = 'Hidden by Admin';
                elements.slotRoomPass.textContent = 'Hidden by Admin';
            }
        } else {
            proceedBtn.style.display = 'block';
        }
    } catch(e) {
        container.innerHTML = `<div class="text-danger tc w-100">Error loading slots: ${e.message}</div>`;
    }
}

function createTournamentCardElement(tId, t) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    card.dataset.tournamentId = tId;

    const bannerUrl = t.bannerUrl || 'https://via.placeholder.com/400x225/1E293B/94A3B8?text=16:9+Banner';
    const eFee = t.entryFee || 0; const pkPrize = t.perKillPrize || 0; const pPool = t.prizePool || 0; const sTime = t.startTime ? new Date(t.startTime) : null; const sTimeLoc = sTime ? sTime.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBA'; const regP = t.registeredPlayers || {}; const regC = Object.keys(regP).length; const maxP = t.maxPlayers || 0; const spotsL = maxP > 0 ? Math.max(0, maxP - regC) : Infinity; const isF = maxP > 0 && spotsL <= 0; const isJ = currentUser && userProfile?.joinedTournaments?.[tId]; const canJ = !isJ && !isF && t.status === 'upcoming';
    let timerTxt = t.status?.toUpperCase() || 'N/A';
    if (t.status === 'upcoming' && sTime) timerTxt = getTimeRemaining(t.startTime);
    else if (t.status === 'ongoing') timerTxt = 'LIVE';
    else if (t.status === 'completed' || t.status === 'result') timerTxt = 'ENDED';
    
    let spotsTxt = 'Unlimited Spots'; let progP = 0;
    if (maxP > 0) { spotsTxt = `<span class="${spotsL <= 5 ? 'text-danger' : 'text-accent'}">${spotsL}</span> Spots Left (${regC}/${maxP})`; progP = Math.min(100, (regC / maxP) * 100); }

    let joinBtnHtml = ''; let idPassBtn = ''; let chatBtnHtml = '';

    if (isJ) {
        joinBtnHtml = `<button class="btn btn-custom btn-sm btn-joined" disabled><i class="bi bi-check-circle-fill"></i> Joined</button>`;
        
        if (t.status === 'ongoing' || t.status === 'completed') {
            joinBtnHtml += `<button class="btn btn-custom btn-warning btn-sm mt-2 w-100 btn-upload-result" data-tournament-id="${tId}" data-tournament-name="${t.name}"><i class="bi bi-cloud-arrow-up-fill"></i> Upload Result</button>`;
        }

        joinBtnHtml += `<button class="btn btn-custom btn-info btn-sm mt-2 w-100 btn-view-slots" data-tournament-id="${tId}" data-max-players="${maxP}"><i class="bi bi-grid-3x3-gap-fill"></i> View Slot / Room Info</button>`;

        if (t.status === 'ongoing' || (t.status === 'upcoming' && t.showIdPass && sTime && Date.now() > sTime.getTime() - 900000)) { idPassBtn = `<button class="btn btn-custom btn-idpass w-100 mt-2 btn-sm" data-tournament-id="${tId}"><i class="bi bi-key-fill"></i> View ID & Pass</button>`; }
        if(t.status === 'ongoing' || t.status === 'upcoming') { chatBtnHtml = `<button class="btn btn-custom btn-custom-secondary btn-sm btn-chat" data-tournament-id="${tId}" data-tournament-name="${t.name || 'Tournament'}"><i class="bi bi-chat-dots-fill"></i> Chat</button>` }
    } else if (canJ) {
        const mode = t.mode || 'Solo';
        joinBtnHtml = `<button class="btn btn-custom btn-sm btn-custom-accent btn-join" data-tournament-id="${tId}" data-fee="${eFee}" data-mode="${mode}" data-min-level="${t.minLevel || 0}">₹${eFee} Join <i class="bi bi-arrow-right-short"></i></button>`;
    } else {
        let disR = t.status !== 'upcoming' ? t.status?.toUpperCase() : (isF ? 'Full' : 'Closed');
        joinBtnHtml = `<button class="btn btn-custom btn-sm btn-disabled" disabled>${disR || 'N/A'}</button>`;
    }

    card.innerHTML = `
        <img src="${bannerUrl}" alt="Tournament Banner" class="tournament-banner-image">
        <div class="tournament-card-content">
            <div class="tournament-card-header">
                <div class="tournament-card-tags">${t.mode ? `<span>${t.mode}</span>` : ''}${t.map ? `<span>${t.map}</span>` : ''}${t.tags ? (Array.isArray(t.tags) ? t.tags.map(tag => `<span>${tag}</span>`).join('') : Object.values(t.tags).map(tag => `<span>${tag}</span>`).join('')) : ''}</div>
                <div class="tournament-card-timer">${timerTxt}</div>
            </div>
            <h3 class="tournament-card-title">${t.icon ? `<i class="${t.icon}"></i>` : '<i class="bi bi-joystick text-accent"></i>'} ${t.name || 'Tournament'}</h3>
            <p class="small text-secondary mb-2"><i class="bi bi-calendar-event"></i> ${sTimeLoc}</p>
            <div class="tournament-card-info">
                <div class="info-item"><span>Prize Pool</span><strong><i class="bi bi-trophy-fill text-accent prize-icon"></i> ₹${pPool}</strong></div>
                <div class="info-item"><span>Per Kill</span><strong>₹${pkPrize}</strong></div>
                <div class="info-item"><span>Entry Fee</span><strong class="${eFee > 0 ? 'text-info' : ''}">${eFee > 0 ? `₹${eFee}` : 'Free'}</strong></div>
                <div class="info-item"><span>Min Level</span><strong>${t.minLevel > 0 ? t.minLevel + '+' : 'Any'}</strong></div>
            </div>
            <div class="tournament-card-spots">${spotsTxt}${maxP > 0 ? `<div class="progress mt-1" style="height: 6px;"><div class="progress-bar bg-warning" role="progressbar" style="width: ${progP}%"></div></div>` : ''}</div>
            <div class="tournament-card-actions">
                <button class="btn btn-custom btn-custom-secondary btn-sm btn-details" data-tournament-id="${tId}">Details</button>
                ${chatBtnHtml}
                ${joinBtnHtml}
            </div>
            ${idPassBtn}
        </div>`;

    const vsBtn = card.querySelector('.btn-view-slots'); if (vsBtn) vsBtn.addEventListener('click', handleOpenSlotModal);
    const jBtn = card.querySelector('.btn-join'); if (jBtn) jBtn.addEventListener('click', handleOpenSlotModal);
    const dBtn = card.querySelector('.btn-details'); if (dBtn) dBtn.addEventListener('click', handleMatchDetailsClick);
    const ipBtn = card.querySelector('.btn-idpass'); if (ipBtn) ipBtn.addEventListener('click', handleIdPasswordClick);
    const cBtn = card.querySelector('.btn-chat'); if (cBtn) cBtn.addEventListener('click', (e) => openTournamentChat(e.currentTarget.dataset.tournamentId, e.currentTarget.dataset.tournamentName));
    return card;
}

async function loadMyContests() { 
    if (!currentUser || !elements.myContestsList) { 
        if(elements.myContestsList) removePlaceholders(elements.myContestsList); 
        if(elements.myContestsList) elements.myContestsList.innerHTML = ''; 
        if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'block'; 
        return; 
    } 
    const joinedIds = Object.keys(userProfile.joinedTournaments || {}); 
    elements.myContestsList.classList.add('placeholder-glow'); 
    elements.myContestsList.innerHTML = `<div class="tournament-card placeholder-glow mb-3"><div class="tournament-card-content"><span class="placeholder col-6"></span><span class="placeholder col-12 mt-2"></span><span class="placeholder col-10 mt-2"></span><div class="d-flex justify-content-between mt-3"><span class="placeholder col-4 h-30"></span><span class="placeholder col-4 h-30"></span></div></div></div>`; 
    if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'none'; 
    if (joinedIds.length === 0) { 
        removePlaceholders(elements.myContestsList); 
        elements.myContestsList.innerHTML = ''; 
        if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'block'; 
        return; 
    } 
    try { 
        const contestPromises = joinedIds.map(id => get(ref(db, `tournaments/${id}`))); 
        const snapshots = await Promise.all(contestPromises); 
        removePlaceholders(elements.myContestsList); 
        elements.myContestsList.innerHTML = ''; 
        const contestCards = []; 
        snapshots.forEach((snapshot, index) => { 
            if (snapshot.exists()) { 
                const t = snapshot.val(); 
                if (t.status === 'upcoming' || t.status === 'ongoing') { 
                    const tId = joinedIds[index]; 
                    contestCards.push({ startTime: t.startTime || 0, card: createTournamentCardElement(tId, t) }); 
                } 
            } 
        }); 
        contestCards.sort((a, b) => a.startTime - b.startTime); 
        if (contestCards.length > 0) { 
            contestCards.forEach(item => elements.myContestsList.appendChild(item.card)); 
        } else if (elements.noContestsMessage) { 
            elements.noContestsMessage.style.display = 'block'; 
            elements.noContestsMessage.textContent = "No upcoming/ongoing joined contests."; 
        } 
    } catch (e) { 
        removePlaceholders(elements.myContestsList); 
        elements.myContestsList.innerHTML = '<p class="text-danger tc">Could not load contests.</p>'; 
    } 
}

function loadWalletData() { if (!currentUser) return; loadRecentTransactions(); }
function loadProfileData() { if (!currentUser) return; if (userProfile?.displayName) { removePlaceholders(elements.profileName?.closest('.placeholder-glow')); removePlaceholders(elements.profileEmail?.closest('.placeholder-glow')); removePlaceholders(elements.profileTotalMatches?.closest('.placeholder-glow')); removePlaceholders(elements.profileWonMatches?.closest('.placeholder-glow')); removePlaceholders(elements.profileTotalEarnings?.closest('.placeholder-glow')); } }
function loadEarningsData() { if (!currentUser) return; if (typeof userProfile?.totalEarnings !== 'undefined') removePlaceholders(elements.earningsTotal?.closest('.placeholder-glow')); if (typeof userProfile?.referralEarnings !== 'undefined') removePlaceholders(elements.earningsReferral?.closest('.placeholder-glow')); }

async function loadLeaderboardData() {
    if (!currentUser) return;
    const listEl = elements.leaderboardListEl;
    const emptyMsgEl = elements.noLeaderboardMessageEl;
    listEl.innerHTML = `<div class="leaderboard-item placeholder-glow mb-2"><span class="placeholder col-1" style="height: 30px; width: 35px;"></span><span class="placeholder col-2 ms-2 me-3" style="height: 45px; width: 45px; border-radius: 50%;"></span><div style="flex-grow: 1;"><span class="placeholder col-6 d-block" style="height: 20px;"></span></div><span class="placeholder col-3" style="height: 20px;"></span></div>`.repeat(5);
    emptyMsgEl.style.display = 'none';

    try {
        const leaderboardQuery = query(ref(db, 'users'), orderByChild('leaderboardRank'), limitToFirst(100));
        const snapshot = await get(leaderboardQuery);
        removePlaceholders(listEl); listEl.innerHTML = '';
        if (!snapshot.exists()) { emptyMsgEl.style.display = 'block'; return; }

        const leaderboardData = [];
        snapshot.forEach(childSnapshot => { const user = childSnapshot.val(); if (user && user.leaderboardRank) { leaderboardData.push(user); } });
        leaderboardData.sort((a, b) => a.leaderboardRank - b.leaderboardRank);

        if (leaderboardData.length === 0) { emptyMsgEl.style.display = 'block'; return; }

        leaderboardData.forEach(user => {
            const displayName = user.displayName || user.email?.split('@')[0] || 'User';
            const photoURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1E293B&color=E2E8F0&bold=true&size=45`;
            const displayEarnings = user.leaderboardDisplayEarnings || 0; 
            const itemEl = document.createElement('div');
            itemEl.className = 'leaderboard-item';
            itemEl.innerHTML = `<div class="leaderboard-rank">#${user.leaderboardRank}</div><img src="${photoURL}" alt="${displayName}" class="leaderboard-avatar"><div class="leaderboard-user-info"><div class="leaderboard-name">${displayName}</div></div><div class="leaderboard-earnings">₹${displayEarnings.toLocaleString('en-IN')}</div>`;
            listEl.appendChild(itemEl);
        });
    } catch(error) { listEl.innerHTML = `<p class="text-center text-danger">Could not load leaderboard. ${error.message}</p>`; }
}

async function recordTransaction(userId, type, amount, description, details = {}) { if (!userId) return; const transactionRef = ref(db, `transactions/${userId}`); const newTransaction = { type, amount, description, timestamp: serverTimestamp(), ...details }; try { await push(transactionRef, newTransaction); } catch (e) { } }

async function loadRecentTransactions() { 
    if (!currentUser || !elements.recentTransactionsList) return; 
    const limit = 5; 
    elements.recentTransactionsList.innerHTML = ''; 
    elements.recentTransactionsList.classList.add('placeholder-glow'); 
    for (let i = 0; i < 3; i++) elements.recentTransactionsList.innerHTML += `<div class="custom-card p-2 mb-2 placeholder-glow"><div class="d-flex justify-content-between"><span class="placeholder col-5 h-16"></span><span class="placeholder col-3 h-16"></span></div><div class="small text-secondary mt-1"><span class="placeholder col-6 h-14"></span></div></div>`; 
    if (elements.noTransactionsMessage) { elements.noTransactionsMessage.style.display = 'block'; elements.noTransactionsMessage.textContent = 'Loading transactions...'; } 
    try { 
        const transRef = query(ref(db, `transactions/${currentUser.uid}`), limitToLast(limit)); 
        const s = await get(transRef); 
        const transactions = s.val() || {}; 
        const sortedT = Object.values(transactions).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); 
        removePlaceholders(elements.recentTransactionsList); 
        elements.recentTransactionsList.innerHTML = ''; 
        if (sortedT.length > 0) { 
            if (elements.noTransactionsMessage) elements.noTransactionsMessage.style.display = 'none'; 
            sortedT.forEach(t => { 
                const item = document.createElement('div'); 
                item.className = 'custom-card p-2 mb-2 d-flex justify-content-between align-items-center'; 
                const isCr = t.amount > 0; 
                const amt = `${isCr ? '+' : ''}₹${Math.abs(t.amount || 0).toFixed(2)}`; 
                const time = t.timestamp ? new Date(t.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'; 
                item.innerHTML = `<div><div class="small fw-bold">${t.description || t.type || 'Txn'}</div><div class="small text-secondary">${time}</div></div><div class="fw-bold ${isCr ? 'text-success' : 'text-danger'}">${amt}</div>`; 
                elements.recentTransactionsList.appendChild(item); 
            }); 
        } else if (elements.noTransactionsMessage) { 
            elements.noTransactionsMessage.style.display = 'block'; 
            elements.noTransactionsMessage.textContent = 'No recent transactions.'; 
        } 
    } catch (e) { 
        removePlaceholders(elements.recentTransactionsList); 
        elements.recentTransactionsList.innerHTML = '<p class="text-danger tc">Could not load transactions.</p>'; 
        if (elements.noTransactionsMessage) elements.noTransactionsMessage.style.display = 'none'; 
    } 
}

function handleWithdrawClick() { if (!currentUser || !elements.withdrawModalInstance) return; const wc = userProfile.winningCash || 0; const minW = appSettings?.minWithdraw || 50; elements.minWithdrawAmount.textContent = minW; elements.withdrawModalBalance.textContent = `₹${wc.toFixed(2)}`; elements.withdrawAmountInput.value = ''; elements.withdrawAmountInput.min = minW; elements.withdrawMethodInput.value = userProfile.upiId || ''; clearStatusMessage(elements.withdrawStatusMessage); elements.withdrawModalInstance.show(); }

async function submitWithdrawRequestHandler() { 
    if (!currentUser || !elements.withdrawModalInstance) return; 
    const amt = parseFloat(elements.withdrawAmountInput.value); 
    const mtd = elements.withdrawMethodInput.value.trim(); 
    const wc = userProfile.winningCash || 0; 
    const minW = appSettings?.minWithdraw || 50; 
    clearStatusMessage(elements.withdrawStatusMessage); 
    if (isNaN(amt) || amt <= 0) { showStatusMessage(elements.withdrawStatusMessage, 'Invalid amount.', 'warning'); return; } 
    if (amt < minW) { showStatusMessage(elements.withdrawStatusMessage, `Min withdraw ₹${minW}.`, 'warning'); return; } 
    if (amt > wc) { showStatusMessage(elements.withdrawStatusMessage, 'Insufficient winning balance.', 'warning'); return; } 
    if (!mtd) { showStatusMessage(elements.withdrawStatusMessage, 'Enter withdrawal method.', 'warning'); return; } 
    
    elements.submitWithdrawRequestBtn.disabled = true; 
    elements.submitWithdrawRequestBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...'; 
    let transactionCommitted = false; 
    
    try { 
        const uRef = ref(db, `users/${currentUser.uid}`); 
        const txResult = await runTransaction(uRef, (prof) => { 
            if (prof) { 
                if ((prof.winningCash || 0) >= amt) { 
                    prof.winningCash = (prof.winningCash || 0) - amt; 
                    return prof; 
                } else { 
                    throw new Error("Insufficient winning balance (Tx)."); 
                } 
            } else { 
                throw new Error("Profile missing (Tx)."); 
            } 
        }); 
        
        if (!txResult.committed) { throw new Error("Failed to update balance. Please try again."); } 
        transactionCommitted = true; 
        
        const wrRef = ref(db, 'withdrawals'); 
        const newReq = { 
            userId: currentUser.uid, 
            userName: userProfile.displayName || currentUser.email, 
            amount: amt, 
            methodDetails: { methodName: mtd.includes('@') ? 'UPI' : 'Bank/Other', accountInfo: mtd }, 
            status: 'pending', 
            requestTimestamp: serverTimestamp(), 
            userEmail: currentUser.email || 'N/A' 
        }; 
        const newWithdrawalRef = await push(wrRef, newReq); 
        await recordTransaction(currentUser.uid, 'withdraw_request', -amt, `Withdrawal Request to ${mtd}`, { withdrawalId: newWithdrawalRef.key }); 
        showStatusMessage(elements.withdrawStatusMessage, 'Request submitted successfully!', 'success', false); 
        
        setTimeout(() => { 
            if (elements.withdrawModalInstance) elements.withdrawModalInstance.hide(); 
        }, 2500); 
        if (currentSectionId === 'wallet-section') loadRecentTransactions(); 
    } catch (e) { 
        showStatusMessage(elements.withdrawStatusMessage, `Error: ${e.message}`, 'danger'); 
        if (transactionCommitted) { 
            const uRef = ref(db, `users/${currentUser.uid}`); 
            try { 
                await runTransaction(uRef, (prof) => { 
                    if (prof) { prof.winningCash = (prof.winningCash || 0) + amt; } 
                    return prof; 
                }); 
                await recordTransaction(currentUser.uid, 'withdraw_failed_refund', amt, `Refund Failed Withdrawal Request`); 
                showStatusMessage(elements.withdrawStatusMessage, `Error: ${e.message}. Amount refunded.`, 'danger'); 
            } catch (refundError) { 
                showStatusMessage(elements.withdrawStatusMessage, `Error: ${e.message}. CRITICAL: Failed to refund amount! Contact support.`, 'danger', false); 
            } 
        } 
    } finally { 
        elements.submitWithdrawRequestBtn.disabled = false; 
        elements.submitWithdrawRequestBtn.innerHTML = 'Submit Request'; 
    } 
}

async function handleMatchDetailsClick(event) { 
    if (!elements.matchDetailsModalInstance) return; 
    const tId = event.currentTarget.dataset.tournamentId; 
    if (!tId) return; 
    elements.matchDetailsModalTitle.textContent = 'Loading...'; 
    elements.matchDetailsModalBody.innerHTML = '<div class="tc p-5"><div class="spinner-border spinner-border-sm"></div></div>'; 
    elements.matchDetailsModalInstance.show(); 
    try { 
        const tRef = ref(db, `tournaments/${tId}`); 
        const s = await get(tRef); 
        if (s.exists()) { 
            const t = s.val(); 
            const gName = appSettings.games?.[t.gameId]?.name || t.gameId || 'N/A'; 
            const sTimeLoc = t.startTime ? new Date(t.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'}) : 'TBA'; 
            
            let pDistHTML = ''; 
            if (t.prizeDistStr) { 
                const fmtDist = t.prizeDistStr.split(',').map(part => { 
                    const [rank, amt] = part.split('-'); 
                    return rank && amt ? `Rank ${rank.trim()}: ₹${amt.trim()}` : ''; 
                }).filter(Boolean).join('\n'); 
                if(fmtDist) pDistHTML = `<h5>Auto Prize Distribution:</h5><pre>${fmtDist}</pre>`; 
            } else if (t.prizeDistribution) { 
                let fmtDist = ''; 
                if (typeof t.prizeDistribution === 'object') { 
                    fmtDist = Object.entries(t.prizeDistribution).map(([rank, prize]) => `Rank ${rank}: ₹${prize}`).join('\n'); 
                } else { 
                    fmtDist = String(t.prizeDistribution).replace(/\\n/g, '\n'); 
                } 
                pDistHTML = `<h5>Prize Distribution:</h5><pre>${fmtDist}</pre>`; 
            } 
            
            const desc = t.description || 'Standard rules apply.'; 
            const fmtDesc = desc.replace(/\n/g, '<br>'); 
            
            elements.matchDetailsModalTitle.textContent = t.name || 'Match Details'; 
            elements.matchDetailsModalBody.innerHTML = `<p><strong>Game:</strong> ${gName}</p><p><strong>Mode:</strong> ${t.mode || 'N/A'}</p><p><strong>Map:</strong> ${t.map || 'N/A'}</p><p><strong>Starts:</strong> ${sTimeLoc}</p><hr><p><strong>Entry:</strong> ${t.entryFee > 0 ? `₹${t.entryFee}` : 'Free'}</p><p><strong>Prize:</strong> ₹${t.prizePool || 0}</p><p><strong>Per Kill:</strong> ₹${t.perKillPrize || 0}</p><p><strong>Max Players:</strong> ${t.maxPlayers > 0 ? t.maxPlayers : 'Unlimited'}</p><hr><h5>Rules:</h5><div style="white-space: pre-wrap; line-height: 1.6;">${fmtDesc}</div>${pDistHTML}`; 
        } else {
            elements.matchDetailsModalBody.innerHTML = '<p class="text-danger">Details not found.</p>'; 
        }
    } catch (e) { 
        elements.matchDetailsModalBody.innerHTML = '<p class="text-danger">Error loading details.</p>'; 
    } 
}

async function handleIdPasswordClick(event) { 
    if (!elements.idPasswordModalInstance) return; 
    const tId = event.currentTarget.dataset.tournamentId; 
    if (!tId) return; 
    if (!currentUser || !userProfile?.joinedTournaments?.[tId]) { alert("Join the tournament first or refresh the page."); return; } 
    elements.roomIdDisplay.innerHTML = '<span class="placeholder col-6"></span>'; 
    elements.roomPasswordDisplay.innerHTML = '<span class="placeholder col-6"></span>'; 
    elements.idPasswordModalInstance.show(); 
    try { 
        const tournamentRef = ref(db, `tournaments/${tId}`); 
        const s = await get(tournamentRef); 
        removePlaceholders(elements.roomIdDisplay.closest('.placeholder-glow')); 
        removePlaceholders(elements.roomPasswordDisplay.closest('.placeholder-glow')); 
        if (s.exists()) { 
            const tournamentData = s.val(); 
            if (tournamentData.showIdPass) { 
                elements.roomIdDisplay.textContent = tournamentData.roomId || 'Not updated yet'; 
                elements.roomPasswordDisplay.textContent = tournamentData.roomPassword || 'Not updated yet'; 
            } else { 
                elements.roomIdDisplay.textContent = 'Hidden by Admin'; 
                elements.roomPasswordDisplay.textContent = 'Hidden by Admin'; 
            } 
        } else { 
            elements.roomIdDisplay.textContent = 'Not Found'; 
            elements.roomPasswordDisplay.textContent = 'Not Found'; 
        } 
    } catch (e) { 
        removePlaceholders(elements.roomIdDisplay.closest('.placeholder-glow')); 
        removePlaceholders(elements.roomPasswordDisplay.closest('.placeholder-glow')); 
        elements.roomIdDisplay.textContent = 'Error'; 
        elements.roomPasswordDisplay.textContent = 'Error'; 
        alert("Error loading ID/Password."); 
    } 
}

async function handlePolicyClick(event) { 
    if (!elements.policyModalInstance) return; 
    event.preventDefault(); 
    const target = event.currentTarget; 
    const policyType = target.dataset.policy; 
    if (!policyType) return; 
    let title = '', modalBodyContent = '<div class="text-center p-5"><div class="spinner-border spinner-border-sm"></div></div>'; 
    elements.policyModalBody.innerHTML = modalBodyContent; 
    switch (policyType) { 
        case 'privacy': title = 'Privacy Policy'; modalBodyContent = appSettings.policyPrivacy || 'Content not available.'; break; 
        case 'terms': title = 'Terms and Conditions'; modalBodyContent = appSettings.policyTerms || 'Content not available.'; break; 
        case 'refund': title = 'Refund and Cancellation'; modalBodyContent = appSettings.policyRefund || 'Content not available.'; break; 
        case 'fairPlay': title = 'Fair Play Policy'; modalBodyContent = appSettings.policyFairPlay || 'Content not available.'; break; 
        case 'refer': 
            title = 'Refer & Earn'; 
            if (!currentUser) { alert("Login to view referral."); return; } 
            const refCode = userProfile.referralCode || 'N/A'; 
            const referralBonus = appSettings.referralBonus || 5; 
            modalBodyContent = `<div class="text-center"><h4>Refer Friends!</h4><p class="text-secondary">Share code & earn!</p><div class="my-4 p-3" style="background: var(--primary-bg); border-radius: 8px;"><p class="small text-secondary mb-1">Your Code:</p><h3 class="text-accent referral-code" id="referralCodeDisplay">${refCode}</h3><div class="mt-3"><button class="btn btn-sm btn-custom btn-custom-secondary me-2 copy-btn" data-target="#referralCodeDisplay"><i class="bi bi-clipboard"></i> Copy</button><button class="btn btn-sm btn-custom btn-custom-secondary" id="shareReferralBtn"><i class="bi bi-share-fill"></i> Share</button></div></div><p class="mt-3 small text-secondary">Get ₹${referralBonus} when your friend joins using your code, and they get a signup bonus!</p></div>`; 
            break; 
        default: title = 'Info'; modalBodyContent = '<p>Content unavailable.</p>'; 
    } 
    elements.policyModalTitle.textContent = title; 
    if (typeof modalBodyContent === 'string' && policyType !== 'refer') { 
        elements.policyModalBody.innerHTML = modalBodyContent.replace(/\n/g, '<br>'); 
    } else { 
        elements.policyModalBody.innerHTML = modalBodyContent; 
    } 
    elements.policyModalInstance.show(); 
}

function setupRealtimeListeners(uid) { 
    if (!uid || !db || !currentUser) return; 
    detachAllDbListeners(); 
    const uRef = ref(db, `users/${uid}`); 
    const listFunc = onValue(uRef, (s) => { 
        if (currentUser && currentUser.uid === uid) { 
            if (s.exists()) { 
                const oldProfile = userProfile; 
                userProfile = s.val(); 
                populateUserInfo(currentUser, userProfile); 
                if (currentSectionId === 'home-section') loadMyContests(); 
                if (currentSectionId === 'wallet-section') loadRecentTransactions(); 
                if (oldProfile.lastCheckedNotifications !== userProfile.lastCheckedNotifications) { 
                    loadAndDisplayNotifications(); 
                } 
            } else { 
                alert("Account data missing or deleted. Logging out."); 
                logoutUser(); 
            } 
        } else { off(uRef, 'value', listFunc); } 
    }, (e) => { }); 
    dbListeners['userProfile'] = { path: `users/${uid}`, func: listFunc }; 
}

function detachAllDbListeners() { 
    for (const k in dbListeners) { 
        try { 
            const { path, func } = dbListeners[k]; 
            if (path && func) { off(ref(db, path), 'value', func); } 
        } catch (e) {} 
    } 
    dbListeners = {}; 
}

async function checkSecurityRules() { 
    try { 
        if (!currentUser) { } else if (elements.securityWarning) { elements.securityWarning.style.display = 'none'; } 
    } catch (error) { 
        if (elements.securityWarning) elements.securityWarning.style.display = 'none'; 
    } 
}

function startRechargeFlow() { 
    if (!currentUser) { alert("Please login to add amount."); window.showSection('login-section'); return; } 
    currentRechargeData = { amount: 0, paymentMethod: null, upiId: null }; 
    elements.rechargeAmountInput.value = ''; elements.rechargeUtrInput.value = ''; 
    
    // CLEAR IMAGE PREVIEW ON START
    if(elements.rechargeScreenshotInput) elements.rechargeScreenshotInput.value = ''; 
    const previewImg = getElement('rechargePreviewImg');
    if(previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
    const overlay = getElement('rechargeChangeOverlay');
    if(overlay) overlay.style.display = 'none';
    const boxI = getElement('rechargeUploadBox')?.querySelector('i');
    const boxSpan = getElement('rechargeUploadBox')?.querySelector('span');
    if(boxI) boxI.style.display = 'block';
    if(boxSpan) boxSpan.style.display = 'block';
    if(elements.rechargeScreenshotStatus) elements.rechargeScreenshotStatus.style.display = 'none'; 
    
    clearStatusMessage(elements.rechargeStep1Status); clearStatusMessage(elements.rechargeStep2Status); clearStatusMessage(elements.rechargeStep3Status); 
    elements.rechargeBalanceDisplay.textContent = (userProfile.depositBalance || 0).toFixed(2); 
    window.showSection('recharge-section', 'wallet-section'); goToRechargeStep(1); 
}

function goToRechargeStep(step) { 
    elements.rechargeStep1.style.display = (step === 1) ? 'block' : 'none'; 
    elements.rechargeStep2.style.display = (step === 2) ? 'block' : 'none'; 
    elements.rechargeStep3.style.display = (step === 3) ? 'block' : 'none'; 
}

function handleGoToStep2() { 
    const amount = parseFloat(elements.rechargeAmountInput.value); 
    if (isNaN(amount) || amount < 10 || amount > 1000) { 
        showStatusMessage(elements.rechargeStep1Status, "Please enter an amount between ₹10 and ₹1000.", 'warning'); return; 
    } 
    clearStatusMessage(elements.rechargeStep1Status); 
    currentRechargeData.amount = amount; 
    elements.rechargeAmountConfirm.textContent = amount.toFixed(2); 
    goToRechargeStep(2); 
}
        
function handleGoToStep3() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedMethod) { showStatusMessage(elements.rechargeStep2Status, "Please select a payment method.", "warning"); return; }
    clearStatusMessage(elements.rechargeStep2Status);
    currentRechargeData.paymentMethod = selectedMethod.value;
    currentRechargeData.upiId = appSettings.upiDetails || 'upi-id-not-found@pay';
    const qrCodeUrl = appSettings.qrCodeUrl || 'https://via.placeholder.com/150/FFFFFF/000000?text=QR+Not+Available';
    elements.rechargeFinalAmount.textContent = currentRechargeData.amount.toFixed(2);
    elements.rechargePaymentMode.textContent = currentRechargeData.paymentMethod;
    elements.rechargeUpiId.textContent = currentRechargeData.upiId;
    if (elements.rechargeQrCodeImg) { elements.rechargeQrCodeImg.src = qrCodeUrl; }
    goToRechargeStep(3);
}

// DEPOSIT SCREENSHOT SUBMIT
async function submitDepositRequest() {
    if (!currentUser) return;
    const utr = elements.rechargeUtrInput.value.trim();
    const file = elements.rechargeScreenshotInput.files[0];
    if (!utr) { showStatusMessage(elements.rechargeStep3Status, "Please enter the UTR/Transaction ID.", 'warning'); return; }
    if (!file) { showStatusMessage(elements.rechargeStep3Status, "Please upload a payment screenshot.", 'warning'); return; }
    elements.rechargeSubmitBtn.disabled = true;
    elements.rechargeSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Submitting...'; showLoader(true);
    try {
        const screenshotUrl = await uploadImageToImgBBUser(file, elements.rechargeScreenshotStatus);
        const depositRequest = { userId: currentUser.uid, userEmail: currentUser.email, userName: userProfile.displayName || 'N/A', amount: currentRechargeData.amount, paymentMethod: currentRechargeData.paymentMethod, upiId: currentRechargeData.upiId, utr: utr, screenshotUrl: screenshotUrl, status: 'pending', timestamp: serverTimestamp() };
        
        await push(ref(db, 'deposits'), depositRequest);
        
        // 🔥 YAHAN FIX KIYA HAI: Deposit Request ko turant Transaction History mein add karna 🔥
        await recordTransaction(currentUser.uid, 'deposit_request', currentRechargeData.amount, `Deposit Requested (Pending)`);
        
        alert("Deposit request submitted successfully! Your balance will be updated after verification.");
        elements.rechargeScreenshotInput.value = ''; elements.rechargeScreenshotStatus.style.display = "none";
        window.showSection('wallet-section');
        
        // 🔥 History turant refresh karne ke liye 🔥
        loadRecentTransactions(); 
        
    } catch (error) { 
        showStatusMessage(elements.rechargeStep3Status, `Failed to submit request. Error: ${error.message}`, 'danger', false); 
    } finally { 
        showLoader(false); elements.rechargeSubmitBtn.disabled = false;
        elements.rechargeSubmitBtn.innerHTML = 'Submit'; 
    }
}
        
// BUG FIX: HANDLE JOIN TOURNAMENT WITH BUTTON ELEMENT (SMART UI TEXT SWAP)
function handleJoinTournamentClick(btn) {
    if (!currentUser) { alert("Login to join."); window.showSection('login-section'); return; }
    const tId = btn.dataset.tournamentId;
    const fee = parseFloat(btn.dataset.fee || 0);
    const mode = btn.dataset.mode || 'Solo';
    if (!tId) return;

    elements.joinTournamentIdInput.value = tId;
    elements.joinTournamentFeeInput.value = fee;
    elements.joinTournamentModeInput.value = mode;
    elements.joinTournamentMinLevelInput.value = btn.dataset.minLevel || 0;

    elements.joinUsernameInput.value = userProfile.username || '';
    elements.joinGameUidInput.value = userProfile.gameUid || '';
    elements.joinGameLevelInput.value = '';
    
    elements.joinTeammateUsernameInput.value = '';
    elements.joinTeammateGameUidInput.value = '';
    if(elements.joinTeammateLevelInput) elements.joinTeammateLevelInput.value = '';

    const p3Name = document.getElementById('joinPlayer3UsernameInput');
    const p3Uid = document.getElementById('joinPlayer3GameUidInput');
    const p3Level = document.getElementById('joinPlayer3LevelInput');
    const p4Name = document.getElementById('joinPlayer4UsernameInput');
    const p4Uid = document.getElementById('joinPlayer4GameUidInput');
    const p4Level = document.getElementById('joinPlayer4LevelInput');
    
    if(p3Name) p3Name.value = ''; if(p3Uid) p3Uid.value = ''; if(p3Level) p3Level.value = '';
    if(p4Name) p4Name.value = ''; if(p4Uid) p4Uid.value = ''; if(p4Level) p4Level.value = '';

    clearStatusMessage(elements.joinTournamentStatusMessage);

    const squadContainer = document.getElementById('joinSquadFieldsContainer');

    // 👇 SMART UI LABEL RENAMING LOGIC 👇
    const p1NameLbl = document.querySelector('label[for="joinUsernameInput"]');
    const p1UidLbl = document.querySelector('label[for="joinGameUidInput"]');
    
    const p2Header = document.querySelector('#joinDuoFieldsContainer h6');
    const p2NameLbl = document.querySelector('label[for="joinTeammateUsernameInput"]');
    const p2UidLbl = document.querySelector('label[for="joinTeammateGameUidInput"]');

    if (mode === 'Squad') {
        if(p1NameLbl) p1NameLbl.textContent = "Player 1 Username";
        if(p1UidLbl) p1UidLbl.textContent = "Player 1 Free Fire UID";
        if(p2Header) p2Header.textContent = "Player 2 Details";
        if(p2NameLbl) p2NameLbl.textContent = "Player 2 Username";
        if(p2UidLbl) p2UidLbl.textContent = "Player 2 Free Fire UID";
    } else {
        if(p1NameLbl) p1NameLbl.textContent = "Your Player Username";
        if(p1UidLbl) p1UidLbl.textContent = "Your Free Fire UID";
        if(p2Header) p2Header.textContent = "Teammate Details";
        if(p2NameLbl) p2NameLbl.textContent = "Teammate Username";
        if(p2UidLbl) p2UidLbl.textContent = "Teammate Free Fire UID";
    }
    // 👆 SMART UI LABEL RENAMING LOGIC END 👆

    if (mode === 'Squad') {
        const totalFee = fee * 4;
        elements.joinFeeDisplayEl.textContent = `₹${totalFee.toFixed(2)} (₹${fee} per player)`;
        elements.joinDuoFieldsContainer.style.display = 'block';
        if(squadContainer) squadContainer.style.display = 'block';
        
        elements.joinTeammateUsernameInput.required = true;
        elements.joinTeammateGameUidInput.required = true;
        if(elements.joinTeammateLevelInput) elements.joinTeammateLevelInput.required = true;
        
        if(p3Name) p3Name.required = true; if(p3Uid) p3Uid.required = true; if(p3Level) p3Level.required = true;
        if(p4Name) p4Name.required = true; if(p4Uid) p4Uid.required = true; if(p4Level) p4Level.required = true;

    } else if (mode === 'Duo') {
        const totalFee = fee * 2;
        elements.joinFeeDisplayEl.textContent = `₹${totalFee.toFixed(2)} (₹${fee} per player)`;
        elements.joinDuoFieldsContainer.style.display = 'block';
        if(squadContainer) squadContainer.style.display = 'none';
        
        elements.joinTeammateUsernameInput.required = true;
        elements.joinTeammateGameUidInput.required = true;
        if(elements.joinTeammateLevelInput) elements.joinTeammateLevelInput.required = true;

        if(p3Name) p3Name.required = false; if(p3Uid) p3Uid.required = false; if(p3Level) p3Level.required = false;
        if(p4Name) p4Name.required = false; if(p4Uid) p4Uid.required = false; if(p4Level) p4Level.required = false;
        
    } else {
        elements.joinFeeDisplayEl.textContent = `₹${fee.toFixed(2)}`;
        elements.joinDuoFieldsContainer.style.display = 'none';
        if(squadContainer) squadContainer.style.display = 'none';
        
        elements.joinTeammateUsernameInput.required = false;
        elements.joinTeammateGameUidInput.required = false;
        if(elements.joinTeammateLevelInput) elements.joinTeammateLevelInput.required = false;

        if(p3Name) p3Name.required = false; if(p3Uid) p3Uid.required = false; if(p3Level) p3Level.required = false;
        if(p4Name) p4Name.required = false; if(p4Uid) p4Uid.required = false; if(p4Level) p4Level.required = false;
    }
    
    getModal('joinTournamentDetailsModal')?.show();
}

async function confirmAndJoinTournament() {
    const tId = elements.joinTournamentIdInput.value;
    const singleFee = parseFloat(elements.joinTournamentFeeInput.value);
    const mode = elements.joinTournamentModeInput.value;
    const username = elements.joinUsernameInput.value.trim();
    const gameUid = elements.joinGameUidInput.value.trim();
    const teammateUsername = elements.joinTeammateUsernameInput.value.trim();
    const teammateGameUid = elements.joinTeammateGameUidInput.value.trim();
    const slotNumber = elements.joinSlotNumberInput.value;

    const minLevel = parseInt(elements.joinTournamentMinLevelInput.value) || 0;
    const playerLevel = parseInt(elements.joinGameLevelInput.value);
    const teammateLevel = elements.joinTeammateLevelInput ? parseInt(elements.joinTeammateLevelInput.value) : 0;
    
    const p3Username = document.getElementById('joinPlayer3UsernameInput') ? document.getElementById('joinPlayer3UsernameInput').value.trim() : '';
    const p3GameUid = document.getElementById('joinPlayer3GameUidInput') ? document.getElementById('joinPlayer3GameUidInput').value.trim() : '';
    const p3Level = document.getElementById('joinPlayer3LevelInput') ? parseInt(document.getElementById('joinPlayer3LevelInput').value) : 0;
    
    const p4Username = document.getElementById('joinPlayer4UsernameInput') ? document.getElementById('joinPlayer4UsernameInput').value.trim() : '';
    const p4GameUid = document.getElementById('joinPlayer4GameUidInput') ? document.getElementById('joinPlayer4GameUidInput').value.trim() : '';
    const p4Level = document.getElementById('joinPlayer4LevelInput') ? parseInt(document.getElementById('joinPlayer4LevelInput').value) : 0;

    let totalFee = singleFee;
    if (mode === 'Duo') totalFee = singleFee * 2;
    if (mode === 'Squad') totalFee = singleFee * 4;

    if (!username || !gameUid) { showStatusMessage(elements.joinTournamentStatusMessage, 'Your Player Username and Game UID are required.', 'warning'); return; }
    if (!playerLevel || playerLevel <= 0 || isNaN(playerLevel)) { showStatusMessage(elements.joinTournamentStatusMessage, 'Please enter a valid Free Fire Level.', 'warning'); return; }

    if (mode === 'Duo' || mode === 'Squad') {
        if (!teammateUsername || !teammateGameUid) { showStatusMessage(elements.joinTournamentStatusMessage, "Player 2's Username and UID are required.", 'warning'); return; }
        if (!teammateLevel || teammateLevel <= 0 || isNaN(teammateLevel)) { showStatusMessage(elements.joinTournamentStatusMessage, "Please enter a valid Player 2 Level.", 'warning'); return; }
    }

    if (mode === 'Squad') {
        if (!p3Username || !p3GameUid || !p4Username || !p4GameUid) { showStatusMessage(elements.joinTournamentStatusMessage, "Player 3 and Player 4 details are required for Squad mode.", 'warning'); return; }
        if (!p3Level || p3Level <= 0 || isNaN(p3Level) || !p4Level || p4Level <= 0 || isNaN(p4Level)) { showStatusMessage(elements.joinTournamentStatusMessage, "Please enter valid levels for Player 3 and 4.", 'warning'); return; }
    }
    
    if (minLevel > 0) {
        if (playerLevel < minLevel) { showStatusMessage(elements.joinTournamentStatusMessage, `Your Free Fire level must be at least ${minLevel} to join.`, 'warning'); return; }
        if ((mode === 'Duo' || mode === 'Squad') && teammateLevel < minLevel) { showStatusMessage(elements.joinTournamentStatusMessage, `Player 2's level must be at least ${minLevel} to join.`, 'warning'); return; }
        if (mode === 'Squad' && (p3Level < minLevel || p4Level < minLevel)) { showStatusMessage(elements.joinTournamentStatusMessage, `All squad players must be at least level ${minLevel} to join.`, 'warning'); return; }
    }
    
    clearStatusMessage(elements.joinTournamentStatusMessage);
    const btn = elements.confirmJoinBtn;
    btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Joining...';

    try {
        const ctrlRef = ref(db, 'settings/appControl');
        const ctrlSnap = await get(ctrlRef);
        const ctrlData = ctrlSnap.exists() ? ctrlSnap.val() : {};
        const BONUS_PERCENT_ALLOWED = ctrlData.bonusUsagePercent || 0; 

        const uRef = ref(db, `users/${currentUser.uid}`);
        const uSnap = await get(uRef);
        if (!uSnap.exists()) throw new Error("User profile missing. Please re-login.");
        const profileData = uSnap.val();
        
        const availableBonus = profileData.bonusCash || 0;
        const deposit = profileData.depositBalance || 0; 
        const winnings = profileData.winningCash || 0; 
        
        const maxBonusAllowed = (totalFee * BONUS_PERCENT_ALLOWED) / 100;
        const actualBonusToUse = Math.min(maxBonusAllowed, availableBonus);
        const remainingFeeToPay = totalFee - actualBonusToUse;

        const spendable = deposit + winnings;
        if (spendable < remainingFeeToPay) { 
            throw new Error(`Balance kam hai! Fee: ₹${totalFee}. Bonus dega: ₹${actualBonusToUse.toFixed(2)}. Aapko ₹${remainingFeeToPay.toFixed(2)} aur chahiye, par aapke paas ₹${spendable.toFixed(2)} hain.`);
        }
        if (profileData.joinedTournaments?.[tId]) { 
            throw new Error("Aap pehle hi ye match join kar chuke hain.");
        }

        const tRef = ref(db, `tournaments/${tId}`);
        const tSnap = await get(tRef);
        if (!tSnap.exists()) throw new Error("Tournament not found.");
        const tData = tSnap.val();
        if (tData.status !== 'upcoming') throw new Error("Tournament registration band ho chuka hai.");
        const rC = tData.registeredPlayers ? Object.keys(tData.registeredPlayers).length : 0;
        if (tData.maxPlayers > 0 && rC >= tData.maxPlayers) throw new Error("Tournament full ho gaya hai.");
        
        if (slotNumber) {
            if (tData.slots && tData.slots[slotNumber]) {
                throw new Error(`Slot #${slotNumber} pehle se book hai. Koi aur slot chuniye.`);
            }
        }

        let feeDeductedFromDeposit = 0;
        let feeDeductedFromWinnings = 0;
        
        if (deposit >= remainingFeeToPay) { 
            feeDeductedFromDeposit = remainingFeeToPay;
        } else { 
            feeDeductedFromDeposit = deposit;
            feeDeductedFromWinnings = remainingFeeToPay - deposit; 
        }

        const newBonus = availableBonus - actualBonusToUse;
        const newDeposit = deposit - feeDeductedFromDeposit;
        const newWinning = winnings - feeDeductedFromWinnings;

        const updates = {};
        updates[`users/${currentUser.uid}/bonusCash`] = newBonus;
        updates[`users/${currentUser.uid}/depositBalance`] = newDeposit;
        updates[`users/${currentUser.uid}/winningCash`] = newWinning;

        updates[`users/${currentUser.uid}/joinedTournaments/${tId}`] = true;
        updates[`users/${currentUser.uid}/username`] = username;
        updates[`users/${currentUser.uid}/gameUid`] = gameUid;

        const registrationData = { joinedAt: serverTimestamp(), username: username, gameUid: gameUid, level: playerLevel };
        if (mode === 'Duo' || mode === 'Squad') {
            registrationData.teammateUsername = teammateUsername;
            registrationData.teammateGameUid = teammateGameUid;
            registrationData.teammateLevel = teammateLevel;
        }
        if (mode === 'Squad') {
            registrationData.player3Username = p3Username;
            registrationData.player3GameUid = p3GameUid;
            registrationData.player3Level = p3Level;
            registrationData.player4Username = p4Username;
            registrationData.player4GameUid = p4GameUid;
            registrationData.player4Level = p4Level;
        }
        updates[`tournaments/${tId}/registeredPlayers/${currentUser.uid}`] = registrationData;

        if (slotNumber) {
            updates[`tournaments/${tId}/slots/${slotNumber}`] = { uid: currentUser.uid, name: username };
        }

        await update(ref(db), updates);
        
        if (totalFee > 0) {
            await recordTransaction(currentUser.uid, 'tournament_join', -totalFee, `Joined: ${tData.name || 'Tournament'}`, { tournamentId: tId });
        }

        alert(`Joined successfully!${totalFee > 0 ? ` ₹${totalFee.toFixed(2)} deducted.` : ''}`);
        
        getModal('joinTournamentDetailsModal')?.hide();
        
        if (currentTournamentGameId) { 
            const activeTab = querySel('.tournament-tabs .tab-item.active')?.dataset.status || 'upcoming'; 
            filterTournaments(currentTournamentGameId, activeTab); 
        }
        
    } catch (e) {
        showStatusMessage(elements.joinTournamentStatusMessage, `${e.message}`, 'danger', false);
    } finally {
        btn.disabled = false; btn.innerHTML = 'Confirm & Join';
    }
}
        
async function loadAndDisplayNotifications() {
    if (!currentUser) return;
    const listEl = elements.notificationsListEl; const badgeEl = elements.notificationBadge; const emptyMsgEl = elements.notificationsEmptyMsgEl;
    listEl.innerHTML = ''; badgeEl.style.display = 'none'; emptyMsgEl.style.display = 'none';
    try {
        const globalNotifRef = ref(db, 'notifications'); const userNotifRef = ref(db, `users/${currentUser.uid}/notifications`);
        const [globalSnapshot, userSnapshot] = await Promise.all([ get(globalNotifRef), get(userNotifRef) ]);
        let allNotifications = [];
        if (globalSnapshot.exists()) allNotifications.push(...Object.values(globalSnapshot.val()));
        if (userSnapshot.exists()) allNotifications.push(...Object.values(userSnapshot.val()));
        if (allNotifications.length === 0) { emptyMsgEl.style.display = 'block'; return; }
        allNotifications.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        let unreadCount = 0; const lastChecked = userProfile.lastCheckedNotifications || 0; let notificationsHtml = '';
        allNotifications.forEach(notif => { const isUnread = notif.timestamp > lastChecked; if (isUnread) unreadCount++; notificationsHtml += createNotificationItemHTML(notif, isUnread); });
        listEl.innerHTML = notificationsHtml;
        if (unreadCount > 0) { badgeEl.textContent = unreadCount > 9 ? '9+' : unreadCount; badgeEl.style.display = 'flex'; }
    } catch (error) { listEl.innerHTML = '<p class="text-danger text-center">Could not load notifications.</p>'; }
}
        
function createNotificationItemHTML(notification, isUnread) {
    return `<div class="notification-item">${isUnread ? '<span class="unread-indicator"></span>' : ''}${notification.imageUrl ? `<img src="${notification.imageUrl}" class="notification-item-img" alt="Notification Image">` : ''}<div class="notification-item-content"><div class="notification-item-title">${notification.title || 'Notification'}</div><div class="notification-item-message">${notification.message || ''}</div><div class="notification-item-time">${formatDate(notification.timestamp)}</div></div></div>`;
}

async function markNotificationsAsRead() {
    if (!currentUser) return;
    try { await update(ref(db, `users/${currentUser.uid}`), { lastCheckedNotifications: serverTimestamp() }); elements.notificationBadge.style.display = 'none'; elements.notificationsListEl.querySelectorAll('.unread-indicator').forEach(indicator => indicator.remove()); } catch (error) {}
}

function openNotificationsModal() { if (!currentUser) return; getModal('notificationsModalEl')?.show(); markNotificationsAsRead(); }

function handleContactUs() {
    if (!currentUser) { alert("Please login to contact us."); return; }
    const contactNumber = appSettings.supportContact || '9389660753';
    const userName = userProfile.displayName || "a user";
    const message = `Hello Sir I Am ${userName} I need your help.`;
    const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
        
async function loadMatchHistory() {
    if (!currentUser) return;
    elements.matchHistoryBodyEl.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-accent"></div><p class="mt-2 text-secondary">Loading history...</p></div>';
    getModal('matchHistoryModal')?.show();
    try {
        const historyRef = ref(db, `users/${currentUser.uid}/matchHistory`);
        const snapshot = await get(historyRef);
        if (!snapshot.exists()) { elements.matchHistoryBodyEl.innerHTML = '<p class="text-center text-secondary p-4">You haven\'t played any matches yet.</p>'; return; }
        const historyData = snapshot.val();
        const sortedHistory = Object.values(historyData).sort((a,b) => (b.date || 0) - (a.date || 0));
        let historyHtml = '';
        sortedHistory.forEach(match => { historyHtml += `<div class="custom-card"><h5 class="tournament-card-title mb-2">${match.tournamentName || 'Tournament'}</h5><p class="small text-secondary mb-3">${formatFullDateTime(match.date)}</p><div class="d-flex justify-content-around text-center"><div><span class="text-secondary small d-block">Rank</span><strong class="h5">#${match.rank || 'N/A'}</strong></div><div><span class="text-secondary small d-block">Kills</span><strong class="h5">${match.kills ?? 'N/A'}</strong></div><div><span class="text-secondary small d-block">Winnings</span><strong class="h5 text-success">₹${(match.earnings || 0).toFixed(2)}</strong></div></div></div>`; });
        elements.matchHistoryBodyEl.innerHTML = historyHtml;
    } catch (error) { elements.matchHistoryBodyEl.innerHTML = `<p class="text-center text-danger p-4">Could not load match history. Error: ${error.message}</p>`; }
}

function openTournamentChat(tournamentId, tournamentName) {
    if (!currentUser) return;
    if (currentChatListener) { off(currentChatListener.ref, 'child_added', currentChatListener.func); currentChatListener = null; }
    elements.tournamentChatModalTitle.textContent = tournamentName;
    elements.chatForm.dataset.tournamentId = tournamentId;
    elements.chatMessagesEl.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-accent"></div></div>';
    getModal('tournamentChatModal')?.show();
    const chatRef = query(ref(db, `chats/${tournamentId}`), limitToLast(50));
    currentChatListener = {
         ref: chatRef,
         func: onChildAdded(chatRef, (snapshot) => {
            if (elements.chatMessagesEl.querySelector('.spinner-border')) elements.chatMessagesEl.innerHTML = '';
            const msg = snapshot.val(); if(msg) appendChatMessage(msg, true);
        }, { onlyOnce: false })
    };
}

function cancelReply(){ currentReply = null; elements.chatReplyContextEl.style.display = 'none'; }

function appendChatMessage(msg, prepend = false) {
    const isMyMessage = msg.uid === currentUser.uid;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isMyMessage ? 'my-message' : 'other-message'}`;
    bubble.dataset.senderName = msg.displayName; bubble.dataset.messageText = msg.message;
    let replyHtml = '';
    if (msg.replyTo) { replyHtml = `<div class="reply-quote-block"><span class="sender-name">${msg.replyTo.originalSenderName}</span><p>${msg.replyTo.originalMessage}</p></div>`; }
    bubble.innerHTML = `${replyHtml}${!isMyMessage ? `<span class="sender-name">${msg.displayName || 'User'}</span>` : ''}${msg.message}<span class="msg-time">${formatFullDateTime(msg.timestamp)}</span>`;
    if(prepend){ elements.chatMessagesEl.prepend(bubble); } else { elements.chatMessagesEl.appendChild(bubble); elements.chatMessagesEl.scrollTop = 0; }
}

async function handleChatSubmit(event) {
    event.preventDefault();
    const tournamentId = event.currentTarget.dataset.tournamentId;
    const messageText = elements.chatMessageInput.value.trim();
    if (!messageText || !tournamentId || !currentUser) return;
    if (!userProfile?.joinedTournaments?.[tournamentId]) { alert("You can only chat in tournaments you have joined."); return; }
    const messageData = { uid: currentUser.uid, displayName: userProfile.displayName, message: messageText, timestamp: serverTimestamp() };
    if (currentReply) messageData.replyTo = currentReply;
    try { await push(ref(db, `chats/${tournamentId}`), messageData); elements.chatMessageInput.value = ''; cancelReply(); } catch(error) { alert(`Could not send message.`); }
}

function openEditNameModal() {
    if (!currentUser) return;
    elements.editNameInput.value = userProfile.displayName || '';
    clearStatusMessage(elements.editNameStatusMessage);
    getModal('editNameModal')?.show();
}

async function saveNameChange() {
    const newName = elements.editNameInput.value.trim();
    if (!newName) { showStatusMessage(elements.editNameStatusMessage, "Name cannot be empty.", "warning"); return; }
    if (newName === userProfile.displayName) { getModal('editNameModal')?.hide(); return; }
    showLoader(true);
    try {
        await update(ref(db, `users/${currentUser.uid}`), { displayName: newName });
        userProfile.displayName = newName; populateUserInfo(currentUser, userProfile); getModal('editNameModal')?.hide();
    } catch (error) { showStatusMessage(elements.editNameStatusMessage, `Error: ${error.message}`, "danger", false); } finally { showLoader(false); }
}

// ====== NEW: SETUP IMAGE PREVIEW LOGIC ======
function setupImagePreview(boxId, inputId, previewId, overlayId) {
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const overlay = document.getElementById(overlayId);

    if(!box || !input) return;

    box.addEventListener('click', () => input.click());

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                overlay.style.display = 'block';
                box.querySelector('i').style.display = 'none';
                box.querySelector('span').style.display = 'none';
            }
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            overlay.style.display = 'none';
            box.querySelector('i').style.display = 'block';
            box.querySelector('span').style.display = 'block';
        }
    });
}
// ============================================

// ====== NEW: DAILY SPIN & WIN LOGIC ======
async function handleSpin() {
    if(!currentUser) return;
    const today = new Date().toLocaleDateString('en-IN');
    if(userProfile.lastSpinDate === today) {
        alert("You have already spun the wheel today. Come back tomorrow!");
        return;
    }
    
    // Fetch probabilities from Firebase
    const snap = await get(ref(db, 'settings/appControl/spinProbabilities'));
    let probs = { zero: 70, one: 20, two: 10, five: 0 };
    if(snap.exists()) probs = snap.val();
    
    const rand = Math.random() * 100;
    let prize = 0;
    let targetSlices = []; 
    
    if(rand < probs.zero) {
        prize = 0; targetSlices = [0, 2, 4, 6]; 
    } else if (rand < probs.zero + probs.one) {
        prize = 1; targetSlices = [1, 5];
    } else if (rand < probs.zero + probs.one + probs.two) {
        prize = 2; targetSlices = [3];
    } else {
        prize = 5; targetSlices = [7];
    }
    
    const finalSlice = targetSlices[Math.floor(Math.random() * targetSlices.length)];
    
    // Calculate rotation logic
    const randomOffset = Math.floor(Math.random() * 30) + 7; 
    const targetDegree = 1800 + (360 - (finalSlice * 45)) - randomOffset;
    
    const wheel = elements.spinWheelEl;
    const btn = elements.spinActionBtn;
    const statusMsg = elements.spinStatusMsg;
    
    btn.disabled = true;
    statusMsg.textContent = "Spinning...";
    statusMsg.className = "mt-5 mb-0 fw-bold text-secondary";
    
    wheel.style.transform = `rotate(${targetDegree}deg)`;
    
    // After 4 seconds (animation duration)
    setTimeout(async () => {
        wheel.style.transition = 'none';
        const actualDeg = targetDegree % 360;
        wheel.style.transform = `rotate(${actualDeg}deg)`; 
        setTimeout(() => wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)', 50);
        
        if(prize > 0) {
            statusMsg.textContent = `🎉 Congratulations! You won ₹${prize} Bonus! 🎉`;
            statusMsg.className = "mt-5 mb-0 fw-bold text-success";
            
            const newBonus = (userProfile.bonusCash || 0) + prize;
            const newBal = (userProfile.depositBalance||0) + (userProfile.winningCash||0) + newBonus;
            
            await update(ref(db, `users/${currentUser.uid}`), {
                bonusCash: newBonus,
                balance: newBal,
                lastSpinDate: today
            });
            
            await recordTransaction(currentUser.uid, 'spin_bonus', prize, `Daily Spin Won`, { status: 'completed' });
            userProfile.lastSpinDate = today;
            userProfile.bonusCash = newBonus;
            
            alert(`Congratulations! You won ₹${prize} Bonus Cash!`);
        } else {
            statusMsg.textContent = "Oh no! Better Luck Next Time.";
            statusMsg.className = "mt-5 mb-0 fw-bold text-danger";
            await update(ref(db, `users/${currentUser.uid}`), { lastSpinDate: today });
            userProfile.lastSpinDate = today;
            alert("Oh no! Better luck next time.");
        }
        
        btn.textContent = "SPUN";
        
    }, 4000);
}
// =========================================

function initializeEventListeners() {
    if (!elements) return; console.log("Initializing listeners...");
    
    // SETUP THE IMAGE PREVIEW BOXES
    setupImagePreview('rechargeUploadBox', 'rechargeScreenshotInput', 'rechargePreviewImg', 'rechargeChangeOverlay');
    setupImagePreview('resultUploadBox', 'resultScreenshotInput', 'resultPreviewImg', 'resultChangeOverlay');
    
    // BIND SPIN BUTTON
    if(elements.spinActionBtn) elements.spinActionBtn.addEventListener('click', handleSpin);

    // ====== FIXED MODULE SCOPE EVENT BINDINGS FOR BUTTONS ======
    elements.spinBannerBtn?.addEventListener('click', () => window.showSection('spin-section', 'home-section'));
    elements.forceUpdateBtn?.addEventListener('click', () => { if(appSettings.updateUrl) window.open(appSettings.updateUrl, '_blank'); });
    // ============================================================

    // NAYA TASK BUTTON CLICK LOGIC (Fixed ID)
    const openTaskEarnBtnFixed = document.getElementById('openTaskEarnBtnFixed');
    if(openTaskEarnBtnFixed) {
        openTaskEarnBtnFixed.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) { alert("Please login first!"); return; }
            window.showSection('task-earn-section', 'profile-section');
        });
    }

    elements.bottomNavItems?.forEach(item => item.addEventListener('click', (e) => { e.preventDefault(); window.showSection(item.dataset.section); }));
    elements.headerBackBtn?.addEventListener('click', () => window.showSection('home-section'));
    elements.tournamentTabs?.forEach(tab => tab.addEventListener('click', (e) => { const s = e.currentTarget.dataset.status; if (currentTournamentGameId && s) { elements.tournamentTabs.forEach(t => t.classList.remove('active')); e.currentTarget.classList.add('active'); filterTournaments(currentTournamentGameId, s); } }));
    elements.loginEmailBtn?.addEventListener('click', loginWithEmail);
    // FIX: signUpWithEmail listener removed — Mega Chain setTimeout block handles signup with 3-level referral logic
    elements.showSignupToggleBtn?.addEventListener('click', () => toggleLoginForm(false));
    elements.showLoginToggleBtn?.addEventListener('click', () => toggleLoginForm(true));
    elements.forgotPasswordLink?.addEventListener('click', (e) => { e.preventDefault(); resetPassword(); });
    elements.logoutProfileBtn?.addEventListener('click', logoutUser);
    elements.policyLinks?.forEach(link => link.addEventListener('click', handlePolicyClick));
    elements.withdrawBtn?.addEventListener('click', handleWithdrawClick);
    elements.addAmountWalletBtn?.addEventListener('click', startRechargeFlow);
    elements.submitWithdrawRequestBtn?.addEventListener('click', submitWithdrawRequestHandler);
    elements.rechargePresetBtns.forEach(btn => { btn.addEventListener('click', () => { elements.rechargeAmountInput.value = btn.dataset.amount; }); });
    elements.goToStep2Btn?.addEventListener('click', handleGoToStep2);
    elements.goToStep3Btn?.addEventListener('click', handleGoToStep3);
    elements.paymentOptionCards.forEach(card => { card.addEventListener('click', () => { elements.paymentOptionCards.forEach(c => c.classList.remove('selected')); card.classList.add('selected'); card.querySelector('input[type="radio"]').checked = true; }); });
    elements.rechargeSubmitBtn?.addEventListener('click', submitDepositRequest);
    elements.rechargeCancelBtn?.addEventListener('click', () => window.showSection('wallet-section'));
    elements.rechargeCopyAmtBtn?.addEventListener('click', () => copyToClipboard(currentRechargeData.amount.toString(), true));
    elements.rechargeCopyUpiBtn?.addEventListener('click', () => copyToClipboard(currentRechargeData.upiId, true));
    elements.contactUsBtn?.addEventListener('click', handleContactUs);
    elements.allTransactionsBtn?.addEventListener('click', () => { window.showSection('earnings-section'); });
    elements.viewEarningsHistoryBtn?.addEventListener('click', () => window.showSection('wallet-section'));
    elements.notificationBtn?.addEventListener('click', openNotificationsModal);
    elements.editNameBtnEl?.addEventListener('click', openEditNameModal);
    elements.saveNameChangeBtn?.addEventListener('click', saveNameChange);
    elements.matchHistoryBtn?.addEventListener('click', loadMatchHistory);
    elements.chatForm?.addEventListener('submit', handleChatSubmit);
    elements.cancelReplyBtn?.addEventListener('click', cancelReply);

    // ====== BUG FIX: SAFE MODAL CLOSE AND PASSING BUTTON ELEMENT ======
    elements.proceedToDetailsBtn?.addEventListener('click', () => {
        let slotModalInst = getModal('slotModal');
        if(slotModalInst) slotModalInst.hide();
        
        // BUG FIX: Wait 400ms for slot modal to close properly before opening join form to prevent UI freeze
        setTimeout(() => {
            if (currentJoinBtnElement) {
                handleJoinTournamentClick(currentJoinBtnElement);
            }
        }, 400);
    });

    // FIX: Prevent Form Submit Refresh
    const joinForm = document.getElementById('joinTournamentForm');
    if(joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ye line form submit hone se (page refresh hone se) rokegi
            confirmAndJoinTournament();
        });
    }
    
    // Agar button click se karna chahein toh usme bhi prevent default
    elements.confirmJoinBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        confirmAndJoinTournament();
    });
    // =================================================================

    elements.chatMessagesEl.addEventListener('click', (e) => {
        const bubble = e.target.closest('.chat-bubble'); if(!bubble) return;
        const sender = bubble.dataset.senderName; let message = bubble.dataset.messageText;
        if (message.length > 50) message = message.substring(0, 50) + '...';
        currentReply = { originalSenderName: sender, originalMessage: message };
        elements.replyToNameEl.textContent = sender; elements.replyToMessageEl.textContent = message; elements.chatReplyContextEl.style.display = 'block';
    });
    
    getElement('tournamentChatModal')?.addEventListener('hidden.bs.modal', () => {
        if (currentChatListener && currentChatListener.ref) { off(currentChatListener.ref, 'child_added', currentChatListener.func); currentChatListener = null; }
        cancelReply(); 
    });

    // 👇 DAILY TASKS (GPLINKS) LOGIC START 👇
    const loadTasksBtn = document.getElementById('openTaskEarnBtnFixed');
    if (loadTasksBtn) {
        loadTasksBtn.addEventListener('click', async () => {
            const taskContainer = document.getElementById('taskListContainer');
            const taskActiveUI = document.getElementById('taskActiveUI');
            const taskExecArea = document.getElementById('taskExecutionArea');
            const taskComingSoon = document.getElementById('taskComingSoon');
            
            // Pehle check karo ki Admin ne system ON rakha hai ya OFF
            try {
                const switchSnap = await get(ref(db, 'settings/taskSystem'));
                const isSystemActive = switchSnap.exists() ? switchSnap.val().isActive : true;

                if (isSystemActive === false) {
                    // Agar OFF hai toh button dabane par "Coming Soon" ka ghoomne wala gear dikhao
                    taskActiveUI.style.display = 'block';
                    taskExecArea.style.display = 'none';
                    
                    // Andar ka saara active maal chhupao aur Coming Soon gear on karo
                    document.getElementById('convertCoinsBtn').parentElement.style.display = 'none';
                    document.getElementById('taskMainAlert').style.display = 'none';
                    taskContainer.style.display = 'none';
                    if(taskComingSoon) taskComingSoon.style.display = 'block';
                    return;
                }

                // Agar ON hai toh normal wapas sab chalu karo aur tasks load karo
                if(taskComingSoon) taskComingSoon.style.display = 'none';
                document.getElementById('convertCoinsBtn').parentElement.style.display = 'block';
                document.getElementById('taskMainAlert').style.display = 'block';
                taskContainer.style.display = 'block';
                taskActiveUI.style.display = 'block';
                taskExecArea.style.display = 'none';

                taskContainer.classList.remove('placeholder-glow');
                taskContainer.innerHTML = '<div class="text-center p-4 text-warning"><div class="spinner-border spinner-border-sm mb-2"></div><br>Loading Tasks...</div>';
                
                const snapshot = await get(ref(db, 'tasks'));
                
                if (!snapshot.exists()) {
                    taskContainer.innerHTML = '<div class="custom-card border-warning bg-dark text-center p-4"><h5 class="text-warning fw-bold mb-0"><i class="bi bi-exclamation-circle-fill"></i> No Tasks Available Right Now.</h5><p class="small text-light mt-2">Check back later for new tasks!</p></div>';
                    return;
                }
                
                let html = '';
                snapshot.forEach(child => {
                    const t = child.val();
                    const tid = child.key;
                    
                    const today = new Date().toLocaleDateString('en-IN');
                    const isCompleted = userProfile?.completedTasks?.[tid] === today;

                    if (t.status === 'active' && !isCompleted) {
                        const safeTitle = t.title ? t.title.replace(/'/g, "&apos;") : 'Task';
                        const safeUrl = t.url ? t.url.replace(/'/g, "&apos;") : '';
                        const safeCode = t.secretCode ? t.secretCode.replace(/'/g, "&apos;") : '';
                        
                        html += `<div class="d-flex justify-content-between align-items-center p-3 mb-2 rounded bg-dark border border-secondary">
                            <div class="text-start">
                                <h6 class="mb-1 text-white"><i class="bi bi-link-45deg text-info"></i> ${safeTitle}</h6>
                                <span class="small text-warning"><i class="bi bi-coin"></i> +${t.rewardCoins || 0} Coins</span>
                            </div>
                            <button class="btn btn-sm btn-custom-accent px-3 fw-bold start-task-btn" 
                                data-tid="${tid}" 
                                data-title="${safeTitle}" 
                                data-link="${safeUrl}" 
                                data-reward="${t.rewardCoins || 0}"
                                data-code="${safeCode}">Start</button>
                        </div>`;
                    }
                });
                
                if (html === '') {
                    taskContainer.innerHTML = '<div class="custom-card border-success bg-dark text-center p-4"><h5 class="text-success fw-bold mb-0"><i class="bi bi-check-circle-fill"></i> All Tasks Completed!</h5><p class="small text-light mt-2">Awesome! You have done all tasks for today.</p></div>';
                } else {
                    taskContainer.innerHTML = html;
                }
            } catch(err) {
                taskContainer.innerHTML = `<div class="text-center p-4 text-danger">Error: ${err.message}</div>`;
            }
        });
    }

    let taskTimerInterval;
    document.body.addEventListener('click', (e) => {
        // 1. "Start" button pe click (Timer dabba kholo)
        if (e.target.closest('.start-task-btn')) {
            const btn = e.target.closest('.start-task-btn');
            document.getElementById('taskActiveUI').style.display = 'none';
            document.getElementById('taskExecutionArea').style.display = 'block';
            
            document.getElementById('execTaskTitle').textContent = btn.getAttribute('data-title');
            document.getElementById('execTaskReward').textContent = btn.getAttribute('data-reward');
            
            // Mod Menu: Generate Unique Token (UID ke pehle 4 akshar)
            const userToken = currentUser.uid.substring(0, 4).toUpperCase();
            document.getElementById('userTaskTokenDisplay').textContent = userToken;
            
            // Reset execution area
            document.getElementById('timerBoxContainer').style.opacity = '0.5';
            document.getElementById('taskTimerDisplay').textContent = "02:00";
            document.getElementById('codeInputContainer').style.display = 'none';
            document.getElementById('finalTaskSecretCode').value = '';
            
            const baseLink = btn.getAttribute('data-link');
            const adminCode = btn.getAttribute('data-code');
            
            const openLinkBtn = document.getElementById('openTaskLinkBtn');
            // Generator ko URL ke zarie Admin Code bhejenge
            openLinkBtn.dataset.link = baseLink.includes('?') ? baseLink + `&base=${adminCode}` : baseLink + `?base=${adminCode}`; 
            openLinkBtn.dataset.code = adminCode;
            openLinkBtn.dataset.reward = btn.getAttribute('data-reward');
            openLinkBtn.dataset.tid = btn.getAttribute('data-tid');
            openLinkBtn.disabled = false;
            openLinkBtn.innerHTML = '<i class="bi bi-box-arrow-up-right me-2"></i> OPEN LINK & FIND CODE';
        }
        
        // 2. "Open Link" button pe click (Timer Start karo)
        if (e.target.closest('#openTaskLinkBtn')) {
            const btn = e.target.closest('#openTaskLinkBtn');
            const link = btn.dataset.link;
            if(link) {
            if (typeof AndroidInterface !== 'undefined') {
                AndroidInterface.showAd();
            } else {
                window.open(link, '_blank');
            }
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Timer Running...';
            
            document.getElementById('timerBoxContainer').style.opacity = '1';
            
            let timeLeft = 120; // 2 minutes = 120 seconds
            const timerDisplay = document.getElementById('taskTimerDisplay');
            
            if (window.taskTimerInterval) clearInterval(window.taskTimerInterval);
            window.taskTimerInterval = setInterval(() => {
                timeLeft--;
                let m = Math.floor(timeLeft / 60);
                let s = timeLeft % 60;
                timerDisplay.textContent = `0${m}:${s < 10 ? '0'+s : s}`;
                
                if (timeLeft <= 0) {
                    clearInterval(window.taskTimerInterval);
                    timerDisplay.textContent = "00:00";
                    timerDisplay.classList.remove('text-warning');
                    timerDisplay.classList.add('text-success');
                    document.getElementById('codeInputContainer').style.display = 'block';
                }
            }, 1000);
        }
        
        // 3. Cancel Task Button
        if (e.target.closest('#cancelTaskExecutionBtn') || e.target.closest('#closeTaskSectionBtn')) {
            clearInterval(window.taskTimerInterval);
            document.getElementById('taskActiveUI').style.display = 'block';
            document.getElementById('taskExecutionArea').style.display = 'none';
        }
        
        // 4. VERIFY & CLAIM Button
        if (e.target.closest('#verifyTaskCodeBtn')) {
            const inputCode = document.getElementById('finalTaskSecretCode').value.trim().toUpperCase();
            const linkBtn = document.getElementById('openTaskLinkBtn');
            const adminCode = linkBtn.dataset.code.toUpperCase();
            const reward = parseInt(linkBtn.dataset.reward);
            const tid = linkBtn.dataset.tid;
            
            if (inputCode === '') { alert("Please enter the Secret Code!"); return; }
            
            const dateObj = new Date();
            const dateStr = dateObj.getDate().toString(); 
            const userToken = currentUser.uid.substring(0, 4).toUpperCase(); 
            
            const dynamicRealCode = adminCode + dateStr + userToken;
            
            if (inputCode === dynamicRealCode) {
                const verifyBtn = e.target.closest('#verifyTaskCodeBtn');
                verifyBtn.disabled = true;
                verifyBtn.innerHTML = "Claiming...";
                
                const today = new Date().toLocaleDateString('en-IN');
                const newCoins = (userProfile.coinsBalance || 0) + reward;
                
                const updates = {};
                updates[`users/${currentUser.uid}/coinsBalance`] = newCoins;
                updates[`users/${currentUser.uid}/completedTasks/${tid}`] = today;
                
                update(ref(db), updates).then(() => {
                    alert(`Success! You got +${reward} Coins.`);
                    localStorage.removeItem('activeTaskGameZ');

                    // 🔥 STRICT GLOBAL COOLDOWN TIMER SYSTEM 🔥
                    const cooldownTime = 6 * 60 * 1000; 
                    const cooldownEndTime = Date.now() + cooldownTime;
                    localStorage.setItem('globalTaskCooldownEndTime', cooldownEndTime);

                    window.startGlobalCooldown = function(endTime) {
                        const cooldownUI = document.getElementById('globalTaskCooldownUI');
                        const listContainer = document.getElementById('taskListContainer');
                        const timerDisplay = document.getElementById('globalTaskCooldownUI_timer');

                        if(cooldownUI) cooldownUI.style.display = 'block';
                        if(listContainer) listContainer.style.display = 'none';

                        if(window.globalCooldownInterval) clearInterval(window.globalCooldownInterval);

                        window.globalCooldownInterval = setInterval(() => {
                            const now = Date.now();
                            const diff = endTime - now;

                            // Layout strict locking parameters
                            if(cooldownUI && cooldownUI.style.display !== 'block') cooldownUI.style.display = 'block';
                            if(listContainer && listContainer.style.display !== 'none') listContainer.style.display = 'none';

                            if (diff <= 0) {
                                clearInterval(window.globalCooldownInterval);
                                if(cooldownUI) cooldownUI.style.display = 'none';
                                if(listContainer) {
                                    listContainer.style.display = 'block';
                                    const loadTaskBtn = document.getElementById('openTaskEarnBtnFixed');
                                    if (loadTaskBtn) loadTaskBtn.click();
                                }
                                localStorage.removeItem('globalTaskCooldownEndTime');
                            } else {
                                const minutes = Math.floor(diff / 60000);
                                const seconds = Math.floor((diff % 60000) / 1000);
                                if(timerDisplay) {
                                    timerDisplay.textContent = `0${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
                                }
                            }
                        }, 1000);
                    };

                    window.startGlobalCooldown(cooldownEndTime);

                    document.getElementById('taskActiveUI').style.display = 'block';
                    document.getElementById('taskExecutionArea').style.display = 'none';
                    document.getElementById('userCoinsDisplay').textContent = newCoins;

                    const openTaskBtn = document.getElementById('openTaskEarnBtnFixed');
                    if (openTaskBtn) {
                        openTaskBtn.click(); 
                    }

                }).catch(err => {
                    alert("Error claiming reward: " + err.message);
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = "VERIFY & CLAIM REWARD";
                });
                
            } else {
                alert("Incorrect Secret Code! Pura link open karke dhyan se code lao.");
            }
        }
        
        // 5. Convert Coins to Bonus Cash (1000 Tokens = 1 Rupee Fixed)
        if (e.target.closest('#convertCoinsBtn')) {
            const coins = userProfile.coinsBalance || 0;
            
            if (coins < 5000) {
                alert(`You need at least 5000 Tokens to convert. You have ${coins} Tokens. (5000 Tokens = ₹5)`);
                return;
            }
            
            if (confirm(`Convert ${coins} Tokens to Bonus Cash? (1000 Tokens = ₹1)`)) {
                const bonusToAdd = Math.floor(coins / 1000);
                const remainingCoins = coins % 1000;
                const newBonus = (userProfile.bonusCash || 0) + bonusToAdd;
                const newBal = (userProfile.depositBalance||0) + (userProfile.winningCash||0) + newBonus;
                
                const convertBtn = e.target.closest('#convertCoinsBtn');
                convertBtn.disabled = true;
                convertBtn.textContent = "Converting...";

                const updates = {};
                updates[`users/${currentUser.uid}/coinsBalance`] = remainingCoins;
                updates[`users/${currentUser.uid}/bonusCash`] = newBonus;
                updates[`users/${currentUser.uid}/balance`] = newBal;
                
                update(ref(db), updates).then(() => {
                    alert(`Success! Converted to ₹${bonusToAdd} Bonus Cash.`);
                    document.getElementById('userCoinsDisplay').textContent = remainingCoins;
                    
                    const txRef = ref(db, `transactions/${currentUser.uid}`);
                    push(txRef, {
                        type: 'coins_converted',
                        amount: bonusToAdd,
                        description: `Converted ${coins - remainingCoins} Coins`,
                        timestamp: serverTimestamp(),
                        status: 'completed'
                    });

                    convertBtn.disabled = false;
                    convertBtn.textContent = "Convert to Bonus Cash";
                }).catch(err => {
                    alert("Error converting coins: " + err.message);
                    convertBtn.disabled = false;
                    convertBtn.textContent = "Convert to Bonus Cash";
                });
            }
        }
    }); 

    // RESULT UPLOAD LOGIC WITH IMGBB
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.btn-upload-result')) {
            const btn = e.target.closest('.btn-upload-result');
            getElement('uploadResultTid').value = btn.dataset.tournamentId;
            
            // Clear previous form & preview
            getElement('resultKillsInput').value = '';
            getElement('resultRankInput').value = '';
            getElement('resultScreenshotInput').value = '';
            const resultPreview = getElement('resultPreviewImg');
            if(resultPreview) { resultPreview.src=''; resultPreview.style.display='none'; }
            const resultOverlay = getElement('resultChangeOverlay');
            if(resultOverlay) resultOverlay.style.display='none';
            const resultBoxI = getElement('resultUploadBox')?.querySelector('i');
            const resultBoxSpan = getElement('resultUploadBox')?.querySelector('span');
            if(resultBoxI) resultBoxI.style.display = 'block';
            if(resultBoxSpan) resultBoxSpan.style.display = 'block';

            getModal('uploadResultModal')?.show();
        }
    });

    getElement('submitResultBtn')?.addEventListener('click', async () => {
        const tId = getElement('uploadResultTid').value;
        const kills = getElement('resultKillsInput').value;
        const rank = getElement('resultRankInput').value;
        const file = getElement('resultScreenshotInput').files[0];
        const statusEl = getElement('uploadResultStatus');

        if (!kills || !rank || !file) { alert("Please fill all details and select a screenshot."); return; }

        showLoader(true);
        
        try {
            const url = await uploadImageToImgBBUser(file, statusEl);

            await set(ref(db, `matchResults/${tId}/${currentUser.uid}`), {
                kills: parseInt(kills),
                rank: parseInt(rank),
                screenshot: url,
                uEmail: currentUser.email,
                timestamp: serverTimestamp()
            });

            alert("Result uploaded successfully! Admin will verify it.");
            getModal('uploadResultModal')?.hide();
        } catch (err) { 
            alert("Upload failed: " + err.message); 
        } finally { 
            showLoader(false); statusEl.style.display = 'none'; 
        }
    });

    document.body.addEventListener('click', (event) => { 
        if (event.target.matches('.copy-btn') || event.target.closest('.copy-btn')) { 
            const btn = event.target.closest('.copy-btn'); 
            const targetSelector = btn.dataset.target; 
            if (targetSelector) { copyToClipboard(targetSelector); } 
        } 
        if (event.target.matches('#shareReferralBtn') || event.target.closest('#shareReferralBtn')) { 
            const cel = getElement('referralCodeDisplay'); 
            if (cel) shareReferral(cel.textContent); 
        } 
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initializeApp !== 'function' || !auth || !db) return;
    showLoader(true);
    loadAppSettings().then(() => { 
        initializeEventListeners(); 
        updateGlobalUI(false); 
        onAuthStateChanged(auth, handleAuthStateChange);
        initializeAudio();
    }).catch(err => { 
        initializeEventListeners(); 
        updateGlobalUI(false); 
        onAuthStateChanged(auth, handleAuthStateChange);
        initializeAudio();
    });

    // 🔥 TIMER RECOVERY SYSTEM 🔥
    const checkSavedCooldown = localStorage.getItem('globalTaskCooldownEndTime');
    if (checkSavedCooldown && Date.now() < parseInt(checkSavedCooldown)) {
        setTimeout(() => {
            if (typeof window.startGlobalCooldown === 'function') {
                window.startGlobalCooldown(parseInt(checkSavedCooldown));
            }
        }, 1200);
    }
});

// ==========================================
// 4. SMART BACK BUTTON NAVIGATION 
// ==========================================
(function() {
    window.appHistoryStack = ['home-section'];

    const originalShowSection = window.showSection;
    window.showSection = function(sectionId, backSection = null) {
        if (sectionId === 'home-section') {
            window.appHistoryStack = ['home-section'];
        } else if (window.appHistoryStack[window.appHistoryStack.length - 1] !== sectionId) {
            window.appHistoryStack.push(sectionId);
        }
        history.pushState({ section: sectionId }, "");
        originalShowSection(sectionId, backSection);
    };

    window.addEventListener('load', () => {
        history.replaceState({ section: 'home-section' }, "");
    });

    window.addEventListener('popstate', (e) => {
        // A. Agar Modal/Popup khula hai toh band karo
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            history.pushState(null, ""); 
            const modalInst = bootstrap.Modal.getInstance(openModal);
            if (modalInst) modalInst.hide();
            return;
        }

        // B. Agar Task Area khula hai toh usko band karo
        const taskArea = document.getElementById('taskExecutionArea');
        if (taskArea && taskArea.style.display === 'block') {
            history.pushState(null, "");
            document.getElementById('taskActiveUI').style.display = 'block';
            taskArea.style.display = 'none';
            localStorage.removeItem('activeTaskGameZ');
            if(window.taskTimerInterval) clearInterval(window.taskTimerInterval);
            return;
        }

        // C. Ek Step Peeche Jao
        window.appHistoryStack.pop();
        if (window.appHistoryStack.length > 0) {
            const prevPage = window.appHistoryStack[window.appHistoryStack.length - 1];
            originalShowSection(prevPage);
            
            // Bottom Nav highlight fix
            document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.section === prevPage);
            });
            history.pushState(null, ""); 
        } else {
            // D. Exit App Logic (Home Page par)
            window.appHistoryStack = ['home-section'];
            if (!document.getElementById('exitToastEl')) {
                history.pushState(null, "");
                const toast = document.createElement('div');
                toast.id = 'exitToastEl';
                toast.innerText = 'Press back again to exit';
                toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#FACC15;border:1px solid #FACC15;padding:10px 20px;border-radius:20px;z-index:99999;font-size:14px;font-weight:bold;box-shadow:0px 0px 10px rgba(250, 204, 21, 0.5);';
                document.body.appendChild(toast);
                setTimeout(() => { if(document.getElementById('exitToastEl')) document.getElementById('exitToastEl').remove(); }, 2000);
            } else {
                window.history.back(); // Asli Exit (Android Studio ise pakad lega)
            }
        }
    });

    // 2. TASK AUTO-RECOVERY (Agar app browser se aane pe reload ho jaye)
    document.body.addEventListener('click', (e) => {
        const openBtn = e.target.closest('#openTaskLinkBtn');
        if (openBtn && !openBtn.disabled) {
            localStorage.setItem('activeTaskGameZ', JSON.stringify({
                tid: openBtn.dataset.tid,
                reward: openBtn.dataset.reward,
                code: openBtn.dataset.code,
                title: document.getElementById('execTaskTitle').innerText,
                endTime: Date.now() + (120 * 1000) // 2 minutes
            }));
        }
        
        if (e.target.closest('#cancelTaskExecutionBtn') || e.target.closest('#closeTaskSectionBtn') || e.target.closest('#verifyTaskCodeBtn')) {
            localStorage.removeItem('activeTaskGameZ');
        }
    });

    window.addEventListener('load', () => {
        const savedTask = localStorage.getItem('activeTaskGameZ');
        if (savedTask) {
            // Splash Screen hatao, direct Task dikhao
            const splash = document.getElementById('splashScreen'); 
            const mainApp = document.getElementById('mainApp'); 
            if(splash) splash.style.display = 'none';
            if(mainApp) mainApp.style.display = 'block';

            setTimeout(() => {
                try {
                    const taskData = JSON.parse(savedTask);
                    const now = Date.now();
                    
                    window.showSection('task-earn-section');
                    document.getElementById('taskActiveUI').style.display = 'none';
                    document.getElementById('taskExecutionArea').style.display = 'block';
                    document.getElementById('execTaskTitle').textContent = taskData.title;
                    document.getElementById('execTaskReward').textContent = taskData.reward;
                    document.getElementById('timerBoxContainer').style.opacity = '1';
                    
                    const checkUserInt = setInterval(() => {
                        if (window.currentUser) {
                            clearInterval(checkUserInt);
                            document.getElementById('userTaskTokenDisplay').textContent = window.currentUser.uid.substring(0, 4).toUpperCase();
                        }
                    }, 500);
                    
                    const btn = document.getElementById('openTaskLinkBtn');
                    btn.dataset.tid = taskData.tid;
                    btn.dataset.reward = taskData.reward;
                    btn.dataset.code = taskData.code;
                    btn.disabled = true;

                    if (taskData.endTime > now) {
                        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Timer Running...';
                        let timeLeft = Math.floor((taskData.endTime - now) / 1000);
                        const timerDisplay = document.getElementById('taskTimerDisplay');
                        
                        if (window.taskTimerInterval) clearInterval(window.taskTimerInterval);
                        window.taskTimerInterval = setInterval(() => {
                            timeLeft--;
                            let m = Math.floor(timeLeft / 60);
                            let s = timeLeft % 60;
                            timerDisplay.textContent = `0${m}:${s < 10 ? '0'+s : s}`;
                            if (timeLeft <= 0) {
                                clearInterval(window.taskTimerInterval);
                                timerDisplay.textContent = "00:00";
                                timerDisplay.classList.remove('text-warning');
                                timerDisplay.classList.add('text-success');
                                document.getElementById('codeInputContainer').style.display = 'block';
                            }
                        }, 1000);
                    } else {
                        btn.innerHTML = '<i class="bi bi-check-circle"></i> Timer Finished';
                        const timerDisplay = document.getElementById('taskTimerDisplay');
                        timerDisplay.textContent = "00:00";
                        timerDisplay.classList.remove('text-warning');
                        timerDisplay.classList.add('text-success');
                        document.getElementById('codeInputContainer').style.display = 'block';
                    }
                } catch(err) { localStorage.removeItem('activeTaskGameZ'); }
            }, 800);
        }
    });
})();
