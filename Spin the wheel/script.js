     // Configuration
        const CONFIG = {
            SEGMENTS: 6,
            SPIN_DURATION: 5000,
            MIN_SPINS: 5,
            MAX_SPINS: 8,
            CONFETTI_COUNT: 80,
            CONFETTI_DURATION: 4000
        };

        const PRIZES = {
            LOSE: {
                segments: [0, 2, 4],
                probability: 50,
                title: "Better Luck Next Time!",
                message: "Don't give up! Spin again for another chance to win amazing discounts!",
                icon: "😢",
                type: "loser",
                code: null
            },
            WIN_50: {
                segments: [1, 5],
                probability: 30,
                title: "🎉 You Won 50% OFF! 🎉",
                message: "Congratulations! Use the code below to get 50% off your next purchase!",
                icon: "🥳",
                type: "winner",
                code: "SAVE50"
            },
            JACKPOT: {
                segments: [3],
                probability: 20,
                title: "🏆 JACKPOT! 100% OFF! 🏆",
                message: "AMAZING! You hit the jackpot! Your next purchase is completely FREE!",
                icon: "🎊",
                type: "jackpot",
                code: "FREE100"
            }
        };

        // State management
        let state = {
            isSpinning: false,
            currentRotation: 0
        };

        // Get weighted random result
        function getWeightedResult() {
            const random = Math.random() * 100;

            if (random < PRIZES.LOSE.probability) {
                return createResult(PRIZES.LOSE);
            } else if (random < PRIZES.LOSE.probability + PRIZES.WIN_50.probability) {
                return createResult(PRIZES.WIN_50);
            } else {
                return createResult(PRIZES.JACKPOT);
            }
        }

        // Create result object
        function createResult(prize) {
            const segments = prize.segments;
            const segment = segments[Math.floor(Math.random() * segments.length)];

            return {
                segment,
                title: prize.title,
                message: prize.message,
                icon: prize.icon,
                type: prize.type,
                code: prize.code
            };
        }

        // Create confetti animation
        function createConfetti() {
            const colors = [
                '#FF6B6B', '#4ECDC4', '#FFE66D',
                '#95E1D3', '#DDA0DD', '#F38181',
                '#FFD700', '#FF69B4', '#87CEEB'
            ];

            for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';

                    // Random properties
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                    confetti.style.width = (Math.random() * 12 + 6) + 'px';
                    confetti.style.height = (Math.random() * 12 + 6) + 'px';
                    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
                    confetti.style.animationDelay = (Math.random() * 0.5) + 's';

                    document.body.appendChild(confetti);

                    setTimeout(() => confetti.remove(), CONFIG.CONFETTI_DURATION);
                }, i * 25);
            }
        }

        // Main spin function
        function spinWheel() {
            if (state.isSpinning) return;

            state.isSpinning = true;
            const spinBtn = document.getElementById('spinBtn');
            spinBtn.disabled = true;
            spinBtn.textContent = 'SPINNING...';

            const result = getWeightedResult();
            const segmentAngle = 360 / CONFIG.SEGMENTS;
            const targetAngle = 360 - (result.segment * segmentAngle + segmentAngle / 2);
            const spins = CONFIG.MIN_SPINS + Math.floor(Math.random() * (CONFIG.MAX_SPINS - CONFIG.MIN_SPINS));
            const finalRotation = state.currentRotation + (spins * 360) + targetAngle - (state.currentRotation % 360);

            const wheel = document.getElementById('wheel');
            wheel.style.transform = `rotate(${finalRotation}deg)`;
            state.currentRotation = finalRotation;

            setTimeout(() => {
                showPopup(result);
                state.isSpinning = false;
                spinBtn.disabled = false;
                spinBtn.textContent = 'SPIN';
            }, CONFIG.SPIN_DURATION);
        }

        // Show popup with result
        function showPopup(result) {
            const popup = document.getElementById('popupBox');
            popup.className = 'popup ' + result.type;

            document.getElementById('popupIcon').textContent = result.icon;
            document.getElementById('popupTitle').textContent = result.title;
            document.getElementById('popupMsg').textContent = result.message;

            const codeDiv = document.getElementById('discountCode');
            const codeText = document.getElementById('codeText');

            if (result.code) {
                codeDiv.style.display = 'inline-block';
                codeText.textContent = result.code;
                createConfetti();
            } else {
                codeDiv.style.display = 'none';
            }

            document.getElementById('popup').classList.add('show');
        }

        // Close popup
        function closePopup() {
            document.getElementById('popup').classList.remove('show');
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (!state.isSpinning) {
                    e.preventDefault();
                    spinWheel();
                }
            }
            if (e.key === 'Escape') {
                closePopup();
            }
        });
