document.addEventListener('DOMContentLoaded', function() {
    // تغییر تب‌ها
    const tabs = document.querySelectorAll('.tab');
    const podcastsSection = document.getElementById('podcasts');
    const archiveSection = document.getElementById('archive');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            if (this.textContent.includes('اپیزود')) {
                podcastsSection.style.display = 'block';
                archiveSection.style.display = 'none';
            } else {
                podcastsSection.style.display = 'none';
                archiveSection.style.display = 'block';
            }
        });
    });
    
    // شبیه‌سازی دکمه فالو
    const followBtn = document.querySelector('.btn-follow');
    followBtn.addEventListener('click', function() {
        if (this.textContent.includes('دنبال')) {
            this.innerHTML = 'دنبال می‌کنید <i class="fas fa-check"></i>';
            this.style.backgroundColor = '#0066cc';
            this.style.color = '#fff';
        } else {
            this.innerHTML = 'دنبال کردن <i class="fas fa-check"></i>';
            this.style.backgroundColor = '#fff';
            this.style.color = '#000';
        }
    });
    
    // افکت‌های ویژه برای عناصر
    const categoryStats = document.querySelector('.category-stats');
    categoryStats.addEventListener('mouseover', function() {
        this.style.boxShadow = '0 0 15px rgba(0, 102, 204, 0.5)';
    });
    
    categoryStats.addEventListener('mouseout', function() {
        this.style.boxShadow = 'none';
    });

    // ایجاد پادکست‌ها
    const podcastsContainer = document.getElementById('podcasts');
    podcasts.forEach(podcast => {
        const podcastElement = document.createElement('div');
        podcastElement.className = 'podcast-player';
        podcastElement.dataset.id = podcast.id;
        podcastElement.innerHTML = `
            <div class="podcast-header">
                <img src="${podcast.cover}" alt="Podcast Cover" class="podcast-cover">
                <div class="podcast-info">
                    <div class="podcast-title">${podcast.title}</div>
                    <div class="podcast-author">${podcast.author}</div>
                    <div class="podcast-stats">
                        <div class="podcast-stat">
                            <span class="listeners-count">
                                <i class="fas fa-headphones"></i>
                                <span class="listeners-count-number">${podcast.listeners.toLocaleString('fa-IR')}</span> شنونده
                            </span>
                        </div>
                        <div class="podcast-stat">
                            <i class="fas fa-calendar-alt"></i>
                            ${podcast.publishDate}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="podcast-controls">
                <button class="podcast-main-btn">
                    <i class="fas fa-play"></i>
                </button>
                <button class="podcast-secondary-btn">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="podcast-secondary-btn">
                    <i class="fas fa-step-forward"></i>
                </button>
                <div class="podcast-progress-container">
                    <div class="podcast-progress-bar"></div>
                </div>
                <div class="podcast-time">00:00 / 00:00</div>
                <div class="podcast-volume">
                    <i class="fas fa-volume-up"></i>
                    <input type="range" min="0" max="1" step="0.1" value="1">
                </div>
            </div>
            
            <div class="podcast-likes">
                <button class="like-btn ${podcast.isLiked ? 'liked' : ''}">
                    <span class="like-count">${podcast.likes.toLocaleString('fa-IR')}</span>
                    <i class="${podcast.isLiked ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <button class="comment-btn">
                    <i class="fas fa-comment"></i>
                    کامنت
                </button>
                <div class="listeners-count">
                    <i class="fas fa-headphones"></i>
                    <span class="current-listeners">${podcast.currentListeners.toLocaleString('fa-IR')}</span> شنونده آنلاین
                </div>
            </div>
            
            <div class="podcast-description">
                ${podcast.description}
            </div>
            
            <audio>
                <source src="${podcast.audio}" type="audio/mpeg">
                مرورگر شما از پخش صدا پشتیبانی نمی‌کند.
            </audio>
        `;
        podcastsContainer.appendChild(podcastElement);
    });

    // ایجاد آیتم‌های آرشیو
    const archiveList = document.querySelector('.archive-list');
    archiveItems.forEach((item, index) => {
        const archiveItem = document.createElement('li');
        archiveItem.className = 'archive-item';
        archiveItem.innerHTML = `
            <div class="archive-item-number">${(index + 1).toLocaleString('fa-IR')}</div>
            <div class="archive-item-title">${item.title}</div>
            <div class="archive-item-date">${item.date}</div>
        `;
        archiveList.appendChild(archiveItem);
    });

    // مدیریت پخش پادکست‌ها
    document.addEventListener('click', function(e) {
        // مدیریت پخش/توقف پادکست
        if (e.target.closest('.podcast-main-btn')) {
            const btn = e.target.closest('.podcast-main-btn');
            const audio = btn.closest('.podcast-player').querySelector('audio');
            const podcastId = parseInt(btn.closest('.podcast-player').dataset.id);
            const podcast = podcasts.find(p => p.id === podcastId);
            
            if (audio.paused) {
                audio.play()
                    .then(() => {
                        btn.innerHTML = '<i class="fas fa-pause"></i>';
                        const listenersEl = btn.closest('.podcast-player').querySelector('.current-listeners');
                        podcast.currentListeners += 1;
                        listenersEl.textContent = podcast.currentListeners.toLocaleString('fa-IR');
                    })
                    .catch(error => {
                        console.error('خطا در پخش پادکست:', error);
                        alert('خطا در پخش پادکست. لطفا مطمئن شوید مرورگر شما از پخش صدا پشتیبانی می‌کند.');
                    });
            } else {
                audio.pause();
                btn.innerHTML = '<i class="fas fa-play"></i>';
                const listenersEl = btn.closest('.podcast-player').querySelector('.current-listeners');
                podcast.currentListeners = Math.max(0, podcast.currentListeners - 1);
                listenersEl.textContent = podcast.currentListeners.toLocaleString('fa-IR');
            }
        }
        
        // مدیریت عقب بردن 15 ثانیه
        if (e.target.closest('.podcast-secondary-btn .fa-step-backward')) {
            const btn = e.target.closest('.podcast-secondary-btn');
            const audio = btn.closest('.podcast-player').querySelector('audio');
            audio.currentTime = Math.max(0, audio.currentTime - 15);
        }
        
        // مدیریت جلو بردن 15 ثانیه
        if (e.target.closest('.podcast-secondary-btn .fa-step-forward')) {
            const btn = e.target.closest('.podcast-secondary-btn');
            const audio = btn.closest('.podcast-player').querySelector('audio');
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
        }
        
        // مدیریت لایک
        if (e.target.closest('.like-btn') || e.target.closest('.like-btn i')) {
            const btn = e.target.closest('.like-btn');
            const podcastId = parseInt(btn.closest('.podcast-player').dataset.id);
            const podcast = podcasts.find(p => p.id === podcastId);
            const heartIcon = btn.querySelector('i');
            const likeCountEl = btn.querySelector('.like-count');
            
            if (podcast.isLiked) {
                podcast.likes -= 1;
                podcast.isLiked = false;
                heartIcon.classList.remove('fas', 'liked');
                heartIcon.classList.add('far');
            } else {
                podcast.likes += 1;
                podcast.isLiked = true;
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas', 'liked');
            }
            
            likeCountEl.textContent = podcast.likes.toLocaleString('fa-IR');
        }
        
        // مدیریت کامنت‌ها
        if (e.target.closest('.comment-btn')) {
            const btn = e.target.closest('.comment-btn');
            const podcastId = parseInt(btn.closest('.podcast-player').dataset.id);
            showComments(podcastId);
        }
    });

    // بستن کامنت‌ها
    document.querySelector('.close-comments').addEventListener('click', function() {
        document.getElementById('commentsModal').style.display = 'none';
    });

    // ارسال کامنت جدید
    document.getElementById('submitComment').addEventListener('click', function() {
        const name = document.getElementById('commentName').value.trim();
        const text = document.getElementById('commentText').value.trim();
        
        if (!name || !text) {
            alert('لطفا نام و نظر خود را وارد کنید');
            return;
        }
        
        const podcastId = parseInt(document.getElementById('commentsList').dataset.podcastId);
        const podcast = podcasts.find(p => p.id === podcastId);
        
        if (podcast) {
            const newComment = {
                id: podcast.comments.length + 1,
                name: name,
                text: text
            };
            
            podcast.comments.push(newComment);
            renderComments(podcast.comments);
            
            document.getElementById('commentName').value = '';
            document.getElementById('commentText').value = '';
        }
    });

    // نمایش کامنت‌ها
    function showComments(podcastId) {
        const podcast = podcasts.find(p => p.id === podcastId);
        if (podcast) {
            document.getElementById('commentsList').dataset.podcastId = podcastId;
            renderComments(podcast.comments);
            document.getElementById('commentsModal').style.display = 'block';
        }
    }

    // رندر کامنت‌ها
    function renderComments(comments) {
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-author">${comment.name}</div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsList.appendChild(commentElement);
        });
    }

    // مدیریت پیشرفت پادکست
    document.addEventListener('timeupdate', function(e) {
        if (e.target.tagName === 'AUDIO') {
            const audio = e.target;
            const progressBar = audio.closest('.podcast-player').querySelector('.podcast-progress-bar');
            const timeDisplay = audio.closest('.podcast-player').querySelector('.podcast-time');
            
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            
            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSeconds = Math.floor(audio.currentTime % 60);
            const durationMinutes = Math.floor(audio.duration / 60);
            const durationSeconds = Math.floor(audio.duration % 60);
            
            timeDisplay.textContent = 
                `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        }
    }, true);

    // مدیریت کلیک روی نوار پیشرفت
    document.addEventListener('click', function(e) {
        if (e.target.closest('.podcast-progress-container')) {
            const container = e.target.closest('.podcast-progress-container');
            const audio = container.closest('.podcast-player').querySelector('audio');
            const pos = (e.pageX - container.offsetLeft) / container.offsetWidth;
            audio.currentTime = pos * audio.duration;
        }
    });

    // مدیریت صدا
    document.addEventListener('input', function(e) {
        if (e.target.closest('.podcast-volume input')) {
            const input = e.target.closest('.podcast-volume input');
            const audio = input.closest('.podcast-player').querySelector('audio');
            audio.volume = input.value;
        }
    });

    // شبیه‌سازی افزایش تعداد شنوندگان
    setInterval(() => {
        document.querySelectorAll('.podcast-player').forEach(player => {
            const audio = player.querySelector('audio');
            const podcastId = parseInt(player.dataset.id);
            const podcast = podcasts.find(p => p.id === podcastId);
            
            if (!audio.paused && podcast) {
                const listenersEl = player.querySelector('.current-listeners');
                const change = Math.floor(Math.random() * 3) - 1;
                podcast.currentListeners = Math.max(0, podcast.currentListeners + change);
                listenersEl.textContent = podcast.currentListeners.toLocaleString('fa-IR');
            }
        });
    }, 10000);
});