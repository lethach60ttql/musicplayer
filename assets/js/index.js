const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER';
const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progressBar = $('.progress-bar');
const songCurrentTime = $('.current-time');
const songDurationTime = $('.duration-time');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
let songPlayed = [0];

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: 'Bach-Nguyet-Quang-Va-Not-Chu-Sa-Dai-Tu',
      singer: '  ',
      path: './assets/music/Bach-Nguyet-Quang-Va-Not-Chu-Sa-Dai-Tu.mp3',
      image: './assets/img/1.jpg',
    },
    {
      name: 'Gap-Em-Dung-Luc-Luan-Tang-Tieu-Uc-Tinh-Huyen-Thuong',
      singer: '',
      path: './assets/music/Gap-Em-Dung-Luc-Luan-Tang-Tieu-Uc-Tinh-Huyen-Thuong.mp3',
      image: './assets/img/2.jpg',
    },
    {
      name: 'Kieu-Ngao-EN',
      singer: '',
      path: './assets/music/Kieu-Ngao-EN.mp3',
      image: './assets/img/3.jpg',
    },
    {
      name: 'Ly-Nhan-Sau-Ly-Vien-Kiet',
      singer: '',
      path: './assets/music/Ly-Nhan-Sau-Ly-Vien-Kiet.mp3',
      image: './assets/img/4.jpg',
    },
    {
      name: 'Mau-Xanh-Tran-Tuyet-Ngung',
      singer: '',
      path: './assets/music/Mau-Xanh-Tran-Tuyet-Ngung.mp3',
      image: './assets/img/5.jpg',
    },
    {
      name: 'Phi-Dieu-Va-Ve-Sau-Nham-Nhien',
      singer: '',
      path: './assets/music/Phi-Dieu-Va-Ve-Sau-Nham-Nhien.mp3',
      image: './assets/img/6.jpg',
    },
    {
      name: 'Quan-Ruou-Cua-Anh-Dong-Cua-Khong-Tiep-Em-Tran-Tuyet-Ngung',
      singer: '',
      path: './assets/music/Quan-Ruou-Cua-Anh-Dong-Cua-Khong-Tiep-Em-Tran-Tuyet-Ngung.mp3',
      image: './assets/img/7.jpg',
    },
    {
      name: 'Su-Thanh-Hoa-Luu-Phuong',
      singer: '',
      path: './assets/music/Su-Thanh-Hoa-Luu-Phuong.mp3',
      image: './assets/img/8.jpg',
    },
    {
      name: 'Thoi-Khong-Sai-Lech-Ngai-Than',
      singer: '',
      path: './assets/music/Thoi-Khong-Sai-Lech-Ngai-Than.mp3',
      image: './assets/img/9.jpg',
    },
    {
      name: 'Yen-Vo-Hiet-Tuong-Tuyet-Nhi',
      singer: '',
      path: './assets/music/Yen-Vo-Hiet-Tuong-Tuyet-Nhi.mp3',
      image: './assets/img/10.jpg',
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? 'active' : ''
      }"  data-index='${index}'>
      <div class="thumb"
          style="background-image: url('${song.image}')">
      </div>
      <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
      </div>
      <div class="option">
          <i class="fas fa-ellipsis-h"></i>
      </div>
  </div>
      `;
    });
    $('.playlist').innerHTML = htmls.join('');
  },
  // define thêm thuộc tính của object app
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    // Lấy cái width hiện tại của cd
    // Trừ đi số px khi oncroll
    // check xem kết quả có >0 không
    // chú ý: khi có kết quả thì gán lại cho cd.style.width chứ không phải là cdWidth, vif offsetWidth chỉ là read-only
    //  chú ý khi set kích thước cho width phải + 'px'
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    // Xử lý tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime * 100) / audio.duration
        );
        progressBar.value = progressPercent;
        progressBar.style.background = `linear-gradient(to right, #ff2a5f ${progressPercent}%, #ccc 0%)`;

        // Xử lý tiến độ
        const minutesCurrent =
          Math.floor(audio.currentTime / 60) <= 9
            ? '0' + Math.floor(audio.currentTime / 60)
            : Math.floor(audio.currentTime / 60);
        const secondsCurrent =
          Math.floor(audio.currentTime - minutesCurrent * 60) <= 9
            ? '0' + Math.floor(audio.currentTime - minutesCurrent * 60)
            : Math.floor(audio.currentTime - minutesCurrent * 60);
        const minutesDuration =
          Math.floor(audio.duration / 60) <= 9
            ? '0' + Math.floor(audio.duration / 60)
            : Math.floor(audio.duration / 60);
        const secondsDuration =
          Math.floor(audio.duration - minutesDuration * 60) <= 9
            ? '0' + Math.floor(audio.duration - minutesDuration * 60)
            : Math.floor(audio.duration - minutesDuration * 60);
        songCurrentTime.innerText = minutesCurrent + ':' + secondsCurrent;
        songDurationTime.innerText = minutesDuration + ':' + secondsDuration;
      }
    };

    // Xử lý khi tua song
    progressBar.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // Xử lý scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = (newCdWidth > 0 ? newCdWidth : 0) / cdWidth;
    };

    // Xử lý click play
    // khi chạy lần đầu isplaying là false,
    // thì lọt vào audio.play và chạy xuống onplay,
    // sau đó onclick lần nữa, nó sẽ kiểm tra lại isplay là true, thì nó lọt vào audio.pause
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Xử lý khi được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    // Xử lý khi bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    // Xử lý khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      _this.activeSong();
      _this.scrollIntoView();
      audio.play();
    };

    // Xử lý khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      _this.activeSong();
      _this.scrollIntoView();
      audio.play();
    };

    // Xử lý khi random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      // console.log(_this.isRandom)
      _this.setConfig('isRandom', _this.isRandom);
      this.classList.toggle('active', _this.isRandom);
      // console.log(_this.isRandom)
    };

    // Xử lý khi repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Xử lý next/repeat khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.loop = true;
        audio.play();
      } else {
        nextBtn.click();
      }
      // sẽ tự click vào nút nextBtn khi audio ended
    };

    // Xử lý lắng nghe onclick vào playlist

    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      const optionNode = e.target.closest('.option');
      if (songNode || optionNode) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.activeSong();
          audio.play();
        }
        if (optionNode) {
        }
      }
    };
  },

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  randomSong: function () {
    let randomIndex;
    // chỗ này không khai báo let trong hàm do, vì khai báo như vậy thì hàm while không thể nhận được
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (songPlayed.includes(randomIndex) === true);
    this.currentIndex = randomIndex;
    songPlayed.push(randomIndex);

    // Khi mảng có số lượng index = số lượng bài hát thì clear mảng
    if (songPlayed.length === this.songs.length) {
      songPlayed = [];
    }
    // logic chỗ do ..while, là random 1 số, đến khi số đó bằng số hiện tại thì dừng
    // chứ không phải là random 1 số đến khi nó khác số trước đó thì dừng >>>hiểu sai

    this.loadCurrentSong();
  },

  nextSong: function () {
    if (this.isRandom) {
    }
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  activeSong: function () {
    const allSong = $$('.song');
    for (let i = 0; i < allSong.length; i++) {
      allSong[i].classList.remove('active');
      $(`[data-index='${this.currentIndex}']`).classList.add('active');
    }
  },
  scrollIntoView: function () {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  },

  loadCurrentSong: function () {
    if (this.currentSong) {
      heading.innerText = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  start: function () {
    // gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    // định nghĩa thêm thuộc tính cho object
    this.defineProperties();
    // xử lý sự kiện
    this.handleEvents();

    // load baì hát hiện tại
    this.loadCurrentSong();
    // render ra DOM
    this.render();
    // Hiển thị trạng thái ban đầu của button repeat & random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
