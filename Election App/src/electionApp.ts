const STORAGE_KEY = 'electionApp'; //default values

// add part
class Vote { // eslint-disable-line no-unused- vars
    id : number 
    title : string
    age : number
    completed : boolean
    constructor(newId : number, newTitle : string, newAge : number) {
        this.id = newId;
        this.title = newTitle;
        this.age = newAge;
        this.completed = false; // default values 
    }
}

//create a whole that acts as facade for parts
class Ballot { // eslint-disable-line no-unused- vars
    allMyVotes : Vote[]
    editedItem : Vote | null
    editedVoteIndex : Vote | null
    beforeEditedTitle : string
    constructor() {
        this.allMyVotes = [];
        this.editedItem = null;
        this.editedVoteIndex = null;
        this.beforeEditedTitle = '';
    }

    getAllVotes() : Vote[]{
        return this.allMyVotes; //get all parts
    }

    getActiveVotes() : Vote[]{
        return this.allMyVotes.filter(vote => !vote.completed); //filter parts
    }

    getCompletedVotes() :Vote[] {
        return this.allMyVotes.filter(function(vote) {
            return vote.completed; //filter parts
        });
    }

    // load all parts from local storage
    load() :Vote[]{
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }

    // save all parts to local storage
    save() : void{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allMyVotes));
    }

    // add part
    addVote(newTitle : string, newAge = 18) : void{ //default value
        newTitle = newTitle.trim();
        if (!newTitle) {
            return;
        }
        const newId = this.allMyVotes.length + 1; // provide default values
        const aNewVote = new Vote(newId, newTitle, newAge);
        this.allMyVotes.push(aNewVote);
    }

    // a calculation across many parts
    remaining() : number{
        return this.getActiveVotes().length;
    }

    // a calculation across many parts
    getAllDone() : boolean{
        return this.remaining() === 0;
    }

    // a calculation within a part
    getAverageAge() : number{
        let average = 0;
        this.allMyVotes.forEach(vote => {
            average += vote.age;
        });
        average = average / this.allMyVotes.length;
        return average;
    }

    setAllDone() : void{
        this.allMyVotes.forEach(function(vote) {
            vote.completed = true;
        });
    }

    // delete a selected part
    removeVote(targetVote : Vote) : void {
        const index = this.allMyVotes.findIndex(vote => vote.title === targetVote.title);
        this.allMyVotes.splice(index, 1);
    }

    // update/edit a part
    startEditing(vote : Vote) : void{
        this.beforeEditedTitle = vote.title;
        this.editedItem = vote;
    }

    // update/edit a part 
    // validate inputs
    doneEditing(vote : Vote) : void{
        if (!vote) {
            return;
        }
        this.editedItem = null;
        vote.title = vote.title.trim();
        if (!vote.title) {
            this.removeVote(vote);
        }
    }

    // discard edits to a part
    cancelEdit(vote : Vote) : void{
        this.editedItem = null;
        vote.title = this.beforeEditedTitle;
    }

    //delete selected part
    removeCompleted() : void{
        this.allMyVotes = this.getActiveVotes();
    }

    //sort parts
    sortVotes() : void{
        this.allMyVotes.sort(function(a, b) {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
    }

    // find a part given a search
    findVote(targetTitle : string) : string{
        return this.allMyVotes.find((vote) => vote.title === targetTitle);
    }
}