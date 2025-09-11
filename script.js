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
    initProfileSystem(); // Профиль и ачивки
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
    
    // Делаем currentLang доступным глобально
    window.currentLanguage = currentLang;
    
    // Set default language on page load
    switchLanguage(currentLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                window.currentLanguage = lang; // Обновляем глобальную переменную
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
let walletConnecting = false; // guard flag

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

    // Небольшая задержка для стабилизации кошелька, затем проверяем существующее подключение
    setTimeout(checkExistingConnection, 100);
}

async function connectWallet() {
    if (walletConnecting) {
        console.log('Connect already in progress, ignoring duplicate click');
        return;
    }
    walletConnecting = true;
    const startTs = Date.now();
    const connectBtn = document.getElementById('connect-wallet-btn');
    const connectMobileBtn = document.getElementById('connect-wallet-mobile-btn');

    function setLoading(label) {
        if (connectBtn) {
            connectBtn.classList.add('wallet-connecting');
            connectBtn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>${label}</span>`;
        }
        if (connectMobileBtn) {
            connectMobileBtn.classList.add('wallet-connecting');
            connectMobileBtn.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i><span>${label}</span>`;
        }
        setTimeout(() => { try { lucide.createIcons(); } catch(_){} }, 5);
    }
    setLoading('Connecting...');

    try {
        const provider = window.solana || window.phantom?.solana;
        if (!provider) {
            throw new Error('Phantom wallet not found');
        }
        if (!provider.isPhantom) {
            console.warn('Provider detected but not Phantom, continuing anyway');
        }

        // Listen for native events (fallback)
        let eventResolved = false;
        const eventPromise = new Promise((resolve) => {
            try {
                provider.once('connect', pubKey => {
                    eventResolved = true;
                    resolve({ publicKey: pubKey });
                });
            } catch(_) { resolve(null); }
        });

        // Primary promise
        const directPromise = provider.connect({ onlyIfTrusted: false });

        // Extended timeout (30s)
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Wallet connection timeout')), 30000));

        const response = await Promise.race([
            Promise.any([directPromise, eventPromise]),
            timeoutPromise
        ]);

        if (!response || !response.publicKey) throw new Error('No publicKey returned');

        walletState.publicKey = response.publicKey.toString();
        walletState.connected = true;
        walletState.provider = provider;
        
        // Сохраняем состояние подключения в localStorage
        localStorage.setItem('peak_wallet_connected', 'true');
        localStorage.setItem('peak_wallet_publickey', walletState.publicKey);
        
        console.log('✅ Wallet connected in', (Date.now()-startTs)+'ms', walletState.publicKey);
        setLoading('Loading profile...');

        // Profile load with its own timeout (10s)
        const profileTimeout = new Promise((_, reject) => setTimeout(()=>reject(new Error('Profile load timeout')), 10000));
        await Promise.race([ updateUserProfile(), profileTimeout ]);
        console.log('✅ Profile updated');
    } catch (err) {
        console.error('Wallet connection failed:', err);
        resetConnectButtons();
        let msg = 'Failed to connect wallet. Please try again.';
        const message = err?.message || '';
        if (message.includes('timeout')) msg = 'Connection timed out. Please check your wallet and try again.';
        else if (message.includes('User rejected') || message.includes('rejected')) msg = 'Connection cancelled by user.';
        else if (message.includes('Phantom wallet not found')) msg = 'Phantom not detected. Install extension.';
        showNotification(msg, 'error');
    } finally {
        walletConnecting = false;
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

        // Очищаем сохраненное состояние подключения
        localStorage.removeItem('peak_wallet_connected');
        localStorage.removeItem('peak_wallet_publickey');

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
        console.log('🔍 Checking existing wallet connection...');
        
        // Проверяем сохраненное состояние подключения
        const wasConnected = localStorage.getItem('peak_wallet_connected') === 'true';
        const savedPublicKey = localStorage.getItem('peak_wallet_publickey');
        
        console.log('💾 Saved state:', { wasConnected, savedPublicKey });
        
        if (window.solana && window.solana.isPhantom) {
            // Сначала проверяем текущее состояние
            if (window.solana.isConnected && window.solana.publicKey) {
                console.log('✅ Wallet already connected');
                walletState.publicKey = window.solana.publicKey.toString();
                walletState.connected = true;
                walletState.provider = window.solana;
                
                // Сохраняем состояние
                localStorage.setItem('peak_wallet_connected', 'true');
                localStorage.setItem('peak_wallet_publickey', walletState.publicKey);
                
                await updateUserProfile();
                return;
            }
            
            // Если был подключен ранее, пытаемся восстановить подключение
            if (wasConnected && savedPublicKey) {
                console.log('🔄 Attempting to restore wallet connection...');
                try {
                    // Запрашиваем подключение без попапа (только если уже разрешено)
                    const response = await window.solana.connect({ onlyIfTrusted: true });
                    
                    if (response && response.publicKey) {
                        console.log('✅ Wallet connection restored successfully');
                        walletState.publicKey = response.publicKey.toString();
                        walletState.connected = true;
                        walletState.provider = window.solana;
                        
                        // Обновляем сохраненное состояние
                        localStorage.setItem('peak_wallet_connected', 'true');
                        localStorage.setItem('peak_wallet_publickey', walletState.publicKey);
                        
                        await updateUserProfile();
                        return;
                    }
                } catch (connectError) {
                    console.log('❌ Failed to restore connection:', connectError.message);
                    // Очищаем сохраненное состояние при ошибке
                    localStorage.removeItem('peak_wallet_connected');
                    localStorage.removeItem('peak_wallet_publickey');
                }
            }
        }
        
        console.log('💡 No existing connection found or restored');
    } catch (error) {
        console.log('❌ Error checking existing connection:', error);
        // Очищаем сохраненное состояние при ошибке
        localStorage.removeItem('peak_wallet_connected');
        localStorage.removeItem('peak_wallet_publickey');
    }
}

