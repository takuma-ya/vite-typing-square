class PhaserGameRecord extends PhaserGame{
    init() {
        let config = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: 'modal-body-record',
            width: 1920,
            height: 1080,
            scene: MenuSceneRecord,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
        };

        game = new Phaser.Game(config);
    }
}

/**
 * First Scene: html games require user to focus the window (click or key down) before playing audio so we do this
 */
class MenuSceneRecord extends MenuScene {
    update() {
        if (isKeyPressed("Space")) {
            this.scene.add("main", MainSceneRecord);
            this.scene.start("main");
        }
    }
}

class MainSceneRecord extends MainScene {
    async create() {
        // Notes timestamps, made with the other script "record.html". They are relative to the start of the song, meaning a value of 1000 equals to 1 second after the song has started
        this.notesTimestamps = this.getNote();
        this.timeToFall = 2000; // ms, time for the note to go to the bottom. The lower the faster/hardest
        this.lastNoteIndex = 0; // last note spawned
        this.notes = [];        // array of notes already spawned
        this.notesRecord = [];  // timestamp array of notes already spawned
        this.record = [];
        this.colliders = [];    // colliders for player input vs falling note
        this.characters = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ"];
        this.charIndex = 0;
        this.endTimestamp = music.time;
        this.firstKeysPressed = [];
        this.firstKeyPressed = {
            code: 'init',
            parsed: false
        };
        

        this.backImage = this.add.image(1920 / 2, 1080 / 2, 'sky').setDisplaySize(1920,1080);
        this.noteBar = this.add.rectangle(1920 / 2, 800, 1920, 300, 0x104e60);
        this.targetBar = this.add.rectangle(200, 800, 10, 300, 0x000000);

        this.character = this.add.image(1920 / 2, 350, 'character');
        this.character.scale = 0.4;

        // The score text
        this.scoreText = this.add.text(100, 100, "SCORE", { fontFamily: "arial", fontSize: "100px" });
        score = 0;

        this.scene.add("result", ResultSceneRecord);
        // We create the audio object and play it
        sound = this.sound.add("music");
        sound.volume = music.volume;
        await sound.play();
        this.startTime = Math.floor(sound.seek * 1000)
        console.log("start")
        
    }
    spawnNotes() {
        // lets look up to the 10 next notes and spawn if needed
        //console.log(Math.floor(sound.seek * 1000))
        for (let i = this.lastNoteIndex; i < this.lastNoteIndex + 10; i++) {
            let note = this.notesTimestamps[i];
            if (!note) break;

            // Spawn note if: is not already spawned, and the timing is right. From the start of the song, we need to consider the time it takes for the note to fall so we start it at the timestamp minus the time to fall
            if (
                note.spawned != true
                && note.timestamp <=  Math.floor(sound.seek * 1000) - this.startTime + this.timeToFall
            ) {
                this.spawnNote(note.is_main, note.timestamp);
                this.lastNoteIndex = i;
                note.spawned = true;
            }
        }
    }

    spawnNote(is_main, timestamp) {
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
            let collider = this.add.image(200, 800, "Stamp").setDisplaySize(100,100);

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
                console.log("success!")
                collider.collided = true;

                 // remove the collider from list
                 this.colliders.splice(this.colliders.indexOf(collider), 1);

                 // destroy the note and remove from list
                 let t = {}
                 console.log(this.notesRecord[this.notes.indexOf(note)]);
                 t.timestamp = this.notesRecord[this.notes.indexOf(note)];
                 this.record.push(t);
                 note.destroy();
                 this.notesRecord.splice(this.notes.indexOf(note), 1);
                 this.notes.splice(this.notes.indexOf(note), 1);

                 // increase the score and update the text
                 score += 100;
                 this.updateScoreText();
            }
        });
    }

    checkFinished() {
        
        if ( Math.floor(sound.seek * 1000) - this.startTime >= this.endTimestamp) {
            console.log(this.record);
            this.scene.start("result");
        }
    }

    getNote() {
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

class ResultSceneRecord extends ResultScene {
    create() {
        this.text = this.add.text(
            1920 / 2,
            1080 / 2,
            `あなたのスコア： ${score}\n\nSPACE：再トライ\n\nENTER：結果を保存して終了`,
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
            let maxScore = document.getElementById(scoreId).textContent;
            if(score > maxScore) {
                alert("ハイスコア更新！")
            }
            document.getElementById(scoreId).textContent = Math.max(maxScore, score);

            let data= new Object();
            data.music_id = music.number;
            data.score = score;
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

            closeBtnRecord.click();
        }
    }
}