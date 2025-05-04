// music_data.json を読み込む
import musicData from './data/music_data.json';
let music;
let sound;
let sound_collision;
let sound_beep;
let score;
let full_score;
let type;
let language;
let closeBtn;
let closeBtnRecord
if (typeof document !== "undefined") {
  closeBtn = document.getElementById("btn-close");
  closeBtnRecord = document.getElementById("btn-close-record");
}

function register_music(music_id) {
  // music_id に対応する音楽情報を取得
  const musicInfo = musicData.find((music) => music.number === music_id);

  if (!musicInfo) {
    console.log("music_id", music_id);
    throw new Error('Not registered music number');
  }

  // 音楽情報を使用して Music オブジェクトを作成
  const music = new Music(
    musicInfo.number,
    musicInfo.src,
    musicInfo.note,
    musicInfo.time,
    musicInfo.bpm,
    musicInfo.first_ts,
    musicInfo.beat,
    musicInfo.volume,
    musicInfo.character
  );

  return music;
}

function sleep(waitMsec) {
    var startMsec = new Date();
   
    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
  }

class Music {
    
    constructor(number, src, note, time, bpm, first_ts, beat, volume, character){
        this.number = number;
        this.src = src;
        this.note = note;
        this.time = time; 
        this.bpm = bpm;
        this.first_ts = first_ts;
        this.beat = beat;
        this.volume = volume;
        this.character = character;
    }
}

class PhaserGame {
    constructor(game_type="") {
        type = game_type;
    }


    init(id, lang) {
        if (type == "record") {
            this.parent_id = `modal-body-record`;
        }
        else {
            this.parent_id = `modal-body`;
        }
        console.log("parent",this.parent_id);
        music = register_music(id);
        language = lang;
        let config = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: this.parent_id,
            width: 1920,
            height: 1080,
            scene: MenuScene,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
        };

        return new Phaser.Game(config);
    }
}

/**
 * First Scene: html games require user to focus the window (click or key down) before playing audio so we do this
 */
class MenuScene {
    create() {
        this.message = "SPACEで開始";
        if(language == "en"){
          this.message = "Press SPACEBAR to start";
        }
        this.text = this.add.text(
            1920 / 2,
            1080 / 2,
            this.message,
            { fontFamily: "arial", fontSize: "100px" }
        );
        this.text.setOrigin(0.5, 0.5);
    }

    update() {
        if (isKeyPressed("Space")) {
            this.scene.add("main", MainScene);
            this.scene.start("main");
        }
    }
}