async function updateUserProfile() {
    try {
        console.log('Updating user profile...');
    // Loading indicators
    const tierEl = document.getElementById('user-tier');
    const balEl = document.getElementById('user-balance');
    if (tierEl) tierEl.textContent = 'Loading...';
    if (balEl) { balEl.textContent = '...'; balEl.style.display = 'block'; }

    const t0 = performance.now();
    const balance = await getPeakBalance(walletState.publicKey);
    const t1 = performance.now();
    console.log(`⏱ Balance fetch time: ${(t1 - t0).toFixed(0)}ms, balance=${balance}`);
        walletState.peakBalance = balance;
        
        // Calculate tier based on balance
        const tier = calculateTier(balance);
        walletState.tier = tier;

        // Generate username from public key
        const username = generateUsername(walletState.publicKey);
        
        // Проверяем, есть ли сохраненный никнейм
        const savedNickname = localStorage.getItem('peak_nickname');
        const displayName = savedNickname || username;

        console.log('Profile data:', { username, savedNickname, displayName, balance, tier: tier.name });

        // Ensure balance display element exists (desktop)
        let userTierEl = document.getElementById('user-tier');
        if (!userTierEl) {
            const nameEl = document.getElementById('user-name');
            if (nameEl) {
                userTierEl = document.createElement('div');
                userTierEl.id = 'user-tier';
                nameEl.parentNode.appendChild(userTierEl);
            }
        }

        // Update UI immediately
        updateProfileUI(displayName, balance, tier);
        if (typeof renderProfileStats === 'function') {
            try { renderProfileStats(); } catch(e){ console.warn('renderProfileStats failed', e); }
        }
        if (typeof renderAchievements === 'function') {
            try { renderAchievements(); } catch(e){ console.warn('renderAchievements failed', e); }
        }
        
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
        showNotification(`Welcome ${displayName}! You are a ${tier.name}`, 'success');

        console.log('Profile updated successfully');
        if (balance === 0) {
            showNotification('Баланс 0 — убедитесь, что backend запущен если ожидаете другое значение.', 'info');
        }

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
            class: 'tier-legendary-text',
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
    
    // Проверяем, есть ли сохраненный никнейм
    const savedNickname = localStorage.getItem('peak_nickname');
    const displayName = savedNickname || username;
    
    // Desktop profile
    const userNameEl = document.getElementById('user-name');
    const userTierEl = document.getElementById('user-tier');
    const userAvatarEl = document.getElementById('user-avatar');
    const userBalanceEl = document.getElementById('user-balance');

    // Mobile profile
    const userNameMobileEl = document.getElementById('user-name-mobile');
    const userTierMobileEl = document.getElementById('user-tier-mobile');
    const userBalanceMobileEl = document.getElementById('user-balance-mobile');

    const formattedBalance = formatBalance(balance);
    const initials = displayName.substring(0, 2).toUpperCase();

    console.log(`📱 UI Elements found:`, {
        userNameEl: !!userNameEl,
        userTierEl: !!userTierEl,
        userAvatarEl: !!userAvatarEl,
        userNameMobileEl: !!userNameMobileEl,
        userTierMobileEl: !!userTierMobileEl,
        savedNickname,
        displayName
    });

    if (userNameEl) {
        userNameEl.textContent = displayName;
        // Очищаем предыдущие классы тира
        userNameEl.classList.remove('tier-legendary', 'tier-epic', 'tier-rare', 'tier-common');
        if (tier.key === 'legendary') {
            userNameEl.classList.add('tier-legendary');
        }
        console.log(`✅ Updated desktop username: ${displayName}`);
    }
    
    if (userTierEl) {
        const tierText = `${tier.name}`;
        userTierEl.textContent = tierText;
        // Применяем обычный класс тира для всех, включая legendary
        userTierEl.className = `user-tier text-sm ${tier.class}`;
        console.log(`✅ Updated desktop tier: ${tierText}`);
    }

    if (userBalanceEl) {
    userBalanceEl.textContent = `${formattedBalance} $PEAK`;
    userBalanceEl.title = `${balance.toLocaleString('en-US', {maximumFractionDigits: 6})} $PEAK`;
        userBalanceEl.style.display = 'block';
        console.log(`✅ Updated desktop balance: ${formattedBalance}`);
    }

    if (userAvatarEl) {
        userAvatarEl.textContent = initials;
        userAvatarEl.className = `w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-sm font-bold text-black cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${tier.class}`;
        console.log(`✅ Updated desktop avatar: ${initials}`);
    }

    // Mobile updates
    if (userNameMobileEl) {
        userNameMobileEl.textContent = displayName;
        // Очищаем предыдущие классы тира
        userNameMobileEl.classList.remove('tier-legendary', 'tier-epic', 'tier-rare', 'tier-common');
        if (tier.key === 'legendary') {
            userNameMobileEl.classList.add('tier-legendary');
        }
        console.log(`✅ Updated mobile username: ${displayName}`);
    }
    
    if (userTierMobileEl) {
        const tierText = `${tier.name}`;
        userTierMobileEl.textContent = tierText;
        // Применяем обычный класс тира для всех, включая legendary
        userTierMobileEl.className = `text-sm ${tier.class}`;
        console.log(`✅ Updated mobile tier: ${tierText}`);
    }

    if (userBalanceMobileEl) {
    userBalanceMobileEl.textContent = `${formattedBalance} $PEAK`;
    userBalanceMobileEl.title = `${balance.toLocaleString('en-US', {maximumFractionDigits: 6})} $PEAK`;
        userBalanceMobileEl.style.display = 'block';
        console.log(`✅ Updated mobile balance: ${formattedBalance}`);
    }
}

// ================= PROFILE & ACHIEVEMENTS =================

// Переводы для тултипов достижений
const ACHIEVEMENT_TRANSLATIONS = {
    en: {
        unlocked: 'Unlocked',
        locked: 'Locked',
        requirement: 'Requirement',
        balance: 'Your balance',
        status: 'Status',
        connected: 'Connected',
        notConnected: 'Not connected',
        connectWallet: 'Connect wallet',
        achievementEarned: '🎉 Achievement Earned!',
        walletConnected: '🎉 Wallet Successfully Connected!',
        connectToUnlock: 'Connect your wallet to unlock',
        needMore: 'Need {amount} more $PEAK',
        hold: 'Hold {amount} $PEAK'
    },
    ru: {
        unlocked: 'Разблокировано',
        locked: 'Заблокировано',
        requirement: 'Требование',
        balance: 'Ваш баланс',
        status: 'Статус',
        connected: 'Подключен',
        notConnected: 'Не подключен',
        connectWallet: 'Подключить кошелек',
        achievementEarned: '🎉 Достижение получено!',
        walletConnected: '🎉 Кошелек успешно подключен!',
        connectToUnlock: 'Подключите кошелек для разблокировки',
        needMore: 'Нужно еще {amount} $PEAK',
        hold: 'Держать {amount} $PEAK'
    }
};

// Функция для получения перевода
function getTranslation(key, params = {}) {
    const lang = window.currentLanguage || 'en';
    let text = ACHIEVEMENT_TRANSLATIONS[lang]?.[key] || ACHIEVEMENT_TRANSLATIONS.en[key] || key;
    
    // Замена параметров в тексте
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

const ACHIEVEMENTS = [
    { id: 'trail',  name: { en: 'Trail Walker', ru: 'Тропоходец' },    req: 100000, image: 'comm.png',   fallback: '🥾', label: 'Hold 100K $PEAK' },
    { id: 'rare',   name: { en: 'Rare Guide', ru: 'Редкий Гид' },      req: 1000000, image: 'rar.png',  fallback: '🏔️', label: 'Hold 1M $PEAK' },
    { id: 'epic',   name: { en: 'Epic Climber', ru: 'Эпический Альпинист' },    req:5000000, image: 'epi.png',  fallback: '⚔️', label: 'Hold 5M $PEAK' },
    { id: 'legend', name: { en: 'Legendary Explorer', ru: 'Легендарный Исследователь' }, req:10000000, image: 'legend.png', fallback: '👑', label: 'Hold 10M $PEAK' },
    // Future / hidden milestones (no images yet -> will use fallback emoji)
    { id: 'mystery1', name: { en: 'Wallet connected', ru: 'Кошелек подключен' },    req:0, image: 'wallet.png', label: 'Wallet connected', hidden: true },
    { id: 'mystery2', name: { en: 'Summit Master', ru: 'Мастер Вершин' },  req:50000000, icon: '⛰️', label: 'Hold 50M $PEAK', hidden: true },
    { id: 'mystery3', name: { en: 'Galaxy Legend', ru: 'Легенда Галактики' },  req:100000000, icon: '🌌', label: 'Hold 100M $PEAK', hidden: true }
];

function renderProfileStats() {
    try {
        const bal = walletState.peakBalance || 0;
        const tierObj = walletState.tier || calculateTier(bal);
        const balEl = document.getElementById('profile-balance');
        const tierEl = document.getElementById('profile-tier');
        if (balEl) balEl.textContent = bal.toLocaleString('en-US', { maximumFractionDigits: 6 });
        if (tierEl) {
            tierEl.textContent = tierObj.name || '-';
            // Применяем цвет тира
            tierEl.className = `mt-1 text-lg font-bold ${tierObj.class || 'text-white'}`;
        }
        console.log('[ProfileStats] Updated', { bal, tier: tierObj.name });
    } catch (e) {
        console.warn('renderProfileStats error', e);
    }
}

function initProfileSystem() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    const openTriggers = [document.getElementById('user-name'), document.getElementById('user-avatar')];
    openTriggers.forEach(el => el && el.addEventListener('click', () => openProfileModal()));

    document.getElementById('profile-close-btn')?.addEventListener('click', closeProfileModal);
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        closeProfileModal();
        disconnectWallet();
    });
    
    // Закрытие модального окна при клике по фону
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProfileModal();
        }
    });
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeProfileModal();
        }
    });
    
    document.getElementById('refresh-achievements-btn')?.addEventListener('click', renderAchievements);
    document.getElementById('nickname-save-btn')?.addEventListener('click', saveNickname);
    document.getElementById('nickname-clear-btn')?.addEventListener('click', clearNickname);
    document.getElementById('nickname-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') saveNickname(); });

    // Load nickname if saved
    loadSavedNickname();
}

