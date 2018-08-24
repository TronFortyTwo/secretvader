// ---------------------------------------------------------------------
// Set background image
function setBackground( nb )
{
	var root = document.getElementsByTagName('html')[0];
	root.style.backgroundImage = 'url(' + nb + ')';
}
// ---------------------------------------------------------------------
// Abstract the piles
function pile_create()
{
	sessionStorage.setItem("draw_pile", String("llllllfffffffffff").shuffle());
	sessionStorage.setItem("discard_pile", "");
	
	console.log("pile: " + sessionStorage.getItem("draw_pile"));
}
function pile_draw()
{
	let draw_pile = sessionStorage.getItem("draw_pile");
	let discard_pile = sessionStorage.getItem("discard_pile");
	
	let card = draw_pile[draw_pile.length-1];
	draw_pile = draw_pile.slice(0,-1);
	
	// save the new pile
	pile_save(draw_pile, discard_pile);
	
	// reshuffle
	pile_shuffle();
	
	return card;
};
function pile_draw3()
{
	let draw_pile = sessionStorage.getItem("draw_pile");
	
	let cards = [];
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	cards.push(draw_pile[draw_pile.length-1]);
	draw_pile = draw_pile.slice(0,-1);
	
	sessionStorage.setItem("draw_pile", draw_pile);
	
	return cards;
};
function pile_show3()
{
	let draw_pile = sessionStorage.getItem("draw_pile");
	let cards = [];
	cards.push(draw_pile[draw_pile.length-1]);
	cards.push(draw_pile[draw_pile.length-2]);
	cards.push(draw_pile[draw_pile.length-3]);
	return cards;
}
function pile_shuffle()
{
	let draw_pile = sessionStorage.getItem("draw_pile");
	
	if( draw_pile.length >= 3 ){ return; }

	let discard_pile = sessionStorage.getItem("discard_pile");
	
	draw_pile += discard_pile;
	discard_pile = "";
	draw_pile = draw_pile.shuffle();
	
	pile_save(draw_pile, discard_pile);
};
function pile_save(p, dp)
{
	sessionStorage.setItem("draw_pile", p);
	sessionStorage.setItem("discard_pile", dp);
};
function pile_info()
{
	let draw_pile = sessionStorage.getItem("draw_pile");
	let discard_pile = sessionStorage.getItem("discard_pile");
	
	return "Mazzo: " + draw_pile.length + " | scartate: " + discard_pile.length;
}
function pile_discard(c)
{
	let d = sessionStorage.getItem("discard_pile");
	d += c;
	sessionStorage.setItem("discard_pile", d);
}
// ---------------------------------------------------------------------
// 
function setPhase( ph )
{
	sessionStorage.setItem("phase", ph);
}
function getPhase()
{
	return sessionStorage.getItem("phase");
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
// abstract players
function getName(pl)
{
	return sessionStorage.getObject("player"+pl).name;
}
function getRole(pl)
{
	return sessionStorage.getObject("player"+pl).role;
}
function isAlive(pl)
{
	return sessionStorage.getObject("player"+pl).alive;
}
function getPlayer(pl)
{
	return sessionStorage.getObject("player"+pl);
}
function setPlayer(n, pla)
{
	sessionStorage.setObject("player"+n, pla);
}
// ---------------------------------------------------------------------
// abstract stuff
function getPresident(){
	return sessionStorage.getItem("president");
}
function setPresident(np){
	sessionStorage.setItem("president", np);
}
function getChancellor(){
	return sessionStorage.getItem("chancellor");
}
function setChancellor(np){
	sessionStorage.setItem("chancellor", np);
}
// ---------------------------------------------------------------------
// tracker abstraction
function tracker_reset(){
	sessionStorage.setItem("tracker", "0");
}
function tracker_at3(){
	return (sessionStorage.getItem("tracker") == 3);
}
function tracker_add(){
	sessionStorage.setItem("tracker", Number(sessionStorage.getItem("tracker"))+1);
}
// ---------------------------------------------------------------------
// Get a random number in a range
function random(min, max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
// ---------------------------------------------------------------------
// Shuffle a string
String.prototype.shuffle = function () {
	let a = this.split("");
	let n = a.length;

    for(var i=n-1; i>0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
// ---------------------------------------------------------------------
// return the stats about the board
function boardStats()
{
	let str = "<br><br>Leggi liberali: " + sessionStorage.getItem("liberal_cards") + " di 5";
	str += "<br>Leggi fasciste: " + sessionStorage.getItem("fascist_cards") + " di 6";
	str += "<br>Election Tracker: " + sessionStorage.getItem("tracker") + " di 3";
	str += "<br>" + pile_info() + "<br>";
	
	return str;
}
// ---------------------------------------------------------------------
// Returns the roles of each player - for ending
function playerRoles()
{
	let player_num = sessionStorage.getItem("player_number");
	let text = "<br>Ruoli:<br>";
	for(let i=1; i<=player_num; i++)
	{
		text += "- <b>" + getName(i) + "</b> (" + getRole(i) + ")";
		if(!isAlive(i))
		{
			text += " [eliminato]";
		}
		text += "<br>";
	}
	return text;
}
// ---------------------------------------------------------------------
// subroutine that removes the standard 'Ok, i got it' button
function removeButton()
{
	let old_button = document.getElementById("button");
	if(old_button)
	{
		old_button.parentNode.removeChild(old_button);
	}
}
// ---------------------------------------------------------------------
// Get next player after the one given
function nextPlayer( start )
{
	let next = Number(start);
	let player_num = Number(sessionStorage.getItem("player_number"));
	
	do {
		next++;
		if(next > player_num)
			next = 1;
	}
	while( !isAlive(next) )
	
	return next;
}
// ---------------------------------------------------------------------
// access turn
function getTurn()
{
	return Number(sessionStorage.getItem("turn"));
}
function setTurn( nt )
{
	sessionStorage.setItem("turn", nt);
}
// ---------------------------------------------------------------------
// subroutine that update the turn
function turnStep()
{
	let next_turn = nextPlayer(getTurn());
	
	setTurn(next_turn);
	
	return next_turn;
}
// ---------------------------------------------------------------------
// boh
function setPlayerNames()
{
	window.location = "playerSetName.html";
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
		role: "liberale",
		alive: true
	};
	
	setPlayer(setnum, player);
	
	if(setnum == sessionStorage.getItem("player_number") ) {
		setGame();
		
		window.location = "pass.html";
		return;
	}
	else
	{
		document.getElementById("p_title").innerHTML = "Giocatore " + (setnum+1) + ":";
		document.getElementById("p_button").onclick = function(){ setName(setnum+1); };
		document.getElementById("p_text").value = "Giocatore " + (setnum+1);
	}
}

// ---------------------------------------------------------------------
// set game
function setGame()
{
	player_num = sessionStorage.getItem("player_number");
	
	// real number of player - counting also the ones killed
	sessionStorage.setItem("real_player_number", player_num);
	
	// assign what player is hitler
	var vnum = random(1, player_num);
	
	var hitler = getPlayer(vnum);
	
	hitler.role = "Vader"
	
	setPlayer(vnum, hitler);
	
	console.log(hitler.name + " is Hitler")
	
	// find the others
	var num_fas = 0;
	if( player_num <= 6 )
		var num_fas = 1;
	else if( player_num <= 8)
		var num_fas = 2;
	else if( player_num <= 10)
		var num_fas = 3;
	else if( player_num <= 12)
		var num_fas = 4;
	else if( player_num <= 14)
		var num_fas = 5;
	
	while(num_fas > 0)
	{
		let fas_num = random(1, player_num);
		
		let p = getPlayer(fas_num);
		
		if(p.role !== "liberale") {
			continue;
		}
		
		num_fas--;
		
		p.role = "fascista";
		
		setPlayer(fas_num, p);
		
		console.log(p.name + " is fascist");
	}
	
	// now choose who now is gonna be the first president
	var first_president = random(1, player_num);
	setPresident(first_president);
	
	console.log( getName(first_president) + " is first president");
	
	// this is the first election
	setChancellor(0);
	sessionStorage.setItem("past_president", "0");
	sessionStorage.setItem("past_chancellor", "0");
	sessionStorage.setItem("real_new_president", "0");
	
	// The first president is also the first to play
	setTurn(first_president);
	
	// create the pile of policies
	pile_create();
	
	// election tracker
	tracker_reset();
	
	// how many cards are in the table
	sessionStorage.setItem("fascist_cards", "0");
	sessionStorage.setItem("liberal_cards", "0");
	
	// at the start of the game, just do a turn showing each one role
	setPhase("first_round");
	
	// based on player number, already preset what presidential powers will be
	if(player_num == 4)
	{
		sessionStorage.setItem("power1", "no");
		sessionStorage.setItem("power2", "no");
		sessionStorage.setItem("power3", "no");
		sessionStorage.setItem("power4", "no");
		sessionStorage.setItem("power5", "president_power_kill");
	}
	else if(player_num == 5 || player_num == 6)
	{
		sessionStorage.setItem("power1", "no");
		sessionStorage.setItem("power2", "no");
		sessionStorage.setItem("power3", "president_power_see");
		sessionStorage.setItem("power4", "president_power_kill");
		sessionStorage.setItem("power5", "president_power_kill");
	}
	else if(player_num == 7 || player_num == 8)
	{
		sessionStorage.setItem("power1", "no");
		sessionStorage.setItem("power2", "president_power_detective");
		sessionStorage.setItem("power3", "president_power_choose");
		sessionStorage.setItem("power4", "president_power_kill");
		sessionStorage.setItem("power5", "president_power_kill");
	}
	else if(player_num == 9 || player_num == 10)
	{
		sessionStorage.setItem("power1", "president_power_detective");
		sessionStorage.setItem("power2", "president_power_detective");
		sessionStorage.setItem("power3", "president_power_choose");
		sessionStorage.setItem("power4", "president_power_kill");
		sessionStorage.setItem("power5", "president_power_kill");
	}
	else if(player_num == 11 || player_num == 12)
	{
		sessionStorage.setItem("power1", "president_power_detective");
		sessionStorage.setItem("power2", "president_power_choose");
		sessionStorage.setItem("power3", "president_power_kill");
		sessionStorage.setItem("power4", "president_power_kill");
		sessionStorage.setItem("power5", "president_power_kill");
	}
	else if(player_num == 13 || player_num == 14)
	{
		sessionStorage.setItem("power1", "president_power_choose");
		sessionStorage.setItem("power2", "president_power_kill");
		sessionStorage.setItem("power3", "president_power_kill");
		sessionStorage.setItem("power4", "president_power_kill");
		sessionStorage.setItem("power5", "president_power_kill");
	}
}

// ---------------------------------------------------------------------
// Make the one who has the phone in the hand pass it
function passLoaded()
{
	document.getElementById("title").innerHTML = "Turno di " + getName(getTurn());
}

// ---------------------------------------------------------------------
// This organize the play page just after has loaded
function playLoaded()
{
	// frequently used stuff
	var phase = getPhase();
	var turn = getTurn();
	var player = getPlayer(turn);
	var president_num = getPresident()
	var president = getPlayer(president_num);
	var player_num = sessionStorage.getItem("player_number");
	var chancellor_num = getChancellor();
	var chancellor = getPlayer(chancellor_num);
	
	// -----------------------------------------------------------------
	// first round just to show roles
	if( phase === "first_round" )
	{
		let text = "";
		let root = document.getElementsByTagName('html')[0];
		
		if(player.role != "liberale")
		{
			root.style.backgroundImage = 'url(css/fascist.jpg)';
			
			if(player.role == "fascista" || player_num < 7)
			{
				text += "Gli altri fascisti sono:<br>";
			
				for(var i=1; i<=player_num; i++)
				{
					if(getName(i) != player.name)
					{
						if(getRole(i) == "fascista")
						{
							text += "- <b>" + getName(i) + "</b><br>"
						}
						else if(getRole(i) == "Vader")
						{
							text += "- <b>" + getName(i) + "</b> (Vader)<br>"
						}
					}
				}
			}
		}
		else
			root.style.backgroundImage = 'url(css/liberal.jpg)';
		
		text += "<br><b>" + president.name + "</b> è il primo presidente.";
		
		document.getElementById("top_title").innerHTML = "Tu sei <b>" + player.role + "</b>";
		document.getElementById("comment").innerHTML = text;
		
		// if everyone already seen his role, go to the election phase
		if( turnStep() == president_num )
			setPhase("election");
	}
	// -----------------------------------------------------------------
	// election phase - president turn
	else if( phase === "election" )
	{
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		let text = "Come candidato presidente, devi scegliere un giocatore che sia candidato cancelliere:";
		
		text += boardStats(text);
		
		document.getElementById("comment").innerHTML = text;
		
		// remove button
		removeButton();
		
		// function
		function setButton(button, i) {
			button.onclick = function()
			{
				setChancellor(i);
				window.location = "pass.html";
			};
		}
		
		// loop
		let past_e = sessionStorage.getItem("past_president");
		let past_c = sessionStorage.getItem("past_chancellor");
		
		for(var i=1; i<=player_num; i++)
		{
			if (
				i == turn ||
				i == past_c ||
				(Number(player_num) > 6 && i == past_e) ||
				!isAlive(i)
			)
				continue;
			
			let temp_player = getPlayer(i);
				
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
		
		// after, we must do a round of votes
		setPhase("vote_round");
	}
	// -----------------------------------------------------------------
	// do a round asking for the votes
	else if( phase === "vote_round")
	{
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		let text = "Devi votare per il nuovo governo:<br>- <b>";
		text += president.name + "</b> presidente<br>- <b>";
		text += chancellor.name + "</b> cancelliere<br>Non rivelare il tuo voto finchè tutti non hanno votato<br<br>";
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		let byes = document.getElementById("button");
		byes.value = "Si";
		byes.onclick = function()
		{
			sessionStorage.setItem("vote"+turn, "si" );
			window.location = "pass.html";
		};
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		byes.parentNode.appendChild(bre);
		byes.parentNode.appendChild(bre2);
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function()
		{
			sessionStorage.setItem("vote"+turn, "no" );
			window.location = "pass.html";
		};
		
		byes.parentNode.appendChild(bno);

		// if everyone already seen his role, go to the election phase
		if( turnStep() == president_num )
			setPhase("vote_result");
	}
	// -----------------------------------------------------------------
	// show election results
	else if(phase === "vote_result")
	{
		setBackground("css/loud.jpg");
				
		// write things down
		document.getElementById("top_title").innerHTML = "Leggi questo a tutti";
		
		// check votation results
		let yes = 0;
		let no = 0;
		let approved = false;
		
		for(var i=1; i<=player_num; i++)
		{
			if( isAlive(i) == false )
				continue;
			
			if( sessionStorage.getItem("vote"+i) == "si" )
				yes++;
			else
				no++;
		}
		
		if(yes > no){
			approved = true;
		}
		
		let text = "ANNUNCIO PUBBLICO:<br>Il nuovo governo proposto:<br>";
		text += "- <b>" + president.name + "</b> presidente<br>";
		text += "- <b>" + chancellor.name + "</b> cancelliere<br>";
		text += "è stato ";
		if(approved)
		{
			text += '<b><font color="green">approvato</font></b><br>';
		}
		else
		{
			text += '<b><font color="red">rifiutato</font></b><br>';
		}
		text += "<br>VOTI:<br>";
		
		for(var i=1; i<=player_num; i++)
		{
			if(isAlive(i) == false)
				continue;
			
			let temp = sessionStorage.getItem("vote"+i); 
			text += "- <b>" + getName(i) + "</b> : " + temp + "<br>"
		}
		
		if(approved)
		{
			text += "<br>Ora il nuovo governo varerà una nuova legge<br>";
			
			setTurn(president_num);
			sessionStorage.setItem("past_president", president_num);
			sessionStorage.setItem("past_chancellor", chancellor_num);
			
			if (( getRole(getChancellor()) == "Vader" ) && (Number(sessionStorage.getItem("fascist_cards")) >= 3) ) {
				setPhase("fascist_win_hitler_elected");
			}
			else {
				setPhase("legislative_president");
			}
		}
		else
		{
			let new_president = nextPlayer(getPresident());
			
			text += "<br>Il prossimo candidato presidente è ";
			text += "<b>" + getName(new_president) + "</b>";
			
			setPresident(new_president);
			setChancellor(0);
			setTurn(new_president);
			tracker_add();
			if(tracker_at3())
				setPhase("caos");
			else
				setPhase("election");
		}
		text += boardStats();
		
		// update text
		document.getElementById("comment").innerHTML = text;
	}
	// -----------------------------------------------------------------
	// the president takes three cards and choose one to discard
	else if(phase == "legislative_president")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// text
		let text = "Ora devi scegliere una delle tre leggi qui sotto che verrà <b>scartata</b>.<br>";
		text += "Le altre due saranno passate al cancelliere <b>" + chancellor.name;
		text += "</b> che sceglierà quale verrà varata";
		text += boardStats();
		
		text += "<br><br>";
		document.getElementById("comment").innerHTML = text;
		
		// draw the three cards
		let cards = pile_draw3();
		sessionStorage.setItem("card1", cards[0]);
		sessionStorage.setItem("card2", cards[1]);
		sessionStorage.setItem("card3", cards[2]);
		
		// the three card buttons
		let b1 = document.getElementById("button");
		b1.value = "LEGGE 1: ";
		if(cards[0] == "f")
			b1.value += "fascista";
		else
			b1.value += "liberale";
	
		b1.onclick = function(){ pickCard(1); };
	
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "LEGGE 2: ";
		if(cards[1] == "f") {
			b2.value += "fascista";
		} else {
			b2.value += "liberale";
		}
		b2.onclick = function(){ pickCard(2); };
		b1.parentNode.appendChild(b2);
		
		
		let bre3 = document.createElement("br");
		let bre4 = document.createElement("br");
		b1.parentNode.appendChild(bre3);
		b1.parentNode.appendChild(bre4);
		
		let b3 = document.createElement("input");
		b3.type = "button";
		b3.value = "LEGGE 3: ";
		if(cards[2] == "f") {
			b3.value += "fascista";
		} else {
			b3.value += "liberale";
		}
		b3.onclick = function(){ pickCard(3); };
		b1.parentNode.appendChild(b3);
		
		// turn
		setTurn(chancellor_num);
		setPhase("legislative_chancellor");
	}
	// -----------------------------------------------------------------
	// the chancellor takes two cards and choose one to apply
	else if(phase == "legislative_chancellor")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// text
		let text = "Ora devi scegliere una delle due leggi qui sotto che il presidente <b>";
		text += president.name + "</b> ti ha passato.<br>";
		text += "Quella che scegli verrà <b>scartata</b>, l'atra sarà giocata sul tabellone.";
		text += boardStats() + "<br>";
		
		document.getElementById("comment").innerHTML = text;
		
		let card1 = sessionStorage.getItem("card1");
		let card2 = sessionStorage.getItem("card2");
		
		// card 1
		let b1 = document.getElementById("button");
		b1.value = "LEGGE 1: ";
		if(card1 == "f") {
			b1.value += "fascista";
		} else {
			b1.value += "liberale";
		}
		b1.onclick = function(){ pickCardChancellor(1); };
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		b1.parentNode.appendChild(bre);
		b1.parentNode.appendChild(bre2);
		
		let b2 = document.createElement("input");
		b2.type = "button";
		b2.value = "LEGGE 2: ";
		if(card2 == "f") {
			b2.value += "fascista";
		} else {
			b2.value += "liberale";
		}
		b2.onclick = function(){ pickCardChancellor(2); };
		b1.parentNode.appendChild(b2);
		
		// veto power
		if( sessionStorage.getItem("fascist_cards") == 5 )
		{
			let bre3 = document.createElement("br");
			let bre4 = document.createElement("br");
			b1.parentNode.appendChild(bre3);
			b1.parentNode.appendChild(bre4);
		
			let vetob = document.createElement("input");
			vetob.type = "button";
			vetob.value = "Proponi il veto al presidente";
			vetob.onclick = function()
			{
				setTurn(president_num);
				setPhase("veto");

				window.location = "pass.html";
			};
			b1.parentNode.appendChild(vetob);
		}
	}
	// -----------------------------------------------------------------
	// show the result of the last legislative session
	else if(phase == "legislative_result")
	{
		setBackground("css/loud.jpg");
		
		let last_policy = sessionStorage.getItem("last_policy");
		
		document.getElementById("top_title").innerHTML = "Leggi questo a tutti";
		
		let text = "ANNUNCIO PUBBLICO:<br>Il governo con:<br>- <b>";
		text += president.name + "</b> presidente<br>- <b>" + chancellor.name;
		text +=  "</b> cancelliere<br>Ha approvato una nuova legge ";
		if( last_policy == "l")
		{
			text += '<b><font color="blue">liberale</font></b><br>';
		}
		else
		{
			text += '<b><font color="red">fascista</font></b><br>';
		}
		text += boardStats();
		
		// update president
		let real_new_president = Number(sessionStorage.getItem("real_new_president"));
		let new_president;
		
		if(real_new_president == 0) {
			new_president = nextPlayer(getPresident());
		}
		else {
			new_president = nextPlayer(real_new_president-1);
			sessionStorage.setItem("real_new_president", 0);
		}
		setPresident(new_president);
		setTurn(new_president);
		setPhase("election");
		
		text += "<br> Il prossimo candidato presidente sarà <b>";
		text += getName(new_president) + "</b><br>";
		
		document.getElementById("comment").innerHTML = text;
		
		// check if some special president power has been activated
		if( sessionStorage.getItem("last_policy") == "f")
		{
			let power = sessionStorage.getItem("power" + sessionStorage.getItem("fascist_cards"));
			if(power != "no")
			{
				setTurn(president_num);
				setPhase(power);
			}
		}
	}
	// -----------------------------------------------------------------
	// liberals just won by making enought liberal policies
	else if(phase == "liberal_win_cards")
	{
		setBackground("css/loud.jpg");
		
		document.getElementById("top_title").innerHTML = "I LIBERALI VINCONO!!";
		
		let text = "ANNUNCIO PUBBLICO:<br>Mettendo l'ultima legge liberale sul tabellone, i liberali vincono la partita!<br>";
		text += playerRoles() + boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		setPhase("end");
	}
	// -----------------------------------------------------------------
	// liberals just won by killing hitler
	else if(phase == "liberal_win_kill")
	{
		setBackground("css/loud.jpg");
		
		document.getElementById("top_title").innerHTML = "I LIBERALI VINCONO!!";
		
		let text = "ANNUNCIO PUBBLICO:<br>Uccidendo Vader, i liberali vincono la partita!<br>";
		text += playerRoles() + boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		setPhase("end");
	}
	// -----------------------------------------------------------------
	// imperlists just won by making enought fascist policies
	else if(phase == "fascist_win_cards")
	{
		setBackground("css/loud.jpg");
		
		document.getElementById("top_title").innerHTML = "I FASCISTI VINCONO!!";
		
		let text = "ANNUNCIO PUBBLICO:<br>Mettendo l'ultima legge fascista sul tabellone, i fascisti vincono la partita!<br>";
		text += playerRoles() + boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		setPhase("end");
	}
	// -----------------------------------------------------------------
	// imperlists just won by making enought fascist policies
	else if(phase == "fascist_win_hitler_elected")
	{
		setBackground("css/loud.jpg");
		
		document.getElementById("top_title").innerHTML = "I FASCISTI VINCONO!!";
		
		let text = "ANNUNCIO PUBBLICO:<br>eleggendo Vader cancelliere, i fascisti vincono la partita!<br>";
		text += playerRoles() + boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		setPhase("end");
	}
	// -----------------------------------------------------------------
	// Country fell in caos, a policy is randomly turned
	else if(phase == "caos")
	{
		setBackground("css/loud.jpg");
		
		// take the first policy of the pile
		let pol = pile_draw();
		
		// write the message
		document.getElementById("top_title").innerHTML = "Read this out loud";
		
		let text = "ANNUNCIO PUBBLICO:<br>Dopo tre proposte di governo rifiutate, il caos ha portato all'approvazione della prima legge del mazzo<br>";
		text += "La nuova legge è ";
		
		if(pol == "f")
		{
			let temp = Number(sessionStorage.getItem("fascist_cards"));
			sessionStorage.setItem("fascist_cards", temp+1);
			text += '<font color="red">fascista</font>';
		}
		else
		{
			let temp = Number(sessionStorage.getItem("liberal_cards"));
			sessionStorage.setItem("liberal_cards", temp+1);
			text += '<font color="blue">liberale</font>';
		}
		text += boardStats();
		
		document.getElementById("comment").innerHTML = text;
		
		// update tracker
		tracker_reset();
		
		if( sessionStorage.getItem("liberal_cards") == 5 )
			setPhase("liberal_win_cards");
		else if(sessionStorage.getItem("fascist_cards") == 6)
			setPhase("fascist_win_cards");
		else
			setPhase("election");
	}
	// -----------------------------------------------------------------
	// the president kills a player
	else if(phase == "president_power_kill")
	{
		setBackground("css/detective.jpg");
		
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// comment
		let text = "SPECIALE POTERE PRESIDENZIALE:<br>Puoi scegliere un giocatore da uccidere";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// remove standard button
		removeButton();
		
		// function
		function setButton(button, i) {
			button.onclick = function()
			{
				let killed_player = getPlayer(i);
				killed_player.alive = false;
				setPlayer(i, killed_player);
				sessionStorage.setItem("killed_player", i);

				turnStep();
	
				if(killed_player.role != "Hitler")
					setPhase("post_kill");
				else
					setPhase("liberal_win_kill");
	
				window.location = "pass.html";
			};
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			if((i != turn) && isAlive(i))
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = getName(i);
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// Tell who has been killed by the president
	else if(phase == "post_kill")
	{
		setBackground("css/loud.jpg");
		
		// title
		document.getElementById("top_title").innerHTML = "Leggi questo a tutti";
		
		// comment
		let text = "ANNUNCIO PUBBLICO:<br>Il presidente ha usato un suo speciale potere, e ha ucciso ";
		text += "<b>" + getName(sessionStorage.getItem("killed_player")) + "</b>.";
		
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// be sure president has not been killed
		setPresident( nextPlayer( getPresident()-1 ) );
		
		// call a new election
		setTurn(getPresident());
		setPhase("election");
	}
	// -----------------------------------------------------------------
	// the president sees a player orientation
	else if(phase == "president_power_detective")
	{
		setBackground("css/detective.jpg");
		
		// remove standard button
		removeButton();
		
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// comment
		let text = "SPECIALE POTERE PRESIDENZIALE:<br>Puoi scegliere un giocatore e vedere il suo schieramento politico";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// function
		function setButton(button, i) {
			button.onclick = function(){
				
				if( sessionStorage.getObject("player"+i).role == "liberale" )
					alert("Il giocatore che hai investigato è liberale");
				else
					alert("Il giocatore che hai investigato è fascista");
				
				window.location = "pass.html";
			};
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			if(i != turn)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = getName(i);
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
		
		setPresident( turnStep() );
		setPhase("election");
	}
	// -----------------------------------------------------------------
	// the president sees the 3 top card of the pile
	else if(phase == "president_power_see")
	{
		setBackground("css/detective.jpg");
		
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// comment
		let text = "SPECIALE POTERE PRESIDENZIALE:<br>Ecco le tre carte in cima al mazzo delle leggi.";
		text += boardStats();
		
		// show them
		let cards = pile_show3();
		
		text += "<br>";
		for(var i=0; i!=3; i++)
		{
			text += "LEGGE " + (i+1) + ": ";
			
			if(cards[i] == "f")
			{
				text += '<font color="red">fascista</font>';
			}
			else
			{
				text += '<font color="blue">liberale</font>';
			}
			text += "<br>";
		}
		
		document.getElementById("comment").innerHTML = text;
		
		setPresident( turnStep() );
		setPhase("election");
	}
	// -----------------------------------------------------------------
	// the president chooses the next candidate president
	else if(phase == "president_power_choose")
	{
		// remove standard button
		removeButton();
		
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		// comment
		let text = "SPECIALE POTERE PRESIDENZIALE:<br>Puoi scegliere un giocatore che sia il prossimo presidente.";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		// function
		function setButton(button, i) {
			button.onclick = function()
			{
				let real_new_president = nextPlayer(turn);
		
				setTurn(i);
				setPresident(i);
				sessionStorage.setItem("real_new_president", real_new_president);
				setPhase("election");
				
				window.location = "pass.html";
			};
		}
		
		// loop
		for(var i=1; i<=player_num; i++)
		{
			if(i != turn)
			{
				let button = document.createElement("input");
				button.type = "button";
				button.value = getName(i);
				
				setButton(button, i);
				
				let el = document.getElementById("last_break").parentNode;
				el.appendChild(button);
				
				let bre = document.createElement("br");
				let bre2 = document.createElement("br");
				el.appendChild(bre);
				el.appendChild(bre2);
			}
		}
	}
	// -----------------------------------------------------------------
	// the president choose to accept the veto of the chancellor or not
	else if(phase == "veto")
	{
		// title
		document.getElementById("top_title").innerHTML = "<b>turno di " + player.name + "</b>";
		
		let text = "Il cancelliere ti propone il veto;<br>Puoi accettare: nessuna legge sarà accettata e una nuova legislatura verrà indetta, "
		text += "Ma l'election tracker avanzera di un posto.<br>Accetti la proposta di veto?";
		text += boardStats();
		document.getElementById("comment").innerHTML = text;
		
		let byes = document.getElementById("button");
		byes.value = "Si";
		byes.onclick = function()
		{
			// discard the two cards, update the election tracker and call a new election
			pile_discard(sessionStorage.getItem("card1"));
			pile_discard(sessionStorage.getItem("card2"));
			pile_shuffle();
			
			tracker_add();
			
			let new_president = nextPlayer(getPresident());
			setPresident(new_president);
			sessionStorage.setItem("turn", new_president);
			setChancellor(0);
			
			setPhase("election");
			
			if(tracker_at3()) {
				setPhase("caos");
			}
			window.location = "pass.html";
		};
		
		let bre = document.createElement("br");
		let bre2 = document.createElement("br");
		byes.parentNode.appendChild(bre);
		byes.parentNode.appendChild(bre2);
		
		let bno = document.createElement("input");
		bno.type = "button";
		bno.value = "No";
		bno.onclick = function()
		{
			// if refused just repropose the cards to the chancellor
			setTurn( getChancellor() );
			setPhase("legislative_chancellor");
			window.location = "pass.html";
		};
		
		byes.parentNode.appendChild(bno);
	}
	//
	else
	{
		console.log("error: unrecognized phase " + phase);
	}
}

// ---------------------------------------------------------------------
// This handle the actions at the end of a turn
function postPlay()
{
	// this may be the only thing that actually make sense here?
	if(sessionStorage.getItem("phase") != "end")
		// continue to play
		window.location = "pass.html";
	else
		// start a new game
		window.location = "index.html";
}

// ---------------------------------------------------------------------
// called from HTML
function pickCard( n )
{
	let discarded_card = sessionStorage.getItem("card"+n);
		
	pile_discard(discarded_card);
		
	// now put the two cards left as card1 and card2
	if(n != 3) {
		sessionStorage.setItem("card"+n, sessionStorage.getItem("card3"));
	}
	
	window.location = "pass.html";
}
// ---------------------------------------------------------------------
function pickCardChancellor( cp )
{
	let played = 1;
	if(cp == 1)
		played = 2;
	
	// discard the other card
	pile_discard(sessionStorage.getItem("card"+cp));
	
	// we ended doing work with cards, so now we can shuffle if needed
	pile_shuffle();
	
	// reset election tracker
	tracker_reset();
		
	// advance the turn
	turnStep();
		
	// play the choosen card
	if( sessionStorage.getItem("card"+played) == "l" )
	{
		let liberal = Number(sessionStorage.getItem("liberal_cards"));
		liberal++;
		sessionStorage.setItem("liberal_cards", liberal);
			
		if( liberal == 5 )
		{
			setPhase("liberal_win_cards");
		}
		else
		{
			// now show the result
			sessionStorage.setItem("last_policy", "l");
			setPhase("legislative_result");
		}
	}
	else
	{
		let fas = Number(sessionStorage.getItem("fascist_cards"));
		fas++;
		sessionStorage.setItem("fascist_cards", fas);
	
		if( fas == 6 )
		{
			setPhase("fascist_win_cards");
		}
		else
		{
			// now show the result
			sessionStorage.setItem("last_policy", "f");
			setPhase("legislative_result");
		}
	}
	
	window.location = "pass.html";
}
