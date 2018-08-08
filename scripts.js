function setPlayerNames()
{
	window.location = "playerSetName.html";
}

// ---------------------------------------------------------------------
// Extend sessionStorage to store objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

// ---------------------------------------------------------------------
// Get a random number in a range
function random(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// ---------------------------------------------------------------------
// Shuffle an array
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// ---------------------------------------------------------------------
// Start a new game
function create( pnum )
{
	sessionStorage.clear();
	
	sessionStorage.setItem("player_number", pnum);
	
	// create all the new players
	setPlayerNames();
}

// ---------------------------------------------------------------------
// Setting the player name
function setName( setnum )
{
	document.getElementById("p_title").innerHTML = "Player " + (setnum+1) + ":";
	document.getElementById("p_button").onclick = function(){ setName(setnum+1); };
	
	var player = {
		name: document.getElementById("p_text").value,
		role: "liberal"
	};
	
	sessionStorage.setObject("player"+setnum, player);
	
	document.getElementById("p_text").value = "Boba Fett";
	
	if(setnum == sessionStorage.getItem("player_number") ) {
		setGame();
		
		window.location = "pass.html";
		return;
	}
}

// ---------------------------------------------------------------------
// set game
function setGame()
{
	player_num = sessionStorage.getItem("player_number");
	
	// assign what player is V.
	var vnum = random(1, player_num);
	
	var vader = JSON.parse(sessionStorage.getItem("player"+vnum));
	
	vader.role = "Dart Vader";
	
	sessionStorage.setObject("player"+vnum, vader);
	
	console.log(vader.name + " is Dart Vader")
	
	// find the others affiliated empire
	if((player_num == 5) || (player_num == 6)) {
		var num_empire = 1;
	}
	else if((player_num == 7) || (player_num == 8)) {
		var num_empire = 2;
	}
	else if((player_num == 9) || (player_num == 10)) {
		var num_empire = 3;
	}
	
	while(num_empire > 0) {
		var empire_num = random(1, player_num);
		
		var p = sessionStorage.getObject("player"+empire_num);
		
		if(p.role !== "liberal") {
			continue;
		}
		
		num_empire--;
		
		p.role = "Imperialist";
		
		sessionStorage.setObject("player"+empire_num, p);
		
		console.log(p.name + " is Imperialist");
	}
	
	// now choose who now is gonna be the first Emperor
	var first_emperor = random(1, player_num);
	sessionStorage.setItem("emperor", first_emperor);
	
	// this is the first election
	sessionStorage.setItem("chancellor", 0);
	sessionStorage.setItem("past_emperor", "-");
	sessionStorage.setItem("past_chancellor", "-");
	
	// The first emperor is also the first to play
	sessionStorage.setItem("turn", first_emperor);
	
	// create the pile of policies
	var discard_pile = [];
	var pile = [
		"l","l","l","l","l","l",
		"f","f","f","f","f","f","f","f","f","f","f",
	];
	pile = shuffle(pile);
	sessionStorage.setItem("pile", pile);
	sessionStorage.setItem("discard_pile", discard_pile);
	
	// election tracker
	sessionStorage.setItem("tracker", 0);
	
	// at the start of the game, just do a turn showing each one role
	sessionStorage.setItem("phase", "first_round");
}

// ---------------------------------------------------------------------
// Make the one who has the phone in the hand pass it
function passLoaded()
{
	var name = sessionStorage.getObject("player" + sessionStorage.getItem("turn") ).name;
	
	document.getElementById("notice").innerHTML = "Pass the phone to " + name;
	document.getElementById("button").value = "OK, now I am " + name;
}

// ---------------------------------------------------------------------
// This organize the play page just after has loaded
function playLoaded()
{
	var phase = sessionStorage.getItem("phase");
	
	var turn = sessionStorage.getItem("turn");
	var player = sessionStorage.getObject("player" + turn );
	var emperor_num = sessionStorage.getItem("emperor");
	var emperor = sessionStorage.getObject("player" + emperor_num);
	var player_num = Number(sessionStorage.getItem("player_number"));
	
	// first round just to show roles
	if( phase === "first_round" )
	{
		let text = "";
		
		if((player.role == "Imperialist") || ((player.role == "Dart Vader") && (player_num < 7)))
		{
			text += "The other Imperialists are:<br>";
			
			for(var i=1; i<=player_num; i++)
			{
				let temp_player = sessionStorage.getObject("player"+i);
				
				if(temp_player.name != player.name)
				{
				
					if(temp_player.role == "Imperialist")
					{
						text += "- <b>" + temp_player.name + "</b><br>"
					}
					else if(temp_player.role == "Dart Vader")
					{
						text += "- <b>" + temp_player.name + "</b> (Dart Vader)<br>"
					}
				}
			}
		}
		
		text += "<br>As first Emperor, <b>" + emperor.name + "</b> has been randomly choosen";
		
		document.getElementById("top_title").innerHTML = "You are <b>" + player.role + "</b>";
		document.getElementById("comment").innerHTML = text;
	}
	// election phase - emperor turn
	else if( phase === "election_emperor" )
	{
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "As candidate Emperor, you have to choose a player to be the candidate chancellor:";
		
		// remove button
		let old_button = document.getElementById("button");
		if(old_button)
		{
			old_button.parentNode.removeChild(old_button);
		}
		
		for(var i=1; i<=player_num; i++)
		{
			let temp_player = sessionStorage.getObject("player"+i);
			let past_e = sessionStorage.getItem("past_emperor");
			let past_c = sessionStorage.getItem("past_chancellor");
			
			if( temp_player.name != player.name ||
				i != past_e ||
				i != past_c
			)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = "<b>" + temp_player.name + "<b>";
				button.onclick = function(){ setChancellor( i ) };
				
				let el = document.getElementById("last_break");
				el.appendChild(button);
			}
		}
	}
	else if( phase === "vote_round")
	{
		let chancellor_num = sessionStorage.getItem("chancellor");
		let chancellor = sessionStorage.getObject("player" + chancellor_num);
		
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "You have to vote for the proposed new govern:<br>- <b>";
		text += emperor.name + "</b> as new Emperor<br>- <b>";
		text += chancellor.name + "</b> as new Chancellor<br><br>";
		
		let byes = document.getElementById("button");
		byes.value = "Yes";
		byes.onclick = function(){ vote("y", turn); };
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function(){ vote("n", turn) };
		
		byes.parentNode.appendChild(bno);
	}
}

// ---------------------------------------------------------------------
// This handle the actions at the end of a turn
function postPlay()
{
	var phase = sessionStorage.getItem("phase");
	var emperor_num = Number(sessionStorage.getItem("emperor"));
	var player_num = Number(sessionStorage.getItem("player_number"));
	
	if(phase === "first_round" )
	{
		// update turn
		let next_turn = Number(sessionStorage.getItem("turn")) + 1;
		
		// restart over if it's the case
		if( next_turn > player_num)
			next_turn = 1;
		
		sessionStorage.setItem("turn", next_turn);
		
		// if everyone already seen his role, go to the election phase
		if( next_turn == emperor_num )
		{
			sessionStorage.setItem("phase", "election_emperor");
		}
	}
	else if(phase === "election_emperor")
	{
		// after, we must do a round of votes
		sessionStorage.setItem("phase", "vote_round");
	}
	else if(phase === "vote_round")
	{
		
	}
	
	// give control to next player that has to play
	window.location = "pass.html";
}

// ---------------------------------------------------------------------
// called from HTML, it sets chancellor someone then finishes turn
function setChancellor( pl )
{
	sessionStorage.setItem("chancellor", pl);
	
	postPlay();
}
