// =============================================
// LUNNAR — Main Application Logic
// Dark futuristic theme + AutoScout24 functions
// =============================================

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme
if (localStorage.getItem('lunnarTheme') === 'light') {
    body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const mode = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('lunnarTheme', mode);
});

// ===== STARFIELD =====
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
let stars = [];
const STAR_COUNT = 400;
let baseSpeed = 0.08;
let warpSpeed = 0.08;

class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * width;
        this.size = 0.5 + Math.random();
        this.opacity = 0.2 + Math.random() * 0.8;
    }
    update() {
        this.z -= (warpSpeed * 50);
        if (this.z <= 0) { this.reset(); this.z = width; }
    }
    draw() {
        // Change star color based on theme
        const isLight = body.classList.contains('light-mode');
        const starColor = isLight ? `rgba(0, 0, 0, ${this.opacity * 0.5})` : `rgba(255, 255, 255, ${this.opacity})`;

        const x = (this.x - width / 2) * (width / this.z) + width / 2;
        const y = (this.y - height / 2) * (width / this.z) + height / 2;
        const s = this.size * (width / this.z);
        if (x < 0 || x > width || y < 0 || y > height) return;
        ctx.beginPath();
        ctx.fillStyle = starColor;
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
    }
}

function resizeCanvas() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const newWidth = hero.offsetWidth;
    const newHeight = hero.offsetHeight;

    if (newWidth > 0 && newHeight > 0) {
        width = newWidth;
        height = newHeight;
        canvas.width = width;
        canvas.height = height;
    }
}

function animateStars() {
    // Only animate if hero is visible
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();

    if (rect.bottom > 0 && height > 0) {
        // Calculate opacity based on visibility (fade out as it leaves)
        const opacity = Math.max(0, Math.min(1, rect.bottom / height));
        canvas.style.opacity = opacity;

        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => { star.update(); star.draw(); });
        warpSpeed += (baseSpeed - warpSpeed) * 0.05;
    }
    requestAnimationFrame(animateStars);
}

window.addEventListener('wheel', (e) => {
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0) {
        warpSpeed = Math.min(2, warpSpeed + Math.abs(e.deltaY) * 0.01);
    }
});