class MainScene {
    preload() {
        // ===== 背景を黒くフェード =====
        this.loadingBackground = this.add.rectangle(1920 / 2, 1080 / 2, 1920, 1080, 0x000000);
        this.loadingBackground.setAlpha(0.85); // 透明度で少し後ろを透かす演出

        // ===== ローディングテキスト =====
        this.loadingText = this.add.text(1920 / 2, 1080 / 2 - 100, 'Now Loading...', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // ===== ローディングバー背景 =====
        const barWidth = 800;
        const barHeight = 50;
        const barX = (1920 - barWidth) / 2;
        const barY = 1080 / 2;

        this.loadingBarBg = this.add.graphics();
        this.loadingBarBg.fillStyle(0x444444, 1);
        this.loadingBarBg.fillRect(barX, barY, barWidth, barHeight);

        // ===== ローディングバー（進行）=====
        this.loadingBar = this.add.graphics();

        this.load.on('progress', (value) => {
            this.loadingBar.clear();
            this.loadingBar.fillStyle(0x00bfff, 1); // 青色
            this.loadingBar.fillRect(barX, barY, barWidth * value, barHeight);
        });

        this.load.on('complete', () => {
            // ロード完了時にローディング画面要素を全て削除
            this.loadingBackground.destroy();
            this.loadingText.destroy();
            this.loadingBarBg.destroy();
            this.loadingBar.destroy();
        });

        console.log(music.src);
        this.load.audio("music", "/musics/" + music.src);
        this.load.audio("collision", "/musics/kati.mp3");
        this.load.audio("beep", "/musics/beep.mp3");
        this.load.image("KeyA", "/images/keyA.png");
        this.load.image("KeyB", "/images/keyB.png");
        this.load.image("KeyC", "/images/keyC.png");
        this.load.image("KeyD", "/images/keyD.png");
        this.load.image("KeyE", "/images/keyE.png");
        this.load.image("KeyF", "/images/keyF.png");
        this.load.image("KeyG", "/images/keyG.png");
        this.load.image("KeyH", "/images/keyH.png");
        this.load.image("KeyI", "/images/keyI.png");
        this.load.image("KeyJ", "/images/keyJ.png");
        this.load.image("KeyK", "/images/keyK.png");
        this.load.image("KeyL", "/images/keyL.png");
        this.load.image("KeyM", "/images/keyM.png");
        this.load.image("KeyN", "/images/keyN.png");
        this.load.image("KeyO", "/images/keyO.png");
        this.load.image("KeyP", "/images/keyP.png");
        this.load.image("KeyQ", "/images/keyQ.png");
        this.load.image("KeyR", "/images/keyR.png");
        this.load.image("KeyS", "/images/keyS.png");
        this.load.image("KeyT", "/images/keyT.png");
        this.load.image("KeyU", "/images/keyU.png");
        this.load.image("KeyV", "/images/keyV.png");
        this.load.image("KeyW", "/images/keyW.png");
        this.load.image("KeyX", "/images/keyX.png");
        this.load.image("KeyY", "/images/keyY.png");
        this.load.image("KeyZ", "/images/keyZ.png");
        this.load.image("sky", "/images/sky.png");
        this.load.image("character", "/images/" + music.character);
        }

    async create() {
        // Notes timestamps, made with the other script "record.html". They are relative to the start of the song, meaning a value of 1000 equals to 1 second after the song has started
        if (type == "record") {
            this.notesTimestamps = this.getRecordNote();
        }
        else {
            this.notesTimestamps = this.getNote();
        }
        full_score = Object.keys(this.notesTimestamps).length;
        this.timeToFall = 2000; // ms, time for the note to go to the bottom. The lower the faster/hardest
        this.lastNoteIndex = 0; // last note spawned
        this.notes = [];        // array of notes already spawned
        this.notesRecord = [];  // timestamp array of notes already spawned
        this.record = [];
        this.colliders = [];    // colliders for player input vs falling note
        this.characters = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ"];
        this.upper_characters = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"];
        this.middle_characters = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"];
        this.lower_characters = ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM"];
        this.charIndex = 0;
        this.endTimestamp = music.time;
        this.firstKeysPressed = [];
        this.firstKeyPressed = {
            code: 'init',
            parsed: false
        };
        

        this.backImage = this.add.image(1920 / 2, 1080 / 2, 'sky').setDisplaySize(1920,1080);
        this.noteBarTop = this.add.rectangle(1920 / 2, 500, 1920, 180, 0x104e60);
        this.noteBarCenter = this.add.rectangle(1920 / 2, 700, 1920, 180, 0x104e60);
        this.noteBarBottom = this.add.rectangle(1920 / 2, 900, 1920, 180, 0x104e60);
        this.targetBar = this.add.rectangle(200, 700, 10, 580, 0x000000);

        this.character = this.add.image(1920 / 2, 200, 'character');
        this.character.scale = 0.3;
        this.character_position = 700; 

        // The score text
        this.scoreText = this.add.text(100, 100, "SCORE", { fontFamily: "arial", fontSize: "100px" });
        score = 0;

        if (type == "record") {
            this.collider_size = 100;
        }
        else {
            this.collider_size = 150;
        }
        this.scene.add("result", ResultScene);
        // We create the audio object and play it
        sound = this.sound.add("music");
        sound.volume = music.volume;
        sound_collision = this.sound.add("collision");
        sound_collision.volume = 2.0;
        sound_beep = this.sound.add("beep");
        sound_beep.volume = 2.0;
        await sound.play();
        this.startTime = Math.floor(sound.seek * 1000)
        console.log(sound.seek)
        console.log(this.startTime)
        console.log("start")
        
    }

    update() {
        this.handlePlayerInput();
        this.spawnNotes();
        this.checkNoteCollisions();
        this.backgroundAnimation();
        this.checkFinished();
    }

    spawnNotes() {
        // lets look up to the 10 next notes and spawn if needed
        for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
            let note = this.notesTimestamps[i];
            if (!note) break;

            // Spawn note if: is not already spawned, and the timing is right. From the start of the song, we need to consider the time it takes for the note to fall so we start it at the timestamp minus the time to fall
            if (
                note.spawned != true
                && note.timestamp <=  Math.floor(sound.seek * 1000) - this.startTime + this.timeToFall
            ) {
              if (type == "record") {
                  this.spawnRecordNote(note.is_main, note.timestamp);
              }
              else {
                  this.spawnNote();
              }
                this.lastNoteIndex = i;
                note.spawned = true;
            }
        }
    }

