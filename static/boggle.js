class BoggleGame{
    constructor(boardID, secs = 60){
        this.secs = secs;
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardID);

        this.timer = setInterval(this.tick.bind(this), 1000);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }
    showWord(word){
        $(".words", this.board).append($("<li>", {text: word}));
    }
    showScore(){
        $(".score", this.board).text(this.score);
    }
    showMsg(msg,cls){
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }
    async handleSubmit(evt){
        evt.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if(this.words.has(word)){
            this.showMsg(`${word} has already been found`, "err");
            return;
        }
        const resp = await axios.get("/check-word", {params: {word: word}});
        if (resp.data.result === "not-word"){
            this.showMsg(`${word} is not a valid word in Dictionary`, "err");
        } else if(resp.data.result === "not-on-board"){
            this.showMsg(`${word} is not located on the board`, "err");
        }else{
            this.showWord(word);
            this.score+=word.length;
            this.showScore();
            this.words.add(word);
            this.showMsg(`Added: ${word}`, "ok");
        }
        $word.val("").focus();
    }
    showTimer(){
        $(".timer", this.board).text(this.secs);
    }
    async tick(){
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }
    async scoreGame(){
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", {score: this.score});
        if(resp.data.newHigh){
            this.showMsg(`New highscore: ${this.score}`, "ok");
        }else{
            this.showMsg(`Final score: ${this.score}`, "ok")
        }
    }
}