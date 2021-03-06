var _ = require('lodash');
var exampagetitle = document.getElementById("ExamPageTitle");
var examindex;
var userAnswers = [];
var userAnswerindex;
var examcompleted = false;

function getUserAnswers()
{
	return userAnswers;
}

function findIncompleteQuestions()
{
	var incompleteQuestions = [];
	var incompleteIndex = 0;
	console.log(userAnswer);
	console.log(userAnswers);

	for(var i = 0; i<Exams[examindex].questions.length; i++)
	{
		if(userAnswers[i] === null || userAnswers[i] === undefined)
		{
			incompleteQuestions[incompleteIndex] = i+1;
			incompleteIndex++;
		}
	}
	return incompleteQuestions;
}

class Exam 
{
	constructor(title, questions)
	{
		this.title = title;
		this.questions = questions;
		var questionindex;
	}

	scrambleExam()
	{
		let previousorder = this.questions;
		let neworder = [];
		let indexused = [];

		let repeatOptionError = true;
		for(var i = 0; i < previousorder.length; i++)
		{
			repeatOptionError = true;
			while(repeatOptionError)
			{
				let randomindex = Math.floor((Math.random() * (previousorder.length)) + 1);
				randomindex -= 1;
				if(indexused.includes(randomindex))
				{
					repeatOptionError = true;
				}
				else
				{
					repeatOptionError = false;
					indexused.push(randomindex);
					neworder.push(previousorder[randomindex]);
				}
			}
		}

		this.questions = neworder;
	}

	takeExam()
	{
		this.scrambleExam();
		for(var i = 0; i<this.questions.length-1; i++);
		{
			this.questions[i].scrambleQuestion();
		}
		this.questionindex = 0;
		this.loadQuestion();
	}

	getCurrentQuestionIndex()
	{
		return this.questionindex;
	}

	setCurrentQuestionIndex(i)
	{
		this.questionindex = i;
	}

	calculateScore(userAnswers)
	{
		examcompleted = true;
		document.body.innerHTML = "";
		var PerfectScore = true;
        var Score = 0;
        for(var i = 0; i<=this.questions.length-1; i++)
        {
            if(userAnswers[i] === this.questions[i].answer)
            {
                Score++;
            }
        }
        var headerscore = document.createElement("H1");
        headerscore.innerText = ("Score: " + Score + "/" + this.questions.length + "\n");
        document.body.appendChild(headerscore);

        for(var i = 0; i<= this.questions.length-1;i++)
        {
            if(userAnswers[i] != this.questions[i].answer)
            {
                PerfectScore = false;
            }
        }
        if(PerfectScore === false)
        {
                for(var i = 0; i<=this.questions.length-1; i++)
                {
                    if(userAnswers[i] != this.questions[i].answer)
                    {
                    	var resultsParagraph = document.createElement("P");
                    	var optionsString = "<ul style = \"list-style-type: sqaure;\">";
                    	for(var optionindex = 0; optionindex < this.questions[i].options.length; optionindex++)
						{
							optionsString += `<li>${this.questions[i].options[optionindex]}</li><br>`;
						}
						optionsString += "</ul>";
                        resultsParagraph.innerHTML = `<br>Question: ${this.questions[i].problem} <br><br>Options: ${optionsString} <div class = "wronganswers">Your Answer: ${userAnswers[i]} </div><div class  = "correctanswers">Correct Answer: ${this.questions[i].answer} </div><br><hr>`;
                        document.body.appendChild(resultsParagraph);
                    }
                }
                var temp = document.querySelectorAll(".wronganswers");
                var temp1 = document.querySelectorAll(".correctanswers");
                for(var tempindex = 0; tempindex < temp.length; tempindex++)
                {	
                	temp[tempindex].style.margin = "0px";
                	temp[tempindex].style.height = "100%";
                	temp[tempindex].style.color = "red";
                	temp1[tempindex].style.margin = "0px";
                	temp1[tempindex].style.height = "100%";
                	temp1[tempindex].style.color = "green";
                }
                document.body.style.height = "auto";
        }
        if(PerfectScore === true)
        {

            var resultsParagraph = document.createElement("P");
            resultsParagraph.innerText = "There were no questions answered incorrectly. Congratulations on the perfect score!";
            resultsParagraph.style.textAlign = "center";
            resultsParagraph.id = "results";
            document.body.appendChild(resultsParagraph);
            
        }
        var homepage = document.createElement("A");
        homepage.setAttribute("href", "index.html");
        var returnButton = document.createElement("BUTTON");
        returnButton.innerText = "Home Page";
        returnButton.style.fontSize = "35px";
        returnButton.style.width = "250px";
        returnButton.style.margin = "10px";
        returnButton.style.height = "46px";
        homepage.appendChild(returnButton);
        document.body.appendChild(homepage);
        let printanswers = document.getElementsByTagName("P");
		for(var printindex = 0; printindex < printanswers.length; printindex++)
		{
			printanswers[printindex].style.height = "100%";
			printanswers[printindex].style.margin = "0px";
		}
		resultsParagraph = document.getElementById("results");
        resultsParagraph.style.height = "auto";
	}
		

	loadQuestion()
	{
		this.questions[this.questionindex].askQuestion();

		var div = document.createElement("div");
		var submitbutton = document.createElement("BUTTON");
		var previousbutton = document.createElement("BUTTON");
		submitbutton.style.width = "150px";
		previousbutton.style.width = "150px";

		submitbutton.id = "submitnext";
		previousbutton.id = "submitprevious";

		if(this.questionindex === this.questions.length-1)
		{
			submitbutton.innerText = "Submit Exam";
		}
		else
		{
			submitbutton.innerText = "Next Question";
		}
		previousbutton.innerText = "Previous Question";
		div.id = "buttons";
		document.body.appendChild(div);

		document.getElementById("buttons").appendChild(submitbutton);
		document.getElementById("buttons").appendChild(previousbutton);
		if(this.questionindex != 0)
		{
			previousbutton.style.display = "block";
		}
		else
		{
			previousbutton.style.display = "none";
		}

		//selectoptions.forEach(item => { item.addEventListener('click', event => { updateAnswer(Number(item.id.substring(3))-1); item.getElementsByTagName("INPUT")[0].checked = true;}) });
		_.forEach(selectoptions, function(value){value.addEventListener('click', event => {
			updateAnswer(Number(value.id.substring(3)-1));
			value.getElementsByTagName("INPUT")[0].checked = true;
		});});

		submitbutton.addEventListener('click', event => { 
			if(submitbutton.innerText === "Next Question")
			{
				Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex()+1);
				document.body.innerHTML = "";
				Exams[examindex].loadQuestion();
				
			}
			if(submitbutton.innerText === "Submit Exam")
			{
				if(getUserAnswers().includes(undefined) || getUserAnswers().length === 0 || getUserAnswers().length != this.questions.length)
				{
					alert("Please answer all of the questions before you submit the exam.\nUnanswered Questions: " + findIncompleteQuestions());
				}
				else
				{
					
					this.calculateScore(getUserAnswers());
				}
			}
		});

		previousbutton.addEventListener('click', event => {
			Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex()-1);
			document.body.innerHTML = "";
			Exams[examindex].loadQuestion();
		});
	}
}


class Question
{
	constructor(problem, options, answer)
	{
		this.problem = problem;
		this.options = options;
		this.answer = answer;
	}

	askQuestion()
	{
		var header = document.createElement("p");
		var inputcontainer = document.createElement("div");

		header.innerText = `${Exams[examindex].getCurrentQuestionIndex()+1}. ${this.problem}`;
		header.style.width = "50%";
		header.style.height = "105px";
		header.style.fontSize = "25px";
		header.style.marginTop = "80px";
		header.style.marginBottom = "25px";
		inputcontainer.id = "inputcontainer";
		inputcontainer.style.fontSize = "20px";
		inputcontainer.style.width = `${header.style.width}`;
		document.body.appendChild(header);
		document.body.appendChild(inputcontainer);

		for(var i2 =0; i2 < this.options.length; i2++)
		{
			if(examindex != 0)
			{
				exampagetitle.innerHTML = "Chapter "+examindex+" Exam";
			}
			else
			{
				exampagetitle.innerHTML = "Book Exam";
			}

			
			var div = document.createElement("div");
			var option = document.createElement("input");
			var text = document.createTextNode(this.options[i2]);

			
			div.id = `div${i2+1}`;
			div.setAttribute("name", "options");
			div.setAttribute("class", "possibleoptions");
			option.type = "radio";
			option.name = "radiooptions";
			option.id = `option${(i2+1)}`;

			if(getUserAnswers()[Exams[examindex].getCurrentQuestionIndex()] === this.options[i2])
			{
				option.checked = true;
			}

			document.getElementById(`inputcontainer`).appendChild(div);
			document.getElementById(`div${i2+1}`).appendChild(option);
			document.getElementById(`div${i2+1}`).appendChild(text);

			
		}
	}

	scrambleQuestion()
	{
		let previousorder = this.options;
		let neworder = [];
		let indexused = [];

		let repeatOptionError = true;
		for(var i = 0; i < previousorder.length; i++)
		{
			repeatOptionError = true;
			while(repeatOptionError)
			{
				let randomindex = Math.floor((Math.random() * (previousorder.length)) + 1);
				randomindex -= 1;
				if(indexused.includes(randomindex))
				{
					repeatOptionError = true;
				}
				else
				{
					repeatOptionError = false;
					indexused.push(randomindex);
					neworder.push(previousorder[randomindex]);
				}
			}
		}
		for(var i = 0; i < neworder.length; i++)
		{
			if(neworder[i] === "All of the above" && i != neworder.length)
			{
				neworder[i] = neworder[neworder.length];
				neworder[neworder.length] = "All of the above";
			}
		}
		this.options = neworder;
	}
}


let Chapter3Questions = [];

