import { animate, inView } from 'https://esm.run/framer-motion';

// CONFIGURATION: Replace with actual PEAK token mint address
// Current address is example - get the real PEAK token mint from your token deployment
const PEAK_TOKEN_MINT = '7bAFtXqcaBagSDTE3AXvnVXFxEjiXCnwNBLqRWjNpump'; // UPDATE THIS!

// Demo mode: DISABLED - only real API checks
const DEMO_MODE = false; // Real API only

// Network configuration - set to 'mainnet' for production tokens
const NETWORK = 'mainnet'; // 'mainnet' or 'devnet'

// SolScan API Configuration
const SOLSCAN_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTc1ODAzMTkwMzUsImVtYWlsIjoic2V0c2tlbkBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTc1ODAzMTl9.q2xSiv0w5vU50fbU_9IDSYdlQ4p8F9sCmUrAekx4UpI';

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем иконки с проверкой загрузки
    initIcons();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initMouseTracker();
    initPhaseAnimations();
    initLanguageSwitcher(); // Добавляем переключатель языков
    initWalletConnection(); // Добавляем подключение кошелька
});

function initIcons() {
    try {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
            console.log('Lucide icons загружены успешно');
            
            // Принудительно делаем иконки ракеты белыми в кнопках
            applyWhiteRocketIcons();
        } else {
            console.warn('Lucide icons не загрузились, используем fallback');
            // Fallback иконки уже в CSS
        }
    } catch (error) {
        console.warn('Ошибка при загрузке Lucide icons:', error);
    }
    
    // Повторная попытка через 1 секунду если не загрузились
    setTimeout(() => {
        try {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
                applyWhiteRocketIcons();
            }
        } catch (e) {
            console.log('Повторная попытка загрузки иконок не удалась, используем emoji fallback');
        }
    }, 1000);
}

function applyWhiteRocketIcons() {
    // Находим все иконки ракеты в кнопках
    const rocketIcons = document.querySelectorAll('.btn-primary [data-lucide="rocket"]');
    rocketIcons.forEach(icon => {
        const svg = icon.querySelector('svg');
        if (svg) {
            svg.style.color = 'white';
            svg.style.fill = 'none';  // Убираем заливку
            svg.style.stroke = 'white';
            svg.style.strokeWidth = '2';
            
            // Также применяем стили ко всем path элементам внутри SVG
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
                path.style.fill = 'none';  // Убираем заливку у path
                path.style.stroke = 'white';
                path.style.strokeWidth = '2';
            });
        }
        
        // Также применяем стили к самому элементу
        icon.style.color = 'white';
    });
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuButton.querySelector('i');

    if (!menuButton || !mobileMenu) return;
    
    const navLinks = mobileMenu.querySelectorAll('a');

    menuButton.addEventListener('click', () => {
        const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.setAttribute('data-lucide', 'menu');
        } else {
            menuIcon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^=\"#\"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => {
        inView(section, () => {
            section.classList.add('in-view');
        }, {
            margin: "-100px 0px"
        });
    });
}

function initParallaxEffects() {
    // Параллакс отключен для устранения рывков при скролле
    // Фоновое изображение теперь статично
    return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.bg-cover');
        
        parallax.forEach(element => {
            const speed = 0.3; // Уменьшаем скорость для более плавного эффекта
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        inView(stat, () => {
            const finalValue = stat.textContent;
            const isNumeric = /^\d+/.test(finalValue);
            
            if (isNumeric) {
                const numValue = parseInt(finalValue.replace(/\D/g, ''));
                animateCounter(stat, 0, numValue, finalValue.replace(/\d+/, ''));
            }
        });
    });
}

function animateCounter(element, start, end, suffix) {
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 16));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        if (end >= 1000000000) {
            element.textContent = (current / 1000000000).toFixed(0) + 'B' + suffix;
        } else if (end >= 1000000) {
            element.textContent = (current / 1000000).toFixed(0) + 'M' + suffix;
        } else {
            element.textContent = current + suffix;
        }
    }, 16);
}

