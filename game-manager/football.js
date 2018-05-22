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

class FootballGame {

    constructor(homeTeam, awayTeam, field, weather) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.field = field;
        this.weather = weather;
        this.teams = [];

        this.teams.push(this.homeTeam);
        this.teams.push(this.awayTeam);

        this.gameLength = 3600; // should be 3600
        this.halfLength = this.gameLength / 2; // 30 minutes = 1800s
        this.quarterLength = this.gameLength / 4; // 15 minutes = 900s
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
        this.fieldPosition = 25;

        this.FIELD_GOAL_DISTANCE = 50;
        this.FIELD_GOAL_RANGE = 100 - (this.FIELD_GOAL_DISTANCE - 17);

        this.time = millis();
        this.playDelay = 1;

        for (var team of this.teams) {
            team.roster = team.players.sort(function (a, b) { return (a.overall > b.overall) ? -1 : ((b.overall > a.overall) ? 1 : 0); });
            team.qbs = team.roster.filter(player => player.pos == 'QB');
            team.punters = team.roster.filter(player => player.pos == 'P');
            team.kickers = team.roster.filter(player => player.pos == 'K');
            //console.log(team.city + "'s Starting Punter is " + team.punter.name + " - " + team.punter.overall + " Overall, with " + team.punter.st + " Special Teams Ability");
        }

        this.coinFlip = round(random());

        if (this.coinFlip == 0) {
            this.startingPossession = this.offense = homeTeam;
            this.defense = awayTeam;
        } else {
            this.startingPossession = this.offense = awayTeam;
            this.defense = homeTeam;
        }
        console.log("Today's game is the " + homeTeam.city + " " + homeTeam.name + " vs the " + awayTeam.city + " " + awayTeam.name + "!");