// ===== MOUSE LIGHT =====
window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / width) * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / height) * 100}%`);
});

// ===== TYPING EFFECT =====
const subtitleText = "A tökéletes használt autó megtalálása még sosem volt ilyen egyszerű.";
function typeSubtitle() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;
    let i = 0;
    el.innerHTML = "";
    function type() {
        if (i < subtitleText.length) {
            el.innerHTML += subtitleText.charAt(i);
            i++;
            setTimeout(type, 40);
        }
    }
    type();
}

// ===== NEURAL NETWORK VISUAL =====
let neuralCanvas, nctx, particles = [];
function initNeural() {
    neuralCanvas = document.getElementById('neural-canvas');
    if (!neuralCanvas) return;
    nctx = neuralCanvas.getContext('2d');
    resizeNeural();
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * neuralCanvas.width,
            y: Math.random() * neuralCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    animateNeural();
}

function resizeNeural() {
    if (!neuralCanvas) return;
    neuralCanvas.width = neuralCanvas.offsetWidth;
    neuralCanvas.height = neuralCanvas.offsetHeight;
}

function animateNeural() {
    nctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
    const isLight = body.classList.contains('light-mode');
    nctx.strokeStyle = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
    nctx.fillStyle = isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)";
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > neuralCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > neuralCanvas.height) p.vy *= -1;
        nctx.beginPath();
        nctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        nctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
                nctx.lineWidth = 1 - dist / 100;
                nctx.beginPath();
                nctx.moveTo(p.x, p.y);
                nctx.lineTo(p2.x, p2.y);
                nctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateNeural);
}

// ================================================================
// ===== CAR MARKETPLACE DATA & LOGIC =====
// ================================================================

const BRANDS_DATA = {
    'Audi': { logo: 'https://cdn.simpleicons.org/audi/white', models: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S1', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ2', 'SQ5', 'SQ7', 'SQ8', 'TT', 'TT RS', 'e-tron', 'e-tron GT'] },
    'BMW': { logo: 'https://cdn.simpleicons.org/bmw/white', models: ['114', '116', '118', '120', '123', '125', '214', '216', '218', '220', '225', '316', '318', '320', '323', '325', '328', '330', '335', '340', '418', '420', '425', '428', '430', '435', '440', '518', '520', '523', '525', '528', '530', '535', '540', '545', '550', '630', '635', '640', '650', '725', '728', '730', '735', '740', '745', '750', '760', '840', '850', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z3', 'Z4', 'i3', 'i4', 'i7', 'i8', 'iX', 'iX1', 'iX3'] },
    'Mercedes': { logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyNGExMiAxMiAwIDEgMCAwLTI0IDEyIDEyIDAgMCAwIDAgMjR6bTAtMjMuNDQzYTExLjQ0MyAxMS40NDMgMCAxIDEgMCAyMi44ODYgMTEuNDQzIDExLjA2MyAwIDAgMSAwLTIyLjg4NnptLS4yODYgNS42MnY2LjYyMWwtNS43MzMgMy4zMWEuMjg2LjI4NiAwIDAgMCAuMTQ0LjUyNC4yOC4yOCAwIDAgMCAuMTQyLS4wMzhMMTIgMTMuMDZsNS43MzMgMy4zYS4yODYuMjg2IDAgMCAwIC40MjgtLjI0OGMwLS4wOTgtLjA1MS0uMTktLjE0Mi0uMjM4bC01LjczMy0zLjMxVjUuNzk3YS4yODYuMjg2IDAgMCAwLS41NzEgMHoiLz48L3N2Zz4=', models: ['A 140', 'A 150', 'A 160', 'A 170', 'A 180', 'A 190', 'A 200', 'A 210', 'A 220', 'A 250', 'A 45 AMG', 'B 150', 'B 160', 'B 170', 'B 180', 'B 200', 'B 220', 'B 250', 'C 160', 'C 180', 'C 200', 'C 220', 'C 230', 'C 240', 'C 250', 'C 270', 'C 280', 'C 300', 'C 320', 'C 350', 'C 400', 'C 43 AMG', 'C 63 AMG', 'CL 500', 'CL 600', 'CLA 180', 'CLA 200', 'CLA 220', 'CLA 250', 'CLA 45 AMG', 'CLK 200', 'CLK 230', 'CLK 270', 'CLK 320', 'CLS 250', 'CLS 320', 'CLS 350', 'CLS 400', 'CLS 500', 'CLS 63 AMG', 'E 200', 'E 220', 'E 230', 'E 240', 'E 250', 'E 270', 'E 280', 'E 290', 'E 300', 'E 320', 'E 350', 'E 400', 'E 420', 'E 430', 'E 500', 'E 55 AMG', 'E 63 AMG', 'G 270', 'G 300', 'G 320', 'G 350', 'G 400', 'G 500', 'G 55 AMG', 'G 63 AMG', 'GL 320', 'GL 350', 'GL 420', 'GL 450', 'GL 500', 'GLA 180', 'GLA 200', 'GLA 220', 'GLA 250', 'GLA 45 AMG', 'GLB 180', 'GLB 200', 'GLB 220', 'GLB 250', 'GLC 200', 'GLC 220', 'GLC 250', 'GLC 300', 'GLC 350', 'GLE 250', 'GLE 300', 'GLE 350', 'GLE 400', 'GLE 450', 'GLE 500', 'GLE 63 AMG', 'GLK 200', 'GLK 220', 'GLK 250', 'GLK 320', 'GLK 350', 'GLS 350', 'GLS 400', 'GLS 500', 'GLS 63 AMG', 'ML 230', 'ML 270', 'ML 280', 'ML 300', 'ML 320', 'ML 350', 'ML 400', 'ML 420', 'ML 430', 'ML 450', 'ML 500', 'ML 55 AMG', 'ML 63 AMG', 'R 280', 'R 300', 'R 320', 'R 350', 'R 500', 'S 250', 'S 280', 'S 300', 'S 320', 'S 350', 'S 400', 'S 420', 'S 430', 'S 450', 'S 500', 'S 550', 'S 560', 'S 600', 'S 63 AMG', 'S 65 AMG', 'SL 280', 'SL 300', 'SL 320', 'SL 350', 'SL 380', 'SL 400', 'SL 420', 'SL 450', 'SL 500', 'SL 560', 'SL 600', 'SL 63 AMG', 'SL 65 AMG', 'SLC 180', 'SLC 200', 'SLC 300', 'SLK 200', 'SLK 230', 'SLK 250', 'SLK 280', 'SLK 300', 'SLK 320', 'SLK 350', 'SLK 55 AMG', 'V 200', 'V 220', 'V 230', 'V 250', 'Vito', 'X 220', 'X 250', 'X 350', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV'] },
    'Volkswagen': { logo: 'https://cdn.simpleicons.org/volkswagen/white', models: ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'CC', 'Corrado', 'Crafter', 'Eos', 'Fox', 'Golf I', 'Golf II', 'Golf III', 'Golf IV', 'Golf V', 'Golf VI', 'Golf VII', 'Golf VIII', 'Golf', 'Golf Plus', 'Golf Sportsvan', 'ID.3', 'ID.4', 'ID.5', 'ID.Buzz', 'Jetta', 'Lupo', 'Multivan', 'New Beetle', 'Passat B1', 'Passat B2', 'Passat B3', 'Passat B4', 'Passat B5', 'Passat B6', 'Passat B7', 'Passat B8', 'Passat CC', 'Passat', 'Phaeton', 'Polo', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Taigo', 'Tiguan', 'Tiguan Allspace', 'Touareg', 'Touran', 'Transporter', 'Up!'] },
    'Toyota': { logo: 'https://cdn.simpleicons.org/toyota/white', models: ['4-Runner', 'Auris', 'Avensis', 'Aygo', 'Aygo X', 'C-HR', 'Camry', 'Celica', 'Corolla', 'Corolla Cross', 'Corolla Verso', 'GR86', 'GT86', 'Hiace', 'Highlander', 'Hilux', 'IQ', 'Land Cruiser', 'Mirai', 'MR2', 'Paseo', 'Picnic', 'Previa', 'Prius', 'Prius Plus', 'Proace', 'Proace City', 'RAV4', 'Starlet', 'Supra', 'Urban Cruiser', 'Verso', 'Verso-S', 'Yaris', 'Yaris Cross', 'Yaris Verso'] },
    'Ford': { logo: 'https://cdn.simpleicons.org/ford/white', models: ['B-Max', 'C-Max', 'Capri', 'Cougar', 'EcoSport', 'Edge', 'Escort', 'Explorer', 'F-150', 'Fiesta', 'Focus', 'Focus C-Max', 'Focus CC', 'Fusion', 'Galaxy', 'Granada', 'Grand C-Max', 'Ka', 'Ka+', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Orion', 'Probe', 'Puma', 'Ranger', 'S-Max', 'Scorpio', 'Sierra', 'Streetka', 'Tourneo Connect', 'Tourneo Courier', 'Tourneo Custom', 'Transit', 'Transit Connect', 'Transit Courier', 'Transit Custom'] },
    'Opel': { logo: 'https://cdn.simpleicons.org/opel/white', models: ['Adam', 'Agila', 'Ampera', 'Antara', 'Ascona', 'Astra', 'Astra F', 'Astra G', 'Astra H', 'Astra J', 'Astra K', 'Astra L', 'Calibra', 'Cascada', 'Combo', 'Corsa', 'Corsa A', 'Corsa B', 'Corsa C', 'Corsa D', 'Corsa E', 'Corsa F', 'Crossland', 'Crossland X', 'Frontera', 'Grandland', 'Grandland X', 'Insignia', 'Insignia A', 'Insignia B', 'Kadett', 'Karl', 'Meriva', 'Meriva A', 'Meriva B', 'Mokka', 'Mokka X', 'Monterey', 'Movano', 'Omega', 'Signum', 'Sintra', 'Tigra', 'Vectra', 'Vectra A', 'Vectra B', 'Vectra C', 'Vivaro', 'Zafira', 'Zafira A', 'Zafira B', 'Zafira C', 'Zafira Life'] },
    'Škoda': { logo: 'https://cdn.simpleicons.org/skoda/white', models: ['Citigo', 'Enyaq', 'Enyaq iV', 'Fabia', 'Fabia I', 'Fabia II', 'Fabia III', 'Fabia IV', 'Felicia', 'Forman', 'Kamiq', 'Karoq', 'Kodiaq', 'Kushaq', 'Octavia', 'Octavia I', 'Octavia II', 'Octavia III', 'Octavia IV', 'Praktik', 'Rapid', 'Roomster', 'Scala', 'Slavia', 'Superb', 'Superb I', 'Superb II', 'Superb III', 'Yeti'] },
    'Renault': { logo: 'https://cdn.simpleicons.org/renault/white', models: ['Alaskan', 'Arkana', 'Austral', 'Avantime', 'Captur', 'Clio', 'Clio I', 'Clio II', 'Clio III', 'Clio IV', 'Clio V', 'Espace', 'Fluence', 'Grand Espace', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Laguna I', 'Laguna II', 'Laguna III', 'Latitude', 'Master', 'Megane', 'Megane I', 'Megane II', 'Megane III', 'Megane IV', 'Megane E-Tech', 'Modus', 'Safrane', 'Scenic', 'Scenic I', 'Scenic II', 'Scenic III', 'Scenic IV', 'Symbol', 'Talisman', 'Thalia', 'Trafic', 'Twingo', 'Twingo I', 'Twingo II', 'Twingo III', 'Twizy', 'Vel Satis', 'Wind', 'Zoe'] },
    'Hyundai': { logo: 'https://cdn.simpleicons.org/hyundai/white', models: ['Accent', 'Atos', 'Atos Prime', 'Bayon', 'Coupe', 'Elantra', 'Galloper', 'Genesis', 'Getz', 'Grandeur', 'H-1', 'H-1 Starex', 'H-100', 'H350', 'i10', 'i20', 'i30', 'i40', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix20', 'ix35', 'ix55', 'Kona', 'Lantra', 'Matrix', 'Pony', 'Santa Fe', 'Santamo', 'Sonata', 'Staria', 'Terracan', 'Trajet', 'Tucson', 'Veloster', 'Venue'] },
    'Kia': { logo: 'https://cdn.simpleicons.org/kia/white', models: ['Besta', 'Carens', 'Carnival', 'Ceed', 'Cerato', 'EV6', 'EV9', 'Joice', 'Magentis', 'Niro', 'Opirus', 'Optima', 'Picanto', 'Pregio', 'Pride', 'Proceed', 'Retona', 'Rio', 'Sephia', 'Shuma', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic', 'Venga', 'XCeed'] },
    'Volvo': { logo: 'https://cdn.simpleicons.org/volvo/white', models: ['240', '340', '440', '460', '480', '740', '760', '850', '940', '960', 'C30', 'C70', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'] },
    'Peugeot': { logo: 'https://cdn.simpleicons.org/peugeot/white', models: ['104', '106', '107', '108', '1007', '204', '205', '206', '206+', '207', '208', '2008', '301', '304', '305', '306', '307', '308', '309', '3008', '404', '405', '406', '407', '408', '4007', '4008', '504', '505', '508', '5008', '604', '605', '607', '806', '807', 'Bipper', 'Boxer', 'Expert', 'Ion', 'Partner', 'RCZ', 'Rifter', 'Traveller'] },
    'Mazda': { logo: 'https://cdn.simpleicons.org/mazda/white', models: ['2', '3', '5', '6', '121', '323', '323 F', '626', 'B-Series', 'BT-50', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-7', 'CX-9', 'Demio', 'MPV', 'MX-3', 'MX-5', 'MX-6', 'MX-30', 'Premacy', 'RX-7', 'RX-8', 'Tribute', 'Xedos 6', 'Xedos 9'] },
    'Honda': { logo: 'https://cdn.simpleicons.org/honda/white', models: ['Accord', 'Civic', 'Concerto', 'CR-V', 'CR-Z', 'CRX', 'FR-V', 'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Logo', 'NSX', 'Prelude', 'S2000', 'Shuttle', 'Stream', 'ZR-V'] },
    'Tesla': { logo: 'https://cdn.simpleicons.org/tesla/white', models: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'] },
};

const CITIES = ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'];
const FUEL_TYPES = ['Benzin', 'Dízel', 'Elektromos', 'Hibrid', 'LPG'];
const TRANSMISSIONS = ['Manuális', 'Automata'];

const BADGE_TYPES = [
    { text: 'ÚJ', class: 'badge-new' },
    { text: 'PRÉMIUM', class: 'badge-premium' },
    { text: 'NÉPSZERŰ', class: 'badge-popular' },
    { text: 'ÁRCSÖKKENTÉS', class: 'badge-reduced' },
    { text: 'ELEKTROMOS', class: 'badge-electric' },
];

const CAR_IMAGES = [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606148585437-080c3e987c6b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80',
];

// ===== BACKEND CONFIG =====
const API_BASE_URL = 'http://localhost:5000/api'; // Change to Render URL after deployment

// ===== GENERATE CARS =====
function generateCars(count = 12) {
    // Keeping this as fallback if API is not available
    const cars = [];
    const brandKeys = Object.keys(BRANDS_DATA);
    for (let i = 0; i < count; i++) {
        const brand = brandKeys[Math.floor(Math.random() * brandKeys.length)];
        const models = BRANDS_DATA[brand].models;
        const model = models[Math.floor(Math.random() * models.length)];
        const year = 2010 + Math.floor(Math.random() * 16);
        const km = Math.floor(Math.random() * 250000) + 5000;
        const fuel = FUEL_TYPES[Math.floor(Math.random() * FUEL_TYPES.length)];
        const trans = TRANSMISSIONS[Math.floor(Math.random() * 2)];
        const hp = 80 + Math.floor(Math.random() * 420);
        const ccm = fuel === 'Elektromos' ? null : (1000 + Math.floor(Math.random() * 4) * 500);
        const price = Math.floor((3 + Math.random() * 45) * 1000000 / 100000) * 100000;
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const img = CAR_IMAGES[i % CAR_IMAGES.length];
        const badge = Math.random() > 0.55 ? BADGE_TYPES[Math.floor(Math.random() * BADGE_TYPES.length)] : null;
        const daysAgo = Math.floor(Math.random() * 30);

        cars.push({
            id: 'static-' + (i + 1), brand, model, year, km, fuel, transmission: trans, hp, ccm, price, city, img, images: [img], badge, daysAgo,
            description: `Kiváló állapotú ${brand} ${model}, ${year} évjárat. ${fuel} üzemanyagú, ${trans.toLowerCase()} váltó, ${hp} lóerő. Szervizelve, magyar papírokkal. ${city}ben megtekinthető.`,
            status: 'approved'
        });
    }
    return cars;
}

let allCars = [];
let filteredCars = [];
let favorites = JSON.parse(localStorage.getItem('lunnarFavorites') || '[]');
let currentUser = JSON.parse(localStorage.getItem('lunnarUser') || 'null');
let token = localStorage.getItem('lunnarToken');

// ===== HELPERS =====
function formatPrice(n) { return n.toLocaleString('hu-HU') + ' Ft'; }
function formatKm(n) { return n.toLocaleString('hu-HU') + ' km'; }
function daysAgoText(d) {
    if (d === 0) return 'Ma';
    if (d === 1) return 'Tegnap';
    return d + ' napja';
}

// ===== BRANDS INIT =====
// ===== BRANDS INIT =====
function getModelGroups(brand, models) {
    const groups = {};

    models.forEach(model => {
        let groupName = "Egyéb";

        if (brand === 'BMW') {
            if (/^[1-8]/.test(model)) groupName = `${model[0]}-es sorozat`;
            else if (model.startsWith('X')) groupName = "X sorozat";
            else if (model.startsWith('Z')) groupName = "Z sorozat";
            else if (model.startsWith('i')) groupName = "i sorozat";
            else if (model.startsWith('M')) groupName = "M sorozat";
        } else if (brand === 'Mercedes') {
            const match = model.match(/^([A-Z]+)/);
            if (match) {
                const prefix = match[1];
                if (['EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV'].includes(prefix)) groupName = "EQ széria";
                else groupName = `${prefix}-osztály`;
            }
        } else if (brand === 'Audi') {
            if (model.startsWith('A')) groupName = "A széria";
            else if (model.startsWith('Q')) groupName = "Q széria";
            else if (model.startsWith('RS')) groupName = "RS széria";
            else if (model.startsWith('S')) groupName = "S széria";
            else if (model.startsWith('TT')) groupName = "TT";
            else if (model.startsWith('e-tron')) groupName = "e-tron";
        } else if (brand === 'Volkswagen') {
            if (model.includes('Golf')) groupName = "Golf";
            else if (model.includes('Passat')) groupName = "Passat";
            else if (model.startsWith('ID')) groupName = "ID széria";
            else if (model.startsWith('T-')) groupName = "T-sorozat (T-Roc/Cross)";
            else groupName = model.split(' ')[0];
        } else {
            groupName = model.split(' ')[0];
        }

        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(model);
    });

    return groups;
}

// ===== CUSTOM SELECT CLASS =====
class CustomSelect {
    constructor(selectEl) {
        if (!selectEl) return;
        this.select = selectEl;
        this.container = null;
        this.trigger = null;
        this.optionsContainer = null;
        this.init();
    }

    init() {
        // Create wrapper
        this.container = document.createElement('div');
        this.container.className = 'custom-select-wrapper';
        this.select.parentNode.insertBefore(this.container, this.select);
        this.container.appendChild(this.select);

        // Create trigger
        this.trigger = document.createElement('div');
        this.trigger.className = 'custom-select-trigger';
        this.updateTriggerContent();
        this.updateDisabledState();

        const arrow = document.createElement('span');
        arrow.className = 'custom-select-arrow';
        arrow.innerHTML = '▼';
        this.trigger.appendChild(arrow);

        this.container.appendChild(this.trigger);

        // Create options container
        this.optionsContainer = document.createElement('div');
        this.optionsContainer.className = 'custom-options';
        this.container.appendChild(this.optionsContainer);

        this.renderOptions();

        // Events
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.select.disabled) return;
            this.toggle();
        });

        document.addEventListener('click', () => this.close());

        // Listen for original select changes
        this.select.addEventListener('change', () => {
            this.updateTriggerContent();
            this.renderOptions();
        });

        // MutationObserver to watch for option and attribute changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                if (m.type === 'childList') this.renderOptions();
                if (m.type === 'attributes') {
                    this.updateDisabledState();
                    this.renderOptions();
                }
                this.updateTriggerContent();
            });
        });
        observer.observe(this.select, { childList: true, attributes: true, attributeFilter: ['disabled'] });
    }

    updateTriggerContent() {
        if (!this.trigger) return;
        const selectedOption = this.select.options[this.select.selectedIndex];
        const textArea = this.trigger.querySelector('span:not(.custom-select-arrow)') || document.createElement('span');
        textArea.textContent = selectedOption ? selectedOption.textContent : '';
        if (!textArea.parentNode) this.trigger.prepend(textArea);
    }

    updateDisabledState() {
        if (this.select.disabled) {
            this.container.classList.add('disabled');
            this.trigger.style.opacity = '0.4';
            this.trigger.style.cursor = 'not-allowed';
        } else {
            this.container.classList.remove('disabled');
            this.trigger.style.opacity = '1';
            this.trigger.style.cursor = 'pointer';
        }
    }

    renderOptions() {
        if (!this.optionsContainer) return;
        this.optionsContainer.innerHTML = '';

        if (this.select.disabled) return;

        const children = this.select.children;
        for (let child of children) {
            if (child.tagName === 'OPTGROUP') {
                const label = document.createElement('div');
                label.className = 'custom-option optgroup-label';
                label.textContent = child.label;
                this.optionsContainer.appendChild(label);

                for (let option of child.options) {
                    this.createOption(option, true);
                }
            } else {
                this.createOption(child);
            }
        }
    }

    createOption(option, isChild = false) {
        const opt = document.createElement('div');
        opt.className = `custom-option ${isChild ? 'optgroup-child' : ''} ${option.selected ? 'selected' : ''}`;
        opt.textContent = option.textContent;
        opt.dataset.value = option.value;

        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            this.select.value = option.value;
            this.select.dispatchEvent(new Event('change'));
            this.close();
        });

        this.optionsContainer.appendChild(opt);
    }

    toggle() {
        const isOpen = this.container.classList.contains('open');
        // Close all other custom selects first
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
        if (!isOpen) this.container.classList.add('open');
    }

    close() {
        this.container.classList.remove('open');
    }
}

function initBrands() {
    const grid = document.getElementById('brands-grid');
    const select = document.getElementById('brand-select');
    if (!grid || !select) return;

    const brandEntries = Object.entries(BRANDS_DATA);

    grid.innerHTML = brandEntries.map(([name, data], index) => `
        <div class="brand-item fade-in" data-brand="${name}">
            <div class="brand-logo"><img src="${data.logo}" alt="${name}"></div>
            <span class="brand-name">${name}</span>
            <span class="brand-count">${Math.floor(Math.random() * 800 + 50)}</span>
        </div>
    `).join('');

    grid.querySelectorAll('.brand-item').forEach(item => {
        item.addEventListener('click', () => {
            select.value = item.dataset.brand;
            select.dispatchEvent(new Event('change'));
            document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
        });
    });

    select.innerHTML = '<option value="">Összes márka</option>' +
        brandEntries.map(([name]) => `<option value="${name}">${name}</option>`).join('');

    // Initialize custom selects for search form
    const searchForm = document.getElementById('car-search-form');
    if (searchForm) {
        searchForm.querySelectorAll('select').forEach(s => new CustomSelect(s));
    }

    select.addEventListener('change', () => {
        const modelSelect = document.getElementById('model-select');
        const brand = select.value;
        if (brand && BRANDS_DATA[brand]) {
            modelSelect.disabled = false;
            const groups = getModelGroups(brand, BRANDS_DATA[brand].models);

            let optionsHtml = '<option value="">Összes modell</option>';
            Object.entries(groups).forEach(([groupName, models]) => {
                optionsHtml += `<optgroup label="${groupName}">`;
                optionsHtml += `<option value="group:${groupName}">${groupName} (mind)</option>`;
                models.forEach(m => {
                    optionsHtml += `<option value="${m}">${m}</option>`;
                });
                optionsHtml += `</optgroup>`;
            });
            modelSelect.innerHTML = optionsHtml;
        } else {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Előbb válassz márkát</option>';
        }
        filterCars();
    });

    document.getElementById('model-select').addEventListener('change', filterCars);
}

// ===== RENDER CARS =====
function renderCars(cars) {
    const grid = document.getElementById('car-list');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    if (countEl) countEl.innerHTML = `Összesen <strong>${cars.length}</strong> találat`;

    if (cars.length === 0) {
        grid.innerHTML = `
            <div class="placeholder" style="letter-spacing:2px;">
                🔍 NINCS TALÁLAT — PRÓBÁLJ MÁS SZŰRŐFELTÉTELEKET
            </div>
        `;
        return;
    }

    if (cars.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-size: 1.2rem;">Nincsenek megjeleníthető hirdetések. Legyél te az első, aki feltölt egyet!</div>';
        return;
    }

    grid.innerHTML = cars.map(car => {
        const isFav = favorites.includes(car.id);
        const displayImg = car.images && car.images.length > 0 ? car.images[0] : car.img;
        return `
        <div class="car-card fade-in" data-id="${car.id}">
             <a href="#ad/${car.id}" class="card-link-wrapper" style="text-decoration:none; color:inherit; display:block;">
                <div class="car-image">
                    ${car.badge ? `<span class="car-badge ${car.badge.class}">${car.badge.text}</span>` : ''}
                    <button class="car-fav ${isFav ? 'active' : ''}" data-fav-id="${car.id}" title="Kedvenc">${isFav ? '❤️' : '🤍'}</button>
                    <img src="${displayImg}" alt="${car.brand} ${car.model}" loading="lazy">
                </div>
                <div class="car-details">
                    <div class="car-header">
                        <div class="car-title">${car.brand} ${car.model}</div>
                        <div class="car-price">${formatPrice(car.price)}</div>
                    </div>
                    <div class="car-subtitle">${car.year} · ${car.transmission} · ${car.hp} LE</div>
                    <div class="car-specs">
                        <span class="car-tag">📅 ${car.year}</span>
                        <span class="car-tag">🛣️ ${formatKm(car.km)}</span>
                        <span class="car-tag">⛽ ${car.fuel}</span>
                        ${car.ccm ? `<span class="car-tag">🔧 ${car.ccm} ccm</span>` : ''}
                    </div>
                    <div class="car-footer">
                        <span>📍 ${car.city}</span>
                        <span>${daysAgoText(car.daysAgo)}</span>
                    </div>
                </div>
            </a>
        </div>`;
    }).join('');

    // Event listeners
    grid.querySelectorAll('.car-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(btn.dataset.favId, btn);
        });
    });

    // Staggered fade-in
    requestAnimationFrame(() => {
        grid.querySelectorAll('.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 80);
        });
    });
}

// ===== FILTER & SORT =====
function filterCars() {
    const brand = document.getElementById('brand-select').value;
    const model = document.getElementById('model-select').value;
    const fuel = document.getElementById('fuel-select').value;
    const yearFrom = parseInt(document.getElementById('year-from').value) || 0;
    const yearTo = parseInt(document.getElementById('year-to').value) || 9999;
    const priceFrom = parseInt(document.getElementById('price-from').value) || 0;
    const priceTo = parseInt(document.getElementById('price-to').value) || Infinity;
    const kmFrom = parseInt(document.getElementById('km-from').value) || 0;
    const kmTo = parseInt(document.getElementById('km-to').value) || Infinity;

    filteredCars = allCars.filter(car => {
        if (brand && car.brand !== brand) return false;
        if (model) {
            if (model.startsWith('group:')) {
                const groupName = model.replace('group:', '');
                const groupModels = getModelGroups(car.brand, BRANDS_DATA[car.brand].models)[groupName];
                if (!groupModels || !groupModels.includes(car.model)) return false;
            } else if (car.model !== model) {
                return false;
            }
        }
        if (fuel && car.fuel !== fuel) return false;
        if (car.year < yearFrom || car.year > yearTo) return false;
        if (car.price < priceFrom || car.price > priceTo) return false;
        if (car.km < kmFrom || car.km > kmTo) return false;
        return true;
    });

    sortCars();
    renderCars(filteredCars);
    updateSearchCount();
}

function sortCars() {
    const sort = document.getElementById('sort-select').value;
    switch (sort) {
        case 'price-asc': filteredCars.sort((a, b) => a.price - b.price); break;
        case 'price-desc': filteredCars.sort((a, b) => b.price - a.price); break;
        case 'km-asc': filteredCars.sort((a, b) => a.km - b.km); break;
        case 'year-desc': filteredCars.sort((a, b) => b.year - a.year); break;
        default: filteredCars.sort((a, b) => a.daysAgo - b.daysAgo); break;
    }
}

function updateSearchCount() {
    const el = document.getElementById('search-count');
    if (el) el.textContent = filteredCars.length.toLocaleString('hu-HU');
}

// ===== FAVORITES =====
function toggleFavorite(id, btn) {
    const idx = favorites.indexOf(id);
    const isBig = btn && btn.classList.contains('big');
    if (idx === -1) {
        favorites.push(id.toString());
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = isBig ? '❤️ Kedvenc' : '❤️';
        }
    } else {
        favorites.splice(idx, 1);
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = isBig ? '🤍 Kedvencekhez' : '🤍';
        }
    }
    localStorage.setItem('lunnarFavorites', JSON.stringify(favorites));
    syncFavoritesWithBackend();
}

// ===== MODAL =====
// ===== ROUTING & VIEWS =====
// ===== VIEW MANAGER (ROUTING) =====
function handleRouting() {
    const hash = window.location.hash || '#home';
    const views = ['view-home', 'view-ad-detail', 'view-favorites', 'view-profile'];

    // Hide all views
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('active');
        }
    });

    const homeAnchors = ['#home', '#hero', '#brands', '#listings', '#how-it-works'];
    const isHomeAnchor = homeAnchors.some(a => hash.startsWith(a));

    // Determine target view
    if (hash === '' || isHomeAnchor) {
        showView('view-home');
        if (hash.startsWith('#') && hash !== '#home') {
            const target = document.querySelector(hash);
            if (target) {
                setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    } else if (hash.startsWith('#ad/')) {
        const id = hash.replace('#ad/', '');
        renderAdDetail(id);
        showView('view-ad-detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash === '#favorites-view' || hash === '#view-favorites') {
        renderFavorites();
        showView('view-favorites');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash === '#view-profile') {
        if (!token) {
            window.location.hash = '#home';
            return;
        }
        try {
            renderProfile();
        } catch (e) {
            console.error("Profile rendering failed:", e);
        }
        showView('view-profile');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showView(viewId) {
    const v = document.getElementById(viewId);
    if (v) {
        v.style.display = 'block';
        v.classList.add('active');
    }
}

function renderAdDetail(id) {
    const car = allCars.find(c => c.id == id || c._id == id);
    const container = document.getElementById('detail-page-content');
    if (!container) return;

    if (!car) {
        container.innerHTML = '<div class="placeholder">HIRDETÉS NEM TALÁLHATÓ</div>';
        return;
    }

    const isFav = favorites.includes(car.id);
    const images = (car.images && car.images.length > 0) ? car.images : [car.img];

    container.innerHTML = `
        <div class="ad-full-detail">
            <a href="#home" class="back-link">← Vissza a kereséshez</a>
            <div class="detail-header-flex">
                <div class="detail-title-area">
                    <h1 class="detail-title">${car.brand} ${car.model}</h1>
                    <p class="detail-subtitle">${car.year} · ${car.fuel} · ${car.transmission}</p>
                </div>
                <div class="detail-price-area">
                    <div class="detail-price">${formatPrice(car.price)}</div>
                    <button class="car-fav big ${isFav ? 'active' : ''}" id="detail-fav-btn" data-fav-id="${car.id}">${isFav ? '❤️ Kedvenc' : '🤍 Kedvencekhez'}</button>
                </div>
            </div>

            <div class="detail-gallery">
                <div class="main-image-container">
                    <img src="${images[0]}" id="main-detail-img" alt="${car.brand} ${car.model}">
                </div>
                ${images.length > 1 ? `
                <div class="thumbnail-row">
                    ${images.map((img, i) => `
                        <div class="thumb ${i === 0 ? 'active' : ''}" onclick="document.getElementById('main-detail-img').src='${img}'; this.parentElement.querySelectorAll('.thumb').forEach(t=>t.classList.remove('active')); this.classList.add('active')">
                            <img src="${img}" alt="Kép ${i + 1}">
                        </div>
                    `).join('')}
                </div>` : ''}
            </div>

            <div class="detail-info-grid">
                <div class="detail-specs-card">
                    <h3>ADATOK</h3>
                    <div class="specs-list">
                        <div class="spec-item"><span>🐎 Teljesítmény</span><strong>${car.hp} LE</strong></div>
                        <div class="spec-item"><span>🛣️ Futott km</span><strong>${formatKm(car.km)}</strong></div>
                        <div class="spec-item"><span>📅 Évjárat</span><strong>${car.year}</strong></div>
                        <div class="spec-item"><span>⛽ Üzemanyag</span><strong>${car.fuel}</strong></div>
                        <div class="spec-item"><span>⚙️ Váltó</span><strong>${car.transmission}</strong></div>
                        ${car.ccm ? `<div class="spec-item"><span>🔧 Hengerűrtartalom</span><strong>${car.ccm} ccm</strong></div>` : ''}
                        <div class="spec-item"><span>📍 Település</span><strong>${car.city}</strong></div>
                    </div>
                </div>
                <div class="detail-desc-card">
                    <h3>LEÍRÁS</h3>
                    <p>${car.description || 'Nincs megadva leírás.'}</p>
                    <div class="detail-contact">
                        ${car.phone ? `
                            <button class="cta-button primary" onclick="window.location.href='tel:${car.phone}'">📞 ELADÓ HÍVÁSA (${car.phone})</button>
                            ${car.email ? `<p style="margin-top: 1rem; opacity: 0.7; font-size: 0.9rem;">📧 ${car.email}</p>` : ''}
                        ` : `
                            <button class="cta-button primary">📞 ELADÓ HÍVÁSA</button>
                        `}
                    </div>
                </div>
            </div>
        </div>
        `;

    const favBtn = container.querySelector('.car-fav');
    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorite(car.id, favBtn);
        });
    }
}

function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    const favCars = allCars.filter(c => favorites.includes(c.id.toString()) || favorites.includes(c._id ? c._id.toString() : ''));

    if (favCars.length === 0) {
        grid.innerHTML = '<div class="placeholder" style="grid-column: 1/-1;">MÉG NINCSENEK KEDVENC AUTÓID</div>';
        return;
    }

    renderCarsIn(favCars, grid);
}

// Custom render for any grid
function renderCarsIn(cars, grid) {
    grid.innerHTML = cars.map(car => {
        const isFav = favorites.includes(car.id);
        const displayImg = car.images && car.images.length > 0 ? car.images[0] : car.img;
        return `
        <div class="car-card visible" data-id="${car.id}">
             <a href="#ad/${car.id}" class="card-link-wrapper" style="text-decoration:none; color:inherit; display:block;">
                <div class="car-image">
                    ${car.badge ? `<span class="car-badge ${car.badge.class}">${car.badge.text}</span>` : ''}
                    <button class="car-fav ${isFav ? 'active' : ''}" data-fav-id="${car.id}" title="Kedvenc">${isFav ? '❤️' : '🤍'}</button>
                    <img src="${displayImg}" alt="${car.brand} ${car.model}" loading="lazy">
                </div>
                <div class="car-details">
                    <div class="car-header">
                        <div class="car-title">${car.brand} ${car.model}</div>
                        <div class="car-price">${formatPrice(car.price)}</div>
                    </div>
                    <div class="car-subtitle">${car.year} · ${car.transmission} · ${car.hp} LE</div>
                </div>
            </a>
        </div>`;
    }).join('');

    grid.querySelectorAll('.car-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(btn.dataset.favId, btn);
            if (window.location.hash === '#favorites-view') renderFavorites();
        });
    });
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        document.querySelector('header').classList.toggle('scrolled', window.scrollY > 20);
    });
}

// ===== HAMBURGER MENU =====
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('nav-links');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('open');
        });
    });
}

// ===== STATS COUNTER =====
function initStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-value[data-target]').forEach(el => {
                    const target = parseInt(el.dataset.target);
                    let current = 0;
                    const duration = 2000;
                    const step = target / (duration / 16);
                    function tick() {
                        current += step;
                        if (current < target) {
                            el.textContent = Math.floor(current).toLocaleString('hu-HU');
                            requestAnimationFrame(tick);
                        } else {
                            el.textContent = target.toLocaleString('hu-HU');
                        }
                    }
                    tick();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const sec = document.getElementById('stats');
    if (sec) observer.observe(sec);
}

// ===== FADE IN OBSERVER =====
// ===== FADE IN OBSERVER =====
function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== SEARCH FORM =====
function initSearch() {
    const form = document.getElementById('car-search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        filterCars();
        document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            const modelSelect = document.getElementById('model-select');
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Előbb válassz márkát</option>';
            filteredCars = [...allCars];
            renderCars(filteredCars);
            updateSearchCount();
        }, 10);
    });

    document.getElementById('fuel-select').addEventListener('change', filterCars);
    document.getElementById('sort-select').addEventListener('change', () => {
        sortCars();
        renderCars(filteredCars);
    });
}

// ===== MODAL EVENTS =====
function initModal() {
    const modal = document.getElementById('car-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const activeView = document.querySelector('.page-view.active');
        const isHomeView = activeView && activeView.id === 'view-home';

        // Routing links should follow normal hashchange behavior
        const routingHashes = ['#ad/', '#favorites-view', '#view-favorites', '#view-profile'];
        if (routingHashes.some(rh => href.startsWith(rh))) return;

        // If we are on home view, smooth scroll to section
        if (isHomeView) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, null, href); // Update URL without triggering hashchange reload
            } else if (href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                window.history.pushState(null, null, '#home');
            }
        }
        // If not on home view, let the anchor click happen -> triggers hashchange -> handleRouting switches view
    });
});

// ===== FETCH DATA =====
async function fetchAds() {
    let apiAds = [];
    try {
        const res = await fetch(`${API_BASE_URL}/ads`);
        if (res.ok) apiAds = await res.json();
    } catch (err) {
        console.warn('Backend server not running, using local fallback');
    }

    // Load local ads from storage
    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    const approvedLocalAds = localAds.filter(ad => ad.status === 'approved');

    // Merge: API ads take priority
    let combinedAds = [...apiAds, ...approvedLocalAds];

    allCars = combinedAds;
    filteredCars = [...allCars];
    renderCars(allCars);
    updateSearchCount();
}

// ===== AD SUBMISSION =====
function initSubmission() {
    const sellBtn = document.getElementById('sell-btn');
    const modal = document.getElementById('submission-modal');
    const closeBtn = document.getElementById('submission-close');
    const form = document.getElementById('ad-submission-form');
    const fileInput = document.getElementById('sub-img-file');
    const preview = document.getElementById('img-preview');

    // Selects
    const subBrand = document.getElementById('sub-brand');
    const subModel = document.getElementById('sub-model');
    const subFuel = document.getElementById('sub-fuel');
    const subTrans = document.getElementById('sub-transmission');

    let base64Images = [];

    // Init Selects
    if (subBrand) {
        subBrand.innerHTML += Object.keys(BRANDS_DATA).sort().map(b => `<option value="${b}">${b}</option>`).join('');
        subBrand.addEventListener('change', () => {
            const data = BRANDS_DATA[subBrand.value];
            if (!data) return;

            let html = '<option value="" disabled selected>Válassz modellt</option>';

            if (data.grouped) {
                Object.entries(data.models).forEach(([group, models]) => {
                    html += `<optgroup label="${group}">`;
                    models.forEach(m => {
                        html += `<option value="${m}">${m}</option>`;
                    });
                    html += `</optgroup>`;
                });
            } else {
                const models = data.models || [];
                html += models.map(m => `<option value="${m}">${m}</option>`).join('');
            }

            subModel.innerHTML = html;
            subModel.disabled = false;
        });
    }

    if (subFuel) {
        subFuel.innerHTML += FUEL_TYPES.map(f => `<option value="${f}">${f}</option>`).join('');
    }

    if (subTrans) {
        subTrans.innerHTML += TRANSMISSIONS.map(t => `<option value="${t}">${t}</option>`).join('');
    }

    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);

            for (const file of files) {
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.readAsDataURL(file);
                });
                base64Images.push(base64);
            }
            updateImagePreviews();
            fileInput.value = ''; // Reset input to allow same file selection
        });
    }

    function updateImagePreviews() {
        if (base64Images.length === 0) {
            preview.innerHTML = '<div class="preview-placeholder">A feltöltött képek itt fognak megjelenni</div>';
            return;
        }

        preview.innerHTML = base64Images.map((img, index) => `
            <div class="preview-card">
                <img src="${img}">
                <button type="button" class="remove-img-btn" onclick="removeImage(${index})" title="Kép törlése">&times;</button>
            </div>
        `).join('');
    }

    window.removeImage = (index) => {
        base64Images.splice(index, 1);
        updateImagePreviews();
    };

    if (sellBtn) sellBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (closeBtn) closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        preview.innerHTML = '<div class="preview-placeholder">A feltöltött képek itt fognak megjelenni</div>';
        base64Images = [];
        if (subModel) {
            subModel.disabled = true;
            subModel.innerHTML = '<option value="" disabled selected>Előbb válassz márkát</option>';
        }
    });

    if (form) form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Submission started...');

        try {
            if (base64Images.length === 0) {
                showToast('Kérjük, válassz ki legalább egy képet!', 'error');
                return;
            }

            // Helper to get element value safely
            const getVal = (id) => {
                const el = document.getElementById(id);
                if (!el) {
                    console.error(`Missing element: ${id}`);
                    return "";
                }
                return el.value;
            };

            const formData = {
                id: 'local-' + Date.now(),
                brand: subBrand ? subBrand.value : "",
                model: subModel ? subModel.value : "",
                year: parseInt(getVal('sub-year')) || 0,
                price: parseInt(getVal('sub-price')) || 0,
                km: parseInt(getVal('sub-km')) || 0,
                city: getVal('sub-city'),
                hp: parseInt(getVal('sub-hp')) || 0,
                ccm: parseInt(getVal('sub-ccm')) || 0,
                phone: getVal('sub-phone'),
                email: getVal('sub-email'),
                images: base64Images,
                description: getVal('sub-desc'),
                fuel: subFuel ? subFuel.value : "",
                transmission: subTrans ? subTrans.value : "",
                status: 'pending',
                createdAt: new Date().toISOString(),
                ownerEmail: currentUser ? currentUser.email : '',
                ownerId: currentUser ? currentUser.id : ''
            };

            console.log('FormData collected:', formData);

            let success = false;
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API_BASE_URL}/ads`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(formData)
                });
                if (res.ok) success = true;
            } catch (err) {
                console.warn('Backend failure, saving locally...');
            }

            if (!success) {
                const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
                localAds.push(formData);
                localStorage.setItem('lunnarLocalAds', JSON.stringify(localAds));
                showToast('A hirdetést helyileg elmentettük! Az admin panelen jóváhagyhatod.', 'info');
                success = true;
            }

            if (success) {
                showToast('Hirdetés sikeresen beküldve! 🎉 Az adminisztrátor hamarosan jóváhagyja.', 'success');
                modal.classList.remove('active');
                form.reset();
                if (preview) preview.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #555; padding: 1rem;">Képek előnézete</div>';
                base64Images = [];
                if (subModel) {
                    subModel.disabled = true;
                    subModel.innerHTML = '<option value="" disabled selected>Előbb válassz márkát</option>';
                }
                document.body.style.overflow = '';
                fetchAds();
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast('Hiba történt a beküldés során. Kérjük, próbáld újra!', 'error');
        }
    });
}