function initMouseTracker() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const moveX = (x / rect.width - 0.5) * 20;
        const moveY = (y / rect.height - 0.5) * 20;
        
        const parallaxElements = hero.querySelectorAll('.absolute');
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
}

function initPhaseAnimations() {
    const phases = document.querySelectorAll('.roadmap-phase-container');
    
    phases.forEach((phase, index) => {
        inView(phase, () => {
            setTimeout(() => {
                phase.style.opacity = '1';
                phase.style.animation = index % 2 === 0 ? 'slideInPhase 0.8s ease-out forwards' : 'slideInPhaseRight 0.8s ease-out forwards';
            }, index * 200);
        }, {
            margin: "-50px 0px"
        });
    });
}

// Language Switching Functionality
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'en'; // Default language is English
    
    // Set default language on page load
    switchLanguage(currentLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                switchLanguage(lang);
                updateActiveButton(lang);
            }
        });
    });
    
    function switchLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-ru]');
        
    elements.forEach(element => {
            const text = element.dataset[lang];
            if (!text) return;

            // Detect whether the localized string contains HTML tags;
            // if so, set innerHTML so tags like <strong> or <a> render properly.
            const containsHtml = /<[^>]+>/.test(text);

            if (containsHtml) {
                element.innerHTML = text;
                // Re-init icons if we injected markup that may contain icon placeholders
                setTimeout(() => {
                    try {
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    } catch (e) {
                        // ignore
                    }
                }, 10);
            } else {
                element.textContent = text;
            }
        });

        // Diagnostic log for debugging (check browser console)
        try { console.log('[i18n] switchLanguage:', lang); } catch(e) {}

        // Fallback: some browsers or environments may have issues with dataset HTML parsing
        // Force innerHTML for the buy-step paragraphs to ensure <strong>/<a> render correctly
        const buyStepEls = document.querySelectorAll('.buy-step-text');
        buyStepEls.forEach(el => {
            const t = el.dataset[lang];
            if (t) el.innerHTML = t;
        });
    }
    
    function updateActiveButton(lang) {
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }
}

// Wallet Connection System
let walletState = {
    connected: false,
    publicKey: null,
    peakBalance: 0,
    tier: null,
    provider: null
};

function initWalletConnection() {
    console.log('Initializing wallet connection...');
    
    const connectBtn = document.getElementById('connect-wallet-btn');
    const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const fallbackBuyBtn = document.getElementById('fallback-buy-btn');
    const fallbackMobileBuyBtn = document.getElementById('fallback-buy-mobile-btn');

    // Check if wallet is available
    if (!window.solana || !window.solana.isPhantom) {
        console.log('Phantom wallet not detected');
        // Wallet not available, show buy buttons
        if (fallbackBuyBtn) fallbackBuyBtn.classList.remove('hidden');
        if (fallbackMobileBuyBtn) fallbackMobileBuyBtn.classList.remove('hidden');
        if (connectBtn) connectBtn.style.display = 'none';
        if (connectMobileBtn) connectMobileBtn.style.display = 'none';
        return;
    }

    console.log('Phantom wallet detected');

    // Add event listeners
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
        console.log('Desktop connect button listener added');
    }
    if (connectMobileBtn) {
        connectMobileBtn.addEventListener('click', connectWallet);
        console.log('Mobile connect button listener added');
    }
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', disconnectWallet);
    }

    // Check if already connected
    checkExistingConnection();
}