let QuestionOptions= [];
QuestionOptions[0] = "Two; one";
QuestionOptions[1] = "One; two";
QuestionOptions[2] = "Zero; one";
QuestionOptions[3] = "One; zero";
Chapter3Questions[0] = new Question("In a digital signal, the on state is represented by ___, and the off state is represented by ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Analog";
QuestionOptions[1] = "Fluctuating";
QuestionOptions[2] = "Dimmer";
QuestionOptions[3] = "Digital";
Chapter3Questions[1] = new Question("A signal that has many varying states is called a(n) ___ signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Signals";
QuestionOptions[1] = "Speeds";
QuestionOptions[2] = "States";
QuestionOptions[3] = "Rates";
Chapter3Questions[2] = new Question("Bit depth is defined as the number of ___ you have in which to describe the value.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "10:1";
QuestionOptions[1] = "5:1";
QuestionOptions[2] = "3:2";
QuestionOptions[3] = "2:1";
Chapter3Questions[3] = new Question("Standard DV cameras usually compress at a ratio of ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "A structure of data containment";
QuestionOptions[1] = "A formatting system";
QuestionOptions[2] = "A program that holds data";
QuestionOptions[3] = "A device or computer program that encodes and decodes file information";
Chapter3Questions[4] = new Question("What is a codec?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Dirty";
QuestionOptions[2] = "Analog";
QuestionOptions[3] = "Clean";
Chapter3Questions[5] = new Question("As noise is introduced to a(n) ___ signal, discerning circuitry can determine if the signal is intended to be high or low, and then retransmit a solid signal without the imposed noise.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Low";
QuestionOptions[3] = "High";
Chapter3Questions[6] = new Question("Noise overcomes the signal after many generations of reamplification of a(n) ___ signal.", QuestionOptions, QuestionOptions[1]);

CE3 = new Exam("CE3", Chapter3Questions);

//Chapter 4
let Chapter4Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Generation";
QuestionOptions[1] = "Compression";
QuestionOptions[2] = "Acoustical";
QuestionOptions[3] = "Propagation";
Chapter4Questions[0] = new Question("How sound moves through the air is called ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Number of times a wavelength cycle occurs per second";
QuestionOptions[1] = "Intensity or loudness of a sound in a particular medium";
QuestionOptions[2] = "Physical distance between two points of a waveform that are exactly one cycle apart";
QuestionOptions[3] = "Cycle when molecules move from rest through compression to rest to rarefaction";
Chapter4Questions[1] = new Question("Wavelength is the ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "The threshold of human hearing";
QuestionOptions[1] = "Ambient noise level";
QuestionOptions[2] = "The threshold of pain";
QuestionOptions[3] = "Normal listening level";
Chapter4Questions[2] = new Question("Which of the following does 0 dB SPL describe?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "+/-10 dB";
QuestionOptions[1] = "+/-6 dB";
QuestionOptions[2] = "+/-1 dB";
QuestionOptions[3] = "+/-3 dB";
Chapter4Questions[3] = new Question("A \"just noticeable\" change in sound pressure level, either louder or softer, requires a ___ change.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Received; effects; structure";
QuestionOptions[1] = "Produced; propagation; control";
QuestionOptions[2] = "Controlled; delivery; translation";
QuestionOptions[3] = "Produced; amplification; reception";
Chapter4Questions[4] = new Question("Acoustics covers how sound is ___, and its ___ and ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Directional Sound";
QuestionOptions[1] = "Echo";
QuestionOptions[2] = "Surface reflection";
QuestionOptions[3] = "Reverberation";
Chapter4Questions[5] = new Question("Numerous, persistent reflections of sound are called ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Interferes with";
QuestionOptions[1] = "Completely blocks";
QuestionOptions[2] = "Enhances";
QuestionOptions[3] = "Is louder than";
Chapter4Questions[6] = new Question("Ambient noise is sound that ___ the desired message or signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Output device";
QuestionOptions[1] = "Electrical signal";
QuestionOptions[2] = "Processor";
QuestionOptions[3] = "Microphone";
Chapter4Questions[7] = new Question("The audio signal ends up in a(n) ___ before being converted back into acoustical energy", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Dynamic";
QuestionOptions[1] = "Condenser";
QuestionOptions[2] = "Electret";
QuestionOptions[3] = "Mic";
Chapter4Questions[8] = new Question("The strength of the electrical audio signal from a microphone is called a(n) ___ -level signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Polarized conductor";
QuestionOptions[1] = "Electrical field";
QuestionOptions[2] = "Remote power";
QuestionOptions[3] = "Internal capacitor";
Chapter4Questions[9] = new Question("Phantom power is the ___ required to power a condenser microphone.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "XRL";
QuestionOptions[1] = "RXL";
QuestionOptions[2] = "LRX";
QuestionOptions[3] = "XLR";
Chapter4Questions[10] = new Question("Typically, what type of connector finishes the shielded twisted-pair cable?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Frequency coordination";
QuestionOptions[1] = "Multiple receivers all tuned to the same frequency";
QuestionOptions[2] = "Using lavalier microphones";
QuestionOptions[3] = "Using IR wireless microphones";
Chapter4Questions[11] = new Question("The simultaneous use of multiple wireless microphone systems requires ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Unity gain";
QuestionOptions[1] = "Gain adjustment";
QuestionOptions[2] = "Attenuation";
QuestionOptions[3] = "Signal expansion";
Chapter4Questions[12] = new Question("If a technician changes the level of a signal, it is called ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "The equalizer";
QuestionOptions[1] = "Everything";
QuestionOptions[2] = "The audio processor";
QuestionOptions[3] = "The loudspeakers";
Chapter4Questions[13] = new Question("The amplifier comes right before ___ in the audio system chain.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A loudspeaker containing multiple drivers";
QuestionOptions[1] = "A loudspeaker enclosure with more than one frequency range";
QuestionOptions[2] = "An electrical frequency dividing network circuit";
QuestionOptions[3] = "A single driver reproducing the entire frequency range";
Chapter4Questions[14] = new Question("What is a crossover?", QuestionOptions, QuestionOptions[2]);

CE4 = new Exam("CE4", Chapter4Questions);

//Chapter 5
let Chapter5Questions = [];

QuestionOptions = [];		
QuestionOptions[0] = "Spectrum";
QuestionOptions[1] = "Visibility";
QuestionOptions[2] = "Vectors";
QuestionOptions[3] = "Wavelength";
Chapter5Questions[0] = new Question("Light waves are categorized by their ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Lumen";
QuestionOptions[1] = "LED";
QuestionOptions[2] = "Footcandle";
QuestionOptions[3] = "Lux";
Chapter5Questions[1] = new Question("Generally, a ___ measurement is taken at a task area like a video sceen.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 Percent";
QuestionOptions[1] = "75 Percent";
QuestionOptions[2] = "50 Percent";
QuestionOptions[3] = "25 Percent";
Chapter5Questions[2] = new Question("Perceived illumination decreases by ___ when the distance from a light source is doubled.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Negatively affects the quality of the displayed image";
QuestionOptions[1] = "Does not affect the quality of the displayed image";
QuestionOptions[2] = "Improves the quality of the displayed image";
QuestionOptions[3] = "Complements the quality of the displayed image";
Chapter5Questions[3] = new Question("The amount of ambient light in a displayed environment ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Sync; R-Y";
QuestionOptions[1] = "Sync; Y";
QuestionOptions[2] = "Chroma; Y";
QuestionOptions[3] = "Chroma; B-Y";
Chapter5Questions[4] = new Question("In the component video signal, the ___ signal is combined with the ___ information.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "S-Video signal";
QuestionOptions[1] = "Digital signal";
QuestionOptions[2] = "Subcarrier channel";
QuestionOptions[3] = "Chrominance";
Chapter5Questions[5] = new Question("In composite video, which of the following \"shares\" the luminance space?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflection, curvature, spherical aberration, and dispersion of field";
QuestionOptions[1] = "Reflection, dispersion, spherical aberration, and curvature of field";
QuestionOptions[2] = "Refraction, presentation, spherical aberration, and curvature of field";
QuestionOptions[3] = "Refraction, dispersion, spherical aberration, and curvature of field";
Chapter5Questions[6] = new Question("Four factors related to primary optics that influence the quality of the projected image are ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "DVI, HDVI, and DisplayPort";
QuestionOptions[1] = "DMI, HDVI, and DisplayPort";
QuestionOptions[2] = "DVI, HDMI, and DisplayPort";
QuestionOptions[3] = "DMI, HDMI, and DisplayPort";
Chapter5Questions[7] = new Question("Three major formats of digital connections are ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Spectrum analyzer";
QuestionOptions[1] = "Frequency analyzer";
QuestionOptions[2] = "Output monitor";
QuestionOptions[3] = "Bandwidth monitor";
Chapter5Questions[8] = new Question("To measure the bandwidth of an image, you will need a ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Remissive";
QuestionOptions[1] = "Emissive";
QuestionOptions[2] = "Transmissive";
QuestionOptions[3] = "Reflective";
Chapter5Questions[9] = new Question("Rear-screen display applications are considered ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transistor mask";
QuestionOptions[1] = "Polarizer";
QuestionOptions[2] = "Pixel grid";
QuestionOptions[3] = "Resistor network";
Chapter5Questions[10] = new Question("LCDs first pass light through a ___, which blocks certain light waves.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Decide if you should use an analog or digital display";
QuestionOptions[1] = "Figure out what type of mount you will need";
QuestionOptions[2] = "Determine the distance of the farthest viewer";
QuestionOptions[3] = "Determine what you want to display";
Chapter5Questions[11] = new Question("When selecting a display type, what should be your first step?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Higher; brighter";
QuestionOptions[1] = "Lower; sharper";
QuestionOptions[2] = "Higher; softer";
QuestionOptions[3] = "Lower; brighter";
Chapter5Questions[12] = new Question("The ___ the gain number of a screen, the ___ the image.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Blurry only at the image center";
QuestionOptions[1] = "Oversaturation of red and green";
QuestionOptions[2] = "Edge of image in sharp focus";
QuestionOptions[3] = "Fuzzy details";
Chapter5Questions[13] = new Question("What quality would the image have if the phase setting of a display needs adjusting?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "L = SH x SW x AF";
QuestionOptions[1] = "L = SH x SW x AH";
QuestionOptions[2] = "L = SH x SA x SF";
QuestionOptions[3] = "L = SH x SW x AS";
Chapter5Questions[14] = new Question("The formula for an ANSI lumen rating is ___.", QuestionOptions, QuestionOptions[0]);

CE5 = new Exam("CE5", Chapter5Questions);

 //Chapter 6
let Chapter6Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Bus";
QuestionOptions[1] = "Star";
QuestionOptions[2] = "Application";
QuestionOptions[3] = "Ring";
Chapter6Questions[0] = new Question("Which of the following networks connects devices in sequence along a linear path?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "IEEE";
QuestionOptions[1] = "Bus";
QuestionOptions[2] = "Ring";
QuestionOptions[3] = "Ethernet";
Chapter6Questions[1] = new Question("What type of network uses packets?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Speeds up";
QuestionOptions[1] = "Stops";
QuestionOptions[2] = "Slows down";
QuestionOptions[3] = "Remains constant";
Chapter6Questions[2] = new Question("What happens to the connection speed in a Wi-Fi conenction if the signal strength declines?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "ST";
QuestionOptions[1] = "SC";
QuestionOptions[2] = "Multimode";
QuestionOptions[3] = "Single-mode";
Chapter6Questions[3] = new Question("Which of the following is a type of fiber-optic cable identified by its yellow outer jacket?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Network interface";
QuestionOptions[1] = "OSI reference";
QuestionOptions[2] = "Informal data link";
QuestionOptions[3] = "IP";
Chapter6Questions[4] = new Question("The ___ model is a guide that assists with conforming network communications and their processes to standards.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Layer 2, the Data Link Layer";
QuestionOptions[1] = "Layer 4, the Transport Layer";
QuestionOptions[2] = "Layer 1, the Physical Layer";
QuestionOptions[3] = "Layer 3, the Network Layer";
Chapter6Questions[5] = new Question("In the OSI model, cabling and patchbays are elements of ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transfer Mode";
QuestionOptions[1] = "Baseband";
QuestionOptions[2] = "Digital subscriber line";
QuestionOptions[3] = "MAC";
Chapter6Questions[6] = new Question("A ___ address is unique to every device and identifies a network's equipment.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Addresses";
QuestionOptions[1] = "Names";
QuestionOptions[2] = "Routes";
QuestionOptions[3] = "Versions";
Chapter6Questions[7] = new Question("IP deals with which of the following on a network?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Three";
QuestionOptions[1] = "Eight";
QuestionOptions[2] = "Six";
QuestionOptions[3] = "One";
Chapter6Questions[8] = new Question("An IPv6 address uses ___ groups of four hexadecimal numbers.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Computers";
QuestionOptions[1] = "Gateways";
QuestionOptions[2] = "Devices";
QuestionOptions[3] = "Printers";
Chapter6Questions[9] = new Question("Subnet masks can indicate how many ___ are allowed on the network.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "IP address and device name";
QuestionOptions[1] = "Subnet mask and gateway";
QuestionOptions[2] = "Subnet mask and DNS server";
QuestionOptions[3] = "IP address and subnet mask";
Chapter6Questions[10] = new Question("What is required to set an IP address manually on a switch?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Gateway";
QuestionOptions[1] = "Virtual private network";
QuestionOptions[2] = "DNS";
QuestionOptions[3] = "DHCP";
Chapter6Questions[11] = new Question("Which type of server automatically assigns an IP address to the MAC address during the device's connection to a network?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Unmanaged";
QuestionOptions[1] = "LAN";
QuestionOptions[2] = "Addressing";
QuestionOptions[3] = "Managed";
Chapter6Questions[12] = new Question("Which of the following switches just needs to be plugged in and connected to devices?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Bridge";
QuestionOptions[3] = "Router";
Chapter6Questions[13] = new Question("A ___ sends packets to different locations on a network and connects to outside networks.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Firewall";
QuestionOptions[3] = "Router";
Chapter6Questions[14] = new Question("A ___ controls incoming and outgoing network traffic and determines what will be allowed through based on a set of security rules.", QuestionOptions, QuestionOptions[2]);

CE6 = new Exam("CE6", Chapter6Questions);

//Chapter7
let Chapter7Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Signal flow";
QuestionOptions[1] = "Signal transfer route";
QuestionOptions[2] = "Wires and cables";
QuestionOptions[3] = "Audio and video control";
Chapter7Questions[0] = new Question("The path on which signal types travel is called ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Insulation";
QuestionOptions[1] = "Jackets";
QuestionOptions[2] = "Conductors";
QuestionOptions[3] = "Noise";
Chapter7Questions[1] = new Question("The purpose of shielding is to prevent ___ from mixing with the signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Cable contains a shield";
QuestionOptions[1] = "Cable contains only one conductor";
QuestionOptions[2] = "Cable contains multiple conductors";
QuestionOptions[3] = "Conductors are insulated";
Chapter7Questions[2] = new Question("Which of the following differentiates cable from wire?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Keeping noise from audio and video";
QuestionOptions[1] = "Blocking static";
QuestionOptions[2] = "Preserving the original transmission";
QuestionOptions[3] = "Rejecting interference";
Chapter7Questions[3] = new Question("Twisted-pair cable using balanced circuitry can help in ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Wireless";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Fiber";
QuestionOptions[3] = "Cable";
Chapter7Questions[4] = new Question("Unless amplified, digital signals generally do not travel as far as ___ signals.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Must have power to operate";
QuestionOptions[1] = "Mix different inputs to a signal output";
QuestionOptions[2] = "Connect multiple inputs simultaneously to one output";
QuestionOptions[3] = "Allow the user to select one input from a number of inputs";
Chapter7Questions[5] = new Question("Switchers ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Can connect any of four inputs to any or both of two outputs";
QuestionOptions[1] = "Must have only one output connected at any given time";
QuestionOptions[2] = "Can connect any of two inputs to any or both of four outputs";
QuestionOptions[3] = "Has effectively eight outputs";
Chapter7Questions[6] = new Question("A 4x2 matrix switcher ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Identifies";
QuestionOptions[1] = "Elevates";
QuestionOptions[2] = "Protects and organizes";
QuestionOptions[3] = "Cools";
Chapter7Questions[7] = new Question("An AV rack is a housing unit that ___ electronic equipment.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "1 foot; 2 to 7 feet";
QuestionOptions[1] = "19 inches; 21 to 25 inches";
QuestionOptions[2] = "25 inches; 19 to 21 inches";
QuestionOptions[3] = "21 inches; 19 to 25 inches";
Chapter7Questions[8] = new Question("The inside of a typical AV rack is ___ wide, and the outside varies from ___.", QuestionOptions, QuestionOptions[1]);

CE7 = new Exam("CE7", Chapter7Questions);

//Chapter 8
let Chapter8Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Complicate";
QuestionOptions[1] = "Automate";
QuestionOptions[2] = "Reconfigure";
QuestionOptions[3] = "Simplify";
Chapter8Questions[0] = new Question("Remote control systems ___ the operation of an AV system.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "GUIs";
QuestionOptions[1] = "Flip charts";
QuestionOptions[2] = "Wireless touchpanels";
QuestionOptions[3] = "Wall switches";
Chapter8Questions[1] = new Question("Which of these is not a common method of interfacing with a control system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Starting a videoconference";
QuestionOptions[1] = "Playing a video";
QuestionOptions[2] = "Dimming the lights and starting a Blu-ray player";
QuestionOptions[3] = "Setting volume levels";
Chapter8Questions[2] = new Question("Which of the following is most likely to be a function rather than a macro?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Turning on the lights";
QuestionOptions[1] = "Activating a single function on a device";
QuestionOptions[2] = "Powering on the audio amplifier and display";
QuestionOptions[3] = "Setting a volume level";
Chapter8Questions[3] = new Question("Which of the following would most likely be a macro?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Internet gateway";
QuestionOptions[1] = "Network printers";
QuestionOptions[2] = "Hard drive";
QuestionOptions[3] = "Control system CPU";
Chapter8Questions[4] = new Question("The purpose of a control system interface is to send instructions to the ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Omnidirectional";
QuestionOptions[1] = "Bidirectional";
QuestionOptions[2] = "Multidirectional";
QuestionOptions[3] = "Unidirectional";
Chapter8Questions[5] = new Question("Communication that allows a return message is called ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Increasing the power level of the elctrical circuit";
QuestionOptions[1] = "Reducing the wattage in a current loop";
QuestionOptions[2] = "Increasing resistance in a voltage loop";
QuestionOptions[3] = "Closing or opening an electrical current or voltage loop";
Chapter8Questions[6] = new Question("Contact-closure control communication provides device operation by ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Quality of the device";
QuestionOptions[1] = "Strength of the power source";
QuestionOptions[2] = "Shadows and darkness";
QuestionOptions[3] = "Sunlight or fluorescent lighting";
Chapter8Questions[7] = new Question("Which of the following can interfere with an IR control?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To control environments at greater distances";
QuestionOptions[1] = "For one-way device communication";
QuestionOptions[2] = "To create IP addresses";
QuestionOptions[3] = "For analog devices";
Chapter8Questions[8] = new Question("Ethernet is mainly used in control systems ___.", QuestionOptions, QuestionOptions[0]);

CE8 = new Exam("CE8", Chapter8Questions);

//Chapter9
let Chapter9Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Neutrons";
QuestionOptions[2] = "Watts";
QuestionOptions[3] = "Current";
Chapter9Questions[0] = new Question("Voltage is the force that causes ___ to flow through a conductor.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Amperes";
QuestionOptions[1] = "Volts";
QuestionOptions[2] = "Ohms";
QuestionOptions[3] = "Watts";
Chapter9Questions[1] = new Question("Current is measured in ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Resistance";
QuestionOptions[2] = "Impedance";
QuestionOptions[3] = "Dissipation";
Chapter9Questions[2] = new Question("The opposition to the flow of electrons in AC is called ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Voltage";
QuestionOptions[1] = "Impedance";
QuestionOptions[2] = "Resistance";
QuestionOptions[3] = "Watts";
Chapter9Questions[3] = new Question("Power is measured in ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "V = I/R";
QuestionOptions[1] = "I = R/V";
QuestionOptions[2] = "I = V/R";
QuestionOptions[3] = "R = V*I";
Chapter9Questions[4] = new Question("The relationship among voltage, current, and resistance is defined by the formula ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Battery";
QuestionOptions[1] = "Load";
QuestionOptions[2] = "Ground";
QuestionOptions[3] = "Source";
Chapter9Questions[5] = new Question("A current is always seeking to go to the ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Panelboards and service entrances";
QuestionOptions[1] = "Feeders and subpanels";
QuestionOptions[2] = "Branch circuits and feeders";
QuestionOptions[3] = "Service entrances and subpanels";
Chapter9Questions[6] = new Question("The main panel distributes power using ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Lateral feed";
QuestionOptions[1] = "Feeders";
QuestionOptions[2] = "Main distribution";
QuestionOptions[3] = "Subpanel (panelboard)";
Chapter9Questions[7] = new Question("At what point in the AC system are the branch circuits that power wall outlets and AV equipment connected?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 percent";
QuestionOptions[1] = "80 percent";
QuestionOptions[2] = "65 percent";
QuestionOptions[3] = "75 percent";
Chapter9Questions[8] = new Question("When planning an electrical system, do not exceed ___ of the capacity of any circuit.", QuestionOptions, QuestionOptions[1]);

CE9 = new Exam("CE9", Chapter9Questions);

//Chapter10
let Chapter10Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "9 kHz to 300 GHz";
QuestionOptions[1] = "No less than 9 kHz";
QuestionOptions[2] = "300 GHz and below";
QuestionOptions[3] = "3 kHz to 300 GHz";
Chapter10Questions[0] = new Question("An AC signal of ___ falls into the RF spectrum.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Converts it to be sent out via antenna";
QuestionOptions[1] = "Stores and reads it";
QuestionOptions[2] = "Demodulates it";
QuestionOptions[3] = "Converts it so that it can be translated and received";
Chapter10Questions[1] = new Question("What does the transmitter do with its audio, video, and/or data?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Transmission";
QuestionOptions[1] = "Demodulation";
QuestionOptions[2] = "Extraction";
QuestionOptions[3] = "Modulation";
Chapter10Questions[2] = new Question("___ is the most important step in converting data in a transmitter.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "VHF";
QuestionOptions[1] = "HF";
QuestionOptions[2] = "VLF";
QuestionOptions[3] = "UHF";
Chapter10Questions[3] = new Question("The range of RFs between 300 MHz and 3 GHz is the ___ band.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Have a wavelength closest to its physical length";
QuestionOptions[1] = "Have a wavelength one half the size of the receiving antenna";
QuestionOptions[2] = "Have proper orientation";
QuestionOptions[3] = "Are transmitted within proximity";
Chapter10Questions[4] = new Question("An antenna will be most sensitive to transmissions that ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Amplify echoes so that the main signal is strengthened";
QuestionOptions[1] = "Find incident and reflected signals that arrive in phase";
QuestionOptions[2] = "Calculate phase differences between signals in order to avoid cancellation";
QuestionOptions[3] = "Eliminate multipath signals that come from the transmitter";
Chapter10Questions[5] = new Question("The main function of a diversity receiver is to ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "HDTV";
QuestionOptions[1] = "CATV";
QuestionOptions[2] = "MATV";
QuestionOptions[3] = "RFTV";
Chapter10Questions[6] = new Question("Which of the following receives broadcast programs from multiple antennas and is redistributed by coaxial or fiber-optic cable?", QuestionOptions, QuestionOptions[1]);

CE10 = new Exam("CE10", Chapter10Questions);

//Chapter11
let Chapter11Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Focusing on what the person is saying";
QuestionOptions[1] = "Summarizing and paraphrasing the person's statements";
QuestionOptions[2] = "Asking frequent questions to guide the conversation to the topic you are interested in discussing";
QuestionOptions[3] = "Maintaining eye contact with the person";
Chapter11Questions[0] = new Question("Which of the following is not considered part of \"active listening\"?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Sending the information within an e-mail message";
QuestionOptions[1] = "Sending the client a document containing the information";
QuestionOptions[2] = "Sending the client a fax";
QuestionOptions[3] = "Calling the client on the phone";
Chapter11Questions[1] = new Question("What is usually the best approach for communicating detailed technical AV plan information to a client?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Architectural drawings of the building";
QuestionOptions[1] = "Feedback from benchmarking site visits";
QuestionOptions[2] = "End-user descriptions of the tasks and applications the AV system will support";
QuestionOptions[3] = "Client/building owner preferences for AV system equipment";
Chapter11Questions[2] = new Question("What is the most valuable source of information when defining the needs for an AV system?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identify the specific equipment needs for the desired AV system";
QuestionOptions[1] = "Determine the overall design of the AV system";
QuestionOptions[2] = "Obtain the client's vision of the AV system design";
QuestionOptions[3] = "Identify the activities that the end users will perform and the functions that the AV system should provide to support these activities";
Chapter11Questions[3] = new Question("What is the main purpose of an initial needs analysis?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Provides a starting point from which to determine client needs";
QuestionOptions[1] = "Defines the functionality that the system elements should provide";
QuestionOptions[2] = "Provides a standard design that can be used from most clients";
QuestionOptions[3] = "Provides a standard design template that can be given to the building architect";
Chapter11Questions[4] = new Question("How does knowledge of the overall room function assist the AV system designer in defining the client needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To provide overall information about the desired general AV needs";
QuestionOptions[1] = "To define the layout of AV components within a room";
QuestionOptions[2] = "To define the specific AV functions that the components must support";
QuestionOptions[3] = "To define the specific AV components";
Chapter11Questions[5] = new Question("How are task parameters used when defining user needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To demonstrate specific AV equipment in operation";
QuestionOptions[1] = "To give the client an opportunity to experience a number of AV system designs that address similar needs";
QuestionOptions[2] = "To test AV system designs";
QuestionOptions[3] = "To evaluate AV vendors prior to final selection of a vendor";
Chapter11Questions[6] = new Question("What is the purpose of benchmarking?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "To understand the full range of room features to ensure that the AV system design takes other building systems and components into account";
QuestionOptions[1] = "To evaluate and approve plans to ensure that room elements are compatible with the AV system installation needs";
QuestionOptions[2] = "To be able to use general site plans to determine the layout of the selected AV components";
QuestionOptions[3] = "Detailed building plans for the rooms in which the systems will be installed are typically not required; only a general floor plan is necessary";
Chapter11Questions[7] = new Question("Why is it important for the AV professional to obtain a full set of building plans?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The main client contact";
QuestionOptions[1] = "The client technical representative";
QuestionOptions[2] = "Contacts that may be required for site inspection and installation, including the architect, building manager, construction manager, security manager, IT manager, and so on";
QuestionOptions[3] = "All of the above";
Chapter11Questions[8] = new Question("What client contact information should be collected during initial client meetings?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To select alternative AV system components that are not affected by the identified constraints";
QuestionOptions[1] = "To inform the client that these constraints must be removed prior to installation tasks";
QuestionOptions[2] = "To develop a work-around plan when these constraints will affect the design or installation tasks";
QuestionOptions[3] = "To eliminate specific tasks that may be adversely impacted by constraints";
Chapter11Questions[9] = new Question("How does the AV team use information about any identified constraints to the AV design and installation tasks?", QuestionOptions, QuestionOptions[2]);

CE11 = new Exam("CE11", Chapter11Questions);

//Chapter12
let Chapter12Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The client";
QuestionOptions[1] = "The AHJ";
QuestionOptions[2] = "The client's insurance company";
QuestionOptions[3] = "Your company";
Chapter12Questions[0] = new Question("When visiting a client site, the primary work site regulations governing the use of PPE are typically defined by which of the following?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "PPE, such as hard hats, work boots, gloves, and safety glasses";
QuestionOptions[1] = "Tools with nonslip handles";
QuestionOptions[2] = "Approved nonconductive ladders";
QuestionOptions[3] = "Fall protection";
Chapter12Questions[1] = new Question("Which of the following is not considered part of the safety equipment that AV technicians should use when working at a work site?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Document the required AV system components for a client";
QuestionOptions[1] = "Document the AV, electrical, and mechanical systems";
QuestionOptions[2] = "Document information about client satisfaction with the AV system";
QuestionOptions[3] = "Document general information about a client and the site that may by relevant for the AV design and installation tasks";
Chapter12Questions[2] = new Question("What is a site survey checklist typically used to do?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail ceiling drawing";
QuestionOptions[2] = "Reflected floor plan";
QuestionOptions[3] = "Elevation drawing";
Chapter12Questions[3] = new Question("What type of plan drawing depicts the layout of items on the ceiling?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Section drawing";
Chapter12Questions[4] = new Question("What type of drawing depicts the ductwork that goes through the building?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Mechanical drawing";
Chapter12Questions[5] = new Question("What type of drawing would you use to determine the characteristics of a wall to ascertain the appropriate height and location of a video display?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Section drawing";
QuestionOptions[3] = "Mechanical drawing";
Chapter12Questions[6] = new Question("What type of drawing would you use to determine what is behind a wall or above a ceiling that could interfere with your system installation plan?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail drawing";
QuestionOptions[2] = "AV system schematic";
QuestionOptions[3] = "Mechanical drawing";
Chapter12Questions[7] = new Question("What drawing would you review to find out exactly how the projector should be mounted to the ceiling?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "NTS";
QuestionOptions[1] = "NCS";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "NIC";
Chapter12Questions[8] = new Question("Which abbreviation on a drawing tells you something on the drawing is not consistent with the scale?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "AFF";
QuestionOptions[1] = "FUT";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "NIC";
Chapter12Questions[9] = new Question("Which abbreviation, along with a measurement given on a drawing, tells you how high on a wall an interface plate should be installed?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Section drawing";
QuestionOptions[2] = "Electrical drawing";
QuestionOptions[3] = "Structural drawing";
Chapter12Questions[10] = new Question("Which type of drawing provides the best information about the ducts and piping in a facility?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "1";
QuestionOptions[1] = "2";
QuestionOptions[2] = "1/2";
QuestionOptions[3] = "None of the above";
Chapter12Questions[11] = new Question("On a drawing with a 1:50 scale, 2 centimeters equal how many meters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "24";
QuestionOptions[1] = "8";
QuestionOptions[2] = "16";
QuestionOptions[3] = "None of the above";
Chapter12Questions[12] = new Question("On a drawing using a 1/4 scale, 6 inches equal how many feet?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "An interior view of a wall or ceiling structure";
QuestionOptions[1] = "The number of a more detailed drawing that depicts a specific portion of a master drawing";
QuestionOptions[2] = "A drawing that depicts items in great detail, such as equipment mounting plans";
QuestionOptions[3] = "A view of a wall from an angle";
Chapter12Questions[13] = new Question("What does a section cut symbol on a drawing indicate?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "25.4 x 10 = 254 mm";
QuestionOptions[1] = "3.94 x 10 = 39.4 mm";
QuestionOptions[2] = "25.4 / 10 = 2.54 mm";
QuestionOptions[3] = "3.94 / 10 = .394 mm";
Chapter12Questions[14] = new Question("Which of the following equations allows you to convert a measurement of 10 inches into an equivalent measurement in millimeters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "100 x 25.4 = 2540 in";
QuestionOptions[1] = "100 x 2.54 = 254 in";
QuestionOptions[2] = "100 / 25.4 = 3.94 in";
QuestionOptions[3] = "100 / 2.54 = .394 in";
Chapter12Questions[15] = new Question("Which of the following equations allows you to convert a measurement of 100 millimeters into an equivalent measurement in inches?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "30 square feet";
QuestionOptions[1] = "35 square feet";
QuestionOptions[2] = "300 square feet";
QuestionOptions[3] = "3000 square feet";
Chapter12Questions[16] = new Question("What is the square footage of a space measuring 15 feet wide by 20 feet long by 10 feet high?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "39 cubic meters";
QuestionOptions[1] = "95 cubic meters";
QuestionOptions[2] = "900 cubic meters";
QuestionOptions[3] = "9000 cubic meters";
Chapter12Questions[17] = new Question("What is the cubic footage of a space measuring 15 meters wide by 20 meters long by 3 meters high?", QuestionOptions, QuestionOptions[2]);

CE12 = new Exam("CE12", Chapter12Questions);

//Chapter13
            let Chapter13Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Determine if the audience can see and hear the presentation, and determine whether movement within the seating area will be comfortable";
            QuestionOptions[1] = "The architect addresses the audience area design, not the AV designer";
            QuestionOptions[2] = "Determine if the proposed audience area HVAC and lighting are adequate";
            QuestionOptions[3] = "Ensure that the audience seating is placed between 5 feet (1.5 meters) and 25 feet (7.6 meters) from the screen";
            Chapter13Questions[0] = new Question("What are the main concerns of the AV system designer regarding the audience area?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "If the room location is close enough to run cabling to the AV components";
            QuestionOptions[1] = "That the room has a clear sightline to the presenter areas";
            QuestionOptions[2] = "If the room meets the required size, power, and HVAC requirements, and provides other services needed for the AV system components";
            QuestionOptions[3] = "If the proposed control room design and layout meet government construction standards and requirements";
            Chapter13Questions[1] = new Question("What is the primary issue the AV designer should examine when evaluating the AV control or projection room area?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Whether the HVAC system will provide sufficient heating and cooling within the audience areas";
            QuestionOptions[1] = "Whether the HVAC system will provide sufficient heating and cooling within the control room area";
            QuestionOptions[2] = "Whether the HVAC system will interfere with AV system component placement or create excessive noise";
            QuestionOptions[3] = "Whether the HVAC system will create electrical interference that impacts AV component operation";
            Chapter13Questions[2] = new Question("What is the typical primary concern of the AV designer when evaluating the HVAC systems at a client site?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Ambient noise and reverberation";
            QuestionOptions[1] = "The required loudness level of the AV system";
            QuestionOptions[2] = "The optimum locations for AV system loudspeakers";
            QuestionOptions[3] = "The audio system needs for the presenter and presenter area within the room";
            Chapter13Questions[3] = new Question("What is the primary issue that the AV designer should assess when reviewing the acoustic environment at a client site?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "8 feet (2.4 meters)";
            QuestionOptions[1] = "16 feet (4.9 meters)";
            QuestionOptions[2] = "24 feet (7.3 meters)";
            QuestionOptions[3] = "32 feet (9.7 meters)";
            Chapter13Questions[4] = new Question("A client needs a display system for a room that will be used for inspecting detailed drawings of computer system networks. What is the maximum distance that the viewers should be placed from a 4-foot (1.2 meter) high screen?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "5 feet (1.52 meters)";
            QuestionOptions[1] = "6.41 feet (1.95 meters)";
            QuestionOptions[2] = "7.12 feet (2.17 meters)";
            QuestionOptions[3] = "8.1 feet ( 2.47 meters)";
            Chapter13Questions[5] = new Question("Based on your review of the client needs, the display should consist of an HD wide-screen flat-panel monitor that is 4 feet high. How wide is the image displayed on this monitor?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Ambient noise";
            QuestionOptions[1] = "Audience sightlines";
            QuestionOptions[2] = "Ambient light";
            QuestionOptions[3] = "Projector placement";
            Chapter13Questions[6] = new Question("Your client is interested in installing a large projection screen in a front lobby area to display images of various projects for promotional purposes. The screen will be installed directly across from a street-level entrance with several windows and a revolving glass door. What should be the primary initial concern of the AV designer regarding the projection system?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Proposed projector location and angle";
            QuestionOptions[1] = "Proposed screen material";
            QuestionOptions[2] = "Ambient light levels in the room";
            QuestionOptions[3] = "Distance between the projector and the screen";
            Chapter13Questions[7] = new Question("What is the primary factor an AV designer should examine when evaluating the potential to ensure a high contrast ratio for a front-projected image within a room?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "How much power is necessary to operate the AV system components";
            QuestionOptions[1] = "What non-AV equipment is on the same panelboard as the AV equipment";
            QuestionOptions[2] = "What existing outlets are available for the AV equipment";
            QuestionOptions[3] = "All of the above";
            Chapter13Questions[8] = new Question("The AV designer is evaluating the proposed AC power supply to an AV control room. What issue(s) should the AV designer consider?", QuestionOptions, QuestionOptions[3]);

            CE13 = new Exam("CE13", Chapter13Questions);

            //Chapter14
            let Chapter14Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "To determine the brightness of an image for a particular viewer";
            QuestionOptions[1] = "To determine if a viewer can see the smallest items on a screen";
            QuestionOptions[2] = "To identify the most appropriate location for a projector";
            QuestionOptions[3] = "To determine if the audience has a clear view of the screen";
            Chapter14Questions[0] = new Question("What is the purpose of a sightline study?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "use lighter-colored finishes on walls";
            QuestionOptions[1] = "Use focused task lighting";
            QuestionOptions[2] = "Install lighting controls such as dimmers";
            QuestionOptions[3] = "Treat windows for light infiltration";
            Chapter14Questions[1] = new Question("Which of the following is not a recommended approach to minimize ambient light levels within a room?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Minimize noise levels within the room during HVAC operation";
            QuestionOptions[1] = "Provide sufficient cooling and heating for audience comfort";
            QuestionOptions[2] = "Ensure sufficient cooling to maintain appropriate temperature levels for AV component operation";
            QuestionOptions[3] = "Locate HVAC system controls near the AV system control to allow for adjustment during a presentation";
            Chapter14Questions[2] = new Question("What is the primary concern the AV designer has regarding the design of the building's HVAC system?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "AV systems are not affected by building codes";
            QuestionOptions[1] = "The layout and design of AV systems are usually strictly regulated via building regulations and codes";
            QuestionOptions[2] = "Building regulations and codes often specify the type of electrical wiring that must be used for specfic AV installations";
            QuestionOptions[3] = "Building regulations and codes typically specify that a separate technical power system be installed for AV systems";
            Chapter14Questions[3] = new Question("How do building regulations or codes impact the AV system design?", QuestionOptions, QuestionOptions[2]);

            CE14 = new Exam("CE14", Chapter14Questions);

            //Chapter15
            let Chapter15Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Create the computer software required to control an AV system";
            QuestionOptions[1] = "Create detailed design documents depicting the AV system components and installation";
            QuestionOptions[2] = "Describe the AV systems necessary to support the defined needs and the general cost of those systems";
            QuestionOptions[3] = "Provide a detailed cost quote for the client to approve";
            Chapter15Questions[0] = new Question("What is the objective of the program phase of AV system design?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Identified needs of the end users";
            QuestionOptions[1] = "Results of the baseline visits";
            QuestionOptions[2] = "Installation capabilities of the general contractor";
            QuestionOptions[3] = "Recommendations from the client";
            Chapter15Questions[1] = new Question("What should the specific AV system capabilities be based on?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Communicate to the decision makers about the overall system's capabilities and budget";
            QuestionOptions[1] = "Provide a detailed layout of AV components to the general contractor";
            QuestionOptions[2] = "Provide a listing of specific components to be used within the AV system";
            QuestionOptions[3] = "Describe the location and layout of AV components within a room";
            Chapter15Questions[2] = new Question("What is the main objective of an AV program report?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Special issues";
            QuestionOptions[1] = "Infrastructure considerations";
            QuestionOptions[2] = "System descriptions";
            QuestionOptions[3] = "Executive summary";
            Chapter15Questions[3] = new Question("Which portion of the AV program report should describe the end users who were consulted to determine system requirements?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "System quote";
            QuestionOptions[1] = "System estimate";
            QuestionOptions[2] = "Opinion of probable cost";
            QuestionOptions[3] = "System \"ballpark\"";
            Chapter15Questions[4] = new Question("Which of the following cost descriptions provides a general budget for the AV system for use within the AV program report?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Identifying required AV system components";
            QuestionOptions[1] = "Purchasing and installing the AV system components";
            QuestionOptions[2] = "Developing more detailed AV system design documents and cost estimates";
            QuestionOptions[3] = "Additional discussions of AV needs";
            Chapter15Questions[5] = new Question("Once approved, what does the AV program report become the basis for?", QuestionOptions, QuestionOptions[2]);

            CE15 = new Exam("CE15", Chapter15Questions);

            //Chapter16
            let Chapter16Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "How the client is going to use the video display system";
            QuestionOptions[1] = "The resolution of the video display system";
            QuestionOptions[2] = "The size of video displays";
            QuestionOptions[3] = "The location of screens";
            Chapter16Questions[0] = new Question("When designing a video display system, what should be the first consideration of the AV system designer?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The AV designer is concerned with only the display systems within the room.";
            QuestionOptions[1] = "The AV designer should ensure that a standard video and audio signal output is available in the control room to allow other users to connect external systems.";
            QuestionOptions[2] = "The AV designer should determine the needed monitoring, feeds, and recording requirements, and ensure that they are supported by the system design.";
            QuestionOptions[3] = "Accommodating monitoring and feed needs is the responsibility of the AV installation team.";
            Chapter16Questions[1] = new Question("The AV designer is creating a system for a client who also needs to route video and audio signals to various other locations at the site. At what level should the AV designer consider this need?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "By including a signal switcher in the system design";
            QuestionOptions[1] = "By including all potential signal sources in the AV system control room";
            QuestionOptions[2] = "By establishing a clear, up-front understanding of the media that the client needs to present";
            QuestionOptions[3] = "By providing appropriate system inputs for each type of signal source";
            Chapter16Questions[2] = new Question("How should the AV design ensure that the AV system addresses the necessary display signal sources?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Minimize the bandwidth of signals transmitted within the system";
            QuestionOptions[1] = "Maximize the bandwidth of signals transmitted within the system";
            QuestionOptions[2] = "Select components that minimize bandwidth";
            QuestionOptions[3] = "Select components that maximize the bandwidth of the entire AV system";
            Chapter16Questions[3] = new Question("How should an AV system designer address system bandwidth?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Directivity, intelligibility, and consistency";
            QuestionOptions[1] = "Intelligibility, frequency response, and headroom";
            QuestionOptions[2] = "Loudness, headroom, and frequency response";
            QuestionOptions[3] = "Loudness, intelligibility, and stability";
            Chapter16Questions[4] = new Question("What are the three main performance parameters that an audio system should be designed to achieve?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "The frequency response should be based on the type of applications the audio is intended to support";
            QuestionOptions[1] = "The designer should work to achieve a frequency response as wide as possible within the project budget";
            QuestionOptions[2] = "The audio system output frequency response should match the frequency reponse of the audio source components";
            QuestionOptions[3] = "The audio system frequency response should meet the industry standard or 20Hz to 20kHz";
            Chapter16Questions[5] = new Question("How should an AV system designer determine the required frequency response of an audio system?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "DSP matrix mixer";
            QuestionOptions[1] = "Echo canceler";
            QuestionOptions[2] = "Crossover";
            QuestionOptions[3] = "Compressor";
            Chapter16Questions[6] = new Question("Which of the following audio processors would a system design specify to enhance the intelligibility fo a videoconferencing system?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "2 ohms";
            QuestionOptions[1] = "4 ohms";
            QuestionOptions[2] = "12 ohms";
            QuestionOptions[3] = "32 ohms";
            Chapter16Questions[7] = new Question("What is the total impedance of a system consisting of three loudspeakers, each with 4 Ohms of impedance, connected in series?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Direct-coupled system";
            QuestionOptions[1] = "Constant-voltage system that uses transformers";
            QuestionOptions[2] = "Series/parallel wired loudspeaker system";
            QuestionOptions[3] = "Low-impedance loudspeaker system";
            Chapter16Questions[8] = new Question("In audio systems where the loudspeakers are located far from the amplifier, what type of loudspeaker system is typically used?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "dB = 20 log (6 meters/12 meters)";
            QuestionOptions[1] = "dB = 20 log (12 meters/6 meters)";
            QuestionOptions[2] = "dB = 20 log (6 meters x 12 meters)";
            QuestionOptions[3] = "db = 20 log (6 meters + 12 meters)";
            Chapter16Questions[9] = new Question("As a listener moves away from a sound source, such as a loudspeaker, the sound energy drops. According to the inverse square law, which formula would you use to determine the drop in acoustic energy if the user moved from 6 to 12 meters away from a sound source?", QuestionOptions, QuestionOptions[0]);

            CE16 = new Exam("CE16", Chapter16Questions);

            //Chapter17
            let Chapter17Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "AV equipment, such as projectors, displays, audio, and control systems";
            QuestionOptions[1] = "Installation services and assistance, when necessary";
            QuestionOptions[2] = "Fabrication of custom components, such as furniture, defined within the proposal";
            QuestionOptions[3] = "All of the above";
            Chapter17Questions[0] = new Question("An AV company that is planning a client system installation typically works with vendors to obtain which of the following?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Request for pricing";
            QuestionOptions[1] = "Request for proposal";
            QuestionOptions[2] = "References for projects";
            QuestionOptions[3] = "Request for products";
            Chapter17Questions[1] = new Question("When working with a vendor or subcontractor for AV services, what does the abbreviation RFP stand for?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "Select local vendors that are based in your city or geographic area";
            QuestionOptions[1] = "Select vendors that you have worked with previously on other projects";
            QuestionOptions[2] = "Select vendors that advertise only name-brand products";
            QuestionOptions[3] = "Select vendors based on information about their capabilities, experience, terms, and value";
            Chapter17Questions[2] = new Question("What is the typical best practice for selecting potential vendors to bid on providing product and services for your AV project?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Describe the specific project work that you want the vendor to address in as much detail as possible, and ask the vendor to propose a technical approach and cost";
            QuestionOptions[1] = "Describe the project needs in general terms that will allow the vendor to be creative when proposing a technical solution and cost";
            QuestionOptions[2] = "Send the vendor the relevant portion of your original proposal to your client, and ask the vendor to propose a price for providing that portion of the project";
            QuestionOptions[3] = "Send the vendor the relevant portion of your original proposal to your client, along with your proposed pricing, and ask the vendor to agree to complete the work on that portion of the project for the identified price";
            Chapter17Questions[3] = new Question("When creating an RFP, what is the best approach for describing the work that you want the vendors to address within their proposal?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Select the proposal that provides the lowest cost.";
            QuestionOptions[1] = "Select the proposal that provides the best combination of cost, value, and terms.";
            QuestionOptions[2] = "Select the proposal that most closely matches the specifications within the RFP";
            QuestionOptions[3] = "Select the proposal that has the best technical approach/specifications";
            Chapter17Questions[4] = new Question("Which of the following best describes the approach for evaluating proposals for products and services from potential vendors?", QuestionOptions, QuestionOptions[1]);

            CE17 = new Exam("CE17", Chapter17Questions);

            //Chapter18
            let Chapter18Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "The charge-out rate for labor in each labor category needed to comlete all of the necessary project tasks";
            QuestionOptions[1] = "The weekly wage of the average paid staff member in the AV company";
            QuestionOptions[2] = "The standard, published labor cost for installing an AV system";
            QuestionOptions[3] = "A standard company cost for installing each AV component";
            Chapter18Questions[0] = new Question("On what is a project labor estimate based?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The invoice for parts and supplies that the AV company sends the client";
            QuestionOptions[1] = "The invoice for parts and supplies that the supplier sends the AV company";
            QuestionOptions[2] = "A list of equipment, supplies, and materials required for the project";
            QuestionOptions[3] = "A list of the equipment, supplies, and materials required for the projet, along with the quantity and cost for each item";
            Chapter18Questions[1] = new Question("What is a BOM?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "The staff member hourly or weekly wages";
            QuestionOptions[1] = "The staff member wages, plus vacation time and taxes";
            QuestionOptions[2] = "The staff member wages, plus vacation time, taxes, and other company overhead costs applicable to that person";
            QuestionOptions[3] = "The actual total time that the staff member spends working on the project";
            Chapter18Questions[2] = new Question("What is included in the charge-out rate for labor in a project estimate?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "A copy of the accepted and approved project proposal";
            QuestionOptions[1] = "A description of the components of the project, so the vendor will propose products to meet your needs";
            QuestionOptions[2] = "A detailed list of all the items you want to purchase for the project, broken out by categories";
            QuestionOptions[3] = "A list of the specific items that you want the vendor to provide";
            Chapter18Questions[3] = new Question("You are interested in getting a bid from a vendor for equipment and supplies for a client AV system installation project. What information do you give the vendor to provide the basis for the bid?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Purchase a large amount of these items at a lower cost per individual item, and keep them in stock in a warehouse until needed for projects";
            QuestionOptions[1] = "Purchase only the amount needed for each project, since the client is billed the cost for purchases";
            QuestionOptions[2] = "Negotiate an up-front price for the products with a vendor, and purchase only the amount needed for each project";
            QuestionOptions[3] = "Combine several individual orders to save on shipping costs";
            Chapter18Questions[4] = new Question("Your company has several projects that require a large number of standard items, such as connectors, cabling, conduit, etc. What is likely the best approach to obtain items for these projects at the lowest total cost?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "To determine if the client received a good value for its funds";
            QuestionOptions[1] = "To determine if the AV company made money on the project";
            QuestionOptions[2] = "To determine what to charge the client once the project is complete";
            QuestionOptions[3] = "To assess the cost of materials and supplies";
            Chapter18Questions[5] = new Question("What is the main objective of evaluating the cost of completing an AV project?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "To improve project estimates and the project management approach";
            QuestionOptions[1] = "To determine if the staff members are working hard enough";
            QuestionOptions[2] = "To assess if the project used the proper quality of materials";
            QuestionOptions[3] = "To evaluate the work of the AV designer";
            Chapter18Questions[6] = new Question("How do project managers use information obtained from evaluating the cost of completing an AV project?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "To determine if some staff are working hard than others";
            QuestionOptions[1] = "To determine what type of work each staff member is performing";
            QuestionOptions[2] = "To determine how staff should be scheduled";
            QuestionOptions[3] = "To evaluate if each staff member's time is being used as effectively as possible";
            Chapter18Questions[7] = new Question("What is the purpose of evaluating staff utilization rates?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "It tells the manager which projects were profitable and which ones were not.";
            QuestionOptions[1] = "It provides general information about the financial health of the overall company.";
            QuestionOptions[2] = "It is provided to the client to show how the project funds were used.";
            QuestionOptions[3] = "It is used by the manager to assess the performance of individual AV installers based on the profit made on their projects.";
            Chapter18Questions[8] = new Question("How does an AV manager use a P&L statement to assess the company's performance?", QuestionOptions, QuestionOptions[1]);

            CE18 = new Exam("CE18", Chapter18Questions);

            //Chapter19
            let Chapter19Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Visible Stray Wires";
            QuestionOptions[1] = "Visible Solder";
            QuestionOptions[2] = "Removed jacket or insulation";
            QuestionOptions[3] = "Crimping";
            Chapter19Questions[0] = new Question("Which of the following is a sign of an improperly fabricated cable termination?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Voltage test";
            QuestionOptions[1] = "Continuity test";
            QuestionOptions[2] = "Signal sweep test";
            QuestionOptions[3] = "Isolation test";
            Chapter19Questions[1] = new Question("Which of the following tests should be conducted to evaluate if a termination is properly transmitting a signal?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "An IP address";
            QuestionOptions[1] = "A wireless card";
            QuestionOptions[2] = "A web address";
            QuestionOptions[3] = "A TCP card";
            Chapter19Questions[2] = new Question("In order to communicate with devices installed onto a TCP/IP network, what must each device have?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The metal rack can shield the receiver from its intended signal";
            QuestionOptions[1] = "It relies on line of sight to the signal transmitter";
            QuestionOptions[2] = "It operates on different frequencies than its receivers";
            QuestionOptions[3] = "It is sensitive to fluorescent light";
            Chapter19Questions[3] = new Question("What is a drawback of using a rack-mounted RF receiver", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Convection";
            QuestionOptions[1] = "Pressurization";
            QuestionOptions[2] = "Conditioning";
            QuestionOptions[3] = "Evacuation";
            Chapter19Questions[4] = new Question("Which of the following rack-ventilation methods uses a fan that draws air from the rack?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Separating cables according to signal strength";
            QuestionOptions[1] = "Separating components according to signal type";
            QuestionOptions[2] = "Running several cables carrying the same signal to separate components";
            QuestionOptions[3] = "Splitting composite video signals into component RGB signals";
            Chapter19Questions[5] = new Question("What does signal separation refer to within a rack layout?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The buildilng's structural support or blocking";
            QuestionOptions[1] = "Drywall";
            QuestionOptions[2] = "Ceiling";
            QuestionOptions[3] = "Any stud in the wall";
            Chapter19Questions[6] = new Question("When mounting heavy equipment, always mount to which of the following?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Structural engineer";
            QuestionOptions[1] = "AV manager";
            QuestionOptions[2] = "Mechanical contractor";
            QuestionOptions[3] = "Client";
            Chapter19Questions[7] = new Question("Who should evaluate all mounting plans and advise the installation technician on difficult mounting situations?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The maximum weight of an equipment rack";
            QuestionOptions[1] = "The highest intensity a sound system can produce";
            QuestionOptions[2] = "The weight at which the item will structurally fail";
            QuestionOptions[3] = "The tendency for an equipment rack to tip over";
            Chapter19Questions[8] = new Question("What is the load limit?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "True";
            QuestionOptions[1] = "False";
            Chapter19Questions[9] = new Question("Roof-mounted HVAC systems may produce vibrations that cause the projector to vibrate and cause an image to appear unfocused.", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The locations within the ceiling where the conduit may be run";
            QuestionOptions[1] = "The outer diameter of the conduit used for specific applications";
            QuestionOptions[2] = "The amount of the inner diameter of a conduit that may be filled with cable";
            QuestionOptions[3] = "Conduits must be rated as fireproof when used within ceiling (plenum) spaces";
            Chapter19Questions[10] = new Question("To what does the permissible area of a conduit refer?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Allows the AV team to brief the presenters or performers on the capabilities of the AV system";
            QuestionOptions[1] = "Ensures that the system meets building code or regulation requirements";
            QuestionOptions[2] = "Helps the AV team integrate the live AV support with any broadcasting requirements";
            QuestionOptions[3] = "Helps the AV installer determine the required equipment and crew resources";
            Chapter19Questions[11] = new Question("What is the main purpose for reviewing the system design when preparing for providing AV support for a live event?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Its broadcast domain must be segmented on every switch in the network";
            QuestionOptions[1] = "You may be limited to whatever addressing scheme the client already uses";
            QuestionOptions[2] = "It increases bandwidth overhead by adding an encryption and tunneling wrapper";
            QuestionOptions[3] = "You will need to manually set IP addresses for each device";
            Chapter19Questions[12] = new Question("Why can implementing a VLAN be labor-intensive?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Ensure that all microphones are behind loudspeakers";
            QuestionOptions[1] = "Ensure that all microphone cables are no longer than 15 feet (4.5 meters) in length";
            QuestionOptions[2] = "Ensure that all microphone cables are taped to the floor";
            QuestionOptions[3] = "Mount all microphones on nonconductive stands";
            Chapter19Questions[13] = new Question("Which of the following objectives should the AV team target when locating microphones for a live event?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "10 feet (3 meters)";
            QuestionOptions[1] = "15 feet (4.5 meters)";
            QuestionOptions[2] = "20 feet (6 meters)";
            QuestionOptions[3] = "30 feet (9 meters)";
            Chapter19Questions[14] = new Question("How far away from the screen should you place a video projector with a lens ratio of 2.0 to create a 10-foot (3-meter) wide image?", QuestionOptions, QuestionOptions[2]);


            CE19 = new Exam("CE19", Chapter19Questions);

            //Chapter20
            let Chapter20Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "The total amount that the client has paid the AV company for the project";
            QuestionOptions[1] = "The total cost of purchasing the needed materials and supplies";
            QuestionOptions[2] = "The amount of labor and materials the project manager has allocated to complete the project";
            QuestionOptions[3] = "The amount of labor and materials the project manager used to successfully complete the project";
            Chapter20Questions[0] = new Question("Project budget refers to which of the following?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Ask the client to agree to a CO that describes the changes to the project agreement and the additional costs.";
            QuestionOptions[1] = "Perform the requested additional work in order to ensure that the client is satisfied.";
            QuestionOptions[2] = "Never perform any work that was not agreed to within the original work contract.";
            QuestionOptions[3] = "Remove another element of the project to keep the final cost the same.";
            Chapter20Questions[1] = new Question("How should the AV company respond if a client requests changes in the project that end up increasing the cost of completing the project?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "A task that cannot begin before another task is complete";
            QuestionOptions[1] = "A task that must be completed by a specific date";
            QuestionOptions[2] = "A task that will be required if specific conditions occur at the project site";
            QuestionOptions[3] = "An optional task that the client can determine is needed once the project is underway";
            Chapter20Questions[2] = new Question("What is a dependency within a project task schedule?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "The AV team should focus on the AV installation; the project manager is responsible for coordinating work at the project.";
            QuestionOptions[1] = "The AV team should review the project schedule; it defines all coordination necessary for the project.";
            QuestionOptions[2] = "The AV team should actively communicate and coordinate with the project manager and other vendors to ensure that the AV installation is not impacted by other vendors working on the project.";
            QuestionOptions[3] = "The AV team should negotiate work schedules directly with the other vendors.";
            Chapter20Questions[3] = new Question("Which statement best describes the relationship of the AV installation team with other vendors on the site?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Modification Announcement (MA)";
            QuestionOptions[1] = "Construction change directive (CCD)";
            QuestionOptions[2] = "Request for change (RFC)";
            QuestionOptions[3] = "Progress report (PR)";
            Chapter20Questions[4] = new Question("Which of the following documents would an AV company submit in the event that a modification in the building design impacted the AV system installation requirements?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Logic network";
            QuestionOptions[1] = "Assumptions and risks";
            QuestionOptions[2] = "WBS";
            QuestionOptions[3] = "Gantt chart";
            Chapter20Questions[5] = new Question("Which of the following defines project deliverables and relates the elements of work?", QuestionOptions, QuestionOptions[2]);

            CE20 = new Exam("CE20", Chapter20Questions);

            //Chapter21
            let Chapter21Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "When preventive maintenance is provided";
            QuestionOptions[1] = "When equipment is updated";
            QuestionOptions[2] = "When another company's equipment fails";
            QuestionOptions[3] = "All of the above";
            Chapter21Questions[0] = new Question("The maintenance technician for a system should document which of the following items?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "A process for registering the ownership of components";
            QuestionOptions[1] = "A process for documenting that the AV system conforms with international standards";
            QuestionOptions[2] = "A formal process for testing the elements of the AV system to ensure that they operate as intended";
            QuestionOptions[3] = "Officially \"launching\" an AV system with users within the client organization";
            Chapter21Questions[1] = new Question("In the context of AV system installations, what is the systems performance verification, or commissioning, process?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Systematically test all components to demonstrate that the AV system operates properly";
            QuestionOptions[1] = "Allow time to \"burn-in\" components to identify any potential failure points";
            QuestionOptions[2] = "Document the delivery and installation of all system components to enable final billing for system installation";
            QuestionOptions[3] = "Document how the user should operate the AV system";
            Chapter21Questions[2] = new Question("What is the objective of commissioning an AV system?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "To identify appropriate signal levels for each component";
            QuestionOptions[1] = "To document the system during the commissioning process";
            QuestionOptions[2] = "To calibrate AV system components";
            QuestionOptions[3] = "To gain an understanding of overall system operation that will aid in identifying sources of problems";
            Chapter21Questions[3] = new Question("How does the AV technician use an understanding of system signal flow to ensure proper operation?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Provide a detailed description of system components and operation";
            QuestionOptions[1] = "Provide manuals for all system components";
            QuestionOptions[2] = "Focus on how to perform basic presentation functions";
            QuestionOptions[3] = "Use a schematic of the system to present how the signal flows through the system";
            Chapter21Questions[4] = new Question("When briefing end users on how to operate the AV system, the AV team should do which of the following?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Shut down system components in any order";
            QuestionOptions[1] = "Shut down system components in a specifically defined order";
            QuestionOptions[2] = "Turn off all system power at once";
            QuestionOptions[3] = "Turn off sources, then processing, then display components";
            Chapter21Questions[5] = new Question("What is a proper AV system shutdown procedure?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "Provide detailed maintenance records that will aid in ongoing maintenance and repair";
            QuestionOptions[1] = "Provide a record for client billing purposes";
            QuestionOptions[2] = "Determine why a component failed";
            QuestionOptions[3] = "Determine warranty coverage of individual components";
            Chapter21Questions[6] = new Question("What is the main reason for carefully documenting AV system preventive maintenance tasks in a maintenance log?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Give users a higher level of confidence when operating the AV system";
            QuestionOptions[1] = "Reduce service calls resulting from user errors";
            QuestionOptions[2] = "Reduce the potential for damage due to improper use";
            QuestionOptions[3] = "Eliminate the need for AV company maintenance and repair calls";
            Chapter21Questions[7] = new Question("Which of the following is not an objective of training end users on the operation of the AV system?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Manufacturer manuals for all equipment that contain instructions for its operation";
            QuestionOptions[1] = "System design and configuration, including signal paths, to enable a technician to troubleshoot and correct any problems with the system";
            QuestionOptions[2] = "Configurations of the control system, including DIP switch settings and IP addresses of individual components";
            QuestionOptions[3] = "Operating instructions written for the AV knowledge level of the end user";
            QuestionOptions[4] = "All of the above";
            Chapter21Questions[8] = new Question("AV companies are typically required to provide documentation of the AV system after a project is complete. What is that documentation typically composed of?", QuestionOptions, QuestionOptions[4]);

            CE21 = new Exam("CE21", Chapter21Questions);

            //Chapter22
            let Chapter22Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "System warranty";
            QuestionOptions[1] = "Service agreement";
            QuestionOptions[2] = "Manufacturer's warranty";
            QuestionOptions[3] = "Preventive warranty";
            Chapter22Questions[0] = new Question("Which of the following types of maintenance agreements commits an AV company to providing ongoing preventive maintenance for a client system?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "System warranty";
            QuestionOptions[1] = "Service agreement";
            QuestionOptions[2] = "Manufacturer's warranty";
            QuestionOptions[3] = "Preventive warranty";
            Chapter22Questions[1] = new Question("When a new AV device fails within the first few weeks after installation, under which type of warranty is the repair typically addressed?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Obtain more information about the problem, such as the symptoms of the system failure";
            QuestionOptions[1] = "Locate the detailed system documentation";
            QuestionOptions[2] = "Travel to the client site to repair the system";
            QuestionOptions[3] = "Contact the manufacturer of the component to assist in troubleshooting";
            Chapter22Questions[2] = new Question("What is the first step that an AV technician should take when a client reports a problem with an AV system?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Replacing system cabling that is causing static within the system";
            QuestionOptions[1] = "Upgrading a display to a greater resolution to meet client needs";
            QuestionOptions[2] = "Replacing a projector bulb that is nearing the end of its operational life";
            QuestionOptions[3] = "Upgrading the programming on a control system to address newly installed components";
            Chapter22Questions[3] = new Question("Which of the following is an example of preventive maintenance?", QuestionOptions, QuestionOptions[2]);

            CE22 = new Exam("CE22", Chapter22Questions);

            //Chapter23
            let Chapter23Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Determine the possible failure points";
            QuestionOptions[1] = "Determine which components are fully operational";
            QuestionOptions[2] = "Review a system diagram depicting interconnections and signal flow";
            QuestionOptions[3] = "Clearly identify the failure symptoms";
            Chapter23Questions[0] = new Question("What should be the first step in troubleshooting a failure in an AV system?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "A system failure that affects multiple components";
            QuestionOptions[1] = "A system failure that is difficult to reproduce";
            QuestionOptions[2] = "A disruption in signal flow affecting the system";
            QuestionOptions[3] = "A failure of an interface component";
            Chapter23Questions[1] = new Question("What is an intermittent problem?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "Examine the system to determine if the problem is simple to address and gather more information";
            QuestionOptions[1] = "Logically divide the system in half, and determine which half has the failure";
            QuestionOptions[2] = "Replace the component that has appeared to fail";
            QuestionOptions[3] = "Ask the user to further descibe the nature of the problem";
            Chapter23Questions[2] = new Question("Once the characteristics of the system failure are clearly identified, what is the recommended next step in order to return the system to normal operation?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Test each of the components in the order of signal flow";
            QuestionOptions[1] = "Test each of the components beginning at the final output, working backward";
            QuestionOptions[2] = "Begin with testing the major functions, and then move to the minor functions";
            QuestionOptions[3] = "Logically divide the system in half, and determine which portion has the failure, and then repeat for the failed half";
            Chapter23Questions[3] = new Question("What is typically the most efficient process for localizing the faulty function within a malfunctioning AV system?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "No, because the users usually understand system operation";
            QuestionOptions[1] = "No, because the users are not considered part of the system that has failed";
            QuestionOptions[2] = "Yes, because users often do not understand how to properly operate the system, and may have changed settings or performed other actions that caused the failure";
            QuestionOptions[3] = "Yes, because user error is typically considered the main cause of AV system failure";
            Chapter23Questions[4] = new Question("When troubleshooting an AV system, should the AV technician consider user error as a source of the problem?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Change the cord to the microphone";
            QuestionOptions[1] = "Test the microphone with a multimeter";
            QuestionOptions[2] = "Plug the microphone into a preamp and test";
            QuestionOptions[3] = "Swap out the suspect microphone with a new microphone that you know is working and see if the system works properly";
            Chapter23Questions[5] = new Question("What is the best method to determine if a microphone is the source of a problem?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Brightness set too high";
            QuestionOptions[1] = "Fan has failed";
            QuestionOptions[2] = "Projector not properly positioned";
            QuestionOptions[3] = "Air filters clogged with dust";
            Chapter23Questions[6] = new Question("Which of the following is not an example of an issue that can cause a video projector to overheat?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Amplifier failure";
            QuestionOptions[1] = "Projector failure";
            QuestionOptions[2] = "Computer source failure";
            QuestionOptions[3] = "Cable/connector failure";
            Chapter23Questions[7] = new Question("Which of the following is the most likely source of an AV system failure or problem?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Adding compression to the microphone signal chain";
            QuestionOptions[1] = "Keeping the microphone as close to the sound source as possible";
            QuestionOptions[2] = "Keeping the loudspeakers in front of and as far from the microphones as possible";
            QuestionOptions[3] = "Turning down or muting all unused microphones";
            Chapter23Questions[8] = new Question("Which of the following is not a method of addressing feedback within an audio system?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Poor gain structure";
            QuestionOptions[1] = "Insufficient compression";
            QuestionOptions[2] = "Noise gate thresholds set too low";
            QuestionOptions[3] = "Source output gain set too high";
            Chapter23Questions[9] = new Question("An excessive amount of high-frequency hiss within an audio system is likely due to which of the following situations?", QuestionOptions, QuestionOptions[0]);

            CE23 = new Exam("CE23", Chapter23Questions);

            //Chapter24
            let Chapter24Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "The AV company should identify the suppliers and vendors with the lowest current prices.";
            QuestionOptions[1] = "The suppliers and vendors often become long-term partners with the AV company in meeting the client needs.";
            QuestionOptions[2] = "The AV company should work with only one supplier or vendor to procure the needed goods and services";
            QuestionOptions[3] = "The AV company client will usually specify the vendors or suppliers to support the client's project.";
            Chapter24Questions[0] = new Question("Which of the following statements descibes the typical relationship of an AV company with its suppliers and vendors?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "Check in orders as they arrive.";
            QuestionOptions[1] = "Ensure the proper amount of warehouse space is available for inventory.";
            QuestionOptions[2] = "Ensure that the total value of stock and inventory does not exceed a specific amount.";
            QuestionOptions[3] = "Keep track of the equipment and supplies the company has on hand, what is on order, and what is at the client site.";
            Chapter24Questions[1] = new Question("Which of the following statements best describes how an AV manager should manage stock and inventory?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "To identify a specific component and allow an inventory system to check the component in and out of the warehouse and venue site";
            QuestionOptions[1] = "To allow the scanner to identify the price of the equipment for rental customers";
            QuestionOptions[2] = "To identify the brand of the equipment or components";
            QuestionOptions[3] = "To identify in which room the equipment should be placed when it arrives at the venue";
            Chapter24Questions[2] = new Question("Why does an AV company use a unique bar code or other identifier on an equipment case for rental AV equipment?", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Client";
            QuestionOptions[1] = "AV company";
            QuestionOptions[2] = "End user";
            QuestionOptions[3] = "Whoever has taken control of the equipment";
            Chapter24Questions[3] = new Question("Once equipment leaves the warehouse, who is responsible for ensuring security and preventing theft?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Properly identifying the person taking possession of the equipment from the AV company";
            QuestionOptions[1] = "Ensuring that the renter knows how to properly operate the equipment";
            QuestionOptions[2] = "Ensuring that the renter knows how to properly transport the equipment";
            QuestionOptions[3] = "Ensuring that the renter has hired a security guard to protect the equipment once it has arrived at the site";
            Chapter24Questions[4] = new Question("What is a key concern when renting AV equipment", QuestionOptions, QuestionOptions[0]);

            QuestionOptions = [];
            QuestionOptions[0] = "Take courses on state-of-the-art AV techniques at AV industry trade shows";
            QuestionOptions[1] = "Obtain and renew a professional certification";
            QuestionOptions[2] = "Obtain industry information from a range of sources, including courses, seminars, publications, vendor presentations, and professional certification courses";
            QuestionOptions[3] = "Take college-level AV technology courses";
            Chapter24Questions[5] = new Question("Which of the following best describes the recommended approach to maintaining professional skills and knowledge?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Maintain security via the use of CCTV systems.";
            QuestionOptions[1] = "Track system usage, identify system or component failures, and identify tampering.";
            QuestionOptions[2] = "Track AV system operation costs.";
            QuestionOptions[3] = "Track the type of program materials viewed via the AV system to ensure that inappropriate program materials are blocked.";
            Chapter24Questions[6] = new Question("Remote-monitoring services for client sites are intended to perform which of the following?", QuestionOptions, QuestionOptions[1]);

            CE24 = new Exam("CE24", Chapter24Questions);

            //Chapter25
            let Chapter25Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Any persons or companies interested in purchasing AV equipment or services";
            QuestionOptions[1] = "Persons or companies interested in purchasing AV equipment or services that are within your area of service";
            QuestionOptions[2] = "Persons or companies interested in purchasing the types of AV equipment or services in which your compnay has special skills or capabilities";
            QuestionOptions[3] = "Business executives who are the decision makers responsible for purchasing AV systems and equipment";
            Chapter25Questions[0] = new Question("Which of the following best describes the market that your AV business should strive to reach with its marketing campaign?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Integrated market";
            QuestionOptions[1] = "Horizontal market";
            QuestionOptions[2] = "Vertical market";
            QuestionOptions[3] = "Niche market";
            Chapter25Questions[1] = new Question("An AV company that concentrates on serving the needs of retailers is focusing on which type of market?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "A comparison of the price of your products and services with the competition";
            QuestionOptions[1] = "The overall quality of the AV equipment carried by your company";
            QuestionOptions[2] = "The overall client rating of your response to the company's RFP";
            QuestionOptions[3] = "The elements of your company that give you an advantage over other companies";
            Chapter25Questions[2] = new Question("What does the term value proposition refer to?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "General project assumptions";
            QuestionOptions[1] = "A detailed description of all the components and accessories";
            QuestionOptions[2] = "A detailed breakdown of the costs for components, materials, and labor";
            QuestionOptions[3] = "A detailed description of the process used for identifying user needs";
            QuestionOptions[4] = "Warranty Information";
            Chapter25Questions[3] = new Question("A proposal for an AV system installation should provide all except which one of the following?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "To \"sell\" the client on purchasing the system";
            QuestionOptions[1] = "To explain how the costs for the project were estimated";
            QuestionOptions[2] = "To identify the needs that the system is intended to address";
            QuestionOptions[3] = "To assist the client in making a purchase decision";
            Chapter25Questions[4] = new Question("What is the recommended role of the AV salesperson when meeting with the client to present a project proposal?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "The AV manager";
            QuestionOptions[1] = "The IT manager";
            QuestionOptions[2] = "The CEO";
            QuestionOptions[3] = "The decision maker identified as ultimately responsible for the AV systems";
            Chapter25Questions[5] = new Question("Who is the person in the client organization that you should focus on meeting to present your proposal?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "How the proposed system will meet the client needs";
            QuestionOptions[1] = "The technical specifications of the AV system";
            QuestionOptions[2] = "The pricing of the AV system";
            QuestionOptions[3] = "How the AV system was designed";
            Chapter25Questions[6] = new Question("What should the sales discussion focus on?", QuestionOptions, QuestionOptions[0]);

            CE25 = new Exam("CE25", Chapter25Questions);

            //Chapter26
            let Chapter26Questions = [];

            QuestionOptions = [];
            QuestionOptions[0] = "Determining if the company already has someone in-house who can perform the work";
            QuestionOptions[1] = "Identifying the specific job requirements";
            QuestionOptions[2] = "Identifying the skills, knowledge, and experience needed by prospective employees";
            QuestionOptions[3] = "Determining the required education and certifications for the prospective employee";
            Chapter26Questions[0] = new Question("What should be the first step in the hiring process?", QuestionOptions, QuestionOptions[1]);

            QuestionOptions = [];
            QuestionOptions[0] = "Describe the job requirements  in as much detail as possible to ensure that the applicant understands the requirements";
            QuestionOptions[1] = "Provide only a few details, so that the applicant contacts the company to learn more";
            QuestionOptions[2] = "Provide the main details about the position in a manner that \"sells\" the company and position to the prospective employee";
            QuestionOptions[3] = "Promote the company in a manner that convinces the applicant that it would make an attractive career choice";
            Chapter26Questions[1] = new Question("Which of the following best describes how a job advertisement should function?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "Only applicants who have previously worked with well-established companies should be selected for an interview";
            QuestionOptions[1] = "Reviewers should call current employer and references of applicants to determine if the resume is accurate prior to selecting applicants for interviews";
            QuestionOptions[2] = "The reviewers should evaluate candidates against the stated job requirements, and create a short list of qualified candidates to invite for interviews.";
            QuestionOptions[3] = "Reviewers should select only candidates whose resumes exactly match the stated job requirements.";
            Chapter26Questions[2] = new Question("When evaluating resumes of prospective job applicants, how should the reviewers decide who to invite for interviews?", QuestionOptions, QuestionOptions[2]);

            QuestionOptions = [];
            QuestionOptions[0] = "The interviewers are legally allowed to ask only standard questions that focus on the person's work experience.";
            QuestionOptions[1] = "The interview should be an informal process of getting to kow the candidate in order to determine if the candidate's personality will be a fit within the organization.";
            QuestionOptions[2] = "Interviewers should focus on technical questions intended to assess the candidate's knowledge of the industry.";
            QuestionOptions[3] = "Interviewers should ask a range of prepared questions intended to asses the candidate's knowledge, skills, and work experience, as well as overall personality, behavior, and attitudes.";
            Chapter26Questions[3] = new Question("Which of the following best describes the interview process?", QuestionOptions, QuestionOptions[3]);

            QuestionOptions = [];
            QuestionOptions[0] = "Once-a-year feedback is used to determine salary increases and promotions.";
            QuestionOptions[1] = "Regular specific feedback should be provided to give staff members guidelines for improving performance.";
            QuestionOptions[2] = "Feedback should be provided when a complaint is received about an employee.";
            QuestionOptions[3] = "Feedback is used to identify areas that require additional training.";
            Chapter26Questions[4] = new Question("What is the main purpose of providing staff with feedback on job performance?", QuestionOptions, QuestionOptions[1]);

            CE26 = new Exam("CE26", Chapter26Questions);

let ChapterExamQuestions = [Chapter3Questions, Chapter4Questions, Chapter5Questions, Chapter6Questions, Chapter7Questions, Chapter8Questions, Chapter9Questions, Chapter10Questions, Chapter11Questions,Chapter12Questions, Chapter13Questions, Chapter14Questions, Chapter15Questions, Chapter16Questions, Chapter17Questions, Chapter18Questions, Chapter19Questions, Chapter20Questions, Chapter21Questions,Chapter22Questions, Chapter23Questions, Chapter24Questions, Chapter25Questions, Chapter26Questions];

	//ChapterExamQuestions = ChapterExamQuestions.flat(5000);
	//ChapterExamQuestions = ChapterExamQuestions.flat(50);
	ChapterExamQuestions = _.flattenDeep(ChapterExamQuestions);

	CE0 = new Exam("CE0", ChapterExamQuestions);
const Exams = [CE0,CE3,CE3,CE3,CE4,CE5,CE6,CE7,CE8,CE9,CE10,CE11,CE12,CE13,CE14,CE15,CE16,CE17,CE18,CE19,CE20,CE21,CE22,CE23,CE24,CE25,CE26];

function init()
{
	var myData = localStorage['objectToPass'];
	localStorage.removeItem('objectToPass');
	var selectedexam = myData;
	try{
		examindex = Number(selectedexam.substring(2));
	}
	catch(err){
		window.location.href = "index.html";
	}
	examcompleted = false;
	Exams[examindex].takeExam();
}

function updateAnswer(userAnswerindex)
{
	userAnswer = Exams[examindex].questions[Exams[examindex].getCurrentQuestionIndex()].options[userAnswerindex];
	userAnswers[Exams[examindex].getCurrentQuestionIndex()] = userAnswer;
}

var selectoptions = document.getElementsByName("options");

document.addEventListener("click", init());
//selectoptions.forEach(item => { item.addEventListener('click', event => { updateAnswer(Number(item.id.substring(3))-1); item.getElementsByTagName("INPUT")[0].checked = true;}) });

_.forEach(selectoptions, function(value){value.addEventListener('click', event => {
			updateAnswer(Number(value.id.substring(3)-1));
			value.getElementsByTagName("INPUT")[0].checked = true;
		});});

var previousbutton = document.getElementById("submitprevious");
var submitbutton = document.getElementById("submitnext");

submitbutton.addEventListener('click', event => { 
	if(submitbutton.innerText === "Next Question")
	{
		Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex());
		document.body.innerHTML = "";
		Exams[examindex].loadQuestion();
	}
 });

previousbutton.addEventListener('click', event => {
	Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex()-1);
	document.body.innerHTML = "";
	Exams[examindex].loadQuestion();
})

document.onkeydown = checkKey;

function checkKey(event)
{
	e = event || window.event;
	submitbutton = document.getElementById("submitnext");
	previousbutton = document.getElementById("submitprevious");
	try
	{
		if((e.keyCode === 13 || e.keyCode === 39)) 
		{
			if(submitbutton.textContent === "Next Question")
			{
				Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex()+1);
				document.body.innerHTML = "";
				Exams[examindex].loadQuestion();

			}
			else if(submitbutton.textContent === "Submit Exam")
			{
				if(getUserAnswers().includes(undefined) || getUserAnswers().length != Exams[examindex].questions.length)
					{
						alert("Please answer all of the questions before you submit the exam.\nUnanswered Questions: " + findIncompleteQuestions());
					}
					else
					{
						Exams[examindex].calculateScore(getUserAnswers());
					}
			}
		}
		if(e.keyCode === 8 || e.keyCode === 37)
		{
			if(Exams[examindex].getCurrentQuestionIndex() != 0 && examcompleted != true)
			{
				Exams[examindex].setCurrentQuestionIndex(Exams[examindex].getCurrentQuestionIndex()-1);
				document.body.innerHTML = "";
				Exams[examindex].loadQuestion();
			}
		}
		if(e.keyCode === 49 || e.keyCode === 97)
		{
			try
			{
				selectoptions[0].getElementsByTagName("INPUT")[0].checked = true;
				updateAnswer(0);
			}
			catch(err){}
		}
		if(e.keyCode === 50 || e.keyCode === 98)
		{
			try
			{
				selectoptions[1].getElementsByTagName("INPUT")[0].checked = true;
				updateAnswer(1);
			}
			catch(err){}
		}
		if(e.keyCode === 51 || e.keyCode === 99)
		{
			try
			{
				selectoptions[2].getElementsByTagName("INPUT")[0].checked = true;
				updateAnswer(2);
			}
			catch(err){}
		}
		if(e.keyCode === 52 || e.keyCode === 100)
		{
			try
			{
				selectoptions[3].getElementsByTagName("INPUT")[0].checked = true;
				updateAnswer(3);
			}
			catch(err){}
		}
		if((e.keyCode === 53 || e.keyCode === 101)) //&& selectoptions.length === 5)
		{
			try
			{
				selectoptions[4].getElementsByTagName("INPUT")[0].checked = true;
				updateAnswer(4);
			}
			catch(err){}
		}
	}
	catch(err){}
}

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});