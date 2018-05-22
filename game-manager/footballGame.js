/*

    Here's the plan. We're going to measure the game in seconds.
    A game is 60 minutes long, which is 3600 seconds long.
    Each play run will take a certain amount of seconds off the clock.
    We'll randomize it.

    I've split it up into halves. We're not going to worry about time stoppages.
    It's as if there are no timeouts. Who has time for that?

    But I will take into account half time. So if a drive is not complete at the end of a half,
    the drive will end and a change of possession will occur.

    We start off with a coin flip to figure out who gets possession.

    From there, we begin a drive. A drive can start with either a kick-off or a turnover.

    We'll feed this information to a 'drive' function using information from the last drive.

    In the drive, we'll run a play.
    
    The offense will pick either a run or pass play.
    This will be randomly picked weighted towards the coach's offense strategy.
    E.g. Run Heavy offenses will pick run plays 60% of the time where a vertical offense
    will run pass plays 60% of the time.

    The defense will then randomly pick run or pass defense which will also be weighted
    based on the opposing team's coaching philosophy. E.g. a team facing a run heavy team
    will pick run defense 60% of the time.

    Then we run their decisions through some sort of formula.

    If a team picks a pass play and the defense picks a pass defense, then the defense
    should have a higher chance of stopping it. If the O picks pass and the D picks run,
    then the O should have the advantage. We also have to take into account the team's stats.

    If both teams pick "pass", but the defense has 89 PD and the offense has 75 PO, the outcome
    should be weighted towards the defense.

    If the O picks a running play, and the D picks to defend the pass, then we'll stil compare
    both team's RO and RD, respectively, but we should apply a penalty of sorts to the defense
    for not being as prepared. 

    We will run this and mark off a random amount of yards, random amount of seconds and
    mark off a down.

    If we get to fourth down, then we have to check field position. Right now, let's not worry
    about the game situation (a team down on their last drive would obviously go for it on 4th,
    but let's assume the coach will always punt or kick). Here, we check the kicker's ST stat.
    We'll come up with a formula that takes the overall and uses that to figure out the probability
    they make field goal from a certain distance. If it's above 75%, then let's have the coach kick it.

    This is really rudimentary, but hey, I just wanna see some games simulated. We'll fix it later.

    If kicking percentage is below 75%, let's punt the ball. Punt yardage is dependent first on Punter's ST
    and then we calculate return yards based on return team's ST vs the kicking team's ST.

    A drive can end one of four ways: END OF REGULATION, END OF HALF, SCORE, TURNOVER.

    END OF REGULATION means the game is over. No new drives. Yay. It's when the clock hits 0
    during a drive and the half is '2';

    END OF HALF means that a new drive is created and possession is changed to opposite of starting posession.
    It's when the clock hits 0 during a drive and the half is '1';

    SCORE means that a new drive is created. Score is added to correct team. Possession is changed
    and next drive begins with a kick off.

    TURNOVER means that a new drive is created. Possession is changed and starting position is based on
    last drive. Turnovers are created based on each team's stats and the plays selected. A correct defense
    has a higher chance of a turnover than the wrong defense. This may be a later thing to be implemented
    once I get the system going.



*/

class FootballGame{

    constructor (homeTeam, awayTeam, weather) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.weather = weather;

        this.gameLength = 900; // should be 3600
        this.halfLength = this.gameLength/2; // 30 minutes = 1800s
        this.quarterLength = this.gameLength/4; // 15 minutes = 900s
        this.currentTime = this.gameLength;

        this.homeTeam.score = 0;
        this.awayTeam.score = 0;

        this.homeTeam.passingYards = 0;
        this.homeTeam.rushingYards = 0;

        this.awayTeam.passingYards = 0;
        this.awayTeam.rushingYards = 0;

        this.quarter = 1;

        this.down = 1;
        this.yardsToGo = 10;
        this.fieldPosition = 1;

        this.coinFlip = round(random());