async function connectWallet() {
    try {
        console.log('Attempting to connect wallet...');
        const connectBtn = document.getElementById('connect-wallet-btn');
        const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
        
        // Show loading state
        if (connectBtn) {
            connectBtn.classList.add('wallet-connecting');
            connectBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>Connecting...</span>';
        }
        if (connectMobileBtn) {
            connectMobileBtn.classList.add('wallet-connecting');
            connectMobileBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>Connecting...</span>';
        }

        // Re-init icons for loading spinner
        setTimeout(() => {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 10);

        // Add timeout for wallet connection
        const connectionTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Wallet connection timeout')), 10000)
        );

        // Connect to Phantom wallet with timeout
        const connectPromise = window.solana.connect();
        const response = await Promise.race([connectPromise, connectionTimeout]);
        
        walletState.publicKey = response.publicKey.toString();
        walletState.connected = true;
        walletState.provider = window.solana;

        console.log('Wallet connected successfully:', walletState.publicKey);

        // Update loading text
        if (connectBtn) {
            connectBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>Loading profile...</span>';
        }
        if (connectMobileBtn) {
            connectMobileBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>Loading profile...</span>';
        }

        // Check PEAK balance and update UI with timeout
        const updateTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile update timeout')), 5000)
        );

        await Promise.race([updateUserProfile(), updateTimeout]);

        console.log('Profile updated successfully');

    } catch (error) {
        console.error('Wallet connection failed:', error);
        
        // Reset buttons on error
        resetConnectButtons();
        
        // Show user-friendly error message
        let errorMessage = 'Failed to connect wallet. Please try again.';
        if (error.message.includes('timeout')) {
            errorMessage = 'Connection timed out. Please check your wallet and try again.';
        } else if (error.message.includes('User rejected')) {
            errorMessage = 'Connection cancelled by user.';
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function disconnectWallet() {
    try {
        console.log('Disconnecting wallet...');
        
        if (walletState.provider && walletState.provider.disconnect) {
            await walletState.provider.disconnect();
        }
        
        // Reset wallet state
        walletState = {
            connected: false,
            publicKey: null,
            peakBalance: 0,
            tier: null,
            provider: null
        };

        // Reset UI - force show connect buttons, hide profile
        document.body.classList.remove('wallet-connected');
        
        const connectBtn = document.getElementById('connect-wallet-btn');
        const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
        const userProfile = document.getElementById('user-profile');
        const userProfileMobile = document.getElementById('user-profile-mobile');
        
        if (connectBtn) connectBtn.style.display = 'flex';
        if (connectMobileBtn) connectMobileBtn.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        if (userProfileMobile) userProfileMobile.style.display = 'none';
        
        resetConnectButtons();

        console.log('Wallet disconnected successfully');
        showNotification('Wallet disconnected successfully', 'success');

    } catch (error) {
        console.error('Disconnect error:', error);
        showNotification('Error disconnecting wallet', 'error');
    }
}

async function checkExistingConnection() {
    try {
        if (window.solana && window.solana.isConnected) {
            walletState.publicKey = window.solana.publicKey.toString();
            walletState.connected = true;
            walletState.provider = window.solana;
            
            await updateUserProfile();
        }
    } catch (error) {
        console.log('No existing connection found');
    }
}

async function updateUserProfile() {
    try {
        console.log('Updating user profile...');
        
        // Get balance quickly
        const balance = await getPeakBalance(walletState.publicKey);
        walletState.peakBalance = balance;
        
        // Calculate tier based on balance
        const tier = calculateTier(balance);
        walletState.tier = tier;

        // Generate username from public key
        const username = generateUsername(walletState.publicKey);

        console.log('Profile data:', { username, balance, tier: tier.name });

        // Update UI immediately
        updateProfileUI(username, balance, tier);
        
        // Mark as connected and hide connect buttons
        document.body.classList.add('wallet-connected');
        
        // Force hide connect buttons and show profile
        const connectBtn = document.getElementById('connect-wallet-btn');
        const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
        const userProfile = document.getElementById('user-profile');
        const userProfileMobile = document.getElementById('user-profile-mobile');
        
        if (connectBtn) connectBtn.style.display = 'none';
        if (connectMobileBtn) connectMobileBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userProfileMobile) userProfileMobile.style.display = 'block';

        // Show success notification
        showNotification(`Welcome ${username}! You are a ${tier.name}`, 'success');

        console.log('Profile updated successfully');

    } catch (error) {
        console.error('Failed to update profile:', error);
        
        // Fallback to default values on error
        const defaultTier = calculateTier(0);
        const defaultUsername = generateUsername(walletState.publicKey || 'default');
        
        updateProfileUI(defaultUsername, 0, defaultTier);
        document.body.classList.add('wallet-connected');
        
        // Force UI update on error too
        const connectBtn = document.getElementById('connect-wallet-btn');
        const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');
        const userProfile = document.getElementById('user-profile');
        const userProfileMobile = document.getElementById('user-profile-mobile');
        
        if (connectBtn) connectBtn.style.display = 'none';
        if (connectMobileBtn) connectMobileBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userProfileMobile) userProfileMobile.style.display = 'block';
        
        showNotification('Connected but failed to load profile data', 'error');
    }
}