    spawnNote() {
        // This is self explanatory. Spawn the note and let it fall to the bottom.
        //let note = this.add.circle(1920 / 2, 0, 20, 0xffff00);
        this.charIndex = Math.floor(Math.random() * this.characters.length);
        let character_position;
        console.log(this.characters[this.charIndex])
        if (this.upper_characters.includes(this.characters[this.charIndex])){
            this.character_position = 500;
        }
        else if (this.middle_characters.includes(this.characters[this.charIndex])){
            this.character_position = 700;
        }
        else if (this.lower_characters.includes(this.characters[this.charIndex])){
            this.character_position = 900;
        }
        let note = this.add.image(1920, this.character_position, this.characters[this.charIndex]).setDisplaySize(150,150);
        this.notes.push(note);
        this.physics.add.existing(note);
        this.physics.moveTo(note, 200, this.character_position, null, this.timeToFall);
    }

    spawnRecordNote(is_main, timestamp) {
        // This is self explanatory. Spawn the note and let it fall to the bottom.
        //let note = this.add.circle(1920 / 2, 0, 20, 0xffff00);
        this.charIndex = 9;
        let note;
        if (is_main == 1){
            note = this.add.image(1920, 800, this.characters[this.charIndex]).setDisplaySize(150,150);
        }
        else {
            note = this.add.image(1920, 800, this.characters[this.charIndex]).setDisplaySize(100,100);
        }
        this.notes.push(note);
        this.notesRecord.push(timestamp);
        this.physics.add.existing(note);
        this.physics.moveTo(note, 200, 800, null, this.timeToFall);
    }