        console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
        console.log(this.offense.city + " is at the " + this.fieldPosition + " yard line");

    }

    startGame() {

        console.log(this.startingPossession.city + " will receive first.");

        switch (this.offense.coach.offenseStyle) {
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

        // Game Loop
        while (this.currentTime > 0) {

            if (millis() - this.time >= this.playDelay) {
                // console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');

                // If the team is down in the bottom of a half, then go for it!
                // Otherwise, check

                this.scoreDifference = this.offense.score - this.defense.score;

                // Set up some variables for the field goals based on the kicker's ability.

                this.offense.FIELD_GOAL_RANGE = (100 - (round(this.offense.kickers[0].st / 2) - 17));

                if (this.down == 4) {
                    if (this.scoreDifference > 3 && this.quarter == 4 && this.currentTime <= 120) {
                        this.runPlay();
                        // this.kickFieldGoal();
                    } else if (this.fieldPosition >= this.offense.FIELD_GOAL_RANGE) { // if in field goal range
                        this.kickFieldGoal();
                    } else {
                        this.puntFootball();
                    }
                } else {
                    if (this.quarter == 2 && this.currentTime <= this.halfLength + 60 && this.fieldPosition >= this.FIELD_GOAL_RANGE) {
                        this.kickFieldGoal();
                    } else {
                        this.runPlay();
                    }
                }

                if (this.down > 4) {
                    this.changePossession(0, 100 - this.fieldPosition);
                }

                /*
    
                    We check to see if the offense has made it past the "100" yard line.
                    If so, then they've scored a touchdown. Huzzah! Hooray!
    
                    We then change possession.
    
                    If they haven't, then we report the downs as is.
    
                */

                // if (this.fieldPosition >= 100){
                //     console.log('%c TOUCHDOWN!', 'background: green; color: white; display: block;');
                //     this.changePossession(7);
                // }

                // After all play decisions have been made, let's look at making the game go.

                if (this.currentTime <= this.gameLength - (this.quarterLength * this.quarter)) {
                    this.currentTime = this.gameLength - (this.quarterLength * this.quarter)
                    console.log("%cEnd of Quarter " + this.quarter, 'background: magenta; color: white; display: block; padding: 5px;');
                    if (this.quarter == 2) {
                        console.log("%cHALFTIME", 'background: magenta; color: white; display: block; padding: 5px;');
                        if (this.coinFlip == 0) {
                            this.offense = awayTeam;
                            this.defense = homeTeam;
                        } else {
                            this.offense = homeTeam;
                            this.defense = awayTeam;
                        }
                        console.log(this.offense.city + " will receive second half kickoff.");
                        this.down = 1;
                        this.yardsToGo = 10;
                        this.fieldPosition = 25;
                    }
                    this.quarter++;
                    console.log(this.homeTeam.city + ": " + this.homeTeam.score);
                    console.log(this.awayTeam.city + ": " + this.awayTeam.score);
                }
                this.time = millis();//also update the stored time
            }



        }
        console.log("%cGAME OVER", 'background: magenta; color: white; display: block; padding: 5px;');
        console.log(this.homeTeam.city + " (" + this.homeTeam.coach.offenseStyle + ") Stats:");
        console.log('Passing Yards: ' + this.homeTeam.passingYards);
        console.log('Rushing Yards: ' + this.homeTeam.rushingYards);

        console.log(this.awayTeam.city + " (" + this.awayTeam.coach.offenseStyle + ") Stats:");
        console.log('Passing Yards: ' + this.awayTeam.passingYards);
        console.log('Rushing Yards: ' + this.awayTeam.rushingYards);
    }

    kickFieldGoal() {

        this.offense.FIELD_GOAL_VARIANCE = -.1 * this.offense.kickers[0].st + 10;
        this.offense.FIELD_GOAL_RANGE = (100 - (round(this.offense.kickers[0].st / 2) - 17)) + round(random(-this.offense.FIELD_GOAL_VARIANCE, this.offense.FIELD_GOAL_VARIANCE));

        if (this.fieldPosition >= this.offense.FIELD_GOAL_RANGE) { // if in field goal range
            console.log('%c FIELD GOAL!', 'background: green; color: white; display: block;');
            console.log(this.offense.kickers[0].name + " kicks a " + (117 - this.fieldPosition) + " yard Field Goal.");
            this.changePossession(3);
            console.log(this.homeTeam.city + ": " + this.homeTeam.score);
            console.log(this.awayTeam.city + ": " + this.awayTeam.score);
        } else {
            console.log('%c FIELD GOAL MISSED!', 'background: red; color: white; display: block;');
            this.changePossession(0, 100 - this.fieldPosition);
        }

        let playLength = round(random(45, 50));
        this.currentTime -= playLength;
    }

    puntFootball() {
        console.log('%c PUNT!', 'background: green; color: white; display: block;');
        let playLength = round(random(45, 50));
        this.currentTime -= playLength;

        this.PUNT_DISTANCE_MIN = this.offense.punters[0].st / 2;
        this.PUNT_DISTANCE = round(this.PUNT_DISTANCE_MIN + random(0, 20));

        console.log(this.offense.punters[0].name + " punts " + this.PUNT_DISTANCE + " yards.");

        if (this.PUNT_DISTANCE + this.fieldPosition > 99) {
            this.STARTING_FIELD_POSITION = 20;
            console.log("TOUCHBACK");
        } else {
            this.STARTING_FIELD_POSITION = 100 - (this.fieldPosition + this.PUNT_DISTANCE);
        }

        this.changePossession(0, this.STARTING_FIELD_POSITION);

    }

    runPlay() {

        /*

            Figure out what play the offense is going to run.

            First we roll a random number from 1-100.
            We compare that number to the passThreshold.
            Different offense styles have different tendencies to pass.
            Some more, some less.

            We do the same for the defense.

            The defense knows how the offense tends to choose plays.
            So it picks plays based on that tendency.

        */

        this.offenseDiceRoll = round(random(100));

        if (this.offenseDiceRoll > this.passThreshold) {
            this.offensePlay = 'PASS';
            this.offenseStat = this.offense.po;
        } else {
            this.offensePlay = 'RUN';
            this.offenseStat = this.offense.ro;
        }

        this.defenseDiceRoll = round(random(100));

        if (this.defenseDiceRoll > this.passThreshold) {
            this.defensePlay = 'PASS';
            this.defenseStat = this.defense.pd;
        } else {
            this.defensePlay = 'RUN';
            this.defenseStat = this.defense.rd;
        }

        // Reset the yards gained to 0.

        this.yardsGained = 0;

        /*

            Now we check the offense's pick to the defense's play pick.

            If they're the same, then the defense should have the advantage.
            Vice versa for if they're different: the offense should have the advantage.

        */

        if (this.defensePlay == this.offensePlay) {
            // if the offense and defense pick the same thing
            if (this.offensePlay == 'PASS') {
                console.log(this.offense.city + " is passing...and defense chose pass.");
                // determine if it's an incomplete pass, complete pass
                this.passResult = round(random(100));
                if (this.passResult < (50 + this.offenseStat - this.defenseStat)) {
                    // pass is complete
                    this.yardsGained += round(random(0, this.offenseStat / 12));
                    if (this.yardsGained > ((100 - this.fieldPosition))) {
                        this.yardsGained = (100 - this.fieldPosition);
                    }
                    this.offense.passingYards += this.yardsGained;
                    console.log(this.offense.qbs[0].name + " pass is complete for " + this.yardsGained + " yards!")

                } else {
                    // pass is incomplete.

                    /*
                    
                        Let's try doing some interceptions, shall we? 

                        Chance of an interception is the difference between the pass D and the pass O with a minimum of 1
                        A 99 ovr vs a 75 overall has a 24% chance? doesn't seem right. maybe half that? quarter that?
                        So (PD - PO)/2 with a minimum of 1. That's the percent chance of an interception.

                    */


                    this.interceptionChance = Math.max((this.defenseStat - this.offenseStat) * 2, 1);
                    this.interceptionChance = Math.min(this.interceptionChance, 25);
                    this.interceptionRoll = round(random(100));

                    if (this.interceptionRoll <= this.interceptionChance) {

                        console.log(this.offense.qbs[0].name + " pass is intercepted!");
                        console.log('%c INTERCEPTION!', 'background: red; color: white; display: block;');

                        this.yardsGained += round(random(this.offenseStat / 25, 100));
                        if (this.yardsGained > ((100 - this.fieldPosition))) {
                            this.yardsGained = (100 - this.fieldPosition);
                        }

                        this.interception = true;

                    } else {

                        this.yardsGained += 0;
                        console.log(this.offense.qbs[0].name + " pass is incomplete!");

                    }
                }
            } else {
                // if play is a run play
                this.yardsGained += round(random(-this.offenseStat / 25, this.offenseStat / 10));
                if (this.yardsGained > ((100 - this.fieldPosition))) {
                    this.yardsGained = (100 - this.fieldPosition);
                }
                this.offense.rushingYards += this.yardsGained;
                console.log("Defense chose run and " + this.offense.city + " ran the ball for " + this.yardsGained + " yards!");
            }
        } else {
            // the defense is at a mismatch
            if (this.offensePlay == 'PASS') {
                console.log(this.offense.city + " is passing...and defense chose run!");
                // determine if it's an incomplete pass, complete pass
                this.passResult = round(random(100));
                if (this.passResult < (50 + this.offenseStat - this.defenseStat * .75)) {
                    // pass is complete
                    this.yardsGained += round(random(this.offenseStat / 25, this.offenseStat / 2));
                    if (this.yardsGained > ((100 - this.fieldPosition))) {
                        this.yardsGained = (100 - this.fieldPosition);
                    }
                    this.offense.passingYards += this.yardsGained;
                    console.log(this.offense.qbs[0].name + " pass is complete for " + this.yardsGained + " yards!")
                } else {
                    // pass is incomplete.
                    this.yardsGained += 0;
                    console.log(this.offense.qbs[0].name + " pass is incomplete!");
                }
            } else {
                // if play is run
                this.yardsGained += round(random(0, this.offenseStat / 4));
                if (this.yardsGained > ((100 - this.fieldPosition))) {
                    this.yardsGained = (100 - this.fieldPosition);
                }
                this.offense.rushingYards += this.yardsGained;
                console.log("Defense chose pass and " + this.offense.city + " ran the ball for " + this.yardsGained + " yards!");

            }
        }

        /*
        
            Now, we advance the down and update the yardsToGo.
            Then we leave this function and head back to the main game loop.

            First, we update the field position based on how many yards were gained (or lost).

            Then, we check if the yards gained is greater than how many
            yards we had left until a first down. If so, the down is reset to 1 and the yardsToGo to 10.
            If there's less than 10 yards until the endzone, then instead it is 1st and 9, or 8, etc.

            If it isn't greater than how many yards are left, then we increase the down.
        
        */

        // Change the field position according to how many yards were gained.
        this.fieldPosition += this.yardsGained;

        // We create a variable to see how long the play lasts.
        // Then we subtract that time from the overall time.

        let playLength = round(random(40, 45));
        this.currentTime -= playLength;

        if (this.interception) {
            this.changePossession(0, 100 - this.fieldPosition, false, false);
            this.interception = false;
        }
        else if (this.fieldPosition >= 100) {
            console.log('%c TOUCHDOWN!', 'background: green; color: white; display: block;');
            this.changePossession(7);
        } else {
            if (this.yardsGained >= this.yardsToGo) {
                this.down = 1;
                if (100 - this.fieldPosition < 10) {
                    this.yardsToGo = 100 - this.fieldPosition;
                } else {
                    this.yardsToGo = 10;
                }
                console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
                console.log(this.offense.city + " is at the " + this.fieldPosition + " yard line");
            } else {
                this.down++;
                this.yardsToGo -= this.yardsGained;
                console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
                console.log(this.offense.city + " is at the " + this.fieldPosition + " yard line");
            }
        }

    }

    changePossession(score = 0, startingFieldPosition = 25, offenseScore = true, showScore = true) {

        this.score = score;
        this.startingFieldPosition = startingFieldPosition;
        this.offenseScore = offenseScore;
        this.showScore = showScore;

        if (this.offense == awayTeam) {
            this.offense.score += this.score;
            this.offense = homeTeam;
            this.defense = awayTeam;
        } else {
            this.homeTeam.score += this.score;
            this.offense = awayTeam;
            this.defense = homeTeam;
        }

        this.fieldPosition = this.startingFieldPosition;
        this.down = 1;
        if (100 - this.fieldPosition < 10) {
            this.yardsToGo = 100 - this.fieldPosition;
        } else {
            this.yardsToGo = 10;
        }

        if (this.showScore) {
            console.log(this.homeTeam.city + ": " + this.homeTeam.score);
            console.log(this.awayTeam.city + ": " + this.awayTeam.score);
        }

        console.log(this.offense.city + " is on offense at the " + this.fieldPosition + " yard line.");
        // console.log('%c' + this.down + " and " + this.yardsToGo, 'background: black; color: white; display: block; padding: 5px;');
        // console.log("Coach " + this.offense.coach.name + " uses a " + this.offense.coach.offenseStyle + " offense");
    }
}