function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    modal.classList.add('show');
    renderProfileStats();
    renderAchievements();
    const input = document.getElementById('nickname-input');
    if (input) {
        // Загружаем сохраненный никнейм или текущий отображаемый
        const savedNickname = localStorage.getItem('peak_nickname');
        const currentDisplayName = document.getElementById('user-name')?.textContent || '';
        input.value = savedNickname || currentDisplayName;
        setTimeout(()=>input.focus(), 50);
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('show');
    
    // Очищаем при закрытии профиля
    cleanupAchievementTooltip();
}

function loadSavedNickname() {
    const stored = localStorage.getItem('peak_nickname');
    if (stored) {
        // Применяем сохраненный никнейм ко всем элементам
        const nameEl = document.getElementById('user-name');
        const nameMobile = document.getElementById('user-name-mobile');
        if (nameEl) nameEl.textContent = stored;
        if (nameMobile) nameMobile.textContent = stored;
        console.log(`✅ Загружен сохраненный никнейм: ${stored}`);
    }
}

function saveNickname() {
    const input = document.getElementById('nickname-input');
    if (!input) return;
    let value = input.value.trim();
    if (!value) {
        showNotification('Введите никнейм', 'error');
        return;
    }
    
    // Проверяем длину никнейма
    if (value.length < 2) {
        showNotification('Никнейм должен содержать минимум 2 символа', 'error');
        return;
    }
    
    if (value.length > 20) {
        showNotification('Никнейм должен содержать максимум 20 символов', 'error');
        return;
    }
    
    // Basic sanitize
    value = value.replace(/<|>|"|'/g, '');
    
    // Сохраняем в localStorage
    localStorage.setItem('peak_nickname', value);
    
    // Применяем ко всем элементам
    const nameEl = document.getElementById('user-name');
    const nameMobile = document.getElementById('user-name-mobile');
    if (nameEl) nameEl.textContent = value;
    if (nameMobile) nameMobile.textContent = value;
    
    showNotification('Никнейм сохранён', 'success');
    renderProfileStats();
    
    console.log(`✅ Никнейм сохранен: ${value}`);
}

function clearNickname() {
    // Удаляем сохраненный никнейм
    localStorage.removeItem('peak_nickname');
    
    // Перезагружаем профиль с оригинальным именем пользователя
    if (walletState.connected && walletState.publicKey) {
        const originalUsername = generateUsername(walletState.publicKey);
        const nameEl = document.getElementById('user-name');
        const nameMobile = document.getElementById('user-name-mobile');
        if (nameEl) nameEl.textContent = originalUsername;
        if (nameMobile) nameMobile.textContent = originalUsername;
        
        // Обновляем поле ввода в модальном окне, если оно открыто
        const input = document.getElementById('nickname-input');
        if (input) input.value = originalUsername;
    }
    
    showNotification('Никнейм сброшен', 'success');
    renderProfileStats();
    
    console.log(`✅ Никнейм сброшен`);
}

function renderAchievements() {
    const activeWrap = document.getElementById('active-badges');
    const lockedWrap = document.getElementById('locked-badges');
    if (!activeWrap || !lockedWrap) return;
    const bal = walletState.peakBalance || 0;
    console.log('[Achievements] Re-render with balance', bal);
    activeWrap.innerHTML = '';
    lockedWrap.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
        // Специальная логика для достижения "Wallet connected"
        let unlocked;
        if (a.id === 'mystery1') {
            unlocked = walletState.connected; // Разблокировано если кошелек подключен
        } else {
            unlocked = bal >= a.req; // Обычная логика по балансу
        }
        const el = document.createElement('div');
        el.className = `achievement-badge ${unlocked ? 'unlocked' : 'locked'}`;
        
        // Получаем название на текущем языке
        const label = typeof a.name === 'object' 
            ? a.name[window.currentLanguage || 'en'] || a.name.en 
            : a.name;
        // Determine visual icon: prefer image if provided
        let iconHtml = '';
        if (a.image) {
            iconHtml = `<img src="${a.image}" alt="${label}" class="badge-img" onerror="this.onerror=null;this.replaceWith(document.createTextNode('${a.fallback || '★'}'))">`;
        } else if (a.icon) {
            iconHtml = a.icon;
        } else if (a.fallback) {
            iconHtml = a.fallback;
        } else {
            iconHtml = '★';
        }
        // Создаем подробное описание для tooltip'а
        const description = unlocked 
            ? `🎉 Achievement Unlocked!\n${a.name}\n\nYou have successfully earned this achievement by holding ${a.req.toLocaleString()} $PEAK tokens or more.`
            : `🔒 Locked Achievement\n${a.name}\n\nRequirement: Hold ${a.req.toLocaleString()} $PEAK tokens\nYour balance: ${bal.toLocaleString()} $PEAK\nNeeded: ${Math.max(0, a.req - bal).toLocaleString()} more $PEAK`;
        
        el.innerHTML = `
            <div class="badge-icon" data-achievement-id="${a.id}">
                ${iconHtml}
                <span class="lock">🔒</span>
            </div>
            <div class="badge-label">${label}</div>
        `;
        
        // Добавляем простой data-атрибут для tooltip и JavaScript обработчики
        const badgeIcon = el.querySelector('.badge-icon');
        if (badgeIcon) {
            badgeIcon.setAttribute('data-tooltip', description);
            
            // Простые обработчики для показа/скрытия тултипа
            badgeIcon.addEventListener('mouseenter', (e) => {
                // Специальные данные для достижения "Wallet connected"
                let tooltipData;
                if (a.id === 'mystery1') {
                    tooltipData = {
                        unlocked,
                        name: label, // Используем переведенное название
                        requirement: 'Connect wallet',
                        balance: walletState.connected ? 'Connected' : 'Not connected',
                        description: 'Successfully connect your Phantom wallet to the platform',
                        isWalletAchievement: true
                    };
                } else {
                    tooltipData = {
                        unlocked,
                        name: label, // Используем переведенное название
                        requirement: a.req,
                        balance: bal,
                        description: a.description || 'Achievement badge for PEAK token holders'
                    };
                }
                
                showSimpleTooltip(e.target, tooltipData);
            });
            
            badgeIcon.addEventListener('mouseleave', () => {
                hideSimpleTooltip();
            });
        }
        (unlocked ? activeWrap : lockedWrap).appendChild(el);
    });
    if (!activeWrap.children.length) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-xs text-gray-500';
        placeholder.textContent = 'No active badges yet';
        activeWrap.appendChild(placeholder);
    }
}