async function fetchAdminAds() {
    const grid = document.getElementById('admin-ad-list');
    let apiAds = [];
    try {
        const res = await fetch(`${API_BASE_URL}/admin/ads`);
        if (res.ok) apiAds = await res.json();
    } catch (err) {
        console.warn('Backend error in admin fetch');
    }

    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    // Show ALL ads for management in admin view
    const combined = [...apiAds, ...localAds];

    if (combined.length === 0) {
        grid.innerHTML = '<div class="placeholder">NINCSENEK MEGJELENÍTHETŐ HIRDETÉSEK</div>';
        return;
    }
    renderAdminAds(combined);
}

function renderAdminAds(ads) {
    const grid = document.getElementById('admin-ad-list');
    grid.innerHTML = ads.map(ad => {
        const displayImages = ad.images && ad.images.length > 0 ? ad.images : [ad.img];
        return `
        <div class="car-card" style="cursor:default;">
            <div class="car-image-mod" style="display: flex; gap: 2px; overflow-x: auto; height: 120px; background: #000;">
                ${displayImages.map(img => `<img src="${img}" style="height: 100%; flex-shrink: 0; object-fit: cover; width: 100px;">`).join('')}
            </div>
            <div class="car-details">
                <span class="status-badge status-${ad.status}">${ad.status}</span>
                <div class="car-title">${ad.brand} ${ad.model}</div>
                <div class="car-price">${formatPrice(ad.price)}</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">
                    📞 ${ad.phone || 'Nincs tel.'} | 📧 ${ad.email || 'Nincs email'}
                </div>
                <div class="admin-actions" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                    ${ad.status === 'pending' ? `
                        <button class="admin-btn approve" onclick="moderateAd('${ad._id || ad.id}', 'approved')">Elfogad</button>
                        <button class="admin-btn reject" onclick="moderateAd('${ad._id || ad.id}', 'rejected')">Elutasít</button>
                    ` : `
                        <button class="admin-btn" disabled style="opacity:0.5">${ad.status === 'approved' ? 'Elfogadva' : 'Elutasítva'}</button>
                    `}
                    <button class="admin-btn reject" onclick="deleteAd('${ad._id || ad.id}')" style="background:#dc2626">Törlés</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

async function moderateAd(id, status) {
    // Check if it's a local ad
    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    const localIdx = localAds.findIndex(ad => ad.id === id);

    if (localIdx !== -1) {
        localAds[localIdx].status = status;
        localStorage.setItem('lunnarLocalAds', JSON.stringify(localAds));
        fetchAdminAds();
        fetchAds();
        return;
    }

    // Otherwise try API
    try {
        const res = await fetch(`${API_BASE_URL}/admin/ads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            fetchAdminAds();
            fetchAds();
        }
    } catch (err) {
        alert('Hiba a moderálás során. Ha ez egy szerver-oldali hirdetés, a szervernek futnia kell!');
    }
}

