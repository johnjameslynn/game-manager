class Conference {
    constructor (name, slug) {
        this.name = name;
        this.slug = slug;
    }
}

class Division {
    constructor (name, slug) {
        this.name = name;
        this.slug = slug;
    }
}



class Schedule {
    constructor (teams, divisions, conferences){
        this.teams = teams;
        this.divisions = divisions;
        this.conferences = conferences;
    }

    generateSchedule(){
        var schedule = [];

        /*

            // In an NFL Schedule, there are several things that we must do:

            6 games are division opponents
            4 games are from a division in the conference
            4 games are from a division in the other conference
            2 games are from the remaining divisions with a team with the same rank (1-4)

            When we generate a team, let's give each team a rank of 1-4 within their division.
            We'll use that number here. I'm not going to keep track of history, though this is something
            I'll want to include in the future. I just want to get it working at this point.

            Division opponents should be easy, we'll just grab every other team in the division twice.

            For a division in the conference, we'll have to keep track of the last three years so that
            the same division doesn't get pulled two years in a row.

            Same for the division in the other conference.

            Finally, we look at the remaining divisions in the conference and the ranks
            of the teams and find the team with the same rank

        */

        for(let i=0; i<teams.length; i++){
            let team = teams[i];
            let teamDivision = team.division;
            let teamConference = team.conference;


            // schedule.push(team);            
        }
        console.table(schedule, ["city", "conference", "division"]);
    }

    /*

    schedule = [
        {
            "Week" : 1,
            "HomeTeam" : [{
                "team" : team[0],
                "score" : 17,
            }],
            "AwayTeam" : [{
                "team" : team[4],
                "score" : 17,
            }],
        }
    ]; */

}