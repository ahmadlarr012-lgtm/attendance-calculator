class JokeGenerator {
    constructor() {
        this.currentJoke = null;
        this.jokesLoaded = 0;
        this.jokeHistory = [];
        this.currentFilter = 'all';
        this.maxHistory = 10;
        this.apiEndpoint = 'https://official-joke-api.appspot.com';
        
        this.loadHistory();
        this.getNewJoke();
    }

    async getNewJoke() {
        try {
            const jokeBtn = document.getElementById('newJokeBtn');
            jokeBtn.disabled = true;
            jokeBtn.innerHTML = '<span class="btn-icon">⏳</span> Loading...';

            let url = `${this.apiEndpoint}/random_joke`;

            if (this.currentFilter !== 'all') {
                url = `${this.apiEndpoint}/jokes/${this.currentFilter}/random`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            this.currentJoke = data;
            this.jokesLoaded++;
            
            this.displayJoke(data);
            this.updateStats();
            this.addToHistory(data);
            this.updateAPIStatus(true);

        } catch (error) {
            console.error('Error fetching joke:', error);
            this.displayError('Failed to load joke. Please try again!');
            this.updateAPIStatus(false);
        } finally {
            jokeBtn.disabled = false;
            jokeBtn.innerHTML = '<span class="btn-icon">🎭</span> Get New Joke';
        }
    }

    displayJoke(joke) {
        const jokeContent = document.getElementById('jokeContent');
        const jokeType = document.getElementById('jokeType');

        let jokeHTML = '';

        if (joke.setup && joke.delivery) {
            jokeHTML = `
                <p>${joke.setup}</p>
                <p class="punchline">${joke.delivery}</p>
            `;
        } else if (joke.joke) {
            jokeHTML = `<p>${joke.joke}</p>`;
        }

        jokeContent.innerHTML = jokeHTML;
        
        const type = joke.type || 'general';
        jokeType.textContent = `Type: ${type}`;
        jokeType.className = `joke-type`;

        document.getElementById('copyBtn').style.display = 'inline-flex';
        document.getElementById('shareBtn').style.display = 'inline-flex';
    }

    displayError(message) {
        const jokeContent = document.getElementById('jokeContent');
        jokeContent.innerHTML = `<p class="error">❌ ${message}</p>`;
        document.getElementById('jokeType').textContent = '';
        document.getElementById('copyBtn').style.display = 'none';
        document.getElementById('shareBtn').style.display = 'none';
    }

    copyJoke() {
        if (!this.currentJoke) return;

        let jokeText = '';
        if (this.currentJoke.setup && this.currentJoke.delivery) {
            jokeText = `${this.currentJoke.setup}\n${this.currentJoke.delivery}`;
        } else if (this.currentJoke.joke) {
            jokeText = this.currentJoke.joke;
        }

        navigator.clipboard.writeText(jokeText).then(() => {
            this.showToast('Joke copied to clipboard! 📋', 'success');
        }).catch(() => {
            this.showToast('Failed to copy joke ❌', 'error');
        });
    }

    async shareJoke() {
        if (!this.currentJoke) return;

        let jokeText = '';
        if (this.currentJoke.setup && this.currentJoke.delivery) {
            jokeText = `${this.currentJoke.setup}\n${this.currentJoke.delivery}`;
        } else if (this.currentJoke.joke) {
            jokeText = this.currentJoke.joke;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Random Joke',
                    text: jokeText,
                });
                this.showToast('Joke shared successfully! 🔗', 'success');
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            this.copyJoke();
        }
    }

    addToHistory(joke) {
        const historyItem = {
            id: Date.now(),
            type: joke.type || 'general',
            text: joke.setup && joke.delivery 
                ? `${joke.setup} ${joke.delivery}` 
                : joke.joke,
            timestamp: new Date().toLocaleTimeString()
        };

        this.jokeHistory.unshift(historyItem);

        if (this.jokeHistory.length > this.maxHistory) {
            this.jokeHistory.pop();
        }

        this.saveHistory();
        this.displayHistory();
    }

    displayHistory() {
        const historyList = document.getElementById('historyList');
        const historyCount = document.getElementById('historyCount');
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');

        historyCount.textContent = `(${this.jokeHistory.length})`;

        if (this.jokeHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-message">No jokes yet. Generate one to get started!</p>';
            clearHistoryBtn.style.display = 'none';
            return;
        }

        clearHistoryBtn.style.display = 'inline-block';

        historyList.innerHTML = this.jokeHistory.map(item => `
            <div class="history-item" onclick="app.loadFromHistory(${item.id})">
                <div class="history-item-type">${item.type} • ${item.timestamp}</div>
                <div class="history-item-text">${item.text.substring(0, 100)}${item.text.length > 100 ? '...' : ''}</div>
            </div>
        `).join('');
    }

    loadFromHistory(id) {
        const item = this.jokeHistory.find(h => h.id === id);
        if (!item) return;

        const jokeContent = document.getElementById('jokeContent');
        jokeContent.innerHTML = `<p>${item.text}</p>`;

        document.getElementById('jokeType').textContent = `Type: ${item.type}`;
        document.getElementById('jokeType').className = `joke-type`;

        this.showToast('Loaded from history! 📜', 'success');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            this.jokeHistory = [];
            this.saveHistory();
            this.displayHistory();
            this.showToast('History cleared! 🗑️', 'success');
        }
    }

    saveHistory() {
        localStorage.setItem('jokeHistory', JSON.stringify(this.jokeHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem('jokeHistory');
        if (saved) {
            try {
                this.jokeHistory = JSON.parse(saved);
                this.displayHistory();
            } catch (e) {
                console.error('Error loading history:', e);
            }
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.getNewJoke();
    }

    updateStats() {
        document.getElementById('jokesCount').textContent = this.jokesLoaded;
    }

    updateAPIStatus(isOnline) {
        const statusEl = document.getElementById('apiStatus');
        if (isOnline) {
            statusEl.textContent = '✓ Online';
            statusEl.className = 'stat-value status-good';
        } else {
            statusEl.textContent = '✗ Offline';
            statusEl.className = 'stat-value status-error';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function getNewJoke() {
    app.getNewJoke();
}

function copyJoke() {
    app.copyJoke();
}

function shareJoke() {
    app.shareJoke();
}

function setFilter(filter) {
    app.setFilter(filter);
}

function clearHistory() {
    app.clearHistory();
}

let app = new JokeGenerator();