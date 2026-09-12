document.addEventListener('DOMContentLoaded', () => {
    
    // Switch Screen Utility
    function switchScreen(fromId, toId) {
        document.getElementById(fromId).classList.remove('active');
        document.getElementById(toId).classList.add('active');
    }

    // 1. Prank Screen Action
    const fixBtn = document.getElementById('fix-btn');
    fixBtn.addEventListener('click', () => {
        switchScreen('prank-screen', 'question-screen');
    });

    // 2. Interactive YES/NO Buttons Game
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    let yesScale = 1;
    let noScale = 1;

    btnNo.addEventListener('click', () => {
        yesScale += 0.45;
        noScale -= 0.15;

        btnYes.style.transform = `scale(${yesScale})`;
        
        if (noScale > 0.2) {
            btnNo.style.transform = `scale(${noScale})`;
        } else {
            btnNo.style.opacity = '0';
            btnNo.style.pointerEvents = 'none';
        }
    });

    // 3. Loading Animation Logic
    btnYes.addEventListener('click', () => {
        switchScreen('question-screen', 'loading-screen');
        startLoading();
    });

    function startLoading() {
        let progress = 0;
        const progressBar = document.getElementById('progress-bar');
        const percentText = document.getElementById('loading-percent');
        const statusText = document.getElementById('loading-status');

        const statuses = [
            "Memuat kata kata...",
            "Memikirkan ucapan yang terbaik...",
            "Menyiapkan doa terbaik...",
            "Hampir selesai...",
            "Selesai!"
        ];

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 1;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    switchScreen('loading-screen', 'birthday-screen');
                    initConfetti();
                    startTyping();
                }, 500);
            }

            progressBar.style.width = `${progress}%`;
            percentText.innerText = `${progress}%`;

            if (progress < 25) statusText.innerText = statuses[0];
            else if (progress < 50) statusText.innerText = statuses[1];
            else if (progress < 75) statusText.innerText = statuses[2];
            else if (progress < 99) statusText.innerText = statuses[3];
            else statusText.innerText = statuses[4];

        }, 80);
    }

    // 4. Typing Effect for Message & Show Photo Section
    function startTyping() {
        const text = "Selamat ulang tahun! Semoga diusiamu yang baru ini kamu selalu diberikan kesehatan, keberkahan, kemudahan meraih impian, dan kebahagiaan yang berlimpah!";
        const target = document.getElementById('typed-text');
        const photoSection = document.getElementById('photo-section');
        let index = 0;

        function type() {
            if (index < text.length) {
                target.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, 35);
            } else {
                setTimeout(() => {
                    photoSection.classList.remove('hidden');
                }, 500);
            }
        }
        type();
    }

    // 5. Camera, Retake, Share, and Navigation Logic
    const takePhotoBtn = document.getElementById('takePhotoBtn');
    const reTakePhotoBtn = document.getElementById('reTakePhotoBtn');
    const cameraInput = document.getElementById('cameraInput');
    const previewContainer = document.getElementById('previewContainer');
    const photoPreview = document.getElementById('photoPreview');
    const shareBtn = document.getElementById('shareBtn');
    const nextSection = document.getElementById('nextSection');
    const gotoFireworksBtn = document.getElementById('gotoFireworksBtn');
    const backToPhotoBtn = document.getElementById('backToPhotoBtn');

    let selectedFile = null;

    takePhotoBtn.addEventListener('click', () => cameraInput.click());
    reTakePhotoBtn.addEventListener('click', () => cameraInput.click());

    cameraInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                photoPreview.src = event.target.result;
                previewContainer.classList.remove('hidden');
                nextSection.classList.remove('hidden');
                takePhotoBtn.classList.add('hidden');
            };
            
            reader.readAsDataURL(selectedFile);
        }
    });

    shareBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        if (navigator.canShare && navigator.canShare({ files: [selectedFile] })) {
            try {
                await navigator.share({
                    title: 'Foto Ulang Tahun',
                    text: 'Nih foto ucapan ulang tahun aku! 🎉',
                    files: [selectedFile]
                });
            } catch (err) {
                console.log('Share canceled/failed:', err);
            }
        } else {
            alert('Fitur share tidak didukung langsung di browser ini, tetapi foto berhasil disimpan!');
        }
    });

    // Pindah ke Halaman Kembang Api
    gotoFireworksBtn.addEventListener('click', () => {
        switchScreen('birthday-screen', 'final-screen');
        startFireworksEngine();
    });

    // Kembali dari Kembang Api ke Halaman Foto
    backToPhotoBtn.addEventListener('click', () => {
        switchScreen('final-screen', 'birthday-screen');
    });

    // 6. Canvas Confetti (Halaman 4)
    function initConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#ff7675', '#fdcb6e', '#00b894', '#0984e3', '#6c5ce7'];

        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += 2;
                if (p.y > height) p.y = -10;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });
            requestAnimationFrame(render);
        }
        render();
    }

    // 7. REALISTIC CONTINUOUS FIREWORKS ENGINE WITH LOVE SHAPE (Halaman 5)
    let isFireworksRunning = false;
    function startFireworksEngine() {
        if (isFireworksRunning) return;
        isFireworksRunning = true;

        const canvas = document.getElementById('fireworks-canvas');
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const fireworks = [];
        const particles = [];
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#eccc68', '#ff7854', '#ffffff'];

        class Firework {
            constructor(startX, startY, targetX, targetY, isLove = false) {
                this.x = startX;
                this.y = startY;
                this.startX = startX;
                this.startY = startY;
                this.targetX = targetX;
                this.targetY = targetY;
                this.distanceToTarget = Math.hypot(targetX - startX, targetY - startY);
                this.distanceTraveled = 0;
                this.coordinates = [];
                this.coordinateCount = 3;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.angle = Math.atan2(targetY - startY, targetX - startX);
                this.speed = 3;
                this.acceleration = 1.02;
                this.brightness = Math.random() * 30 + 50;
                this.isLove = isLove;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.speed *= this.acceleration;
                const vx = Math.cos(this.angle) * this.speed;
                const vy = Math.sin(this.angle) * this.speed;
                this.distanceTraveled = Math.hypot(this.x - this.startX, this.y - this.startY);

                if (this.distanceTraveled >= this.distanceToTarget) {
                    createExplosion(this.targetX, this.targetY, this.isLove);
                    fireworks.splice(index, 1);
                } else {
                    this.x += vx;
                    this.y += vy;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.isLove ? '#ff4757' : `hsl(${Math.random() * 360}, 100%, 70%)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        class Particle {
            constructor(x, y, color, vx, vy) {
                this.x = x;
                this.y = y;
                this.coordinates = [];
                this.coordinateCount = 5;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.vx = vx;
                this.vy = vy;
                this.friction = 0.96;
                this.gravity = 0.4;
                this.color = color;
                this.alpha = 1;
                this.decay = Math.random() * 0.015 + 0.008;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;

                if (this.alpha <= this.decay) {
                    particles.splice(index, 1);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.lineWidth = 1.8;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        function createExplosion(x, y, isLove) {
            if (isLove) {
                // Pola Matematika Bentuk Hati ❤️
                const count = 80;
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    // Persamaan Parametrik Hati
                    const heartX = 16 * Math.pow(Math.sin(angle), 3);
                    const heartY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
                    
                    const vx = heartX * 0.35;
                    const vy = heartY * 0.35;
                    particles.push(new Particle(x, y, '#ff4d4d', vx, vy));
                }
            } else {
                // Ledakan Lingkaran Biasa
                const count = 70;
                const baseColor = colors[Math.floor(Math.random() * colors.length)];
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 8 + 1;
                    const vx = Math.cos(angle) * speed;
                    const vy = Math.sin(angle) * speed;
                    particles.push(new Particle(x, y, baseColor, vx, vy));
                }
            }
        }

        // Timer Peluncuran Kembang Api Terus Menerus
        let timerTick = 0;
        let loveCounter = 0;

        function loop() {
            requestAnimationFrame(loop);

            // Efek Jejak Keburatan Langit (Motion Blur Realistis)
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            let i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            let j = particles.length;
            while (j--) {
                particles[j].draw();
                particles[j].update(j);
            }

            timerTick++;
            // Luncurkan kembang api setiap ~45 frame (tidak terlalu cepat)
            if (timerTick >= 45) {
                timerTick = 0;
                loveCounter++;

                const startX = Math.random() * (width - 200) + 100;
                const targetX = startX + (Math.random() * 100 - 50);
                const targetY = Math.random() * (height / 2) + 50;

                // Setiap peluncuran ke-4 akan membentuk HATI (Love) ❤️
                const isLove = (loveCounter % 4 === 0);
                fireworks.push(new Firework(startX, height, targetX, targetY, isLove));
            }
        }

        loop();
    }
});