        if (this.coinFlip == 0){
            this.startingPossession = this.possession = homeTeam;
            this.notPossession = awayTeam;
        }else{
            this.startingPossession = this.possession = awayTeam;
            this.notPossession = homeTeam;
        }
        console.log("Today's game is the " + homeTeam.city + " " + homeTeam.name + " vs the " + awayTeam.city + " " + awayTeam.name + "!");
    }

    newGame(){
        // If the team is down in the bottom of a half, then go for it!
        // Otherwise, check

        // this.scoreDifference = this.offense.score - this.defense.score;
        // this.FIELD_GOAL_RANGE = 100-(this.FIELD_GOAL_DISTANCE-17);

        // if (this.down == 4){
        //     if (this.scoreDifference > 3 && this.quarter == 4 && this.timeRemaining <= 120){
        //         runPlay();
        //     }else if (this.fieldPosition >= this.FIELD_GOAL_RANGE){ // if in field goal range
        //         kickFieldGoal();
        //     }else{
        //         puntFootball();
        //     }
        // }else{
        //     runPlay();
        // }
    }

    startGame(){
        console.log(this.startingPossession.city + " will receive first.");

        // THIS IS WHERE THE PLAY MAGIC WILL HAPPEN

        switch(this.possession.coach.offenseStyle){
            case 'Vertical':
                this.passThreshold = 35;
                break;
            case 'West Coast':
                this.passThreshold = 40;
                break;
            case 'Run Heavy':
                this.passThreshold = 65;
                break;
            case 'Balanced':
                this.passThreshold = 50;
                break;
            case 'Spread':
                this.passThreshold = 40;
                break;
            case 'Run and Shoot':
                this.passThreshold = 35;
                break;
        }

        console.log(this.possession.coach.offenseStyle);

        while(this.currentTime > 0){

            // console.log(this.currentTime);

            console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');

            this.offenseDiceRoll = round(random(100));
            if(this.offenseDiceRoll > this.passThreshold){
                this.offensePlay = 'PASS';
                this.offenseStat = this.possession.po;
            }else{
                this.offensePlay = 'RUN';
                this.offenseStat = this.possession.ro;
            }

            this.defenseDiceRoll = round(random(100));
            if(this.defenseDiceRoll > this.passThreshold){
                this.defensePlay = 'PASS';
                this.defenseStat = this.notPossession.pd;
            }else{
                this.defensePlay = 'RUN';
                this.defenseStat = this.notPossession.rd;
            }

            this.yardsGained = 0;
            this.passingYardsGained = round(random(2, 10));
            this.rushingYardsGained = round(random(0, 10));

            if(this.defensePlay == this.offensePlay){
                // if the offense and defense pick the same thing
                if (this.offensePlay == 'PASS'){
                    console.log(this.possession.city + " is passing...and defense chose pass.");
                    // determine if it's an incomplete pass, complete pass
                    this.passResult = round(random(100));
                    if (this.passResult < (50 + this.offenseStat-this.defenseStat)){
                        // pass is complete
                        this.yardsGained += 1;
                        if (this.yardsGained > ((99-this.fieldPosition))){
                            this.yardsGained = (99-this.fieldPosition);
                        }
                        this.possession.passingYards += this.yardsGained;
                        console.log("Pass is complete for " + this.yardsGained + " yards!")
                    }else{
                        // pass is incomplete.
                        this.yardsGained += 0;
                        console.log("Pass is incomplete!");
                    }
                }else{
                    // if play is run
                    this.yardsGained += 0;
                    if (this.yardsGained > ((99-this.fieldPosition))){
                        this.yardsGained = (99-this.fieldPosition);
                    }
                    this.possession.rushingYards += this.yardsGained;
                    console.log("Defense chose run and " + this.possession.city + " ran the ball for " + this.yardsGained + " yards!");
                }
            }else{
                // the defense is at a mismatch
                if (this.offensePlay == 'PASS'){
                    console.log(this.possession.city + " is passing...and defense chose run!");
                    // determine if it's an incomplete pass, complete pass
                    this.passResult = round(random(100));
                    if (this.passResult < (50 + this.offenseStat-this.defenseStat*.75)){
                        // pass is complete
                        this.yardsGained += round(random(2, ((99-this.fieldPosition))));
                        this.possession.passingYards += this.yardsGained;
                        console.log("Pass is complete for " + this.yardsGained + " yards!")
                    }else{
                        // pass is incomplete.
                        this.yardsGained += 0;
                        console.log("Pass is incomplete!");
                    }
                }else{
                    // if play is run
                    this.yardsGained += round(random(0, ((99-this.fieldPosition))));
                    this.possession.rushingYards += this.yardsGained;
                    console.log("Defense chose pass and " + this.possession.city + " ran the ball for " + this.yardsGained + " yards!");
                }
            }

            // AFTER A PLAY IS RUN

            // Change the field position according to how many yards were gained.
            this.fieldPosition += this.yardsGained;

            if(this.yardsGained >= this.yardsToGo){
                this.down = 1;
                if (100-this.fieldPosition < 10){
                    this.yardsToGo = 100-this.fieldPosition;
                }else{
                    this.yardsToGo = 10;
                }
                if (this.fieldPosition >= 100){
                    
                    console.log('%c TOUCHDOWN!!!', 'background: green; color: white; display: block;');
                    if (this.possession == awayTeam){
                        this.awayTeam.score += 7;
                        this.possession = homeTeam;
                        this.notPossession = awayTeam;
                    }else{
                        this.homeTeam.score += 7;
                        this.possession = awayTeam;
                        this.notPossession = homeTeam;
                    }
                    this.fieldPosition = 1;
                    console.log(this.possession.city + " is on offense at the " + this.fieldPosition + " yard line.");
                    console.log(this.possession.coach.offenseStyle);
                }else{
                    console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
                    console.log(this.possession.city + " is at the " + this.fieldPosition + " yard line");    
                }
            }else{
                this.down++;
                if (this.down > 4){

                    if (this.fieldPosition >= 75){
                        console.log('%c' + 'FIELD GOAL', 'background: green; color: white; display: block; padding: 5px;');
                        if (this.possession == awayTeam){
                            this.awayTeam.score += 3;
                            this.possession = homeTeam;
                            this.notPossession = awayTeam;
                        }else{
                            this.homeTeam.score += 3;
                            this.possession = awayTeam;
                            this.notPossession = homeTeam;
                        }
                    }else{
                        console.log('%c' + 'TURNOVER ON DOWNS', 'background: blue; color: white; display: block; padding: 5px;');
                        if (this.possession == awayTeam){
                            this.awayTeam.score += 0;
                            this.possession = homeTeam;
                            this.notPossession = awayTeam;
                        }else{
                            this.homeTeam.score += 0;
                            this.possession = awayTeam;
                            this.notPossession = homeTeam;
                        }
                    }
                    this.down = 1;
                    this.yardsToGo = 10;
                    this.fieldPosition = 100-this.fieldPosition;
                    console.log(this.possession.city + " is on offense at the " + this.fieldPosition + " yard line.");
                    console.log(this.possession.coach.offenseStyle);
                }else{
                    this.yardsToGo -= this.yardsGained;
                    console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
                    console.log(this.possession.city + " is at the " + this.fieldPosition + " yard line");    
                }
            }

            let playLength = round(random(45, 50));


            this.currentTime -= playLength;

            if(this.currentTime <= this.gameLength-(this.quarterLength*this.quarter)){
                this.currentTime = this.gameLength-(this.quarterLength*this.quarter)
                console.log("%cEnd of Quarter " + this.quarter, 'background: magenta; color: white; display: block; padding: 5px;');
                if (this.quarter == 2){
                    console.log("%cHALFTIME", 'background: magenta; color: white; display: block; padding: 5px;');
                    if (this.coinFlip == 0){
                        this.possession = awayTeam;
                        this.notPossession = homeTeam;
                    }else{
                        this.possession = homeTeam;
                        this.notPossession = awayTeam;
                    }
                    console.log(this.possession.city + " will receive second half kickoff.");
                    this.down = 1;
                    this.yardsToGo = 10;
                    this.fieldPosition = 1;
                }
                this.quarter++;
                console.log(this.homeTeam.city + ": " + this.homeTeam.score);
                console.log(this.awayTeam.city + ": " + this.awayTeam.score);
            }

            // if(this.currentTime <= this.halfLength){ // HALFTIME
            //     console.log("HALFTIME");
            //     if (this.coinFlip == 0){
            //         this.possession = awayTeam;
            //     }else{
            //         this.possession = homeTeam;
            //     }
            //     console.log(this.possession.city + " will receive second half kickoff.");
            //     this.currentTime = this.halfLength;
            // }
        }
        console.log("%cGAME OVER", 'background: magenta; color: white; display: block; padding: 5px;');
        console.log(this.homeTeam.city + "(" + this.homeTeam.coach.offenseStyle + ") Stats:");
        console.log('Passing Yards: ' + this.homeTeam.passingYards);
        console.log('Rushing Yards: ' + this.homeTeam.rushingYards);

        console.log(this.awayTeam.city + "(" + this.awayTeam.coach.offenseStyle + ") Stats:");
        console.log('Passing Yards: ' + this.awayTeam.passingYards);
        console.log('Rushing Yards: ' + this.awayTeam.rushingYards);

        // console.log("PASS O PLAYS: " + po);
        // console.log("RUN O PLAYS: " + ro);
        // console.log("PASS D PLAYS: " + pd);
        // console.log("RUN D PLAYS: " + rd);
        // console.log("Total Plays: " + (po + ro));
    }

    changePossession(possession, homeTeam, awayTeam, score){

        this.possession = possession;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.score = score;

        if (this.possession == this.awayTeam){
            this.awayTeam.score += this.score;
            this.possession = this.homeTeam;
            this.notPossession = this.awayTeam;
        }else{
            this.homeTeam.score += this.score;
            this.possession = this.awayTeam;
            this.notPossession = this.homeTeam;
        }

        console.log(this.homeTeam.city + ": " + this.homeTeam.score);
        console.log(this.awayTeam.city + ": " + this.awayTeam.score);

    }

    runPlay(){

        /*

        Check how much time we have left
        Check field position
        Check the downs and yards to go

        If it's 4th down, do we want to punt, kick a field goal, or go for it?

        Inside the 25 (fieldPosition >= 75), then kick a field goal
        UNLESS it's the fourth quarter and the offense is behind by more than 3. Then go for it, fools.

        Outside the 25, punt it
        UNLESS it's the fourth quarter and the offense is behind. Then go for it, fools.


        // If the team is down in the bottom of a half, then go for it!
        // Otherwise, check

        this.scoreDifference = this.offense.score - this.defense.score;
        this.FIELD_GOAL_RANGE = 100-(this.FIELD_GOAL_DISTANCE-17);

        if (this.down == 4){
            if (this.scoreDifference > 3 && this.quarter == 4 && this.timeRemaining <= 120){
                runPlay();
            }else if (this.fieldPosition >= this.FIELD_GOAL_RANGE){ // if in field goal range
                kickFieldGoal();
            }else{
                puntFootball();
            }
        }else{
            runPlay();
        }
            

        Pick Offense Play
        Pick Defense Play

        If Offense and Defense pick the same play
            do some shit
        If they pick different plays
            do some shit

        

        */

        
    }
}