// Простая функция очистки (пустая, оставляем для совместимости)
function cleanupAchievementTooltip() {
    // Функция оставлена пустой для совместимости с существующими вызовами
    hideSimpleTooltip();
}

// Простые функции для тултипов
let simpleTooltip = null;

function showSimpleTooltip(element, data) {
    hideSimpleTooltip(); // Скрываем предыдущий тултип
    
    simpleTooltip = document.createElement('div');
    simpleTooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,40,0.95) 100%);
        border: 1px solid rgba(250,204,21,0.3);
        border-radius: 12px;
        padding: 16px;
        min-width: 240px;
        max-width: 300px;
        font-size: 0.75rem;
        color: #f8fafc;
        z-index: 9999999;
        box-shadow: 0 8px 25px rgba(0,0,0,0.8), 0 0 0 1px rgba(250,204,21,0.1);
        backdrop-filter: blur(10px);
        pointer-events: none;
        line-height: 1.4;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    // Создаем красивый HTML контент с переводами
    const statusIcon = data.unlocked ? '✅' : '🔒';
    const statusText = data.unlocked ? getTranslation('unlocked') : getTranslation('locked');
    const statusColor = data.unlocked ? '#22c55e' : '#ef4444';
    const borderColor = data.unlocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    const bgColor = data.unlocked ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    
    let statusMessage = '';
    let requirementText = '';
    let balanceText = '';
    
    if (data.isWalletAchievement) {
        // Специальное сообщение для достижения кошелька
        requirementText = `${getTranslation('requirement')}: ${getTranslation('connectWallet')}`;
        balanceText = `${getTranslation('status')}: ${data.unlocked ? getTranslation('connected') : getTranslation('notConnected')}`;
        statusMessage = data.unlocked 
            ? getTranslation('walletConnected')
            : getTranslation('connectToUnlock');
    } else {
        // Обычная логика для токен достижений
        requirementText = `${getTranslation('requirement')}: ${getTranslation('hold', { amount: data.requirement.toLocaleString() })}`;
        balanceText = `${getTranslation('balance')}: ${data.balance.toLocaleString()} $PEAK`;
        if (data.unlocked) {
            statusMessage = getTranslation('achievementEarned');
        } else {
            const needed = Math.max(0, data.requirement - data.balance);
            statusMessage = getTranslation('needMore', { amount: needed.toLocaleString() });
        }
    }
    
    simpleTooltip.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 600; color: #fbbf24; margin-bottom: 6px; text-align: center;">
            ${statusIcon} ${statusText}
        </div>
        <div style="font-size: 0.9rem; font-weight: 700; color: #f8fafc; margin-bottom: 8px; text-align: center;">
            ${data.name}
        </div>
        <div style="font-size: 0.75rem; color: #cbd5e1; margin-bottom: 10px; text-align: center;">
            ${requirementText}
        </div>
        <div style="font-size: 0.7rem; color: #9ca3af; margin-bottom: 10px; text-align: center;">
            ${balanceText}
        </div>
        <div style="font-size: 0.75rem; font-weight: 600; text-align: center; padding: 6px 10px; border-radius: 6px; background: ${bgColor}; color: ${statusColor}; border: 1px solid ${borderColor};">
            ${statusMessage}
        </div>
    `;
    
    document.body.appendChild(simpleTooltip);
    
    // Позиционируем тултип снизу под элементом
    const rect = element.getBoundingClientRect();
    const tooltipRect = simpleTooltip.getBoundingClientRect();
    
    // Позиционируем по центру под элементом
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 10;
    
    // Если не помещается по ширине слева, корректируем
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    
    // Если не помещается снизу, показываем сверху
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = rect.top - tooltipRect.height - 10;
    }
    
    simpleTooltip.style.left = left + 'px';
    simpleTooltip.style.top = top + 'px';
    
    // Показываем тултип
    setTimeout(() => {
        if (simpleTooltip) simpleTooltip.style.opacity = '1';
    }, 10);
}

function hideSimpleTooltip() {
    if (simpleTooltip) {
        simpleTooltip.remove();
        simpleTooltip = null;
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

// ---- BALANCE CHECK (BACKEND + FALLBACK) ----
// Tries local backend (Flask) first, then falls back to direct RPC (limited) if backend offline.
async function getPeakBalance(publicKey) {
    if (!publicKey) return 0;
    console.log('🔎 Start PEAK balance fetch:', { publicKey, mint: PEAK_TOKEN_MINT });
    // 1. Try backend endpoints (relative, 127.0.0.1, localhost)
    const apiBases = [];
    if (location.protocol.startsWith('http')) {
        apiBases.push('/api/peak-balance/'); // reverse proxy or same-origin deploy
    }
    apiBases.push('http://127.0.0.1:5000/api/peak-balance/');
    apiBases.push('http://localhost:5000/api/peak-balance/');

    for (const base of apiBases) {
        try {
            const url = base.startsWith('http') ? `${base}${publicKey}` : `${base}${publicKey}`;
            console.log(`🌐 Trying backend: ${url}`);
            const controller = new AbortController();
            const timeoutMs = 3500; // per attempt
            const to = setTimeout(()=>controller.abort(), timeoutMs);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(to);
            if (res.ok) {
                const data = await res.json();
                if (typeof data.balance === 'number') {
                    console.log('✅ Backend balance success via', base, data);
                    return data.balance;
                }
                console.warn('Backend returned no numeric balance', data);
            } else {
                console.warn(`Backend ${base} status ${res.status}`);
            }
        } catch (err) {
            console.warn(`Backend attempt failed for ${base}:`, err.message);
        }
    }
    console.warn('⚠️ All backend attempts failed, using direct RPC fallback. Ensure Flask server is running (python app.py)');

    // 2. Minimal direct fallback: single RPC mint-filter only (faster, less CORS risk if allowed)
    try {
        const res = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner',
                params: [ publicKey, { mint: PEAK_TOKEN_MINT }, { encoding: 'jsonParsed' } ]
            })
        });
        if (res.ok) {
            const data = await res.json();
            const list = data?.result?.value || [];
            if (list.length) {
                const info = list[0].account.data.parsed.info.tokenAmount;
                const precise = Number(info.amount) / 10 ** info.decimals;
                console.log('✅ Direct fallback balance:', precise);
                return precise;
            }
        } else {
            console.warn('Direct RPC fallback status', res.status);
        }
    } catch (e) {
        console.warn('Direct RPC fallback error:', e.message);
    }

    console.log('❌ Balance not found; returning 0');
    return 0;
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