async function deleteAd(id) {
    if (!confirm('Biztosan törölni szeretnéd ezt a hirdetést?')) return;

    // Local ad check
    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    const localIdx = localAds.findIndex(ad => ad.id === id);

    if (localIdx !== -1) {
        localAds.splice(localIdx, 1);
        localStorage.setItem('lunnarLocalAds', JSON.stringify(localAds));
        fetchAdminAds();
        fetchAds();
        return;
    }

    // API ad check
    try {
        const res = await fetch(`${API_BASE_URL}/admin/ads/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            fetchAdminAds();
            fetchAds();
        }
    } catch (err) {
        alert('Hiba a törlés során. A szervernek futnia kell!');
    }
}

function toggleAdmin() {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel.style.display === 'none') {
        const pw = prompt('Kérjük, add meg az admin jelszót:');
        if (pw === 'levi123') {
            adminPanel.style.display = 'block';
            fetchAdminAds();
            adminPanel.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Helytelen jelszó!');
        }
    } else {
        adminPanel.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(()=>this.parentElement.remove(), 300)">✕</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

// ===== LOCAL AUTH HELPERS =====
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return 'lh_' + Math.abs(hash).toString(36) + '_' + btoa(str).slice(0, 12);
}

function getUsers() {
    return JSON.parse(localStorage.getItem('lunnarUsers') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('lunnarUsers', JSON.stringify(users));
}

function generateLocalToken(userId) {
    return 'lt_' + userId + '_' + Date.now().toString(36);
}

// ===== AUTH LOGIC =====

// ========================================================
// EMAILJS BEÁLLÍTÁS
// 1. Menj: https://www.emailjs.com és regisztrálj (ingyenes)
// 2. Add Services → Gmail (vagy más) → másold az Service ID-t
// 3. Add Email Templates (KETTŐ sablon kell):
//    a) Hitelesítési sablon (reg_verify_template): 
//       To: {{to_email}}, Subject: "Lunnar – Fiók hitelesítés"
//       Body: "Hitelesítési kódod: {{code}}"
//    b) Jelszó visszaállítás sablon (reset_pw_template):
//       To: {{to_email}}, Subject: "Lunnar – Jelszó visszaállítás"
//       Body: "Visszaállítási kódod: {{code}}"
// 4. Account → General → másold a Public Key-t
// 5. Töltsd ki az alábbi értékeket:
// ========================================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'O6bdBo6yyIOOiouPr',       // pl. 'aBcDeFgHiJkLmNoP'
    SERVICE_ID: 'service_zlzjea5',        // pl. 'service_abc123'
    VERIFY_TEMPLATE_ID: 'template_nhph4mk',// pl. 'template_abc123'
    RESET_TEMPLATE_ID: 'template_hbxe8w3', // pl. 'template_xyz789'
};

// EmailJS inicializálás
(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    }
})();

// Valódi email küldő függvény
async function sendEmailCode(toEmail, code, type = 'verify') {
    if (typeof emailjs === 'undefined') {
        showToast('Email szolgáltatás nem elérhető!', 'error');
        return false;
    }
    const templateId = type === 'verify'
        ? EMAILJS_CONFIG.VERIFY_TEMPLATE_ID
        : EMAILJS_CONFIG.RESET_TEMPLATE_ID;

    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, templateId, {
            to_email: toEmail,
            code: code,
        });
        return true;
    } catch (err) {
        console.error('EmailJS hiba:', err);
        showToast('Email küldési hiba: ' + (err.text || err.message || 'Ismeretlen hiba'), 'error');
        return false;
    }
}

// In-memory stores for verification codes
let pendingVerifications = {}; // email -> { code, userData }
let pendingResets = {};        // email -> code

function generateCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function initAuth() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    const logoutNavBtn = document.getElementById('logout-nav-btn');
    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const forgotModal = document.getElementById('forgot-modal');
    const verifyModal = document.getElementById('verify-modal');

    function updateAuthUI() {
        const userInfo = document.getElementById('user-info');
        const userDisplayName = document.getElementById('user-display-name');
        const userAvatarLetter = document.getElementById('user-avatar-letter');

        if (token && currentUser) {
            if (loginNavBtn) loginNavBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'block';
            if (userDisplayName) userDisplayName.textContent = currentUser.username.toUpperCase();
            if (userAvatarLetter) userAvatarLetter.textContent = currentUser.username.charAt(0).toUpperCase();
        } else {
            if (loginNavBtn) loginNavBtn.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    updateAuthUI();

    // Profile Dropdown Toggle
    const profileToggle = document.getElementById('profile-toggle');
    if (profileToggle) {
        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const userMenu = document.getElementById('user-info');
            if (userMenu) userMenu.classList.toggle('active');
        });
    }

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('user-info');
        if (!userMenu) return;

        // If clicking outside the menu OR clicking a dropdown item link
        if (!userMenu.contains(e.target) || e.target.closest('.user-dropdown-item')) {
            userMenu.classList.remove('active');
        }
    });

    if (loginNavBtn) loginNavBtn.addEventListener('click', () => {
        if (!authModal) return;
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    if (logoutNavBtn) logoutNavBtn.addEventListener('click', () => {
        token = null;
        currentUser = null;
        localStorage.removeItem('lunnarToken');
        localStorage.removeItem('lunnarUser');
        updateAuthUI();
        showToast('Sikeresen kijelentkeztél!', 'info');
        window.location.hash = '#home';
    });

    if (authClose) authClose.addEventListener('click', () => {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Click outside modal closes it
    if (authModal) authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabBtns.forEach(b => b.style.opacity = '0.6');
            btn.style.opacity = '1';

            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
            const targetContent = document.getElementById(btn.dataset.tab);
            if (targetContent) targetContent.style.display = 'block';
        });
    });

    // Handle switch links (Don't have an account? etc.)
    document.querySelectorAll('.auth-switch-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            const tabBtn = document.querySelector(`.tab-btn[data-tab="${targetTab}"]`);
            if (tabBtn) tabBtn.click();
        });
    });

    // ===== REGISTRATION =====
    if (regForm) regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const termsCheckbox = document.getElementById('reg-terms');
        const submitBtn = regForm.querySelector('.auth-submit-btn');

        // Validation
        if (username.length < 3) { showToast('A felhasználónév legalább 3 karakter legyen!', 'error'); return; }
        if (!email.includes('@') || !email.includes('.')) { showToast('Kérjük, adj meg egy érvényes email címet!', 'error'); return; }
        if (password.length < 6) { showToast('A jelszó legalább 6 karakter legyen!', 'error'); return; }
        if (!/[A-Z]/.test(password)) { showToast('A jelszónak tartalmaznia kell legalább egy nagybetűt!', 'error'); return; }
        if (!/[0-9]/.test(password)) { showToast('A jelszónak tartalmaznia kell legalább egy számot!', 'error'); return; }
        if (password !== passwordConfirm) { showToast('A két jelszó nem egyezik!', 'error'); return; }
        if (termsCheckbox && !termsCheckbox.checked) { showToast('El kell fogadnod az Általános Szerződési Feltételeket!', 'error'); return; }

        const users = getUsers();
        if (users.find(u => u.email === email)) { showToast('Ez az email cím már regisztrálva van!', 'error'); return; }
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) { showToast('Ez a felhasználónév már foglalt!', 'error'); return; }

        // Küldés indul – loading állapot
        if (submitBtn) { submitBtn.disabled = true; submitBtn.querySelector('span').textContent = 'KÜLDÉS...'; }

        // Generate verification code
        const code = generateCode();
        pendingVerifications[email] = {
            code,
            userData: { id: 'user_' + Date.now(), username, email, passwordHash: simpleHash(password), createdAt: new Date().toISOString() }
        };

        // Valódi email küldés EmailJS-sel
        const sent = await sendEmailCode(email, code, 'verify');

        if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'FIÓK LÉTREHOZÁSA'; }

        if (!sent) {
            delete pendingVerifications[email];
            return; // Hiba toast már megjelent a sendEmailCode-ban
        }

        // Email elküldve – megnyitjuk a hitelesítési modalt
        authModal.classList.remove('active');
        document.getElementById('verify-email-display').textContent = email;
        document.getElementById('verify-code').value = '';
        verifyModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        showToast('Hitelesítési kódot elküldtük az email címedre! 📧 Ellenőrizd a postafiókodat.', 'success', 6000);
        regForm.reset();
        resetPasswordRequirements();
    });

    // ===== EMAIL VERIFICATION =====
    const verifyForm = document.getElementById('verify-form');
    if (verifyForm) verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('verify-code').value.trim();
        const emailDisplay = document.getElementById('verify-email-display').textContent;
        const pending = pendingVerifications[emailDisplay];

        if (!pending) { showToast('Hiba: nincs aktív hitelesítési kérelem.', 'error'); return; }
        if (codeInput !== pending.code) { showToast('Helytelen kód! Próbáld újra.', 'error'); return; }

        // Code matches – save user
        const users = getUsers();
        users.push(pending.userData);
        saveUsers(users);
        delete pendingVerifications[emailDisplay];

        verifyModal.classList.remove('active');
        document.body.style.overflow = '';
        showToast('Fiókod sikeresen létrehozva és hitelesítve! 🎉 Most már bejelentkezhetsz.', 'success', 6000);

        // Open login modal and prefill email
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.querySelector('[data-tab="login-tab"]').click();
        setTimeout(() => {
            document.getElementById('login-email').value = emailDisplay;
            document.getElementById('login-password').focus();
        }, 100);
    });

    // Resend code
    const resendBtn = document.getElementById('resend-code');
    if (resendBtn) resendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const emailDisplay = document.getElementById('verify-email-display').textContent;
        const pending = pendingVerifications[emailDisplay];
        if (!pending) { showToast('Nincs aktív hitelesítési kérelem.', 'error'); return; }

        const newCode = generateCode();
        pending.code = newCode;
        sendEmailCode(emailDisplay, newCode, 'verify').then(sent => {
            if (sent) showToast('Kódot újraküldtük! Ellenőrizd a postafiókodat.', 'success');
        });
    });

    // ===== LOGIN =====
    if (loginForm) loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        if (!email || !password) { showToast('Kérjük, töltsd ki az összes mezőt!', 'error'); return; }

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) { showToast('Nem található fiók ezzel az email címmel!', 'error'); return; }
        if (user.passwordHash !== simpleHash(password)) { showToast('Hibás jelszó! Próbáld újra.', 'error'); return; }

        token = generateLocalToken(user.id);
        currentUser = { username: user.username, email: user.email, id: user.id };
        localStorage.setItem('lunnarToken', token);
        localStorage.setItem('lunnarUser', JSON.stringify(currentUser));

        showToast(`Üdvözöljük, ${user.username}! 🎉`, 'success');
        authModal.classList.remove('active');
        document.body.style.overflow = '';
        loginForm.reset();
        updateAuthUI();
    });

    // ===== FORGOT PASSWORD link =====
    const forgotLink = document.querySelector('.forgot-password');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.remove('active');
            document.getElementById('forgot-step-1').style.display = 'block';
            document.getElementById('forgot-step-2').style.display = 'none';
            document.getElementById('forgot-email').value = document.getElementById('login-email').value || '';
            document.getElementById('forgot-form').reset();
            forgotModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close forgot modal
    const forgotClose = document.getElementById('forgot-close');
    if (forgotClose) forgotClose.addEventListener('click', () => {
        forgotModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    if (forgotModal) forgotModal.addEventListener('click', (e) => {
        if (e.target === forgotModal) { forgotModal.classList.remove('active'); document.body.style.overflow = ''; }
    });

    // Back to login from forgot
    const backToLoginBtn = document.getElementById('back-to-login-from-forgot');
    if (backToLoginBtn) backToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        forgotModal.classList.remove('active');
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // STEP 1: Submit email for reset
    const forgotForm = document.getElementById('forgot-form');
    if (forgotForm) forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();
        const submitBtn = forgotForm.querySelector('.auth-submit-btn');
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            showToast('Nem található fiók ezzel az email címmel!', 'error');
            return;
        }

        // Loading állapot
        if (submitBtn) { submitBtn.disabled = true; submitBtn.querySelector('span').textContent = 'KÜLDÉS...'; }

        const code = generateCode();
        pendingResets[email] = code;

        // Valódi email küldés
        const sent = await sendEmailCode(email, code, 'reset');

        if (submitBtn) { submitBtn.disabled = false; submitBtn.querySelector('span').textContent = 'KÓD KÜLDÉSE'; }

        if (!sent) {
            delete pendingResets[email];
            return; // Hiba toast már megjelent
        }

        // Email elküldve – megjelenítjük a 2. lépést
        document.getElementById('forgot-step-1').style.display = 'none';
        document.getElementById('forgot-step-2').style.display = 'block';
        document.getElementById('forgot-code').value = '';
        document.getElementById('forgot-new-pw').value = '';
        resetForgotPasswordRequirements();

        showToast('Visszaállítási kódot elküldtük! 📧 Ellenőrizd a postafiókodat.', 'success', 6000);
    });

    // STEP 2: Verify code and set new password
    const forgotResetForm = document.getElementById('forgot-reset-form');
    if (forgotResetForm) forgotResetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();
        const codeInput = document.getElementById('forgot-code').value.trim();
        const newPw = document.getElementById('forgot-new-pw').value;

        if (!pendingResets[email]) { showToast('Hiba: nincs aktív visszaállítási kérelem.', 'error'); return; }
        if (codeInput !== pendingResets[email]) { showToast('Helytelen kód! Próbáld újra.', 'error'); return; }
        if (newPw.length < 6) { showToast('A jelszó legalább 6 karakter legyen!', 'error'); return; }
        if (!/[A-Z]/.test(newPw)) { showToast('A jelszónak nagybetűt kell tartalmaznia!', 'error'); return; }
        if (!/[0-9]/.test(newPw)) { showToast('A jelszónak számot kell tartalmaznia!', 'error'); return; }

        const users = getUsers();
        const userIdx = users.findIndex(u => u.email === email);
        if (userIdx === -1) { showToast('Felhasználó nem található!', 'error'); return; }

        users[userIdx].passwordHash = simpleHash(newPw);
        saveUsers(users);
        delete pendingResets[email];

        forgotModal.classList.remove('active');
        document.body.style.overflow = '';
        showToast('Jelszavad sikeresen megváltozott! 🎉 Most már bejelentkezhetsz.', 'success', 6000);

        // Open login modal and prefill email
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.querySelector('[data-tab="login-tab"]').click();
        setTimeout(() => {
            document.getElementById('login-email').value = email;
            document.getElementById('login-password').focus();
        }, 100);
    });

    // ===== PASSWORD TOGGLES (all, including new modals) =====
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) {
                const isPassword = target.type === 'password';
                target.type = isPassword ? 'text' : 'password';
                btn.innerHTML = isPassword ? '👁' : '◌';
            }
        });
    });

    // ===== PASSWORD REQUIREMENTS — REGISTRATION =====
    const regPasswordInput = document.getElementById('reg-password');
    if (regPasswordInput) {
        regPasswordInput.addEventListener('input', () => {
            applyPasswordRequirements(regPasswordInput.value,
                document.getElementById('req-length'),
                document.getElementById('req-upper'),
                document.getElementById('req-number')
            );
        });
    }

    // ===== PASSWORD REQUIREMENTS — FORGOT PASSWORD RESET =====
    const forgotNewPwInput = document.getElementById('forgot-new-pw');
    if (forgotNewPwInput) {
        forgotNewPwInput.addEventListener('input', () => {
            applyPasswordRequirements(forgotNewPwInput.value,
                document.getElementById('freq-length'),
                document.getElementById('freq-upper'),
                document.getElementById('freq-number')
            );
        });
    }
}

// Shared helper: update requirement checkmarks
function applyPasswordRequirements(pw, elLength, elUpper, elNumber) {
    if (elLength) { elLength.classList.toggle('met', pw.length >= 6); }
    if (elUpper) { elUpper.classList.toggle('met', /[A-Z]/.test(pw)); }
    if (elNumber) { elNumber.classList.toggle('met', /[0-9]/.test(pw)); }
}

function resetPasswordRequirements() {
    ['req-length', 'req-upper', 'req-number'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('met');
    });
}

function resetForgotPasswordRequirements() {
    ['freq-length', 'freq-upper', 'freq-number'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('met');
    });
}

async function syncFavoritesWithBackend() {
    // Local-only: favorites are already in localStorage
    // Try backend sync if available, silently fail otherwise
    if (!token) return;
    try {
        await fetch(`${API_BASE_URL}/user/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ favorites })
        });
    } catch (e) { /* Backend not available, that's fine */ }
}

