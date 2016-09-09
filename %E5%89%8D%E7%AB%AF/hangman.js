function Guess(resultElem){
	this.resultElem = resultElem;
	this.sessionId = "";
	this.score = 0;
	this.requestUrl = "https://strikingly-hangman.herokuapp.com/game/on";
	this.id = "wzxiejinbin@gmail.com";
	this.ifStop = false;
	this.numberOfWordsToGuess = 0;
	this.numberOfGuessAllowedForEachWord = 0;
	this.wordArray = [];
	this.wordLength = 0;
	this.letterArray = [];
	this.currentLetter = "";
	this.currectLetters = "";
	this.wrongLetters = "";
	this.sendRequest = function(obj,callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 0 || xhr.status == 200) {
					if(xhr.responseText!=""){
						callback(eval("("+xhr.responseText+")"));
					}
				}
			}
		}
		xhr.open("POST",this.requestUrl,true);
		xhr.setRequestHeader("Content-Type", "application/json");
		try{
			xhr.send(JSON.stringify(obj));		
		}catch(exp){
			setTimeout(function(){
				xhr.send(JSON.stringify(obj));	
			},1000);
		}
	};
	this.startGame = function(){
		this.ifStop = false;
		var self = this;
		this.sendRequest({
			"playerId":this.id,
			"action":"startGame"
		},function(data){
			console.log(data.message);
			self.sessionId = data.sessionId;
			self.numberOfWordsToGuess = data.data.numberOfWordsToGuess;
			self.numberOfGuessAllowedForEachWord = data.data.numberOfGuessAllowedForEachWord;
			self.nextWord();
		});
	};
	this.nextWord = function(){
		this.wordArray = [];
		this.wordLength = 0;
		this.currentLetter = "";
		this.currectLetters = "";
		this.wrongLetters = "";
		if(!this.ifStop){
			var self = this;
			this.sendRequest({
				"sessionId":this.sessionId,
				"action":"nextWord"
			},function(data){
				self.wordLength = data.data.word.length;
				self.wordArray = getWordList(dictionary,self.wordLength);
				self.letterArray = getLetterFrequency(self.wordArray);
				self.currentLetter = self.letterArray[0].name.toUpperCase();
				self.makeAGuess();
			});
		}
	};
	this.makeAGuess = function(){
		if(!this.ifStop){
			var self = this;
			this.sendRequest({
				"sessionId":this.sessionId,
				"action":"guessWord",
				"guess":this.currentLetter
			},function(data){
				data = data.data;
				if(data.word.indexOf("*")<0||data.wrongGuessCountOfCurrentWord==self.numberOfGuessAllowedForEachWord){
					if(data.word.indexOf("*")<0){
						console.log(data.word);
					}
					self.getResult();
					if(data.totalWordCount < self.numberOfWordsToGuess){
						self.nextWord();
					}else{
						self.stopGuess();
					}
				}else{
					var index = data.word.indexOf(self.currentLetter);
					if(index>=0){
						self.currectLetters+=self.currentLetter;
						self.wordArray = getWordList(self.wordArray,self.wordLength,index,self.currentLetter);
						self.letterArray = getLetterFrequency(self.wordArray);
						var letters = self.letterArray;
						for(var i=0,len=letters.length;i<len;i++){
							var name = letters[i].name.toUpperCase();
							if(self.currectLetters.indexOf(name)<0&&self.wrongLetters.indexOf(name)<0){
								self.currentLetter = name;
								break;
							}
						}
					}else{
						self.wrongLetters+=self.currentLetter;
						var letters = self.letterArray;
						for(var i=0,len=letters.length;i<len;i++){
							var name = letters[i].name.toUpperCase();
							if(self.currectLetters.indexOf(name)<0&&self.wrongLetters.indexOf(name)<0){
								self.currentLetter = name;
								break;
							}
						}
					}
					if(self.currentLetter){
						setTimeout(function(){
							self.makeAGuess();
						},100);
					}else{
						self.nextWord();
					}
				}
			});
		}
	};
	this.stopGuess = function(){
		this.ifStop = true;
		this.score = 0;
		this.numberOfWordsToGuess = 0;
		this.numberOfGuessAllowedForEachWord = 0;
		this.submitResult();
	};
	this.submitResult = function(){
		var self = this;
		if(this.sessionId==""){
			return;
		}
		this.sendRequest({
			"sessionId":this.sessionId,
			"action":"submitResult"
		},function(data){
			self.sessionId = "";
			data = data.data;
			var str = "totalWordCount:"+data.totalWordCount+"\n"+
				"correctWordCount:"+data.correctWordCount+"\n"+
				"totalWrongGuessCount:"+data.totalWrongGuessCount+"\n"+
				"score:"+data.score+"\n"+
				"datetime:"+data.datetime+"\n\n";
			console.log(str);
			if(self.resultElem){
				self.resultElem.innerHTML =str.replace(/\n/g,"<br/>");
			}
		});
	};
	this.getResult = function(){
		var self = this;
		this.sendRequest({
			"sessionId":this.sessionId,
			"action":"getResult"
		},function(data){
			data = data.data;
			var str = "current result:\n"+"totalWordCount:"+data.totalWordCount+"\n"+
				"correctWordCount:"+data.correctWordCount+"\n"+
				"totalWrongGuessCount:"+data.totalWrongGuessCount+"\n"+
				"score:"+data.score+"\n\n";
			console.log(str);
			if(self.resultElem){
				self.resultElem.innerHTML =str.replace(/\n/g,"<br/>");
			}
			
		});
	};
}

function getWordList(arr,size,index,value){
	var list = [];
	for(var i=0,len=arr.length;i<len;i++){
		var word = arr[i].toUpperCase();
		if(word.length==size){
			if(index && value){
				if(word.charAt(index)==value){
					list.push(word);
				}
			}else{
				list.push(word);
			}
		}
	}
	return list;
}
function getLetterFrequency(arr){
	var resultObj = {};
	for(var i=0,len=arr.length;i<len;i++){
		var word = arr[i].toLowerCase();
		var wordSize = word.length;
		var letters = {};
		for(var j=0;j<wordSize;j++){
			var letter = word.charAt(j);
			if(letters[letter]){
				continue;
			}else{
				letters[letter] = word.match(new RegExp(letter,"g")).length;
			}
		}
		var keys = Object.keys(letters);
		for(var k=0,len2=keys.length;k<len2;k++){
			var key = keys[k];
			if(resultObj[key]){
				resultObj[key] += letters[key];
			}else{
				resultObj[key] = letters[key];
			}
		}
	}
	var resultArr = [];
	var keys = Object.keys(resultObj);
	for(var i=0,len=keys.length;i<len;i++){
		resultArr.push({"name":keys[i],"count":resultObj[keys[i]]});
	}
	return resultArr.sort(function(a,b){
		if(a.count>b.count){
			return -1;
		}else if(a.count<b.count){
			return 1;
		}else{
			return 0;
		}
	});
}