    handlePlayerInput() {
        this.firstKeysPressed = getFirstKeysPressed()
        if (this.firstKeysPressed.length != 0) {
            // we create a new collider at the position of the red bar
            let collider = this.add.rectangle(200, 700, 20, 580, 0xc0c0c0);

            // attach physics
            this.physics.add.existing(collider);

            // little tween to grow
            this.tweens.add({
                targets: collider,
                //scale: 2,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    collider.destroy();

                    // If the collider did not hit a note, its a miss, so lets lower the score
                    if (collider.collided != true) {
                        this.cameras.main.shake(100, 0.01);
                        sound_beep.play();
                        score -= 200;
                        this.updateScoreText();
                    }
                }
            });

            // add the collider to the list
            this.colliders.push(collider);
            this.firstKeyPressed = this.firstKeysPressed[0]
        }
    }

    checkNoteCollisions() {
        this.physics.overlap(this.colliders, this.notes, (collider, note) => {
            if(this.firstKeyPressed.code==note.texture.key){
                // the collider collided
                sound_collision.play();
                console.log("success!")
                console.log(sound.seek)
                collider.collided = true;

                 // remove the collider from list
                 this.colliders.splice(this.colliders.indexOf(collider), 1);
                 if (type == "record") {
                     // destroy the note and remove from list
                     let t = {}
                     console.log(this.notesRecord[this.notes.indexOf(note)]);
                     t.timestamp = this.notesRecord[this.notes.indexOf(note)];
                     this.record.push(t);
                     this.notesRecord.splice(this.notes.indexOf(note), 1);
                 }
                 this.notes.splice(this.notes.indexOf(note), 1);

                 // destroy the note and remove from list
                 note.destroy();
                 
                 // increase the score and update the text
                 score += 100;
                 this.updateScoreText();
            }
        });
    }

    updateScoreText() {
        this.scoreText.text = score;
    }

    backgroundAnimation() {
        switch (Math.floor(( Math.floor(sound.seek * 1000) - this.startTime) / 1000 )%4){
            case 0:
                this.character.rotation += 0.01;
                break;
            case 1:
                this.character.rotation -= 0.01;
                break;
            case 2:
                this.character.rotation -= 0.01;
                break;
            case 3:
                this.character.rotation += 0.01;
                break;

        }
    }
    

    checkFinished() {
        
        if ( Math.floor(sound.seek * 1000) - this.startTime >= this.endTimestamp) {
            if (type == "record") {
                console.log(this.record);
            }
            this.scene.start("result");
        }
    }

    getNote() {
        var request = new XMLHttpRequest();
        request.open("GET", "/jsons/" + music.note, false);
        request.send(null);
        return JSON.parse(request.responseText);
    }

    getRecordNote() {
        let timestamps = [];
        let span = 1000 * 60 / music.bpm / music.beat;
        let timestamp = {};
        let i = 0;
        while(1) { 
            let t = {};
            timestamp = Math.floor(music.first_ts + span * i);
            if (timestamp >= music.time)
                break;
            t.timestamp = timestamp;
            if (i % music.beat == 0) {
                t.is_main = 1
            }
            else {
                t.is_main = 0
            }
            timestamps.push(t);
            i += 1;
        }
        return timestamps;
    }
}

class ResultScene {
    create() {
        this.message = `あなたのスコア： ${score}\n\nSPACE：再トライ\n\nENTER：結果を保存して終了`;
        if (language == "en"){
            this.message = `Your score： ${score}\n\nSPACEBAR：Retry\n\nENTER：Save the results and exit`;
        }
        this.text = this.add.text(
            1920 / 2,
            1080 / 2,
            this.message,
            { fontFamily: "arial", fontSize: "100px" }
        );
        this.text.setOrigin(0.5, 0.5);
    }

    update() {
        if (isKeyPressed("Space")) {
            sound.stop();
            this.scene.start("main");
        }

        if (isKeyPressed("Enter")) {
            let scoreId = "score-" + music.number;
            let rateId = "rate-" + music.number;
            let maxScore = document.getElementById(scoreId).textContent;
            let maxRate = document.getElementById(rateId).textContent;
            let rate = Math.floor(100 * score / (100 * full_score));
            console.log("full_score",full_score);
            console.log("score",score);
            console.log("rate",rate);
            console.log("maxRate",maxRate);
            console.log("max",Math.max(maxRate, rate));
            if(score > maxScore) {
                if ( language == "en"){
                    alert("New record!");
                }
                else{
                    alert("ハイスコア更新！");
                }
            }
            if(rate == 100) {
                document.getElementById(scoreId).style.color = "green";
                document.getElementById(rateId).style.color = "green";
            }
            window.score = Math.max(maxScore, score);
            window.rate = Math.max(maxRate, rate);

            let data= new Object();
            data.music_id = music.number;
            data.score = score;
            data.rate = rate;
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.onreadystatechange = function()
            {
                var READYSTATE_COMPLETED = 4;
                var HTTP_STATUS_OK = 200;

                if( this.readyState == READYSTATE_COMPLETED
                && this.status == HTTP_STATUS_OK )
                {
                    // レスポンスの表示
                    alert( this.responseText );
                }
            }
            xmlHttpRequest.open('POST', '/save_score');

            // データをリクエスト ボディに含めて送信する
            xmlHttpRequest.setRequestHeader("content-type", "application/json");
            xmlHttpRequest.send(JSON.stringify(data));

            if (type == "record") {
                closeBtnRecord.click();
            }
            else {
                closeBtn.click();
            }
        }
    }
}

export { register_music, PhaserGame }; 