function calculateTier(balance) {
    console.log(`🎯 Calculating tier for balance: ${balance}`);
    
    let tier;
    if (balance >= 10000000) { // 10M+
        tier = {
            name: 'Legendary Explorer',
            key: 'legendary',
            class: 'tier-legendary',
            icon: '👑'
        };
    } else if (balance >= 1000000) { // 1M+
        tier = {
            name: 'Epic Climber',
            key: 'epic',
            class: 'tier-epic-climber',
            icon: '⚔️'
        };
    } else if (balance >= 500000) { // 500K+
        tier = {
            name: 'Rare Guide',
            key: 'rare',
            class: 'tier-rare-guide',
            icon: '🏔️'
        };
    } else { // < 500K
        tier = {
            name: 'Trail Walker',
            key: 'common',
            class: 'tier-trail-walker',
            icon: '🥾'
        };
    }
    
    console.log(`🏆 Assigned tier: ${tier.name} (${tier.key})`);
    return tier;
}

function formatBalance(balance) {
    if (balance >= 1000000) {
        return (balance / 1000000).toFixed(1) + 'M';
    } else if (balance >= 1000) {
        return (balance / 1000).toFixed(1) + 'K';
    }
    return balance.toString();
}

function generateUsername(publicKey) {
    // Generate a readable username from public key
    const prefixes = ['Doge', 'Peak', 'Moon', 'Crypto', 'Solana', 'Diamond'];
    const suffixes = ['Explorer', 'Climber', 'Hodler', 'Master', 'Hunter', 'Seeker'];
    
    // Simple hash function built-in instead of separate function
    let hash = 0;
    for (let i = 0; i < publicKey.length; i++) {
        const char = publicKey.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    hash = Math.abs(hash);
    
    const prefix = prefixes[hash % prefixes.length];
    const suffix = suffixes[(hash >> 3) % suffixes.length];
    const number = (hash % 999) + 1;
    
    return `${prefix}${suffix}${number}`;
}

function updateProfileUI(username, balance, tier) {
    console.log(`📊 Updating profile UI:`, {
        username,
        balance,
        tier,
        formattedBalance: formatBalance(balance)
    });
    
    // Desktop profile
    const userNameEl = document.getElementById('user-name');
    const userTierEl = document.getElementById('user-tier');
    const userAvatarEl = document.getElementById('user-avatar');

    // Mobile profile
    const userNameMobileEl = document.getElementById('user-name-mobile');
    const userTierMobileEl = document.getElementById('user-tier-mobile');

    const formattedBalance = formatBalance(balance);
    const initials = username.substring(0, 2).toUpperCase();

    console.log(`📱 UI Elements found:`, {
        userNameEl: !!userNameEl,
        userTierEl: !!userTierEl,
        userAvatarEl: !!userAvatarEl,
        userNameMobileEl: !!userNameMobileEl,
        userTierMobileEl: !!userTierMobileEl
    });

    if (userNameEl) {
        userNameEl.textContent = username;
        if (tier.key === 'legendary') {
            userNameEl.classList.add('tier-legendary');
        }
        console.log(`✅ Updated desktop username: ${username}`);
    }
    
    if (userTierEl) {
        const tierText = `${tier.name} • ${formattedBalance} $PEAK`;
        userTierEl.textContent = tierText;
        userTierEl.className = `user-tier text-sm ${tier.class}`;
        console.log(`✅ Updated desktop tier: ${tierText}`);
    }

    if (userAvatarEl) {
        userAvatarEl.textContent = initials;
        userAvatarEl.className = `w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-sm font-bold text-black ${tier.class}`;
        console.log(`✅ Updated desktop avatar: ${initials}`);
    }

    // Mobile updates
    if (userNameMobileEl) {
        userNameMobileEl.textContent = username;
        if (tier.key === 'legendary') {
            userNameMobileEl.classList.add('tier-legendary');
        }
        console.log(`✅ Updated mobile username: ${username}`);
    }
    
    if (userTierMobileEl) {
        const tierText = `${tier.name} • ${formattedBalance} $PEAK`;
        userTierMobileEl.textContent = tierText;
        userTierMobileEl.className = `text-sm ${tier.class}`;
        console.log(`✅ Updated mobile tier: ${tierText}`);
    }
}

function resetConnectButtons() {
    const connectBtn = document.getElementById('connect-wallet-btn');
    const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');

    if (connectBtn) {
        connectBtn.classList.remove('wallet-connecting');
        connectBtn.innerHTML = '<i data-lucide="wallet" class="w-5 h-5 mr-2"></i><span data-en="Connect Wallet" data-ru="Подключить кошелек">Connect Wallet</span>';
    }
    
    if (connectMobileBtn) {
        connectMobileBtn.classList.remove('wallet-connecting');
        connectMobileBtn.innerHTML = '<i data-lucide="wallet" class="w-5 h-5 mr-2"></i><span data-en="Connect Wallet" data-ru="Подключить кошелек">Connect Wallet</span>';
    }
    
    // Re-init icons after innerHTML change
    setTimeout(() => {
        try {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        } catch (e) {
            console.log('Icon re-init failed:', e);
        }
    }, 10);
}

async function getPeakBalance(publicKey) {
    try {
        console.log('Getting PEAK balance for:', publicKey);
        console.log('PEAK Token Mint:', PEAK_TOKEN_MINT);
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Balance check timeout')), 15000)
        );
        
        const balancePromise = new Promise(async (resolve, reject) => {
            try {
                console.log(`🔍 Checking PEAK token balance for wallet: ${publicKey}...`);
                
                // Method 1: Try direct Solana RPC (most reliable)
                try {
                    console.log('Method 1: Query parameter authentication');
                    
                    const url = `https://pro-api.solscan.io/v2.0/account/token-accounts?address=${publicKey}&token=${SOLSCAN_API_KEY}`;
                    console.log('API URL (without token):', url.replace(SOLSCAN_API_KEY, '[TOKEN]'));
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    console.log(`Response status: ${response.status}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Query param auth success:', data);
                        
                        if (data.success && data.data && Array.isArray(data.data)) {
                            console.log(`Found ${data.data.length} token accounts`);
                            
                            for (const token of data.data) {
                                const mint = token.token_address || token.mint;
                                const symbol = token.token_symbol || token.symbol || '';
                                const amount = parseFloat(token.amount || 0);
                                
                                console.log(`Token: ${symbol} (${mint}) - Balance: ${amount}`);
                                
                                if (mint === PEAK_TOKEN_MINT) {
                                    console.log(`🎯 Found PEAK! Balance: ${amount}`);
                                    resolve(amount);
                                    return;
                                }
                            }
                        }
                    } else {
                        const errorText = await response.text();
                        console.warn(`Query param auth failed: ${response.status} - ${errorText}`);
                    }
                } catch (error) {
                    console.warn('Query param auth error:', error);
                }
                
                // Method 2: Try Helius API (alternative)
                try {
                    console.log('Method 2: Helius API as alternative');
                    
                    const heliusUrl = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=28de18db-8c1f-499a-8d1d-c7e90901d326`;
                    
                    const response = await fetch(heliusUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Helius API success:', data);
                        
                        if (data.tokens && Array.isArray(data.tokens)) {
                            for (const token of data.tokens) {
                                const mint = token.mint;
                                const amount = parseFloat(token.amount || 0);
                                
                                if (mint === PEAK_TOKEN_MINT) {
                                    console.log(`🎯 Found PEAK via Helius! Balance: ${amount}`);
                                    resolve(amount);
                                    return;
                                }
                            }
                        }
                    } else {
                        console.warn(`Helius API failed: ${response.status}`);
                    }
                } catch (error) {
                    console.warn('Helius API error:', error);
                }
                
                // Method 3: Try direct Solana RPC
                try {
                    console.log('Method 3: Direct Solana RPC');
                    
                    const rpcUrl = 'https://api.mainnet-beta.solana.com';
                    
                    const response = await fetch(rpcUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'getTokenAccountsByOwner',
                            params: [
                                publicKey,
                                { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
                                { encoding: 'jsonParsed' }
                            ]
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Solana RPC success');
                        
                        if (data.result && data.result.value) {
                            console.log(`Found ${data.result.value.length} token accounts via RPC`);
                            
                            for (const account of data.result.value) {
                                const mint = account.account.data.parsed.info.mint;
                                const amount = parseFloat(account.account.data.parsed.info.tokenAmount.uiAmount || 0);
                                
                                console.log(`Token mint: ${mint} - Balance: ${amount}`);
                                
                                if (mint === PEAK_TOKEN_MINT) {
                                    console.log(`🎯 Found PEAK via RPC! Balance: ${amount}`);
                                    resolve(amount);
                                    return;
                                }
                            }
                            
                            console.log('❌ PEAK not found via RPC');
                        }
                    } else {
                        console.warn(`Solana RPC failed: ${response.status}`);
                    }
                } catch (error) {
                    console.warn('Solana RPC error:', error);
                }
                
                // Method 4: Try public SolScan (no auth required)
                try {
                    console.log('Method 4: Public SolScan API');
                    
                    const url = `https://public-api.solscan.io/account/splTokens/${publicKey}`;
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ Public SolScan success:', data);
                        
                        if (Array.isArray(data)) {
                            for (const token of data) {
                                const mint = token.tokenAddress;
                                const amount = parseFloat(token.tokenAmount?.uiAmount || 0);
                                
                                if (mint === PEAK_TOKEN_MINT) {
                                    console.log(`🎯 Found PEAK via public SolScan! Balance: ${amount}`);
                                    resolve(amount);
                                    return;
                                }
                            }
                        }
                    } else {
                        console.warn(`Public SolScan failed: ${response.status}`);
                    }
                } catch (error) {
                    console.warn('Public SolScan error:', error);
                }
                
                console.log('❌ All API methods failed - no PEAK tokens found');
                resolve(0);
                
            } catch (error) {
                console.error('Error in balance promise:', error);
                reject(error);
            }
        });
        
        return await Promise.race([balancePromise, timeoutPromise]);
        
    } catch (error) {
        console.error('Error getting PEAK balance:', error);
        return 0;
    }
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transform transition-all duration-300 ${
        type === 'error' ? 'bg-red-600' : 
        type === 'success' ? 'bg-green-600' : 
        'bg-blue-600'
    }`;
    notification.textContent = message;
    notification.style.transform = 'translateX(100%)';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}