async function renderProfile() {
    if (!token || !currentUser) return;

    // 1. Basic User Info
    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');

    if (usernameEl) usernameEl.textContent = currentUser.username.toUpperCase();
    if (emailEl) emailEl.textContent = currentUser.email;
    if (avatarEl) avatarEl.textContent = currentUser.username.charAt(0).toUpperCase();

    // 2. Stats Calculation
    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    const myAds = localAds.filter(ad => ad.ownerEmail === currentUser.email || ad.ownerId === currentUser.id);

    const favsIds = JSON.parse(localStorage.getItem('lunnarFavorites') || '[]');
    const favsActive = allCars.filter(c => favsIds.includes(c.id) || favsIds.includes(c._id));

    const adsCountEl = document.getElementById('stat-ads-count');
    const favsCountEl = document.getElementById('stat-favs-count');

    if (adsCountEl) adsCountEl.textContent = myAds.length;
    if (favsCountEl) favsCountEl.textContent = favsActive.length;

    // 3. Render Listings & Favorites
    fetchMyAds();
    renderProfileFavorites();
}

let profileTabsInitialized = false;
function initProfileTabs() {
    if (profileTabsInitialized) return;
    const tabs = document.querySelectorAll('.profile-tab-btn');
    const contents = document.querySelectorAll('.profile-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.profileTab;

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetContent = document.getElementById(`profile-tab-${target}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });
    profileTabsInitialized = true;
}

function renderProfileFavorites() {
    const grid = document.getElementById('my-favorites-list');
    if (!grid) return;

    const favIds = JSON.parse(localStorage.getItem('lunnarFavorites') || '[]');
    const favCars = allCars.filter(c => favIds.includes(c.id) || favIds.includes(c._id));

    if (favCars.length === 0) {
        grid.innerHTML = '<div class="placeholder">NINCSENEK MÉG KEDVENCEID</div>';
        return;
    }

    grid.innerHTML = favCars.map(car => renderCarCard(car)).join('');
}

async function fetchMyAds() {
    if (!token || !currentUser) return;
    const grid = document.getElementById('my-ads-list');
    if (!grid) return;

    // Local ads
    const localAds = JSON.parse(localStorage.getItem('lunnarLocalAds') || '[]');
    const ads = localAds.filter(ad => ad.ownerEmail === currentUser.email || ad.ownerId === currentUser.id);

    if (ads.length === 0) {
        grid.innerHTML = '<div class="placeholder">NINCSENEK MÉG HIRDETÉSEID</div>';
        return;
    }

    grid.innerHTML = ads.map(ad => renderCarCard(ad)).join('');
}

function renderCarCard(car) {
    const badge = car.badge ? `<div class="badge ${car.badge.class}">${car.badge.text}</div>` : '';
    const img = car.images && car.images.length > 0 ? car.images[0] : car.img;
    const price = typeof formatPrice === 'function' ? formatPrice(car.price) : car.price;
    const km = typeof formatKm === 'function' ? formatKm(car.km) : car.km;

    return `
        <div class="car-card" onclick="window.location.hash='#ad/${car._id || car.id}'">
            <div class="car-image">
                <img src="${img}" alt="${car.brand} ${car.model}" loading="lazy">
                ${badge}
                <div class="car-overlay">
                    <span>RÉSZLETEK</span>
                </div>
            </div>
            <div class="car-details">
                <div class="car-title">${car.brand} ${car.model}</div>
                <div class="car-price">${price}</div>
                <div class="car-info">
                    <span>${car.year}</span>
                    <span>${km}</span>
                    <span>${car.fuel}</span>
                </div>
                ${car.status ? `
                <div style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">
                    Státusz: <span class="status-${car.status}">${car.status}</span>
                </div>` : ''}
            </div>
        </div>
    `;
}

// Global exposure for onclick
window.moderateAd = moderateAd;
window.deleteAd = deleteAd;
window.toggleAdmin = toggleAdmin;

// ===== INIT EVERYTHING =====
function init() {
    resizeCanvas();
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());
    animateStars();
    typeSubtitle();
    initNeural();
    initBrands();
    fetchAds();
    initSearch();
    initModal();
    initSubmission();
    initAuth();
    initHeaderScroll();
    initHamburger();
    initStats();
    initFadeIn();
    initProfileTabs();

    // Router
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
}

window.addEventListener('resize', () => {
    resizeCanvas();
    resizeNeural();
});

init();
