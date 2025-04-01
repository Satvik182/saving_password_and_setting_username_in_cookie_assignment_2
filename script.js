const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store key-value pair in local storage
function store(key, value) {
    localStorage.setItem(key, value);
}

// Retrieve value from local storage
function retrieve(key) {
    return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear local storage
function clearStorage() {
    localStorage.clear();
}

// Generate SHA-256 hash
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get or generate a SHA-256 hash
async function getSHA256Hash() {
    let cachedHash = retrieve('sha256');
    if (cachedHash) {
        return cachedHash;
    }

    const randomNumber = getRandomNumber(MIN, MAX);
    store('originalNumber', randomNumber); // Store the original number for debugging
    cachedHash = await sha256(randomNumber.toString());
    store('sha256', cachedHash);

    return cachedHash;
}

// Display the hash when the page loads
async function main() {
    sha256HashView.innerHTML = 'Calculating...';
    const hash = await getSHA256Hash();
    sha256HashView.innerHTML = hash;
}

// Check if the entered PIN matches the hash
async function test() {
    const pin = pinInput.value.trim();

    if (pin.length !== 3) {
        resultView.innerHTML = '💡 Please enter a 3-digit number.';
        resultView.classList.remove('hidden');
        return;
    }

    const hashedPin = await sha256(pin);
    const storedHash = retrieve('sha256');

    if (hashedPin === storedHash) {
        resultView.innerHTML = '🎉 Success! You found the correct number.';
        resultView.classList.add('success');
    } else {
        resultView.innerHTML = '❌ Incorrect. Try again!';
    }
    resultView.classList.remove('hidden');
}

// Restrict input to numbers only (max 3 digits)
pinInput.addEventListener('input', (e) => {
    pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the test function to the button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('check').addEventListener('click', test);
    main();
});
