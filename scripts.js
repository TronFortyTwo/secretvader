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
// subroutine that update the turn
function turnStep()
{
	let player_num = Number(sessionStorage.getItem("player_number"));
	
	// update turn
	let next_turn = Number(sessionStorage.getItem("turn")) + 1;
		
	// restart over if it's the case
	if( next_turn > player_num)
		next_turn = 1;
		
	sessionStorage.setItem("turn", next_turn);
	
	return next_turn;
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
	var player = {
		name: document.getElementById("p_text").value,
		role: "liberal"
	};
	
	sessionStorage.setObject("player"+setnum, player);
	
	if(setnum == sessionStorage.getItem("player_number") ) {
		setGame();
		
		window.location = "pass.html";
		return;
	}
	else
	{
		document.getElementById("p_title").innerHTML = "Player " + (setnum+1) + ":";
		document.getElementById("p_button").onclick = function(){ setName(setnum+1); };
		document.getElementById("p_text").value = "Player " + (setnum+1) + " name";
	}
}

// ---------------------------------------------------------------------
// set game
function setGame()
{
	player_num = sessionStorage.getItem("player_number");
	
	// assign what player is V.
	var vnum = random(1, player_num);
	
	var vader = sessionStorage.getObject("player"+vnum);
	
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
		let empire_num = random(1, player_num);
		
		let p = sessionStorage.getObject("player"+empire_num);
		
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
	
	console.log( sessionStorage.getObject("player"+first_emperor).name + " is first emperor");
	
	// this is the first election
	sessionStorage.setItem("chancellor", "0");
	sessionStorage.setItem("past_emperor", "0");
	sessionStorage.setItem("past_chancellor", "0");
	
	// The first emperor is also the first to play
	sessionStorage.setItem("turn", first_emperor);
	
	// create the pile of policies
	var discard_pile = [];
	var pile = [
		"l","l","l","l","l","l",
		"f","f","f","f","f","f","f","f","f","f","f"
	];
	pile = shuffle(pile);
	sessionStorage.setItem("pile", pile);
	sessionStorage.setItem("discard_pile", discard_pile);
	
	// election tracker
	sessionStorage.setItem("tracker", "0");
	
	// how many cards are in the table
	sessionStorage.setItem("empire_cards", "0");
	sessionStorage.setItem("liberal_cards", "0");
	
	// how many fascist cards are needed for imperialists to win
	sessionStorage.setItem("empire_cards_target", 6);
	
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
	var player_num = sessionStorage.getItem("player_number");
	var chancellor_num = sessionStorage.getItem("chancellor");
	var chancellor = sessionStorage.getObject("player" + chancellor_num);
	
	// -----------------------------------------------------------------
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
	// -----------------------------------------------------------------
	// election phase - emperor turn
	else if( phase === "election" )
	{
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "As candidate Emperor, you have to choose a player to be the candidate chancellor:";
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		
		document.getElementById("comment").innerHTML = text;
		
		// remove button
		let old_button = document.getElementById("button");
		if(old_button)
		{
			old_button.parentNode.removeChild(old_button);
		}
		
		// function
		function setButton(button, i) {
			button.onclick = function(){ setChancellor(i); };
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			let temp_player = sessionStorage.getObject("player"+i);
			let past_e = sessionStorage.getItem("past_emperor");
			let past_c = sessionStorage.getItem("past_chancellor");
			
			if( i != turn &&
				i != past_c &&
				( (Number(player_num) < 7) || i != past_e)
			)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = temp_player.name;
				
				setButton(button, i);
				
				let el = document.getElementById("last_break");
				el.parentNode.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.parentNode.appendChild(bre);
				el.parentNode.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// do a round asking for the votes
	else if( phase === "vote_round")
	{
		let chancellor_num = sessionStorage.getItem("chancellor");
		let chancellor = sessionStorage.getObject("player" + chancellor_num);
		
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		let text = "You have to vote for the proposed new govern:<br>- <b>";
		text += emperor.name + "</b> as new Emperor<br>- <b>";
		text += chancellor.name + "</b> as new Chancellor<br>Please, don't say your vote until everyone has voted<br<br>";
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		document.getElementById("comment").innerHTML = text;
		
		let byes = document.getElementById("button");
		byes.value = "Yes";
		byes.onclick = function(){ vote("y", turn); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		byes.parentNode.appendChild(bre);
		byes.parentNode.appendChild(bre2);
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function(){ vote("n", turn) };
		
		byes.parentNode.appendChild(bno);
	}
	// -----------------------------------------------------------------
	// show election results
	else if(phase === "vote_result")
	{
		// check votation results
		let yes = 0;
		let no = 0;
		let approved = false;
		
		for(var i=1; i<=player_num; i++)
		{
			if( sessionStorage.getItem("vote"+i) == "y" )
				yes++;
			else
				no++;
		}
		
		if(yes > no){
			approved = true;
		}
		
		// write things down
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		let text = "PUBLIC ANNOUNCE:<br>the new candidate government with<br>";
		text += "- <b>" + emperor.name + "</b> as Emperor<br>";
		text += "- <b>" + chancellor.name + "</b> as chancellor<br>";
		text += "has been ";
		if(approved)
		{
			text += '<font color="green">approved</font><br>';
		}
		else
		{
			text += '<font color="red">rejected</font><br>';
		}
		text += "<br>VOTES:<br>";
		for(var i=1; i<=player_num; i++)
		{
			let temp = sessionStorage.getItem("vote"+i);
			text += "- <b>" + sessionStorage.getObject("player"+i).name + "</b> : " + temp + "<br>"
		}
		if(approved)
		{
			text += "<br>Now the new government will create a new policy<br>";
			
			sessionStorage.setItem("vote_result", "y");
			sessionStorage.setItem("turn", emperor_num);
			sessionStorage.setItem("past_emperor", emperor_num);
			sessionStorage.setItem("past_chancellor", chancellor_num);
		}
		else
		{
			let new_emperor = Number(sessionStorage.getItem("emperor"));
			new_emperor++;
			if(new_emperor > player_num)
				new_emperor = 1;
			
			text += "<br>After this failure, the opportunity to create a new government is given to ";
			text += "<b>" + sessionStorage.getObject("player"+new_emperor).name + "</b>";
			
			sessionStorage.setItem("vote_result", "n");
			sessionStorage.setItem("tracker", Number(sessionStorage.getItem("tracker"))+1);
			sessionStorage.setItem("emperor", new_emperor);
			sessionStorage.setItem("turn", new_emperor);
			sessionStorage.setItem("chancellor", "0");
		}
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		
		// update text
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// the emperor takes three cards and choose one to discard
	else if(phase == "legislative_emperor")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// text
		let text = "You now have to choose one of three policies shown below one to discard.<br>";
		text += "The other two will be passed to the chancellor <b>" + chancellor.name + "</b>. He will then choose the one to approve that will go on the board";
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		text += "<br><br>";
		document.getElementById("comment").innerHTML = text;
		
		// draw the three cards
		let pile = sessionStorage.getItem("pile").split("");
		let discard_pile = sessionStorage.getItem("discard_pile").split("");
		
		// reshuffle pile if needed
		if(pile.length < 3) {
			pile = pile.concat(discard_pile);
			discard_pile = [];
			pile = shuffle(pile);
		}
		
		let card1 = pile.pop();
		sessionStorage.setItem("card1", card1);
		let card2 = pile.pop();
		sessionStorage.setItem("card2", card2);
		let card3 = pile.pop();
		sessionStorage.setItem("card3", card3);
		
		// the three card buttons
		let b1 = document.getElementById("button");
		b1.value = "CARD 1: ";
		if(card1 == "f") {
			b1.value += "fascist";
		} else {
			b1.value += "liberal";
		}
		b1.onclick = function(){ pickCard(1); };
	
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "CARD 2: ";
		if(card2 == "f") {
			b2.value += "fascist";
		} else {
			b2.value += "liberal";
		}
		b2.onclick = function(){ pickCard(2); };
		b1.parentNode.appendChild(b2);
		
		
		let bre3 = document.createElement("br");
		let bre4 = document.createElement("br");
		b1.parentNode.appendChild(bre3);
		b1.parentNode.appendChild(bre4);
		
		let b3 = document.createElement("input");
		b3.type = "button";
		b3.value = "CARD 3: ";
		if(card3 == "f") {
			b3.value += "fascist";
		} else {
			b3.value += "liberal";
		}
		b3.onclick = function(){ pickCard(3); };
		b1.parentNode.appendChild(b3);
		
		// update piles
		sessionStorage.setItem("pile", pile);
		sessionStorage.setItem("discard_pile", discard_pile);
		
		// turn
		sessionStorage.setItem("turn", chancellor_num);
	}
	// -----------------------------------------------------------------
	// the chancellor takes two cards and choose one to apply
	else if(phase == "legislative_chancellor")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>" + player.name + "</b> turn";
		
		// text
		let text = "You now have to choose one of the two policies shown below that the Emperor <b>" + emperor.name + "</b> has passed to you.<br>";
		text += "The one you choose will be the policy approved that will go on the board, while the other one will be discarded";
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		text += "<br><br>";
		document.getElementById("comment").innerHTML = text;
		
		let card1 = sessionStorage.getItem("card1");
		let card2 = sessionStorage.getItem("card2");
		
		// card 1
		let b1 = document.getElementById("button");
		b1.value = "CARD 1: ";
		if(card1 == "f") {
			b1.value += "fascist";
		} else {
			b1.value += "liberal";
		}
		b1.onclick = function(){ pickCard(1); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "CARD 2: ";
		if(card2 == "f") {
			b2.value += "fascist";
		} else {
			b2.value += "liberal";
		}
		b2.onclick = function(){ pickCard(2); };
		b1.parentNode.appendChild(b2);
	}
	// -----------------------------------------------------------------
	// show the result of the last legislative session
	else if(phase == "legislative_result")
	{
		let last_policy = sessionStorage.getItem("last_policy");
		
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		let text = "PUBLIC ANNOUNCE:<br>the government with<br>";
		text += "- <b>" + emperor.name + "</b> as Emperor<br>";
		text += "- <b>" + chancellor.name + "</b> as chancellor<br>";
		text += "has just approved a new ";
		if( last_policy == "l")
		{
			text += '<font color="blue">liberal</font><br>';
		}
		else
		{
			text += '<font color="red">fascist</font><br>';
		}
		
		text += " policy"
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		text += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " of 3<br>";
		
		// update emperor
		let new_emperor = Number(sessionStorage.getItem("emperor"));
		new_emperor++;
		if(new_emperor > player_num){
			new_emperor = 1;
		}
		sessionStorage.setItem("emperor", new_emperor);
		sessionStorage.setItem("turn", new_emperor);
		
		text += "<br> Now a new government will be created. The candidate Emperor now is <b>";
		text += sessionStorage.getObject("player"+new_emperor).name + "</b><br>";
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// liberals just won by making enought liberal policies
	else if(phase == "liberal_win_cards")
	{
		document.getElementById("top_title").innerHTML = "LIBERALS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>Placing the last liberal policy on the board, the liberals won the game!<br>";
		text += "<br>Roles:<br>"
		for(let i=1; i<=player_num; i++)
		{
			let temp = sessionStorage.getObject("player"+i);
			
			text += "- <b>" + temp.name + "</b> (" + temp.role + ")<br>";
		}
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// imperlists just won by making enought fascist policies
	else if(phase == "empire_win_cards")
	{
		document.getElementById("top_title").innerHTML = "IMPERIALISTS WINS!!";
		
		let text = "PUBLIC ANNOUNCE:<br>Placing the last fascist policy on the board, the imperialists won the game!<br>";
		text += "<br>Roles:<br>"
		for(let i=1; i<=player_num; i++)
		{
			let temp = sessionStorage.getObject("player"+i);
			
			text += "- <b>" + temp.name + "</b> (" + temp.role + ")<br>";
		}
		text += "<br><br>Total liberal policies approved: " + sessionStorage.getItem("liberal_cards") + " of 5";
		text += "<br>Total fascist policies approved: " + sessionStorage.getItem("empire_cards") + " of " + sessionStorage.getItem("empire_cards_target");
		
		document.getElementById("comment").innerHTML = text;
	}
	else
	{
		console.log("error: unrecognized phase " + phase);
	}
}

// ---------------------------------------------------------------------
// This handle the actions at the end of a turn
function postPlay()
{
	var phase = sessionStorage.getItem("phase");
	var emperor_num = Number(sessionStorage.getItem("emperor"));
	
	if(phase === "first_round" )
	{
		let turn = turnStep();
		
		// if everyone already seen his role, go to the election phase
		if( turn == emperor_num )
		{
			sessionStorage.setItem("phase", "election");
		}
	}
	else if(phase === "election")
	{
		turnStep();
		
		// after, we must do a round of votes
		sessionStorage.setItem("phase", "vote_round");
	}
	else if(phase === "vote_round")
	{
		let turn = turnStep();

		// if everyone already seen his role, go to the election phase
		if( turn == emperor_num )
		{
			sessionStorage.setItem("phase", "vote_result");
		}
	}
	else if(phase === "vote_result")
	{
		let result = sessionStorage.getItem("vote_result");
		
		if(result == "y")
			sessionStorage.setItem("phase", "legislative_emperor");
		else
			sessionStorage.setItem("phase", "election");
		
		sessionStorage.removeItem("vote_result");
	}
	else if(phase == "legislative_emperor")
	{
		let discard_pile = sessionStorage.getItem("discard_pile").split("");
		
		let discarded_num = sessionStorage.getItem("card_picked");
		let discarded_card = sessionStorage.getItem("card"+discarded_num);
		
		// put the card in the discard pile
		discard_pile.push(discarded_card);
		sessionStorage.setItem("discard_pile", discard_pile);
		
		// now put the two cards left as card1 and card2
		if(discarded_num != 3)
		{
			sessionStorage.setItem("card"+discarded_num, sessionStorage.getItem("card3"));
		}
		
		sessionStorage.setItem("phase", "legislative_chancellor");
	}
	else if(phase == "legislative_chancellor")
	{
		let discard_pile = sessionStorage.getItem("discard_pile").split("");
		
		let picked = sessionStorage.getItem("card_picked");
		let discarded;
		
		(picked == 1) ? discarder=2: discarded=1;
		
		// discard the other card
		discard_pile.push( sessionStorage.getItem("card"+discarded) );
		sessionStorage.setItem("discard_pile", discard_pile);
		
		let card_picked = sessionStorage.getItem("card"+picked);
		
		// reset election tracker
		sessionStorage.setItem("tracker", 0);
		
		// play the choosen card
		if(card_picked == "l")
		{
			let liberal = Number(sessionStorage.getItem("liberal_cards"));
			liberal++;
			sessionStorage.setItem("liberal_cards", liberal);
			
			if( liberal == 5 )
			{
				sessionStorage.setItem("phase", "liberal_win_cards");
				turnStep();
				return;
			}
		}
		else
		{
			let fas = Number(sessionStorage.getItem("empire_cards"));
			fas++;
			sessionStorage.setItem("empire_cards", fas);
			
			if( fas == sessionStorage.getItem("empire_cards_target") )
			{
				sessionStorage.setItem("phase", "empire_win_cards");
				turnStep();
				return;
			}
		}
		
		// now show the result
		turnStep();
		sessionStorage.setItem("last_policy", card_picked);
		sessionStorage.setItem("phase", "legislative_result");
	}
	else if(phase == "legislative_result")
	{
		sessionStorage.setItem("phase", "election");
	}
	else if(phase == "liberal_win_cards")
	{
		
	}
	else if(phase == "empire_win_cards")
	{
		
	}
	else
	{
		console.log("error: unrecognized phase " + phase);
	}
	
	// give control to next player that has to play
	window.location = "pass.html";
}

// ---------------------------------------------------------------------
// called from HTML, it sets chancellor someone then finishes turn
function setChancellor( pl )
{
	sessionStorage.setItem("chancellor", pl);
	
	sessionStorage.setItem( "turn", Number(sessionStorage.getItem("turn") - 1));
	
	postPlay();
}

// ---------------------------------------------------------------------
// called from HTML, it sets the vote of someone
function vote( v, who )
{
	sessionStorage.setItem("vote"+who, v );
	
	postPlay();
}
// ---------------------------------------------------------------------
// called from HTML, it sets what cards has been choosen
function pickCard( n )
{
	sessionStorage.setItem("card_picked", n);
	
	postPlay();
}
