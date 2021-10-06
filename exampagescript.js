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
        this.questions.forEach(element => element.scrambleQuestion());
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

        var version;
        if(ExamTitles[examindex].substring(1,2) === "2")
        {
            version = "2nd Edition";
        }
        else if(ExamTitles[examindex].substring(1,2) === "3")
        {
            version = "3rd Edition";
        }

        var examnumber;
        if(ExamTitles[examindex].substring(4) === "00")
        {
            examnumber = " Book";
        }
        else
        {
            examnumber = " Chapter " + ExamTitles[examindex].substring(4);
        }

        exampagetitle.innerHTML = version + examnumber + " Exam";

		for(var i2 =0; i2 < this.options.length; i2++)
		{	
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
            if((neworder[i] === "All of the above" || neworder[i] === "None of the above") && i != neworder.length-1)
            {
                var lastanswer = neworder[i];
                neworder[i] = neworder[neworder.length-1];
                neworder[neworder.length-1] = lastanswer;
            }
        }
        this.options = neworder;
	}
}
//SECOND EDITION
//Chapter 3
let V2Chapter3Questions = [];

let QuestionOptions= [];
QuestionOptions[0] = "Two; one";
QuestionOptions[1] = "One; two";
QuestionOptions[2] = "Zero; one";
QuestionOptions[3] = "One; zero";
V2Chapter3Questions[0] = new Question("In a digital signal, the on state is represented by ___, and the off state is represented by ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Analog";
QuestionOptions[1] = "Fluctuating";
QuestionOptions[2] = "Dimmer";
QuestionOptions[3] = "Digital";
V2Chapter3Questions[1] = new Question("A signal that has many varying states is called a(n) ___ signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Signals";
QuestionOptions[1] = "Speeds";
QuestionOptions[2] = "States";
QuestionOptions[3] = "Rates";
V2Chapter3Questions[2] = new Question("Bit depth is defined as the number of ___ you have in which to describe the value.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "10:1";
QuestionOptions[1] = "5:1";
QuestionOptions[2] = "3:2";
QuestionOptions[3] = "2:1";
V2Chapter3Questions[3] = new Question("Standard DV cameras usually compress at a ratio of ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "A structure of data containment";
QuestionOptions[1] = "A formatting system";
QuestionOptions[2] = "A program that holds data";
QuestionOptions[3] = "A device or computer program that encodes and decodes file information";
V2Chapter3Questions[4] = new Question("What is a codec?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Dirty";
QuestionOptions[2] = "Analog";
QuestionOptions[3] = "Clean";
V2Chapter3Questions[5] = new Question("As noise is introduced to a(n) ___ signal, discerning circuitry can determine if the signal is intended to be high or low, and then retransmit a solid signal without the imposed noise.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Low";
QuestionOptions[3] = "High";
V2Chapter3Questions[6] = new Question("Noise overcomes the signal after many generations of reamplification of a(n) ___ signal.", QuestionOptions, QuestionOptions[1]);

var V2CE03 = new Exam("V2CE03", V2Chapter3Questions);

//Chapter 4
let V2Chapter4Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Generation";
QuestionOptions[1] = "Compression";
QuestionOptions[2] = "Acoustical";
QuestionOptions[3] = "Propagation";
V2Chapter4Questions[0] = new Question("How sound moves through the air is called ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Number of times a wavelength cycle occurs per second";
QuestionOptions[1] = "Intensity or loudness of a sound in a particular medium";
QuestionOptions[2] = "Physical distance between two points of a waveform that are exactly one cycle apart";
QuestionOptions[3] = "Cycle when molecules move from rest through compression to rest to rarefaction";
V2Chapter4Questions[1] = new Question("Wavelength is the ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "The threshold of human hearing";
QuestionOptions[1] = "Ambient noise level";
QuestionOptions[2] = "The threshold of pain";
QuestionOptions[3] = "Normal listening level";
V2Chapter4Questions[2] = new Question("Which of the following does 0 dB SPL describe?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "+/-10 dB";
QuestionOptions[1] = "+/-6 dB";
QuestionOptions[2] = "+/-1 dB";
QuestionOptions[3] = "+/-3 dB";
V2Chapter4Questions[3] = new Question("A \"just noticeable\" change in sound pressure level, either louder or softer, requires a ___ change.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Received; effects; structure";
QuestionOptions[1] = "Produced; propagation; control";
QuestionOptions[2] = "Controlled; delivery; translation";
QuestionOptions[3] = "Produced; amplification; reception";
V2Chapter4Questions[4] = new Question("Acoustics covers how sound is ___, and its ___ and ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Directional Sound";
QuestionOptions[1] = "Echo";
QuestionOptions[2] = "Surface reflection";
QuestionOptions[3] = "Reverberation";
V2Chapter4Questions[5] = new Question("Numerous, persistent reflections of sound are called ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Interferes with";
QuestionOptions[1] = "Completely blocks";
QuestionOptions[2] = "Enhances";
QuestionOptions[3] = "Is louder than";
V2Chapter4Questions[6] = new Question("Ambient noise is sound that ___ the desired message or signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Output device";
QuestionOptions[1] = "Electrical signal";
QuestionOptions[2] = "Processor";
QuestionOptions[3] = "Microphone";
V2Chapter4Questions[7] = new Question("The audio signal ends up in a(n) ___ before being converted back into acoustical energy", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Dynamic";
QuestionOptions[1] = "Condenser";
QuestionOptions[2] = "Electret";
QuestionOptions[3] = "Mic";
V2Chapter4Questions[8] = new Question("The strength of the electrical audio signal from a microphone is called a(n) ___ -level signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Polarized conductor";
QuestionOptions[1] = "Electrical field";
QuestionOptions[2] = "Remote power";
QuestionOptions[3] = "Internal capacitor";
V2Chapter4Questions[9] = new Question("Phantom power is the ___ required to power a condenser microphone.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "XRL";
QuestionOptions[1] = "RXL";
QuestionOptions[2] = "LRX";
QuestionOptions[3] = "XLR";
V2Chapter4Questions[10] = new Question("Typically, what type of connector finishes the shielded twisted-pair cable?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Frequency coordination";
QuestionOptions[1] = "Multiple receivers all tuned to the same frequency";
QuestionOptions[2] = "Using lavalier microphones";
QuestionOptions[3] = "Using IR wireless microphones";
V2Chapter4Questions[11] = new Question("The simultaneous use of multiple wireless microphone systems requires ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Unity gain";
QuestionOptions[1] = "Gain adjustment";
QuestionOptions[2] = "Attenuation";
QuestionOptions[3] = "Signal expansion";
V2Chapter4Questions[12] = new Question("If a technician changes the level of a signal, it is called ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "The equalizer";
QuestionOptions[1] = "Everything";
QuestionOptions[2] = "The audio processor";
QuestionOptions[3] = "The loudspeakers";
V2Chapter4Questions[13] = new Question("The amplifier comes right before ___ in the audio system chain.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A loudspeaker containing multiple drivers";
QuestionOptions[1] = "A loudspeaker enclosure with more than one frequency range";
QuestionOptions[2] = "An electrical frequency dividing network circuit";
QuestionOptions[3] = "A single driver reproducing the entire frequency range";
V2Chapter4Questions[14] = new Question("What is a crossover?", QuestionOptions, QuestionOptions[2]);

var V2CE04 = new Exam("V2CE04", V2Chapter4Questions);

//Chapter 5
let V2Chapter5Questions = [];

QuestionOptions = [];		
QuestionOptions[0] = "Spectrum";
QuestionOptions[1] = "Visibility";
QuestionOptions[2] = "Vectors";
QuestionOptions[3] = "Wavelength";
V2Chapter5Questions[0] = new Question("Light waves are categorized by their ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Lumen";
QuestionOptions[1] = "LED";
QuestionOptions[2] = "Footcandle";
QuestionOptions[3] = "Lux";
V2Chapter5Questions[1] = new Question("Generally, a ___ measurement is taken at a task area like a video sceen.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 Percent";
QuestionOptions[1] = "75 Percent";
QuestionOptions[2] = "50 Percent";
QuestionOptions[3] = "25 Percent";
V2Chapter5Questions[2] = new Question("Perceived illumination decreases by ___ when the distance from a light source is doubled.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Negatively affects the quality of the displayed image";
QuestionOptions[1] = "Does not affect the quality of the displayed image";
QuestionOptions[2] = "Improves the quality of the displayed image";
QuestionOptions[3] = "Complements the quality of the displayed image";
V2Chapter5Questions[3] = new Question("The amount of ambient light in a displayed environment ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Sync; R-Y";
QuestionOptions[1] = "Sync; Y";
QuestionOptions[2] = "Chroma; Y";
QuestionOptions[3] = "Chroma; B-Y";
V2Chapter5Questions[4] = new Question("In the component video signal, the ___ signal is combined with the ___ information.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "S-Video signal";
QuestionOptions[1] = "Digital signal";
QuestionOptions[2] = "Subcarrier channel";
QuestionOptions[3] = "Chrominance";
V2Chapter5Questions[5] = new Question("In composite video, which of the following \"shares\" the luminance space?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflection, curvature, spherical aberration, and dispersion of field";
QuestionOptions[1] = "Reflection, dispersion, spherical aberration, and curvature of field";
QuestionOptions[2] = "Refraction, presentation, spherical aberration, and curvature of field";
QuestionOptions[3] = "Refraction, dispersion, spherical aberration, and curvature of field";
V2Chapter5Questions[6] = new Question("Four factors related to primary optics that influence the quality of the projected image are ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "DVI, HDVI, and DisplayPort";
QuestionOptions[1] = "DMI, HDVI, and DisplayPort";
QuestionOptions[2] = "DVI, HDMI, and DisplayPort";
QuestionOptions[3] = "DMI, HDMI, and DisplayPort";
V2Chapter5Questions[7] = new Question("Three major formats of digital connections are ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Spectrum analyzer";
QuestionOptions[1] = "Frequency analyzer";
QuestionOptions[2] = "Output monitor";
QuestionOptions[3] = "Bandwidth monitor";
V2Chapter5Questions[8] = new Question("To measure the bandwidth of an image, you will need a ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Remissive";
QuestionOptions[1] = "Emissive";
QuestionOptions[2] = "Transmissive";
QuestionOptions[3] = "Reflective";
V2Chapter5Questions[9] = new Question("Rear-screen display applications are considered ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transistor mask";
QuestionOptions[1] = "Polarizer";
QuestionOptions[2] = "Pixel grid";
QuestionOptions[3] = "Resistor network";
V2Chapter5Questions[10] = new Question("LCDs first pass light through a ___, which blocks certain light waves.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Decide if you should use an analog or digital display";
QuestionOptions[1] = "Figure out what type of mount you will need";
QuestionOptions[2] = "Determine the distance of the farthest viewer";
QuestionOptions[3] = "Determine what you want to display";
V2Chapter5Questions[11] = new Question("When selecting a display type, what should be your first step?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Higher; brighter";
QuestionOptions[1] = "Lower; sharper";
QuestionOptions[2] = "Higher; softer";
QuestionOptions[3] = "Lower; brighter";
V2Chapter5Questions[12] = new Question("The ___ the gain number of a screen, the ___ the image.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Blurry only at the image center";
QuestionOptions[1] = "Oversaturation of red and green";
QuestionOptions[2] = "Edge of image in sharp focus";
QuestionOptions[3] = "Fuzzy details";
V2Chapter5Questions[13] = new Question("What quality would the image have if the phase setting of a display needs adjusting?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "L = SH x SW x AF";
QuestionOptions[1] = "L = SH x SW x AH";
QuestionOptions[2] = "L = SH x SA x SF";
QuestionOptions[3] = "L = SH x SW x AS";
V2Chapter5Questions[14] = new Question("The formula for an ANSI lumen rating is ___.", QuestionOptions, QuestionOptions[0]);

var V2CE05 = new Exam("V2CE05", V2Chapter5Questions);

 //Chapter 6
let V2Chapter6Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Bus";
QuestionOptions[1] = "Star";
QuestionOptions[2] = "Application";
QuestionOptions[3] = "Ring";
V2Chapter6Questions[0] = new Question("Which of the following networks connects devices in sequence along a linear path?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "IEEE";
QuestionOptions[1] = "Bus";
QuestionOptions[2] = "Ring";
QuestionOptions[3] = "Ethernet";
V2Chapter6Questions[1] = new Question("What type of network uses packets?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Speeds up";
QuestionOptions[1] = "Stops";
QuestionOptions[2] = "Slows down";
QuestionOptions[3] = "Remains constant";
V2Chapter6Questions[2] = new Question("What happens to the connection speed in a Wi-Fi conenction if the signal strength declines?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "ST";
QuestionOptions[1] = "SC";
QuestionOptions[2] = "Multimode";
QuestionOptions[3] = "Single-mode";
V2Chapter6Questions[3] = new Question("Which of the following is a type of fiber-optic cable identified by its yellow outer jacket?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Network interface";
QuestionOptions[1] = "OSI reference";
QuestionOptions[2] = "Informal data link";
QuestionOptions[3] = "IP";
V2Chapter6Questions[4] = new Question("The ___ model is a guide that assists with conforming network communications and their processes to standards.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Layer 2, the Data Link Layer";
QuestionOptions[1] = "Layer 4, the Transport Layer";
QuestionOptions[2] = "Layer 1, the Physical Layer";
QuestionOptions[3] = "Layer 3, the Network Layer";
V2Chapter6Questions[5] = new Question("In the OSI model, cabling and patchbays are elements of ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transfer Mode";
QuestionOptions[1] = "Baseband";
QuestionOptions[2] = "Digital subscriber line";
QuestionOptions[3] = "MAC";
V2Chapter6Questions[6] = new Question("A ___ address is unique to every device and identifies a network's equipment.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Addresses";
QuestionOptions[1] = "Names";
QuestionOptions[2] = "Routes";
QuestionOptions[3] = "Versions";
V2Chapter6Questions[7] = new Question("IP deals with which of the following on a network?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Three";
QuestionOptions[1] = "Eight";
QuestionOptions[2] = "Six";
QuestionOptions[3] = "One";
V2Chapter6Questions[8] = new Question("An IPv6 address uses ___ groups of four hexadecimal numbers.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Computers";
QuestionOptions[1] = "Gateways";
QuestionOptions[2] = "Devices";
QuestionOptions[3] = "Printers";
V2Chapter6Questions[9] = new Question("Subnet masks can indicate how many ___ are allowed on the network.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "IP address and device name";
QuestionOptions[1] = "Subnet mask and gateway";
QuestionOptions[2] = "Subnet mask and DNS server";
QuestionOptions[3] = "IP address and subnet mask";
V2Chapter6Questions[10] = new Question("What is required to set an IP address manually on a switch?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Gateway";
QuestionOptions[1] = "Virtual private network";
QuestionOptions[2] = "DNS";
QuestionOptions[3] = "DHCP";
V2Chapter6Questions[11] = new Question("Which type of server automatically assigns an IP address to the MAC address during the device's connection to a network?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Unmanaged";
QuestionOptions[1] = "LAN";
QuestionOptions[2] = "Addressing";
QuestionOptions[3] = "Managed";
V2Chapter6Questions[12] = new Question("Which of the following switches just needs to be plugged in and connected to devices?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Bridge";
QuestionOptions[3] = "Router";
V2Chapter6Questions[13] = new Question("A ___ sends packets to different locations on a network and connects to outside networks.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Firewall";
QuestionOptions[3] = "Router";
V2Chapter6Questions[14] = new Question("A ___ controls incoming and outgoing network traffic and determines what will be allowed through based on a set of security rules.", QuestionOptions, QuestionOptions[2]);

var V2CE06 = new Exam("V2CE06", V2Chapter6Questions);

//Chapter7
let V2Chapter7Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Signal flow";
QuestionOptions[1] = "Signal transfer route";
QuestionOptions[2] = "Wires and cables";
QuestionOptions[3] = "Audio and video control";
V2Chapter7Questions[0] = new Question("The path on which signal types travel is called ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Insulation";
QuestionOptions[1] = "Jackets";
QuestionOptions[2] = "Conductors";
QuestionOptions[3] = "Noise";
V2Chapter7Questions[1] = new Question("The purpose of shielding is to prevent ___ from mixing with the signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Cable contains a shield";
QuestionOptions[1] = "Cable contains only one conductor";
QuestionOptions[2] = "Cable contains multiple conductors";
QuestionOptions[3] = "Conductors are insulated";
V2Chapter7Questions[2] = new Question("Which of the following differentiates cable from wire?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Keeping noise from audio and video";
QuestionOptions[1] = "Blocking static";
QuestionOptions[2] = "Preserving the original transmission";
QuestionOptions[3] = "Rejecting interference";
V2Chapter7Questions[3] = new Question("Twisted-pair cable using balanced circuitry can help in ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Wireless";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Fiber";
QuestionOptions[3] = "Cable";
V2Chapter7Questions[4] = new Question("Unless amplified, digital signals generally do not travel as far as ___ signals.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Must have power to operate";
QuestionOptions[1] = "Mix different inputs to a signal output";
QuestionOptions[2] = "Connect multiple inputs simultaneously to one output";
QuestionOptions[3] = "Allow the user to select one input from a number of inputs";
V2Chapter7Questions[5] = new Question("Switchers ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Can connect any of four inputs to any or both of two outputs";
QuestionOptions[1] = "Must have only one output connected at any given time";
QuestionOptions[2] = "Can connect any of two inputs to any or both of four outputs";
QuestionOptions[3] = "Has effectively eight outputs";
V2Chapter7Questions[6] = new Question("A 4x2 matrix switcher ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Identifies";
QuestionOptions[1] = "Elevates";
QuestionOptions[2] = "Protects and organizes";
QuestionOptions[3] = "Cools";
V2Chapter7Questions[7] = new Question("An AV rack is a housing unit that ___ electronic equipment.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "1 foot; 2 to 7 feet";
QuestionOptions[1] = "19 inches; 21 to 25 inches";
QuestionOptions[2] = "25 inches; 19 to 21 inches";
QuestionOptions[3] = "21 inches; 19 to 25 inches";
V2Chapter7Questions[8] = new Question("The inside of a typical AV rack is ___ wide, and the outside varies from ___.", QuestionOptions, QuestionOptions[1]);

var V2CE07 = new Exam("V2CE07", V2Chapter7Questions);

//Chapter 8
let V2Chapter8Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Complicate";
QuestionOptions[1] = "Automate";
QuestionOptions[2] = "Reconfigure";
QuestionOptions[3] = "Simplify";
V2Chapter8Questions[0] = new Question("Remote control systems ___ the operation of an AV system.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "GUIs";
QuestionOptions[1] = "Flip charts";
QuestionOptions[2] = "Wireless touchpanels";
QuestionOptions[3] = "Wall switches";
V2Chapter8Questions[1] = new Question("Which of these is not a common method of interfacing with a control system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Starting a videoconference";
QuestionOptions[1] = "Playing a video";
QuestionOptions[2] = "Dimming the lights and starting a Blu-ray player";
QuestionOptions[3] = "Setting volume levels";
V2Chapter8Questions[2] = new Question("Which of the following is most likely to be a function rather than a macro?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Turning on the lights";
QuestionOptions[1] = "Activating a single function on a device";
QuestionOptions[2] = "Powering on the audio amplifier and display";
QuestionOptions[3] = "Setting a volume level";
V2Chapter8Questions[3] = new Question("Which of the following would most likely be a macro?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Internet gateway";
QuestionOptions[1] = "Network printers";
QuestionOptions[2] = "Hard drive";
QuestionOptions[3] = "Control system CPU";
V2Chapter8Questions[4] = new Question("The purpose of a control system interface is to send instructions to the ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Omnidirectional";
QuestionOptions[1] = "Bidirectional";
QuestionOptions[2] = "Multidirectional";
QuestionOptions[3] = "Unidirectional";
V2Chapter8Questions[5] = new Question("Communication that allows a return message is called ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Increasing the power level of the elctrical circuit";
QuestionOptions[1] = "Reducing the wattage in a current loop";
QuestionOptions[2] = "Increasing resistance in a voltage loop";
QuestionOptions[3] = "Closing or opening an electrical current or voltage loop";
V2Chapter8Questions[6] = new Question("Contact-closure control communication provides device operation by ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Quality of the device";
QuestionOptions[1] = "Strength of the power source";
QuestionOptions[2] = "Shadows and darkness";
QuestionOptions[3] = "Sunlight or fluorescent lighting";
V2Chapter8Questions[7] = new Question("Which of the following can interfere with an IR control?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To control environments at greater distances";
QuestionOptions[1] = "For one-way device communication";
QuestionOptions[2] = "To create IP addresses";
QuestionOptions[3] = "For analog devices";
V2Chapter8Questions[8] = new Question("Ethernet is mainly used in control systems ___.", QuestionOptions, QuestionOptions[0]);

var V2CE08 = new Exam("V2CE08", V2Chapter8Questions);

//Chapter9
let V2Chapter9Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Neutrons";
QuestionOptions[2] = "Watts";
QuestionOptions[3] = "Current";
V2Chapter9Questions[0] = new Question("Voltage is the force that causes ___ to flow through a conductor.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Amperes";
QuestionOptions[1] = "Volts";
QuestionOptions[2] = "Ohms";
QuestionOptions[3] = "Watts";
V2Chapter9Questions[1] = new Question("Current is measured in ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Resistance";
QuestionOptions[2] = "Impedance";
QuestionOptions[3] = "Dissipation";
V2Chapter9Questions[2] = new Question("The opposition to the flow of electrons in AC is called ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Voltage";
QuestionOptions[1] = "Impedance";
QuestionOptions[2] = "Resistance";
QuestionOptions[3] = "Watts";
V2Chapter9Questions[3] = new Question("Power is measured in ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "V = I/R";
QuestionOptions[1] = "I = R/V";
QuestionOptions[2] = "I = V/R";
QuestionOptions[3] = "R = V*I";
V2Chapter9Questions[4] = new Question("The relationship among voltage, current, and resistance is defined by the formula ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Battery";
QuestionOptions[1] = "Load";
QuestionOptions[2] = "Ground";
QuestionOptions[3] = "Source";
V2Chapter9Questions[5] = new Question("A current is always seeking to go to the ___.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Panelboards and service entrances";
QuestionOptions[1] = "Feeders and subpanels";
QuestionOptions[2] = "Branch circuits and feeders";
QuestionOptions[3] = "Service entrances and subpanels";
V2Chapter9Questions[6] = new Question("The main panel distributes power using ___.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Lateral feed";
QuestionOptions[1] = "Feeders";
QuestionOptions[2] = "Main distribution";
QuestionOptions[3] = "Subpanel (panelboard)";
V2Chapter9Questions[7] = new Question("At what point in the AC system are the branch circuits that power wall outlets and AV equipment connected?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 percent";
QuestionOptions[1] = "80 percent";
QuestionOptions[2] = "65 percent";
QuestionOptions[3] = "75 percent";
V2Chapter9Questions[8] = new Question("When planning an electrical system, do not exceed ___ of the capacity of any circuit.", QuestionOptions, QuestionOptions[1]);

var V2CE09 = new Exam("V2CE09", V2Chapter9Questions);

//Chapter10
let V2Chapter10Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "9 kHz to 300 GHz";
QuestionOptions[1] = "No less than 9 kHz";
QuestionOptions[2] = "300 GHz and below";
QuestionOptions[3] = "3 kHz to 300 GHz";
V2Chapter10Questions[0] = new Question("An AC signal of ___ falls into the RF spectrum.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Converts it to be sent out via antenna";
QuestionOptions[1] = "Stores and reads it";
QuestionOptions[2] = "Demodulates it";
QuestionOptions[3] = "Converts it so that it can be translated and received";
V2Chapter10Questions[1] = new Question("What does the transmitter do with its audio, video, and/or data?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Transmission";
QuestionOptions[1] = "Demodulation";
QuestionOptions[2] = "Extraction";
QuestionOptions[3] = "Modulation";
V2Chapter10Questions[2] = new Question("___ is the most important step in converting data in a transmitter.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "VHF";
QuestionOptions[1] = "HF";
QuestionOptions[2] = "VLF";
QuestionOptions[3] = "UHF";
V2Chapter10Questions[3] = new Question("The range of RFs between 300 MHz and 3 GHz is the ___ band.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Have a wavelength closest to its physical length";
QuestionOptions[1] = "Have a wavelength one half the size of the receiving antenna";
QuestionOptions[2] = "Have proper orientation";
QuestionOptions[3] = "Are transmitted within proximity";
V2Chapter10Questions[4] = new Question("An antenna will be most sensitive to transmissions that ___.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Amplify echoes so that the main signal is strengthened";
QuestionOptions[1] = "Find incident and reflected signals that arrive in phase";
QuestionOptions[2] = "Calculate phase differences between signals in order to avoid cancellation";
QuestionOptions[3] = "Eliminate multipath signals that come from the transmitter";
V2Chapter10Questions[5] = new Question("The main function of a diversity receiver is to ___.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "HDTV";
QuestionOptions[1] = "CATV";
QuestionOptions[2] = "MATV";
QuestionOptions[3] = "RFTV";
V2Chapter10Questions[6] = new Question("Which of the following receives broadcast programs from multiple antennas and is redistributed by coaxial or fiber-optic cable?", QuestionOptions, QuestionOptions[1]);

var V2CE10 = new Exam("V2CE10", V2Chapter10Questions);

//Chapter11
let V2Chapter11Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Focusing on what the person is saying";
QuestionOptions[1] = "Summarizing and paraphrasing the person's statements";
QuestionOptions[2] = "Asking frequent questions to guide the conversation to the topic you are interested in discussing";
QuestionOptions[3] = "Maintaining eye contact with the person";
V2Chapter11Questions[0] = new Question("Which of the following is not considered part of \"active listening\"?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Sending the information within an e-mail message";
QuestionOptions[1] = "Sending the client a document containing the information";
QuestionOptions[2] = "Sending the client a fax";
QuestionOptions[3] = "Calling the client on the phone";
V2Chapter11Questions[1] = new Question("What is usually the best approach for communicating detailed technical AV plan information to a client?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Architectural drawings of the building";
QuestionOptions[1] = "Feedback from benchmarking site visits";
QuestionOptions[2] = "End-user descriptions of the tasks and applications the AV system will support";
QuestionOptions[3] = "Client/building owner preferences for AV system equipment";
V2Chapter11Questions[2] = new Question("What is the most valuable source of information when defining the needs for an AV system?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identify the specific equipment needs for the desired AV system";
QuestionOptions[1] = "Determine the overall design of the AV system";
QuestionOptions[2] = "Obtain the client's vision of the AV system design";
QuestionOptions[3] = "Identify the activities that the end users will perform and the functions that the AV system should provide to support these activities";
V2Chapter11Questions[3] = new Question("What is the main purpose of an initial needs analysis?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Provides a starting point from which to determine client needs";
QuestionOptions[1] = "Defines the functionality that the system elements should provide";
QuestionOptions[2] = "Provides a standard design that can be used from most clients";
QuestionOptions[3] = "Provides a standard design template that can be given to the building architect";
V2Chapter11Questions[4] = new Question("How does knowledge of the overall room function assist the AV system designer in defining the client needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To provide overall information about the desired general AV needs";
QuestionOptions[1] = "To define the layout of AV components within a room";
QuestionOptions[2] = "To define the specific AV functions that the components must support";
QuestionOptions[3] = "To define the specific AV components";
V2Chapter11Questions[5] = new Question("How are task parameters used when defining user needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To demonstrate specific AV equipment in operation";
QuestionOptions[1] = "To give the client an opportunity to experience a number of AV system designs that address similar needs";
QuestionOptions[2] = "To test AV system designs";
QuestionOptions[3] = "To evaluate AV vendors prior to final selection of a vendor";
V2Chapter11Questions[6] = new Question("What is the purpose of benchmarking?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "To understand the full range of room features to ensure that the AV system design takes other building systems and components into account";
QuestionOptions[1] = "To evaluate and approve plans to ensure that room elements are compatible with the AV system installation needs";
QuestionOptions[2] = "To be able to use general site plans to determine the layout of the selected AV components";
QuestionOptions[3] = "Detailed building plans for the rooms in which the systems will be installed are typically not required; only a general floor plan is necessary";
V2Chapter11Questions[7] = new Question("Why is it important for the AV professional to obtain a full set of building plans?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The main client contact";
QuestionOptions[1] = "The client technical representative";
QuestionOptions[2] = "Contacts that may be required for site inspection and installation, including the architect, building manager, construction manager, security manager, IT manager, and so on";
QuestionOptions[3] = "All of the above";
V2Chapter11Questions[8] = new Question("What client contact information should be collected during initial client meetings?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To select alternative AV system components that are not affected by the identified constraints";
QuestionOptions[1] = "To inform the client that these constraints must be removed prior to installation tasks";
QuestionOptions[2] = "To develop a work-around plan when these constraints will affect the design or installation tasks";
QuestionOptions[3] = "To eliminate specific tasks that may be adversely impacted by constraints";
V2Chapter11Questions[9] = new Question("How does the AV team use information about any identified constraints to the AV design and installation tasks?", QuestionOptions, QuestionOptions[2]);

var V2CE11 = new Exam("V2CE11", V2Chapter11Questions);

//Chapter12
let V2Chapter12Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The client";
QuestionOptions[1] = "The AHJ";
QuestionOptions[2] = "The client's insurance company";
QuestionOptions[3] = "Your company";
V2Chapter12Questions[0] = new Question("When visiting a client site, the primary work site regulations governing the use of PPE are typically defined by which of the following?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "PPE, such as hard hats, work boots, gloves, and safety glasses";
QuestionOptions[1] = "Tools with nonslip handles";
QuestionOptions[2] = "Approved nonconductive ladders";
QuestionOptions[3] = "Fall protection";
V2Chapter12Questions[1] = new Question("Which of the following is not considered part of the safety equipment that AV technicians should use when working at a work site?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Document the required AV system components for a client";
QuestionOptions[1] = "Document the AV, electrical, and mechanical systems";
QuestionOptions[2] = "Document information about client satisfaction with the AV system";
QuestionOptions[3] = "Document general information about a client and the site that may by relevant for the AV design and installation tasks";
V2Chapter12Questions[2] = new Question("What is a site survey checklist typically used to do?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail ceiling drawing";
QuestionOptions[2] = "Reflected floor plan";
QuestionOptions[3] = "Elevation drawing";
V2Chapter12Questions[3] = new Question("What type of plan drawing depicts the layout of items on the ceiling?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Section drawing";
V2Chapter12Questions[4] = new Question("What type of drawing depicts the ductwork that goes through the building?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Mechanical drawing";
V2Chapter12Questions[5] = new Question("What type of drawing would you use to determine the characteristics of a wall to ascertain the appropriate height and location of a video display?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Section drawing";
QuestionOptions[3] = "Mechanical drawing";
V2Chapter12Questions[6] = new Question("What type of drawing would you use to determine what is behind a wall or above a ceiling that could interfere with your system installation plan?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail drawing";
QuestionOptions[2] = "AV system schematic";
QuestionOptions[3] = "Mechanical drawing";
V2Chapter12Questions[7] = new Question("What drawing would you review to find out exactly how the projector should be mounted to the ceiling?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "NTS";
QuestionOptions[1] = "NCS";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "NIC";
V2Chapter12Questions[8] = new Question("Which abbreviation on a drawing tells you something on the drawing is not consistent with the scale?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "AFF";
QuestionOptions[1] = "FUT";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "NIC";
V2Chapter12Questions[9] = new Question("Which abbreviation, along with a measurement given on a drawing, tells you how high on a wall an interface plate should be installed?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Section drawing";
QuestionOptions[2] = "Electrical drawing";
QuestionOptions[3] = "Structural drawing";
V2Chapter12Questions[10] = new Question("Which type of drawing provides the best information about the ducts and piping in a facility?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "1";
QuestionOptions[1] = "2";
QuestionOptions[2] = "1/2";
QuestionOptions[3] = "None of the above";
V2Chapter12Questions[11] = new Question("On a drawing with a 1:50 scale, 2 centimeters equal how many meters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "24";
QuestionOptions[1] = "8";
QuestionOptions[2] = "16";
QuestionOptions[3] = "None of the above";
V2Chapter12Questions[12] = new Question("On a drawing using a 1/4 scale, 6 inches equal how many feet?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "An interior view of a wall or ceiling structure";
QuestionOptions[1] = "The number of a more detailed drawing that depicts a specific portion of a master drawing";
QuestionOptions[2] = "A drawing that depicts items in great detail, such as equipment mounting plans";
QuestionOptions[3] = "A view of a wall from an angle";
V2Chapter12Questions[13] = new Question("What does a section cut symbol on a drawing indicate?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "25.4 x 10 = 254 mm";
QuestionOptions[1] = "3.94 x 10 = 39.4 mm";
QuestionOptions[2] = "25.4 / 10 = 2.54 mm";
QuestionOptions[3] = "3.94 / 10 = .394 mm";
V2Chapter12Questions[14] = new Question("Which of the following equations allows you to convert a measurement of 10 inches into an equivalent measurement in millimeters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "100 x 25.4 = 2540 in";
QuestionOptions[1] = "100 x 2.54 = 254 in";
QuestionOptions[2] = "100 / 25.4 = 3.94 in";
QuestionOptions[3] = "100 / 2.54 = .394 in";
V2Chapter12Questions[15] = new Question("Which of the following equations allows you to convert a measurement of 100 millimeters into an equivalent measurement in inches?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "30 square feet";
QuestionOptions[1] = "35 square feet";
QuestionOptions[2] = "300 square feet";
QuestionOptions[3] = "3000 square feet";
V2Chapter12Questions[16] = new Question("What is the square footage of a space measuring 15 feet wide by 20 feet long by 10 feet high?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "39 cubic meters";
QuestionOptions[1] = "95 cubic meters";
QuestionOptions[2] = "900 cubic meters";
QuestionOptions[3] = "9000 cubic meters";
V2Chapter12Questions[17] = new Question("What is the cubic footage of a space measuring 15 meters wide by 20 meters long by 3 meters high?", QuestionOptions, QuestionOptions[2]);

var V2CE12 = new Exam("V2CE12", V2Chapter12Questions);

//Chapter13
let V2Chapter13Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Determine if the audience can see and hear the presentation, and determine whether movement within the seating area will be comfortable";
QuestionOptions[1] = "The architect addresses the audience area design, not the AV designer";
QuestionOptions[2] = "Determine if the proposed audience area HVAC and lighting are adequate";
QuestionOptions[3] = "Ensure that the audience seating is placed between 5 feet (1.5 meters) and 25 feet (7.6 meters) from the screen";
V2Chapter13Questions[0] = new Question("What are the main concerns of the AV system designer regarding the audience area?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "If the room location is close enough to run cabling to the AV components";
QuestionOptions[1] = "That the room has a clear sightline to the presenter areas";
QuestionOptions[2] = "If the room meets the required size, power, and HVAC requirements, and provides other services needed for the AV system components";
QuestionOptions[3] = "If the proposed control room design and layout meet government construction standards and requirements";
V2Chapter13Questions[1] = new Question("What is the primary issue the AV designer should examine when evaluating the AV control or projection room area?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Whether the HVAC system will provide sufficient heating and cooling within the audience areas";
QuestionOptions[1] = "Whether the HVAC system will provide sufficient heating and cooling within the control room area";
QuestionOptions[2] = "Whether the HVAC system will interfere with AV system component placement or create excessive noise";
QuestionOptions[3] = "Whether the HVAC system will create electrical interference that impacts AV component operation";
V2Chapter13Questions[2] = new Question("What is the typical primary concern of the AV designer when evaluating the HVAC systems at a client site?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ambient noise and reverberation";
QuestionOptions[1] = "The required loudness level of the AV system";
QuestionOptions[2] = "The optimum locations for AV system loudspeakers";
QuestionOptions[3] = "The audio system needs for the presenter and presenter area within the room";
V2Chapter13Questions[3] = new Question("What is the primary issue that the AV designer should assess when reviewing the acoustic environment at a client site?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "8 feet (2.4 meters)";
QuestionOptions[1] = "16 feet (4.9 meters)";
QuestionOptions[2] = "24 feet (7.3 meters)";
QuestionOptions[3] = "32 feet (9.7 meters)";
V2Chapter13Questions[4] = new Question("A client needs a display system for a room that will be used for inspecting detailed drawings of computer system networks. What is the maximum distance that the viewers should be placed from a 4-foot (1.2 meter) high screen?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "5 feet (1.52 meters)";
QuestionOptions[1] = "6.41 feet (1.95 meters)";
QuestionOptions[2] = "7.12 feet (2.17 meters)";
QuestionOptions[3] = "8.1 feet ( 2.47 meters)";
V2Chapter13Questions[5] = new Question("Based on your review of the client needs, the display should consist of an HD wide-screen flat-panel monitor that is 4 feet high. How wide is the image displayed on this monitor?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ambient noise";
QuestionOptions[1] = "Audience sightlines";
QuestionOptions[2] = "Ambient light";
QuestionOptions[3] = "Projector placement";
V2Chapter13Questions[6] = new Question("Your client is interested in installing a large projection screen in a front lobby area to display images of various projects for promotional purposes. The screen will be installed directly across from a street-level entrance with several windows and a revolving glass door. What should be the primary initial concern of the AV designer regarding the projection system?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Proposed projector location and angle";
QuestionOptions[1] = "Proposed screen material";
QuestionOptions[2] = "Ambient light levels in the room";
QuestionOptions[3] = "Distance between the projector and the screen";
V2Chapter13Questions[7] = new Question("What is the primary factor an AV designer should examine when evaluating the potential to ensure a high contrast ratio for a front-projected image within a room?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "How much power is necessary to operate the AV system components";
QuestionOptions[1] = "What non-AV equipment is on the same panelboard as the AV equipment";
QuestionOptions[2] = "What existing outlets are available for the AV equipment";
QuestionOptions[3] = "All of the above";
V2Chapter13Questions[8] = new Question("The AV designer is evaluating the proposed AC power supply to an AV control room. What issue(s) should the AV designer consider?", QuestionOptions, QuestionOptions[3]);

var V2CE13 = new Exam("V2CE13", V2Chapter13Questions);

//Chapter14
let V2Chapter14Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "To determine the brightness of an image for a particular viewer";
QuestionOptions[1] = "To determine if a viewer can see the smallest items on a screen";
QuestionOptions[2] = "To identify the most appropriate location for a projector";
QuestionOptions[3] = "To determine if the audience has a clear view of the screen";
V2Chapter14Questions[0] = new Question("What is the purpose of a sightline study?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "use lighter-colored finishes on walls";
QuestionOptions[1] = "Use focused task lighting";
QuestionOptions[2] = "Install lighting controls such as dimmers";
QuestionOptions[3] = "Treat windows for light infiltration";
V2Chapter14Questions[1] = new Question("Which of the following is not a recommended approach to minimize ambient light levels within a room?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Minimize noise levels within the room during HVAC operation";
QuestionOptions[1] = "Provide sufficient cooling and heating for audience comfort";
QuestionOptions[2] = "Ensure sufficient cooling to maintain appropriate temperature levels for AV component operation";
QuestionOptions[3] = "Locate HVAC system controls near the AV system control to allow for adjustment during a presentation";
V2Chapter14Questions[2] = new Question("What is the primary concern the AV designer has regarding the design of the building's HVAC system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "AV systems are not affected by building codes";
QuestionOptions[1] = "The layout and design of AV systems are usually strictly regulated via building regulations and codes";
QuestionOptions[2] = "Building regulations and codes often specify the type of electrical wiring that must be used for specfic AV installations";
QuestionOptions[3] = "Building regulations and codes typically specify that a separate technical power system be installed for AV systems";
V2Chapter14Questions[3] = new Question("How do building regulations or codes impact the AV system design?", QuestionOptions, QuestionOptions[2]);

var V2CE14 = new Exam("V2CE14", V2Chapter14Questions);

//Chapter15
let V2Chapter15Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Create the computer software required to control an AV system";
QuestionOptions[1] = "Create detailed design documents depicting the AV system components and installation";
QuestionOptions[2] = "Describe the AV systems necessary to support the defined needs and the general cost of those systems";
QuestionOptions[3] = "Provide a detailed cost quote for the client to approve";
V2Chapter15Questions[0] = new Question("What is the objective of the program phase of AV system design?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identified needs of the end users";
QuestionOptions[1] = "Results of the baseline visits";
QuestionOptions[2] = "Installation capabilities of the general contractor";
QuestionOptions[3] = "Recommendations from the client";
V2Chapter15Questions[1] = new Question("What should the specific AV system capabilities be based on?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Communicate to the decision makers about the overall system's capabilities and budget";
QuestionOptions[1] = "Provide a detailed layout of AV components to the general contractor";
QuestionOptions[2] = "Provide a listing of specific components to be used within the AV system";
QuestionOptions[3] = "Describe the location and layout of AV components within a room";
V2Chapter15Questions[2] = new Question("What is the main objective of an AV program report?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Special issues";
QuestionOptions[1] = "Infrastructure considerations";
QuestionOptions[2] = "System descriptions";
QuestionOptions[3] = "Executive summary";
V2Chapter15Questions[3] = new Question("Which portion of the AV program report should describe the end users who were consulted to determine system requirements?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "System quote";
QuestionOptions[1] = "System estimate";
QuestionOptions[2] = "Opinion of probable cost";
QuestionOptions[3] = "System \"ballpark\"";
V2Chapter15Questions[4] = new Question("Which of the following cost descriptions provides a general budget for the AV system for use within the AV program report?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identifying required AV system components";
QuestionOptions[1] = "Purchasing and installing the AV system components";
QuestionOptions[2] = "Developing more detailed AV system design documents and cost estimates";
QuestionOptions[3] = "Additional discussions of AV needs";
V2Chapter15Questions[5] = new Question("Once approved, what does the AV program report become the basis for?", QuestionOptions, QuestionOptions[2]);

var V2CE15 = new Exam("V2CE15", V2Chapter15Questions);

//Chapter16
let V2Chapter16Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "How the client is going to use the video display system";
QuestionOptions[1] = "The resolution of the video display system";
QuestionOptions[2] = "The size of video displays";
QuestionOptions[3] = "The location of screens";
V2Chapter16Questions[0] = new Question("When designing a video display system, what should be the first consideration of the AV system designer?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The AV designer is concerned with only the display systems within the room.";
QuestionOptions[1] = "The AV designer should ensure that a standard video and audio signal output is available in the control room to allow other users to connect external systems.";
QuestionOptions[2] = "The AV designer should determine the needed monitoring, feeds, and recording requirements, and ensure that they are supported by the system design.";
QuestionOptions[3] = "Accommodating monitoring and feed needs is the responsibility of the AV installation team.";
V2Chapter16Questions[1] = new Question("The AV designer is creating a system for a client who also needs to route video and audio signals to various other locations at the site. At what level should the AV designer consider this need?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "By including a signal switcher in the system design";
QuestionOptions[1] = "By including all potential signal sources in the AV system control room";
QuestionOptions[2] = "By establishing a clear, up-front understanding of the media that the client needs to present";
QuestionOptions[3] = "By providing appropriate system inputs for each type of signal source";
V2Chapter16Questions[2] = new Question("How should the AV design ensure that the AV system addresses the necessary display signal sources?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Minimize the bandwidth of signals transmitted within the system";
QuestionOptions[1] = "Maximize the bandwidth of signals transmitted within the system";
QuestionOptions[2] = "Select components that minimize bandwidth";
QuestionOptions[3] = "Select components that maximize the bandwidth of the entire AV system";
V2Chapter16Questions[3] = new Question("How should an AV system designer address system bandwidth?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Directivity, intelligibility, and consistency";
QuestionOptions[1] = "Intelligibility, frequency response, and headroom";
QuestionOptions[2] = "Loudness, headroom, and frequency response";
QuestionOptions[3] = "Loudness, intelligibility, and stability";
V2Chapter16Questions[4] = new Question("What are the three main performance parameters that an audio system should be designed to achieve?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "The frequency response should be based on the type of applications the audio is intended to support";
QuestionOptions[1] = "The designer should work to achieve a frequency response as wide as possible within the project budget";
QuestionOptions[2] = "The audio system output frequency response should match the frequency reponse of the audio source components";
QuestionOptions[3] = "The audio system frequency response should meet the industry standard or 20Hz to 20kHz";
V2Chapter16Questions[5] = new Question("How should an AV system designer determine the required frequency response of an audio system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "DSP matrix mixer";
QuestionOptions[1] = "Echo canceler";
QuestionOptions[2] = "Crossover";
QuestionOptions[3] = "Compressor";
V2Chapter16Questions[6] = new Question("Which of the following audio processors would a system design specify to enhance the intelligibility fo a videoconferencing system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "2 ohms";
QuestionOptions[1] = "4 ohms";
QuestionOptions[2] = "12 ohms";
QuestionOptions[3] = "32 ohms";
V2Chapter16Questions[7] = new Question("What is the total impedance of a system consisting of three loudspeakers, each with 4 Ohms of impedance, connected in series?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Direct-coupled system";
QuestionOptions[1] = "Constant-voltage system that uses transformers";
QuestionOptions[2] = "Series/parallel wired loudspeaker system";
QuestionOptions[3] = "Low-impedance loudspeaker system";
V2Chapter16Questions[8] = new Question("In audio systems where the loudspeakers are located far from the amplifier, what type of loudspeaker system is typically used?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "dB = 20 log (6 meters/12 meters)";
QuestionOptions[1] = "dB = 20 log (12 meters/6 meters)";
QuestionOptions[2] = "dB = 20 log (6 meters x 12 meters)";
QuestionOptions[3] = "db = 20 log (6 meters + 12 meters)";
V2Chapter16Questions[9] = new Question("As a listener moves away from a sound source, such as a loudspeaker, the sound energy drops. According to the inverse square law, which formula would you use to determine the drop in acoustic energy if the user moved from 6 to 12 meters away from a sound source?", QuestionOptions, QuestionOptions[0]);

var V2CE16 = new Exam("V2CE16", V2Chapter16Questions);

//Chapter17
let V2Chapter17Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "AV equipment, such as projectors, displays, audio, and control systems";
QuestionOptions[1] = "Installation services and assistance, when necessary";
QuestionOptions[2] = "Fabrication of custom components, such as furniture, defined within the proposal";
QuestionOptions[3] = "All of the above";
V2Chapter17Questions[0] = new Question("An AV company that is planning a client system installation typically works with vendors to obtain which of the following?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Request for pricing";
QuestionOptions[1] = "Request for proposal";
QuestionOptions[2] = "References for projects";
QuestionOptions[3] = "Request for products";
V2Chapter17Questions[1] = new Question("When working with a vendor or subcontractor for AV services, what does the abbreviation RFP stand for?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Select local vendors that are based in your city or geographic area";
QuestionOptions[1] = "Select vendors that you have worked with previously on other projects";
QuestionOptions[2] = "Select vendors that advertise only name-brand products";
QuestionOptions[3] = "Select vendors based on information about their capabilities, experience, terms, and value";
V2Chapter17Questions[2] = new Question("What is the typical best practice for selecting potential vendors to bid on providing product and services for your AV project?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Describe the specific project work that you want the vendor to address in as much detail as possible, and ask the vendor to propose a technical approach and cost";
QuestionOptions[1] = "Describe the project needs in general terms that will allow the vendor to be creative when proposing a technical solution and cost";
QuestionOptions[2] = "Send the vendor the relevant portion of your original proposal to your client, and ask the vendor to propose a price for providing that portion of the project";
QuestionOptions[3] = "Send the vendor the relevant portion of your original proposal to your client, along with your proposed pricing, and ask the vendor to agree to complete the work on that portion of the project for the identified price";
V2Chapter17Questions[3] = new Question("When creating an RFP, what is the best approach for describing the work that you want the vendors to address within their proposal?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Select the proposal that provides the lowest cost.";
QuestionOptions[1] = "Select the proposal that provides the best combination of cost, value, and terms.";
QuestionOptions[2] = "Select the proposal that most closely matches the specifications within the RFP";
QuestionOptions[3] = "Select the proposal that has the best technical approach/specifications";
V2Chapter17Questions[4] = new Question("Which of the following best describes the approach for evaluating proposals for products and services from potential vendors?", QuestionOptions, QuestionOptions[1]);

var V2CE17 = new Exam("V2CE17", V2Chapter17Questions);

//Chapter18
let V2Chapter18Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The charge-out rate for labor in each labor category needed to comlete all of the necessary project tasks";
QuestionOptions[1] = "The weekly wage of the average paid staff member in the AV company";
QuestionOptions[2] = "The standard, published labor cost for installing an AV system";
QuestionOptions[3] = "A standard company cost for installing each AV component";
V2Chapter18Questions[0] = new Question("On what is a project labor estimate based?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The invoice for parts and supplies that the AV company sends the client";
QuestionOptions[1] = "The invoice for parts and supplies that the supplier sends the AV company";
QuestionOptions[2] = "A list of equipment, supplies, and materials required for the project";
QuestionOptions[3] = "A list of the equipment, supplies, and materials required for the projet, along with the quantity and cost for each item";
V2Chapter18Questions[1] = new Question("What is a BOM?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "The staff member hourly or weekly wages";
QuestionOptions[1] = "The staff member wages, plus vacation time and taxes";
QuestionOptions[2] = "The staff member wages, plus vacation time, taxes, and other company overhead costs applicable to that person";
QuestionOptions[3] = "The actual total time that the staff member spends working on the project";
V2Chapter18Questions[2] = new Question("What is included in the charge-out rate for labor in a project estimate?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "A copy of the accepted and approved project proposal";
QuestionOptions[1] = "A description of the components of the project, so the vendor will propose products to meet your needs";
QuestionOptions[2] = "A detailed list of all the items you want to purchase for the project, broken out by categories";
QuestionOptions[3] = "A list of the specific items that you want the vendor to provide";
V2Chapter18Questions[3] = new Question("You are interested in getting a bid from a vendor for equipment and supplies for a client AV system installation project. What information do you give the vendor to provide the basis for the bid?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Purchase a large amount of these items at a lower cost per individual item, and keep them in stock in a warehouse until needed for projects";
QuestionOptions[1] = "Purchase only the amount needed for each project, since the client is billed the cost for purchases";
QuestionOptions[2] = "Negotiate an up-front price for the products with a vendor, and purchase only the amount needed for each project";
QuestionOptions[3] = "Combine several individual orders to save on shipping costs";
V2Chapter18Questions[4] = new Question("Your company has several projects that require a large number of standard items, such as connectors, cabling, conduit, etc. What is likely the best approach to obtain items for these projects at the lowest total cost?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To determine if the client received a good value for its funds";
QuestionOptions[1] = "To determine if the AV company made money on the project";
QuestionOptions[2] = "To determine what to charge the client once the project is complete";
QuestionOptions[3] = "To assess the cost of materials and supplies";
V2Chapter18Questions[5] = new Question("What is the main objective of evaluating the cost of completing an AV project?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "To improve project estimates and the project management approach";
QuestionOptions[1] = "To determine if the staff members are working hard enough";
QuestionOptions[2] = "To assess if the project used the proper quality of materials";
QuestionOptions[3] = "To evaluate the work of the AV designer";
V2Chapter18Questions[6] = new Question("How do project managers use information obtained from evaluating the cost of completing an AV project?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To determine if some staff are working hard than others";
QuestionOptions[1] = "To determine what type of work each staff member is performing";
QuestionOptions[2] = "To determine how staff should be scheduled";
QuestionOptions[3] = "To evaluate if each staff member's time is being used as effectively as possible";
V2Chapter18Questions[7] = new Question("What is the purpose of evaluating staff utilization rates?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "It tells the manager which projects were profitable and which ones were not.";
QuestionOptions[1] = "It provides general information about the financial health of the overall company.";
QuestionOptions[2] = "It is provided to the client to show how the project funds were used.";
QuestionOptions[3] = "It is used by the manager to assess the performance of individual AV installers based on the profit made on their projects.";
V2Chapter18Questions[8] = new Question("How does an AV manager use a P&L statement to assess the company's performance?", QuestionOptions, QuestionOptions[1]);

var V2CE18 = new Exam("V2CE18", V2Chapter18Questions);

//Chapter19
let V2Chapter19Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Visible Stray Wires";
QuestionOptions[1] = "Visible Solder";
QuestionOptions[2] = "Removed jacket or insulation";
QuestionOptions[3] = "Crimping";
V2Chapter19Questions[0] = new Question("Which of the following is a sign of an improperly fabricated cable termination?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Voltage test";
QuestionOptions[1] = "Continuity test";
QuestionOptions[2] = "Signal sweep test";
QuestionOptions[3] = "Isolation test";
V2Chapter19Questions[1] = new Question("Which of the following tests should be conducted to evaluate if a termination is properly transmitting a signal?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "An IP address";
QuestionOptions[1] = "A wireless card";
QuestionOptions[2] = "A web address";
QuestionOptions[3] = "A TCP card";
V2Chapter19Questions[2] = new Question("In order to communicate with devices installed onto a TCP/IP network, what must each device have?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The metal rack can shield the receiver from its intended signal";
QuestionOptions[1] = "It relies on line of sight to the signal transmitter";
QuestionOptions[2] = "It operates on different frequencies than its receivers";
QuestionOptions[3] = "It is sensitive to fluorescent light";
V2Chapter19Questions[3] = new Question("What is a drawback of using a rack-mounted RF receiver", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Convection";
QuestionOptions[1] = "Pressurization";
QuestionOptions[2] = "Conditioning";
QuestionOptions[3] = "Evacuation";
V2Chapter19Questions[4] = new Question("Which of the following rack-ventilation methods uses a fan that draws air from the rack?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Separating cables according to signal strength";
QuestionOptions[1] = "Separating components according to signal type";
QuestionOptions[2] = "Running several cables carrying the same signal to separate components";
QuestionOptions[3] = "Splitting composite video signals into component RGB signals";
V2Chapter19Questions[5] = new Question("What does signal separation refer to within a rack layout?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The buildilng's structural support or blocking";
QuestionOptions[1] = "Drywall";
QuestionOptions[2] = "Ceiling";
QuestionOptions[3] = "Any stud in the wall";
V2Chapter19Questions[6] = new Question("When mounting heavy equipment, always mount to which of the following?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Structural engineer";
QuestionOptions[1] = "AV manager";
QuestionOptions[2] = "Mechanical contractor";
QuestionOptions[3] = "Client";
V2Chapter19Questions[7] = new Question("Who should evaluate all mounting plans and advise the installation technician on difficult mounting situations?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The maximum weight of an equipment rack";
QuestionOptions[1] = "The highest intensity a sound system can produce";
QuestionOptions[2] = "The weight at which the item will structurally fail";
QuestionOptions[3] = "The tendency for an equipment rack to tip over";
V2Chapter19Questions[8] = new Question("What is the load limit?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "True";
QuestionOptions[1] = "False";
V2Chapter19Questions[9] = new Question("Roof-mounted HVAC systems may produce vibrations that cause the projector to vibrate and cause an image to appear unfocused.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The locations within the ceiling where the conduit may be run";
QuestionOptions[1] = "The outer diameter of the conduit used for specific applications";
QuestionOptions[2] = "The amount of the inner diameter of a conduit that may be filled with cable";
QuestionOptions[3] = "Conduits must be rated as fireproof when used within ceiling (plenum) spaces";
V2Chapter19Questions[10] = new Question("To what does the permissible area of a conduit refer?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Allows the AV team to brief the presenters or performers on the capabilities of the AV system";
QuestionOptions[1] = "Ensures that the system meets building code or regulation requirements";
QuestionOptions[2] = "Helps the AV team integrate the live AV support with any broadcasting requirements";
QuestionOptions[3] = "Helps the AV installer determine the required equipment and crew resources";
V2Chapter19Questions[11] = new Question("What is the main purpose for reviewing the system design when preparing for providing AV support for a live event?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Its broadcast domain must be segmented on every switch in the network";
QuestionOptions[1] = "You may be limited to whatever addressing scheme the client already uses";
QuestionOptions[2] = "It increases bandwidth overhead by adding an encryption and tunneling wrapper";
QuestionOptions[3] = "You will need to manually set IP addresses for each device";
V2Chapter19Questions[12] = new Question("Why can implementing a VLAN be labor-intensive?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Ensure that all microphones are behind loudspeakers";
QuestionOptions[1] = "Ensure that all microphone cables are no longer than 15 feet (4.5 meters) in length";
QuestionOptions[2] = "Ensure that all microphone cables are taped to the floor";
QuestionOptions[3] = "Mount all microphones on nonconductive stands";
V2Chapter19Questions[13] = new Question("Which of the following objectives should the AV team target when locating microphones for a live event?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "10 feet (3 meters)";
QuestionOptions[1] = "15 feet (4.5 meters)";
QuestionOptions[2] = "20 feet (6 meters)";
QuestionOptions[3] = "30 feet (9 meters)";
V2Chapter19Questions[14] = new Question("How far away from the screen should you place a video projector with a lens ratio of 2.0 to create a 10-foot (3-meter) wide image?", QuestionOptions, QuestionOptions[2]);


var V2CE19 = new Exam("V2CE19", V2Chapter19Questions);

//Chapter20
let V2Chapter20Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The total amount that the client has paid the AV company for the project";
QuestionOptions[1] = "The total cost of purchasing the needed materials and supplies";
QuestionOptions[2] = "The amount of labor and materials the project manager has allocated to complete the project";
QuestionOptions[3] = "The amount of labor and materials the project manager used to successfully complete the project";
V2Chapter20Questions[0] = new Question("Project budget refers to which of the following?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ask the client to agree to a CO that describes the changes to the project agreement and the additional costs.";
QuestionOptions[1] = "Perform the requested additional work in order to ensure that the client is satisfied.";
QuestionOptions[2] = "Never perform any work that was not agreed to within the original work contract.";
QuestionOptions[3] = "Remove another element of the project to keep the final cost the same.";
V2Chapter20Questions[1] = new Question("How should the AV company respond if a client requests changes in the project that end up increasing the cost of completing the project?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "A task that cannot begin before another task is complete";
QuestionOptions[1] = "A task that must be completed by a specific date";
QuestionOptions[2] = "A task that will be required if specific conditions occur at the project site";
QuestionOptions[3] = "An optional task that the client can determine is needed once the project is underway";
V2Chapter20Questions[2] = new Question("What is a dependency within a project task schedule?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The AV team should focus on the AV installation; the project manager is responsible for coordinating work at the project.";
QuestionOptions[1] = "The AV team should review the project schedule; it defines all coordination necessary for the project.";
QuestionOptions[2] = "The AV team should actively communicate and coordinate with the project manager and other vendors to ensure that the AV installation is not impacted by other vendors working on the project.";
QuestionOptions[3] = "The AV team should negotiate work schedules directly with the other vendors.";
V2Chapter20Questions[3] = new Question("Which statement best describes the relationship of the AV installation team with other vendors on the site?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Modification Announcement (MA)";
QuestionOptions[1] = "Construction change directive (CCD)";
QuestionOptions[2] = "Request for change (RFC)";
QuestionOptions[3] = "Progress report (PR)";
V2Chapter20Questions[4] = new Question("Which of the following documents would an AV company submit in the event that a modification in the building design impacted the AV system installation requirements?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Logic network";
QuestionOptions[1] = "Assumptions and risks";
QuestionOptions[2] = "WBS";
QuestionOptions[3] = "Gantt chart";
V2Chapter20Questions[5] = new Question("Which of the following defines project deliverables and relates the elements of work?", QuestionOptions, QuestionOptions[2]);

var V2CE20 = new Exam("V2CE20", V2Chapter20Questions);

//Chapter21
let V2Chapter21Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "When preventive maintenance is provided";
QuestionOptions[1] = "When equipment is updated";
QuestionOptions[2] = "When another company's equipment fails";
QuestionOptions[3] = "All of the above";
V2Chapter21Questions[0] = new Question("The maintenance technician for a system should document which of the following items?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A process for registering the ownership of components";
QuestionOptions[1] = "A process for documenting that the AV system conforms with international standards";
QuestionOptions[2] = "A formal process for testing the elements of the AV system to ensure that they operate as intended";
QuestionOptions[3] = "Officially \"launching\" an AV system with users within the client organization";
V2Chapter21Questions[1] = new Question("In the context of AV system installations, what is the systems performance verification, or commissioning, process?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Systematically test all components to demonstrate that the AV system operates properly";
QuestionOptions[1] = "Allow time to \"burn-in\" components to identify any potential failure points";
QuestionOptions[2] = "Document the delivery and installation of all system components to enable final billing for system installation";
QuestionOptions[3] = "Document how the user should operate the AV system";
V2Chapter21Questions[2] = new Question("What is the objective of commissioning an AV system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To identify appropriate signal levels for each component";
QuestionOptions[1] = "To document the system during the commissioning process";
QuestionOptions[2] = "To calibrate AV system components";
QuestionOptions[3] = "To gain an understanding of overall system operation that will aid in identifying sources of problems";
V2Chapter21Questions[3] = new Question("How does the AV technician use an understanding of system signal flow to ensure proper operation?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Provide a detailed description of system components and operation";
QuestionOptions[1] = "Provide manuals for all system components";
QuestionOptions[2] = "Focus on how to perform basic presentation functions";
QuestionOptions[3] = "Use a schematic of the system to present how the signal flows through the system";
V2Chapter21Questions[4] = new Question("When briefing end users on how to operate the AV system, the AV team should do which of the following?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Shut down system components in any order";
QuestionOptions[1] = "Shut down system components in a specifically defined order";
QuestionOptions[2] = "Turn off all system power at once";
QuestionOptions[3] = "Turn off sources, then processing, then display components";
V2Chapter21Questions[5] = new Question("What is a proper AV system shutdown procedure?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Provide detailed maintenance records that will aid in ongoing maintenance and repair";
QuestionOptions[1] = "Provide a record for client billing purposes";
QuestionOptions[2] = "Determine why a component failed";
QuestionOptions[3] = "Determine warranty coverage of individual components";
V2Chapter21Questions[6] = new Question("What is the main reason for carefully documenting AV system preventive maintenance tasks in a maintenance log?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Give users a higher level of confidence when operating the AV system";
QuestionOptions[1] = "Reduce service calls resulting from user errors";
QuestionOptions[2] = "Reduce the potential for damage due to improper use";
QuestionOptions[3] = "Eliminate the need for AV company maintenance and repair calls";
V2Chapter21Questions[7] = new Question("Which of the following is not an objective of training end users on the operation of the AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Manufacturer manuals for all equipment that contain instructions for its operation";
QuestionOptions[1] = "System design and configuration, including signal paths, to enable a technician to troubleshoot and correct any problems with the system";
QuestionOptions[2] = "Configurations of the control system, including DIP switch settings and IP addresses of individual components";
QuestionOptions[3] = "Operating instructions written for the AV knowledge level of the end user";
QuestionOptions[4] = "All of the above";
V2Chapter21Questions[8] = new Question("AV companies are typically required to provide documentation of the AV system after a project is complete. What is that documentation typically composed of?", QuestionOptions, QuestionOptions[4]);

var V2CE21 = new Exam("V2CE21", V2Chapter21Questions);

//Chapter22
let V2Chapter22Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "System warranty";
QuestionOptions[1] = "Service agreement";
QuestionOptions[2] = "Manufacturer's warranty";
QuestionOptions[3] = "Preventive warranty";
V2Chapter22Questions[0] = new Question("Which of the following types of maintenance agreements commits an AV company to providing ongoing preventive maintenance for a client system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "System warranty";
QuestionOptions[1] = "Service agreement";
QuestionOptions[2] = "Manufacturer's warranty";
QuestionOptions[3] = "Preventive warranty";
V2Chapter22Questions[1] = new Question("When a new AV device fails within the first few weeks after installation, under which type of warranty is the repair typically addressed?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Obtain more information about the problem, such as the symptoms of the system failure";
QuestionOptions[1] = "Locate the detailed system documentation";
QuestionOptions[2] = "Travel to the client site to repair the system";
QuestionOptions[3] = "Contact the manufacturer of the component to assist in troubleshooting";
V2Chapter22Questions[2] = new Question("What is the first step that an AV technician should take when a client reports a problem with an AV system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Replacing system cabling that is causing static within the system";
QuestionOptions[1] = "Upgrading a display to a greater resolution to meet client needs";
QuestionOptions[2] = "Replacing a projector bulb that is nearing the end of its operational life";
QuestionOptions[3] = "Upgrading the programming on a control system to address newly installed components";
V2Chapter22Questions[3] = new Question("Which of the following is an example of preventive maintenance?", QuestionOptions, QuestionOptions[2]);

var V2CE22 = new Exam("V2CE22", V2Chapter22Questions);

//Chapter23
let V2Chapter23Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Determine the possible failure points";
QuestionOptions[1] = "Determine which components are fully operational";
QuestionOptions[2] = "Review a system diagram depicting interconnections and signal flow";
QuestionOptions[3] = "Clearly identify the failure symptoms";
V2Chapter23Questions[0] = new Question("What should be the first step in troubleshooting a failure in an AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A system failure that affects multiple components";
QuestionOptions[1] = "A system failure that is difficult to reproduce";
QuestionOptions[2] = "A disruption in signal flow affecting the system";
QuestionOptions[3] = "A failure of an interface component";
V2Chapter23Questions[1] = new Question("What is an intermittent problem?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Examine the system to determine if the problem is simple to address and gather more information";
QuestionOptions[1] = "Logically divide the system in half, and determine which half has the failure";
QuestionOptions[2] = "Replace the component that has appeared to fail";
QuestionOptions[3] = "Ask the user to further descibe the nature of the problem";
V2Chapter23Questions[2] = new Question("Once the characteristics of the system failure are clearly identified, what is the recommended next step in order to return the system to normal operation?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Test each of the components in the order of signal flow";
QuestionOptions[1] = "Test each of the components beginning at the final output, working backward";
QuestionOptions[2] = "Begin with testing the major functions, and then move to the minor functions";
QuestionOptions[3] = "Logically divide the system in half, and determine which portion has the failure, and then repeat for the failed half";
V2Chapter23Questions[3] = new Question("What is typically the most efficient process for localizing the faulty function within a malfunctioning AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "No, because the users usually understand system operation";
QuestionOptions[1] = "No, because the users are not considered part of the system that has failed";
QuestionOptions[2] = "Yes, because users often do not understand how to properly operate the system, and may have changed settings or performed other actions that caused the failure";
QuestionOptions[3] = "Yes, because user error is typically considered the main cause of AV system failure";
V2Chapter23Questions[4] = new Question("When troubleshooting an AV system, should the AV technician consider user error as a source of the problem?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Change the cord to the microphone";
QuestionOptions[1] = "Test the microphone with a multimeter";
QuestionOptions[2] = "Plug the microphone into a preamp and test";
QuestionOptions[3] = "Swap out the suspect microphone with a new microphone that you know is working and see if the system works properly";
V2Chapter23Questions[5] = new Question("What is the best method to determine if a microphone is the source of a problem?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Brightness set too high";
QuestionOptions[1] = "Fan has failed";
QuestionOptions[2] = "Projector not properly positioned";
QuestionOptions[3] = "Air filters clogged with dust";
V2Chapter23Questions[6] = new Question("Which of the following is not an example of an issue that can cause a video projector to overheat?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Amplifier failure";
QuestionOptions[1] = "Projector failure";
QuestionOptions[2] = "Computer source failure";
QuestionOptions[3] = "Cable/connector failure";
V2Chapter23Questions[7] = new Question("Which of the following is the most likely source of an AV system failure or problem?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Adding compression to the microphone signal chain";
QuestionOptions[1] = "Keeping the microphone as close to the sound source as possible";
QuestionOptions[2] = "Keeping the loudspeakers in front of and as far from the microphones as possible";
QuestionOptions[3] = "Turning down or muting all unused microphones";
V2Chapter23Questions[8] = new Question("Which of the following is not a method of addressing feedback within an audio system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Poor gain structure";
QuestionOptions[1] = "Insufficient compression";
QuestionOptions[2] = "Noise gate thresholds set too low";
QuestionOptions[3] = "Source output gain set too high";
V2Chapter23Questions[9] = new Question("An excessive amount of high-frequency hiss within an audio system is likely due to which of the following situations?", QuestionOptions, QuestionOptions[0]);

var V2CE23 = new Exam("V2CE23", V2Chapter23Questions);

//Chapter24
let V2Chapter24Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The AV company should identify the suppliers and vendors with the lowest current prices.";
QuestionOptions[1] = "The suppliers and vendors often become long-term partners with the AV company in meeting the client needs.";
QuestionOptions[2] = "The AV company should work with only one supplier or vendor to procure the needed goods and services";
QuestionOptions[3] = "The AV company client will usually specify the vendors or suppliers to support the client's project.";
V2Chapter24Questions[0] = new Question("Which of the following statements descibes the typical relationship of an AV company with its suppliers and vendors?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Check in orders as they arrive.";
QuestionOptions[1] = "Ensure the proper amount of warehouse space is available for inventory.";
QuestionOptions[2] = "Ensure that the total value of stock and inventory does not exceed a specific amount.";
QuestionOptions[3] = "Keep track of the equipment and supplies the company has on hand, what is on order, and what is at the client site.";
V2Chapter24Questions[1] = new Question("Which of the following statements best describes how an AV manager should manage stock and inventory?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To identify a specific component and allow an inventory system to check the component in and out of the warehouse and venue site";
QuestionOptions[1] = "To allow the scanner to identify the price of the equipment for rental customers";
QuestionOptions[2] = "To identify the brand of the equipment or components";
QuestionOptions[3] = "To identify in which room the equipment should be placed when it arrives at the venue";
V2Chapter24Questions[2] = new Question("Why does an AV company use a unique bar code or other identifier on an equipment case for rental AV equipment?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Client";
QuestionOptions[1] = "AV company";
QuestionOptions[2] = "End user";
QuestionOptions[3] = "Whoever has taken control of the equipment";
V2Chapter24Questions[3] = new Question("Once equipment leaves the warehouse, who is responsible for ensuring security and preventing theft?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Properly identifying the person taking possession of the equipment from the AV company";
QuestionOptions[1] = "Ensuring that the renter knows how to properly operate the equipment";
QuestionOptions[2] = "Ensuring that the renter knows how to properly transport the equipment";
QuestionOptions[3] = "Ensuring that the renter has hired a security guard to protect the equipment once it has arrived at the site";
V2Chapter24Questions[4] = new Question("What is a key concern when renting AV equipment", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Take courses on state-of-the-art AV techniques at AV industry trade shows";
QuestionOptions[1] = "Obtain and renew a professional certification";
QuestionOptions[2] = "Obtain industry information from a range of sources, including courses, seminars, publications, vendor presentations, and professional certification courses";
QuestionOptions[3] = "Take college-level AV technology courses";
V2Chapter24Questions[5] = new Question("Which of the following best describes the recommended approach to maintaining professional skills and knowledge?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Maintain security via the use of CCTV systems.";
QuestionOptions[1] = "Track system usage, identify system or component failures, and identify tampering.";
QuestionOptions[2] = "Track AV system operation costs.";
QuestionOptions[3] = "Track the type of program materials viewed via the AV system to ensure that inappropriate program materials are blocked.";
V2Chapter24Questions[6] = new Question("Remote-monitoring services for client sites are intended to perform which of the following?", QuestionOptions, QuestionOptions[1]);

var V2CE24 = new Exam("V2CE24", V2Chapter24Questions);

//Chapter25
let V2Chapter25Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Any persons or companies interested in purchasing AV equipment or services";
QuestionOptions[1] = "Persons or companies interested in purchasing AV equipment or services that are within your area of service";
QuestionOptions[2] = "Persons or companies interested in purchasing the types of AV equipment or services in which your compnay has special skills or capabilities";
QuestionOptions[3] = "Business executives who are the decision makers responsible for purchasing AV systems and equipment";
V2Chapter25Questions[0] = new Question("Which of the following best describes the market that your AV business should strive to reach with its marketing campaign?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Integrated market";
QuestionOptions[1] = "Horizontal market";
QuestionOptions[2] = "Vertical market";
QuestionOptions[3] = "Niche market";
V2Chapter25Questions[1] = new Question("An AV company that concentrates on serving the needs of retailers is focusing on which type of market?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "A comparison of the price of your products and services with the competition";
QuestionOptions[1] = "The overall quality of the AV equipment carried by your company";
QuestionOptions[2] = "The overall client rating of your response to the company's RFP";
QuestionOptions[3] = "The elements of your company that give you an advantage over other companies";
V2Chapter25Questions[2] = new Question("What does the term value proposition refer to?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "General project assumptions";
QuestionOptions[1] = "A detailed description of all the components and accessories";
QuestionOptions[2] = "A detailed breakdown of the costs for components, materials, and labor";
QuestionOptions[3] = "A detailed description of the process used for identifying user needs";
QuestionOptions[4] = "Warranty Information";
V2Chapter25Questions[3] = new Question("A proposal for an AV system installation should provide all except which one of the following?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To \"sell\" the client on purchasing the system";
QuestionOptions[1] = "To explain how the costs for the project were estimated";
QuestionOptions[2] = "To identify the needs that the system is intended to address";
QuestionOptions[3] = "To assist the client in making a purchase decision";
V2Chapter25Questions[4] = new Question("What is the recommended role of the AV salesperson when meeting with the client to present a project proposal?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "The AV manager";
QuestionOptions[1] = "The IT manager";
QuestionOptions[2] = "The CEO";
QuestionOptions[3] = "The decision maker identified as ultimately responsible for the AV systems";
V2Chapter25Questions[5] = new Question("Who is the person in the client organization that you should focus on meeting to present your proposal?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "How the proposed system will meet the client needs";
QuestionOptions[1] = "The technical specifications of the AV system";
QuestionOptions[2] = "The pricing of the AV system";
QuestionOptions[3] = "How the AV system was designed";
V2Chapter25Questions[6] = new Question("What should the sales discussion focus on?", QuestionOptions, QuestionOptions[0]);

var V2CE25 = new Exam("V2CE25", V2Chapter25Questions);

//Chapter26
let V2Chapter26Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Determining if the company already has someone in-house who can perform the work";
QuestionOptions[1] = "Identifying the specific job requirements";
QuestionOptions[2] = "Identifying the skills, knowledge, and experience needed by prospective employees";
QuestionOptions[3] = "Determining the required education and certifications for the prospective employee";
V2Chapter26Questions[0] = new Question("What should be the first step in the hiring process?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Describe the job requirements  in as much detail as possible to ensure that the applicant understands the requirements";
QuestionOptions[1] = "Provide only a few details, so that the applicant contacts the company to learn more";
QuestionOptions[2] = "Provide the main details about the position in a manner that \"sells\" the company and position to the prospective employee";
QuestionOptions[3] = "Promote the company in a manner that convinces the applicant that it would make an attractive career choice";
V2Chapter26Questions[1] = new Question("Which of the following best describes how a job advertisement should function?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Only applicants who have previously worked with well-established companies should be selected for an interview";
QuestionOptions[1] = "Reviewers should call current employer and references of applicants to determine if the resume is accurate prior to selecting applicants for interviews";
QuestionOptions[2] = "The reviewers should evaluate candidates against the stated job requirements, and create a short list of qualified candidates to invite for interviews.";
QuestionOptions[3] = "Reviewers should select only candidates whose resumes exactly match the stated job requirements.";
V2Chapter26Questions[2] = new Question("When evaluating resumes of prospective job applicants, how should the reviewers decide who to invite for interviews?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "The interviewers are legally allowed to ask only standard questions that focus on the person's work experience.";
QuestionOptions[1] = "The interview should be an informal process of getting to kow the candidate in order to determine if the candidate's personality will be a fit within the organization.";
QuestionOptions[2] = "Interviewers should focus on technical questions intended to assess the candidate's knowledge of the industry.";
QuestionOptions[3] = "Interviewers should ask a range of prepared questions intended to asses the candidate's knowledge, skills, and work experience, as well as overall personality, behavior, and attitudes.";
V2Chapter26Questions[3] = new Question("Which of the following best describes the interview process?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Once-a-year feedback is used to determine salary increases and promotions.";
QuestionOptions[1] = "Regular specific feedback should be provided to give staff members guidelines for improving performance.";
QuestionOptions[2] = "Feedback should be provided when a complaint is received about an employee.";
QuestionOptions[3] = "Feedback is used to identify areas that require additional training.";
V2Chapter26Questions[4] = new Question("What is the main purpose of providing staff with feedback on job performance?", QuestionOptions, QuestionOptions[1]);

var V2CE26 = new Exam("V2CE26", V2Chapter26Questions);

//THIRD EDITION
//Chapter 3
let V3Chapter3Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Two; one";
QuestionOptions[1] = "One; two";
QuestionOptions[2] = "Zero; one";
QuestionOptions[3] = "One; zero";
V3Chapter3Questions[0] = new Question("In a digital signal, the on state is represented by _, and the off state is represented by _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Analog";
QuestionOptions[1] = "Fluctuating";
QuestionOptions[2] = "Dimmer";
QuestionOptions[3] = "Digital";
V3Chapter3Questions[1] = new Question("A signal that has many varying states is called a(n) _ signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Signals";
QuestionOptions[1] = "Speeds";
QuestionOptions[2] = "States";
QuestionOptions[3] = "Rates";
V3Chapter3Questions[2] = new Question("Bit depth is defined as the number of _ you have in which to describe the value.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Spreadsheets";
QuestionOptions[1] = "Text files";
QuestionOptions[2] = "Financial data";
QuestionOptions[3] = "Audio, video, and images";
V3Chapter3Questions[3] = new Question("Lossy compression is particularly suitable for the transmission of _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A structure of data containment";
QuestionOptions[1] = "A formatting system";
QuestionOptions[2] = "A program that holds data";
QuestionOptions[3] = "A device or processing system that encodes and decodes data";
V3Chapter3Questions[4] = new Question("What is a codec?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Dirty";
QuestionOptions[2] = "Analog";
QuestionOptions[3] = "Clean";
V3Chapter3Questions[5] = new Question("As noise is introduced along a(n) _ signal path, processing circutiry can determine whether the signal is intended to be high or low and then retransmit a solid signal without the imposed noise.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Digital";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Low";
QuestionOptions[3] = "High";
V3Chapter3Questions[6] = new Question("Noise overcomes the signal after many generations of re-amplification of a(n) _ signal.", QuestionOptions, QuestionOptions[1]);


//Chapter4
let V3Chapter4Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Generation";
QuestionOptions[1] = "Compression";
QuestionOptions[2] = "Acoustical";
QuestionOptions[3] = "Propagation";
V3Chapter4Questions[0] = new Question("How sound moves through the air is called _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Number of times a wavelength cycle occurs per second";
QuestionOptions[1] = "Intensity or loudness of a sound in a particular medium";
QuestionOptions[2] = "Physical distance between two points of a waveform that are exactly one cycle apart";
QuestionOptions[3] = "Cycle when molecules move from rest through compression to rest to rarefaction";
V3Chapter4Questions[1] = new Question("Wavelength is the _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "The threshold of human hearing";
QuestionOptions[1] = "Ambient noise level";
QuestionOptions[2] = "The threshold of pain";
QuestionOptions[3] = "Normal listenening level";
V3Chapter4Questions[2] = new Question("Which of the following does 0dB SPL describe?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "+/- 10dB";
QuestionOptions[1] = "+/- 6dB";
QuestionOptions[2] = "+/- 1dB";
QuestionOptions[3] = "+/- 3dB";
V3Chapter4Questions[3] = new Question("A \"just noticeable\" change in sound pressure level, either loud or softer, requires a _ change.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Received; effects; structure";
QuestionOptions[1] = "Produced; propagation; control";
QuestionOptions[2] = "Controlled; delivery; translation";
QuestionOptions[3] = "Produced; amplification; reception";
V3Chapter4Questions[4] = new Question("Acoustics covers how sound is _, and its _ and _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Directional sound";
QuestionOptions[1] = "Echo";
QuestionOptions[2] = "Surface reflection";
QuestionOptions[3] = "Reverberation";
V3Chapter4Questions[5] = new Question("Numerous persistent reflections of sound are called _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Interferes with";
QuestionOptions[1] = "Completely blocks";
QuestionOptions[2] = "Enchances";
QuestionOptions[3] = "Is louder than";
V3Chapter4Questions[6] = new Question("Ambient noise is sound that _ the desired message or signal.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Output device";
QuestionOptions[1] = "Electrical signal";
QuestionOptions[2] = "Processor";
QuestionOptions[3] = "Microphone";
V3Chapter4Questions[7] = new Question("The audio signal ends up in a(n) _ before being converted into acoustical energy.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Dynamic";
QuestionOptions[1] = "Condenser";
QuestionOptions[2] = "Electret";
QuestionOptions[3] = "Mic";
V3Chapter4Questions[8] = new Question("The strength of the electrical audio signal from a microphone is called a(n) _-level signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Polarized conductor";
QuestionOptions[1] = "Electrical field";
QuestionOptions[2] = "Remote power";
QuestionOptions[3] = "Internal capacitor";
V3Chapter4Questions[9] = new Question("Phantom power is the _ required to power a condenser microphone.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "XRL";
QuestionOptions[1] = "RXL";
QuestionOptions[2] = "LRX";
QuestionOptions[3] = "XLR";
V3Chapter4Questions[10] = new Question("Typically, what type of connector finishes the shielded twisted-pair cable?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Frequency coordination";
QuestionOptions[1] = "Multiple receivers all tuned to the same frequency";
QuestionOptions[2] = "Using lavalier microphones";
QuestionOptions[3] = "Using IR wireless microphones";
V3Chapter4Questions[11] = new Question("The simultaneous use of multiple wireless microphone systems requires _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Unity gain";
QuestionOptions[1] = "Gain adjustment";
QuestionOptions[2] = "Attenuation";
QuestionOptions[3] = "Signal expansion";
V3Chapter4Questions[12] = new Question("If a technician changes the level of a signal, it is called _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "The equalizer";
QuestionOptions[1] = "Everything";
QuestionOptions[2] = "The audio processor";
QuestionOptions[3] = "The loudspeakers";
V3Chapter4Questions[13] = new Question("The amplifier comes right before _ in the audio system chain.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A loudspeaker containing multiple drivers";
QuestionOptions[1] = "A loudspeaker enclosure with more than one frequency range";
QuestionOptions[2] = "An electrical frequency dividing network circuit";
QuestionOptions[3] = "A single driver reproducing the entire frequency range";
V3Chapter4Questions[14] = new Question("What is a crossover?", QuestionOptions, QuestionOptions[2]);


//Chapter5
let V3Chapter5Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Spectrum";
QuestionOptions[1] = "Visibility";
QuestionOptions[2] = "Vectors";
QuestionOptions[3] = "Wavelength";
V3Chapter5Questions[0] = new Question("Electromagnetic radiation is categorized by its _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Lumen";
QuestionOptions[1] = "LED";
QuestionOptions[2] = "Foot-candle";
QuestionOptions[3] = "Lux";
V3Chapter5Questions[1] = new Question("Generally, a _ measurement of incident light is take at a task area like a video screen.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 percent";
QuestionOptions[1] = "75 percent";
QuestionOptions[2] = "50 percent";
QuestionOptions[3] = "25 percent";
V3Chapter5Questions[2] = new Question("Illumination decreases by _ when the distance from a light souce is doubled.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Negatively affects the quality of the display image";
QuestionOptions[1] = "Does not affect the quality of the displayed image";
QuestionOptions[2] = "Improves the quality fo the displayed image";
QuestionOptions[3] = "Complements the quality of the displayed image";
V3Chapter5Questions[3] = new Question("The amount of ambient light in a displayed environment _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Contrast ratio";
QuestionOptions[1] = "Horizontal rows and vertical columns of pixels";
QuestionOptions[2] = "Horizontal and vertical sync signals";
QuestionOptions[3] = "Aspect ratio";
V3Chapter5Questions[4] = new Question("The native resolution of display device is defined by its _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "16:9";
QuestionOptions[1] = "15:1";
QuestionOptions[2] = "2.39:1";
QuestionOptions[3] = "80:1";
V3Chapter5Questions[5] = new Question("According to the Projected Image System Contrast Ratio standard, what is the minimum contrast ratio required for viewing full-motion video?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflection, curvature, spherical aberration, and dispersion of field";
QuestionOptions[1] = "Reflection, dispersion, spherical aberration, and curvature of field";
QuestionOptions[2] = "Refraction, presentation, spherical aberration, and curvature of field";
QuestionOptions[3] = "Refraction, dispersion, spherical aberration, and curvature of field";
V3Chapter5Questions[6] = new Question("Four factors related to primary optics that influence the quality of the projected image are _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "DVI, HDVI, and DisplayPort";
QuestionOptions[1] = "DMI, HDVI, and DisplayPort";
QuestionOptions[2] = "DVI, HDMI, and DisplayPort";
QuestionOptions[3] = "DMI, HDMI, and DisplayPort";
V3Chapter5Questions[7] = new Question("Three of the major formats of digital signal connections are _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Spectrum analyzer";
QuestionOptions[1] = "Frequency analyzer";
QuestionOptions[2] = "Output monitor";
QuestionOptions[3] = "Bandwidth monitor";
V3Chapter5Questions[8] = new Question("To measure the bandwidth of an image, you will need a _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Remissive";
QuestionOptions[1] = "Emissive";
QuestionOptions[2] = "Transmissive";
QuestionOptions[3] = "Reflective";
V3Chapter5Questions[9] = new Question("Rear-screen display applications are considered _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transistor mask";
QuestionOptions[1] = "Polarizer";
QuestionOptions[2] = "Pixel grid";
QuestionOptions[3] = "Resistor network";
V3Chapter5Questions[10] = new Question("LCDs first pass light through a _, which blocks certain light waves.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Decide if you should use an analog or digital display";
QuestionOptions[1] = "Figure out what type of mount you will need";
QuestionOptions[2] = "Determine the distance of the farthest viewer";
QuestionOptions[3] = "Determine what you want to display";
V3Chapter5Questions[11] = new Question("When selecting a display type, what should be your first step?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Higher; brigther";
QuestionOptions[1] = "Lower; sharper";
QuestionOptions[2] = "Higher; softer";
QuestionOptions[3] = "Lower; brighter";
V3Chapter5Questions[12] = new Question("The _ the gain number of a projection screen, the _ the image.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Blurry only at the image center";
QuestionOptions[1] = "Oversaturation of red and green";
QuestionOptions[2] = "Edge of image in sharp focus";
QuestionOptions[3] = "Fuzzy details";
V3Chapter5Questions[13] = new Question("What quality would the image have if the phase setting of a display needs adjusting?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "L = SH x SW x AI";
QuestionOptions[1] = "L = SH x SW x AH";
QuestionOptions[2] = "L = SH x SA x SF";
QuestionOptions[3] = "L = SH x SW x AS";
V3Chapter5Questions[14] = new Question("The formula for an ANSI lumen rating is _.", QuestionOptions, QuestionOptions[0]);


//Chapter 6
let V3Chapter6Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Bus";
QuestionOptions[1] = "Star";
QuestionOptions[2] = "Mesh";
QuestionOptions[3] = "Ring";
V3Chapter6Questions[0] = new Question("Which of the following newtork topologies connects devices in sequence along a linear path?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "802.1x";
QuestionOptions[1] = "EIA-485";
QuestionOptions[2] = "IPv6";
QuestionOptions[3] = "802.11";
V3Chapter6Questions[1] = new Question("Which IEEE standard defines Wi-Fi communications methods?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Speeds up";
QuestionOptions[1] = "Stops";
QuestionOptions[2] = "Slows down";
QuestionOptions[3] = "Remains constant";
V3Chapter6Questions[2] = new Question("What happens to the connection speed in a Wi-Fi connection if the signal strength declines?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "ST";
QuestionOptions[1] = "SC";
QuestionOptions[2] = "Multimode";
QuestionOptions[3] = "Single-mode";
V3Chapter6Questions[3] = new Question("Which of the following is a type of fiber-optic cable identified by its yellow outer jacket?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Network interface";
QuestionOptions[1] = "OSI reference";
QuestionOptions[2] = "Informal data link";
QuestionOptions[3] = "Asynchronous transfer mode";
V3Chapter6Questions[4] = new Question("The _ model is a guide that assists with conforming network communications and their processes to standards.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Layer 2, the Data Link layer";
QuestionOptions[1] = "Layer 4, the Transport layer";
QuestionOptions[2] = "Layer 1, the Physical layer";
QuestionOptions[3] = "Layer 3, the Network layer";
V3Chapter6Questions[5] = new Question("In the OSI model, cabling and patchbays are elements of _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Transfer mode";
QuestionOptions[1] = "Baseband";
QuestionOptions[2] = "Digital subscriber line";
QuestionOptions[3] = "MAC";
V3Chapter6Questions[6] = new Question("A _ address is unique to every device and identifies a network's euqipment.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Addresses";
QuestionOptions[1] = "Names";
QuestionOptions[2] = "Routes";
QuestionOptions[3] = "Versions";
V3Chapter6Questions[7] = new Question("IP deals with which of the following on a network?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Three";
QuestionOptions[1] = "Eight";
QuestionOptions[2] = "Six";
QuestionOptions[3] = "One";
V3Chapter6Questions[8] = new Question("An IPv6 address uses _ groups of four hexadecimal numbers.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Computers";
QuestionOptions[1] = "Gatewawys";
QuestionOptions[2] = "Devices";
QuestionOptions[3] = "Printers";
V3Chapter6Questions[9] = new Question("Subnet masks can indicate how many _ are allowed on the network.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "IP address and device name";
QuestionOptions[1] = "Subnet mask and gateway";
QuestionOptions[2] = "Subnet mask and DNS server";
QuestionOptions[3] = "IP Address and subnet mask";
V3Chapter6Questions[10] = new Question("What is required to set an IP address manually on a network?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Gateway";
QuestionOptions[1] = "Virtual private network";
QuestionOptions[2] = "DNS";
QuestionOptions[3] = "DHCP";
V3Chapter6Questions[11] = new Question("Which type of server automatically assigns an IP address to the MAC address during the device's connection to a network?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Unmanaged";
QuestionOptions[1] = "LAN";
QuestionOptions[2] = "Addressing";
QuestionOptions[3] = "Managed";
V3Chapter6Questions[12] = new Question("Which of the following switches just needs to be plugged in and connected to devices?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Bridge";
QuestionOptions[3] = "Router";
V3Chapter6Questions[13] = new Question("A _ sends packets to different locations on a network and connects to outside networks.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Switch";
QuestionOptions[1] = "Gateway";
QuestionOptions[2] = "Firewall";
QuestionOptions[3] = "Router";
V3Chapter6Questions[14] = new Question("A _ controls incoming and outgoing network traffic and determines what will be allowed through based on a set of security rules.", QuestionOptions, QuestionOptions[2]);

//Chapter 7
let V3Chapter7Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Signal flow";
QuestionOptions[1] = "Signal transfer route";
QuestionOptions[2] = "Wires and cables";
QuestionOptions[3] = "Audio and video control";
V3Chapter7Questions[0] = new Question("The path on which signal types travel is called _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Insulation";
QuestionOptions[1] = "Jackets";
QuestionOptions[2] = "Conductors";
QuestionOptions[3] = "Noise";
V3Chapter7Questions[1] = new Question("The purpose of shielding is to prevent _ from mixing with the signal.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Cable contains a shield";
QuestionOptions[1] = "Cable contains only one conductor";
QuestionOptions[2] = "Cable contains multiple conductors";
QuestionOptions[3] = "Conductors are insulated";
V3Chapter7Questions[2] = new Question("Which of the following differentiates cable from wire?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Keeping noise from audio and video";
QuestionOptions[1] = "Blocking static";
QuestionOptions[2] = "Preserving the original transmission";
QuestionOptions[3] = "Rejecting interference";
V3Chapter7Questions[3] = new Question("Twisted-pair cable using balanced circuitry can help in _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Wireless";
QuestionOptions[1] = "Analog";
QuestionOptions[2] = "Fiber";
QuestionOptions[3] = "Cable";
V3Chapter7Questions[4] = new Question("Unless amplified or buffered, digital signals generally do not travel as far as _ signals.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Must have power to operate";
QuestionOptions[1] = "Mix different inputs to a signal output";
QuestionOptions[2] = "Connect multiple inputs simultaneously to one output";
QuestionOptions[3] = "Allow the user to select one input form a number of inputs";
V3Chapter7Questions[5] = new Question("Switchers _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Can connect any of four inputs to one or both of two outputs";
QuestionOptions[1] = "Must have only one output connected at any given time";
QuestionOptions[2] = "Can connect either of two inputs to any or all of four outputs";
QuestionOptions[3] = "has effectively eight outputs";
V3Chapter7Questions[6] = new Question("A 4 x 2 matrix switcher _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Identifies";
QuestionOptions[1] = "Elevates";
QuestionOptions[2] = "Protects and organizes";
QuestionOptions[3] = "Cools";
V3Chapter7Questions[7] = new Question("An AV rack is a housing unit that _ electronic equipment.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "1 foot (305mm); 2 to 7 feet (610mm to 2.13m)";
QuestionOptions[1] = "19 inches (482.6mm); 21 to 25 inches (533 to 635mm)";
QuestionOptions[2] = "25 inches (635mm); 19 to 21 inches (482.6 to 533mm)";
QuestionOptions[3] = "21 inches (533mm_; 19 to 25 inches (482.6 to 635mm)";
V3Chapter7Questions[8] = new Question("The inside of a typical AV rack is _ wide, and the outside varies from _.", QuestionOptions, QuestionOptions[1]);

//Chapter 8

let V3Chapter8Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Complicate";
QuestionOptions[1] = "Automate";
QuestionOptions[2] = "Reconfigure";
QuestionOptions[3] = "Simplify";
V3Chapter8Questions[0] = new Question("Remote control systems _ the operation of an AV system.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "GUIs";
QuestionOptions[1] = "Flip charts";
QuestionOptions[2] = "Wireless touch panels";
QuestionOptions[3] = "Wall switches";
V3Chapter8Questions[1] = new Question("Which of these is not a common method of interfacing with a control system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Starting a videoconference";
QuestionOptions[1] = "Playing a video";
QuestionOptions[2] = "Dimming the lights and starting a media player";
QuestionOptions[3] = "Setting volume levels";
V3Chapter8Questions[2] = new Question("Which of the following is most likely to be a function rather than a program?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Turning on the lights";
QuestionOptions[1] = "Activating a single function on a device";
QuestionOptions[2] = "Powering on the audio amplifier and display";
QuestionOptions[3] = "Setting a volume level";
V3Chapter8Questions[3] = new Question("Which of the following would most likely require a program?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Internet gateway";
QuestionOptions[1] = "Network printers";
QuestionOptions[2] = "Hard drive";
QuestionOptions[3] = "Control system CPU";
V3Chapter8Questions[4] = new Question("The purpose of a control system interface is to send instructions to the _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Omnidirectional";
QuestionOptions[1] = "Bidirectional";
QuestionOptions[2] = "Multidirectional";
QuestionOptions[3] = "Unidirectional";
V3Chapter8Questions[5] = new Question("Communication that allows a return mesasge is called _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Increasing the power level of the electrical circuit";
QuestionOptions[1] = "Reducing the wattage in a current loop";
QuestionOptions[2] = "Increasing resistance in a voltage loop";
QuestionOptions[3] = "Closing or opening an electrical contact";
V3Chapter8Questions[6] = new Question("Contact-closure control communication provides device operation by _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Quality of the device";
QuestionOptions[1] = "Strength of the power source";
QuestionOptions[2] = "Shadows and darkness";
QuestionOptions[3] = "Bright sunshine or fluorescent lighting";
V3Chapter8Questions[7] = new Question("Which of the following can interfere with an IR control?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To control complex systems";
QuestionOptions[1] = "For one-way device communication";
QuestionOptions[2] = "To create IP addresses";
QuestionOptions[3] = "For analog devices";
V3Chapter8Questions[8] = new Question("Ethernet is mainly used in control systems _.", QuestionOptions, QuestionOptions[0]);

//Chapter 9

let V3Chapter9Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Neutrons";
QuestionOptions[2] = "Watts";
QuestionOptions[3] = "Current";
V3Chapter9Questions[0] = new Question("Voltage is the force that causes _ to flow through a conductor.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Amperes";
QuestionOptions[1] = "Volts";
QuestionOptions[2] = "Ohms";
QuestionOptions[3] = "Watts";
V3Chapter9Questions[1] = new Question("Current is measured in _", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Ohms";
QuestionOptions[1] = "Resistance";
QuestionOptions[2] = "Impedance";
QuestionOptions[3] = "Dissipation";
V3Chapter9Questions[2] = new Question("The opposition to the flow of current in an AC circuit is called.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Voltage";
QuestionOptions[1] = "Impedance";
QuestionOptions[2] = "Resistance";
QuestionOptions[3] = "Watts";
V3Chapter9Questions[3] = new Question("Power is measured in _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "V = I/R";
QuestionOptions[1] = "I = R/V";
QuestionOptions[2] = "I = V/R";
QuestionOptions[3] = "R = V*I";
V3Chapter9Questions[4] = new Question("The relationship between voltage, current, and resistance is defined by the formula _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Battery";
QuestionOptions[1] = "Load";
QuestionOptions[2] = "Ground";
QuestionOptions[3] = "Source";
V3Chapter9Questions[5] = new Question("A current is always seeking to return to the _.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Distribution panels and service entrances";
QuestionOptions[1] = "Feeders and distribution panels";
QuestionOptions[2] = "Branch circuits and feeders";
QuestionOptions[3] = "Service entrances and distribution panels";
V3Chapter9Questions[6] = new Question("The main panel distributes power using _.", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Lateral feed";
QuestionOptions[1] = "Feeders";
QuestionOptions[2] = "Main distribution";
QuestionOptions[3] = "Subsidiary distribution panel (panelboard)";
V3Chapter9Questions[7] = new Question("At what point int he AC power system are the branch circuits that power wall outlets and AV equipment connected?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "95 percent";
QuestionOptions[1] = "80 percent";
QuestionOptions[2] = "65 percent";
QuestionOptions[3] = "75 percent";
V3Chapter9Questions[8] = new Question("When planning an electrical system, do not plan to exceed _ of the current capacity of any circuit.", QuestionOptions, QuestionOptions[1]);

//Chapter 10

let V3Chapter10Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "9kHz to 300 GHz";
QuestionOptions[1] = "No less than 9kHz";
QuestionOptions[2] = "300GHz and below";
QuestionOptions[3] = "3kHz to 300GHz";
V3Chapter10Questions[0] = new Question("An AC signal of _ falls into the RF spectrum.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Modulates it to be sent out via an antenna";
QuestionOptions[1] = "Stores and reads it";
QuestionOptions[2] = "Demodulates it";
QuestionOptions[3] = "Converts it so that it can be translated and received";
V3Chapter10Questions[1] = new Question("What does the transmitter do with its incoming signal stream?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Transmission";
QuestionOptions[1] = "Demodulation";
QuestionOptions[2] = "Extraction";
QuestionOptions[3] = "Modulation";
V3Chapter10Questions[2] = new Question("_ is the most important step in converting data in a transmitter.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "VHF";
QuestionOptions[1] = "HF";
QuestionOptions[2] = "VLF";
QuestionOptions[3] = "UHF";
V3Chapter10Questions[3] = new Question("The range of frequencies between 300MHz and 3GHz is the _ band.", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Have a physical length one-quarter of the signal wavelength";
QuestionOptions[1] = "Have a wavelength one-half the size of the receiving antenna";
QuestionOptions[2] = "Have proper orientationn";
QuestionOptions[3] = "Have a mounting close to the ground";
V3Chapter10Questions[4] = new Question("One of the most efficient configurations for a vertical antenna is to _.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Amplify echoes so that the main signal is strengthened";
QuestionOptions[1] = "Find incident and reflected signals that arrive in phase";
QuestionOptions[2] = "Compare phase differences between signals to avoid cancellation";
QuestionOptions[3] = "Eliminate multipath signals that come from the transmitter";
V3Chapter10Questions[5] = new Question("The main function of a diversity receiver is to _.", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "In tropical climates";
QuestionOptions[1] = "In point-to-point communications";
QuestionOptions[2] = "Where wide area coverage is important";
QuestionOptions[3] = "Where the transmitters or receivers are in motion";
V3Chapter10Questions[6] = new Question("Parabolic antennas are ideal for use _.", QuestionOptions, QuestionOptions[1]);

//Chapter 11

let V3Chapter11Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Focusing on what the person is saying";
QuestionOptions[1] = "Summarizing and paraphrasing the person's statements";
QuestionOptions[2] = "Asking frequenct questions to guide the conversation to the topic you are interested in discussing";
QuestionOptions[3] = "Maintaining eye contact with the person";
V3Chapter11Questions[0] = new Question("Which of the following is not considered part of active listening?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Sending the information within an e-mail message";
QuestionOptions[1] = "Sending the client an electronic document containing the information";
QuestionOptions[2] = "Sending a fax message";
QuestionOptions[3] = "Calling the client on the phone";
V3Chapter11Questions[1] = new Question("What is usually the best approach for communicating detailed technical AV plan information to a client?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Architectural drawings of the building";
QuestionOptions[1] = "Feedback from benchmarking site visits";
QuestionOptions[2] = "End-user descriptions of the tasks and applications the AV system will support";
QuestionOptions[3] = "Client/building owner preferences for AV system equipment";
V3Chapter11Questions[2] = new Question("What is the most valuable source of infomration when defining the needs for an AV system?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "To identify the specific equipment needs for the desired AV system";
QuestionOptions[1] = "To determine the overall design of the AV system";
QuestionOptions[2] = "To obtain the client's vision of the AV system design";
QuestionOptions[3] = "To identify the activities that the end users will perform and the functions that the AV system should provide to support these activities";
V3Chapter11Questions[3] = new Question("What is the main purpose of an initial needs analysis?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Provides a starting poitn from which to determine client needs";
QuestionOptions[1] = "Defines the functionality that the system elements should provide";
QuestionOptions[2] = "Provides a standard design that can be used for most clients";
QuestionOptions[3] = "Provides a standard design template that can be given to the building architect";
V3Chapter11Questions[4] = new Question("How does knowledge of the overall room function assist the AV system designer in defining the client needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To provide overall information about the desired general AV needs";
QuestionOptions[1] = "To define the layout of AV components within a room";
QuestionOptions[2] = "To define the specific AV functions that the components must support";
QuestionOptions[3] = "To define the specific AV components";
V3Chapter11Questions[5] = new Question("How are task parameters used when defining user needs?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To demonstrate specific AV equipment in operation";
QuestionOptions[1] = "To give the client an opportunity to experience a number of AV system designs that address similar needs";
QuestionOptions[2] = "To test AV system designs";
QuestionOptions[3] = "To evaluate AV vendors prior to final selection of a vendor";
V3Chapter11Questions[6] = new Question("What is the purpose of benchmarking?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "To understand the full range of room features to ensure that the AV design takes other building systems and components into account.";
QuestionOptions[1] = "To evaluate and approve plans to ensure the room elements are compatible with the AV system installation needs.";
QuestionOptions[2] = "To be able to use general site plans to determine the layout of the selected AV components.";
QuestionOptions[3] = "Detailed building plans for the rooms in which the systems will be installed are typically not required; only a general floor plan is necessary.";
V3Chapter11Questions[7] = new Question("Why is it important for the AV professional to obtain a full set of building plans?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The main client contact";
QuestionOptions[1] = "The client technical representative";
QuestionOptions[2] = "Contacts that may be required for site inspection and installation, including the architect, building manager, construction manager, security manager, IT manager, and so on";
QuestionOptions[3] = "All of the above";
V3Chapter11Questions[8] = new Question("What client contact information should be collected during initial client meetings?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To select alternative AV system components that are not affected by the identified constraints";
QuestionOptions[1] = "To inform the client that these constraints must be removed prior to installation tasks";
QuestionOptions[2] = "To develop a work-around plan when these constraints will affect the design or installation tasks";
QuestionOptions[3] = "To eliminate specific tasks that may be adversely impacted by constraints";
V3Chapter11Questions[9] = new Question("How does the AV team use information about any identified constraints to the AV design and installation tasks?", QuestionOptions, QuestionOptions[2]);

//Chapter 12
let V3Chapter12Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The client";
QuestionOptions[1] = "The AHJ";
QuestionOptions[2] = "The client's insurance company";
QuestionOptions[3] = "Your company";
V3Chapter12Questions[0] = new Question("When visiting a client site, the primary work site regulations governing the use of PPE are typically defined by which of the following?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "PPE, such as hard hats, work boots, gloves, and safety glasses";
QuestionOptions[1] = "Tools with nonslip handles";
QuestionOptions[2] = "Approved nonconductive ladders";
QuestionOptions[3] = "Fall protection";
V3Chapter12Questions[1] = new Question("Which of the following is not considered part of the safety equipment that AV technicians should use when working at a work site?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Document the required AV system components for a client";
QuestionOptions[1] = "Document the AV, electrical, and mechanical systems";
QuestionOptions[2] = "Document the information about client satisfaction with the AV system";
QuestionOptions[3] = "Document general information about a client and the site that may be relevant for the AV design and installation tasks";
V3Chapter12Questions[2] = new Question("What is a site survey checklist tyipcally used to do?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail ceiling drawing";
QuestionOptions[2] = "Reflected floor plan";
QuestionOptions[3] = "Elevation drawing";
V3Chapter12Questions[3] = new Question("What type of plan drawing depicts the layout of items on the ceiling?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Section drawing";
V3Chapter12Questions[4] = new Question("What type of drawing depicts the ductwork that goes through the building?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Detail drawing";
QuestionOptions[3] = "Mechanical drawing";
V3Chapter12Questions[5] = new Question("What type of drawing would you use to determine the characteristics of a wall to ascertain the appropriate height and location of a video display?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Elevation drawing";
QuestionOptions[1] = "Reflected ceiling plan";
QuestionOptions[2] = "Section drawing";
QuestionOptions[3] = "Mechanical drawing";
V3Chapter12Questions[6] = new Question("What type of drawing would you use to determine what is behind a wall or above a ceiling that could interfere with your system installation plan?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Reflected ceiling plan";
QuestionOptions[1] = "Detail drawing";
QuestionOptions[2] = "AV system schematic";
QuestionOptions[3] = "Mechanical drawing";
V3Chapter12Questions[7] = new Question("What drawing would you review to find out exactly how the projector should be mounted to the ceiling?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "NTS";
QuestionOptions[1] = "NCS";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "NIC";
V3Chapter12Questions[8] = new Question("Which abbreviation on a drawing tells you something on the drawing is not consistent with the scale?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "NIC";
QuestionOptions[1] = "FUT";
QuestionOptions[2] = "SCN";
QuestionOptions[3] = "AFF";
V3Chapter12Questions[9] = new Question("Which abbreviation, along with a measurement given on a drawing, tells you how high on a wall an interface plate should be installed?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Mechanical drawing";
QuestionOptions[1] = "Section drawing";
QuestionOptions[2] = "Electrical drawing";
QuestionOptions[3] = "Structural drawing";
V3Chapter12Questions[10] = new Question("Which type of drawing provides the best infomration about the ducts and piping in a facility?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "1";
QuestionOptions[1] = "2";
QuestionOptions[2] = "1/2";
QuestionOptions[3] = "None of the above";
V3Chapter12Questions[11] = new Question("On a drawing with a 1:50 scale, 20 centimeters equal how many meters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "24";
QuestionOptions[1] = "8";
QuestionOptions[2] = "16";
QuestionOptions[3] = "None of the above";
V3Chapter12Questions[12] = new Question("On a drawing using a 1/4 scale, 6 inches equal how many feet?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "A sectional view through part of the structure";
QuestionOptions[1] = "The number of a more detailed drawing that depicts a specific portion of a master drawing";
QuestionOptions[2] = "A drawing that depicts items in great detail, such as equipment mounting plans";
QuestionOptions[3] = "A view of a wall from an angle";
V3Chapter12Questions[13] = new Question("What does a section cut symbol on a drawing indicate?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "25.4 x 10 = 254mm";
QuestionOptions[1] = "3.94 x 10 = 39.4mm";
QuestionOptions[2] = "25.4 / 10 = 2.54mm";
QuestionOptions[3] = "3.94 / 10 = 0.394mm";
V3Chapter12Questions[14] = new Question("Which of the following equations allows you to convert a measurement of 10 inches into an equivalent measurement in millimeters?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "100 x 25.4 = 2540in";
QuestionOptions[1] = "100 x 2.54 = 254in";
QuestionOptions[2] = "100 / 25.4 = 3.94in";
QuestionOptions[3] = "100 / 2.54 = 0.394in";
V3Chapter12Questions[15] = new Question("Which of the following equations allows you to convert a measurement of 100 millimeters into an equivalent measurement in inches?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "30 square feet";
QuestionOptions[1] = "35 square feet";
QuestionOptions[2] = "300 square feet";
QuestionOptions[3] = "3000 square feet";
V3Chapter12Questions[16] = new Question("What is the area of a space measuring 15 feet wide by 20 feet long by 10 feet high?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "39 cubic meters";
QuestionOptions[1] = "95 cubic meters";
QuestionOptions[2] = "900 cubic meters";
QuestionOptions[3] = "9000 cubic meters";
V3Chapter12Questions[17] = new Question("What is the volume of a space measuring 15 meters wide by 20 meters long by 3 meters high?", QuestionOptions, QuestionOptions[2]);

//Chapter 13
let V3Chapter13Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Determine whether the audience can see and hear the presentation, and determine whether movement within the seating area will be comfortable.";
QuestionOptions[1] = "The architect adddresses the audience area design, not the AV designer.";
QuestionOptions[2] = "Determine whether the proposed audience area HVAC and lighting are adequate.";
QuestionOptions[3] = "Ensure that the audience seating is placed between 5 feet (1.5 meters) and 25 feet (7.6 meters) from the screen.";
V3Chapter13Questions[0] = new Question("What are the main concerns of the AV system designer regarding the audience area?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "If the room location is close enough to run cabling to the AV components";
QuestionOptions[1] = "That the room has a clera sightline to the presenter areas";
QuestionOptions[2] = "If the room meets the required size, poewr, and HVAC requirements, and provides other services needed for the AV system components";
QuestionOptions[3] = "If the proposed control room design and layout meet government construction standards and requirements";
V3Chapter13Questions[1] = new Question("What is the primary issue the AV designer should examine when evaluating the AV control or projection room area?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Whether the HVAC system will provide sufficient heating and cooling within the audience areas";
QuestionOptions[1] = "Whether the HVAC system will provide sufficient heating and cooling with the control room area";
QuestionOptions[2] = "Whether the HVAC system will interfere with AV system component placement or create excessive noise";
QuestionOptions[3] = "Whether the HVAC system will create electrical interference that impacts AV component operation";
V3Chapter13Questions[2] = new Question("What is the typical primary concern of the AV designer when evaluating the HVAC systems at a client site?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ambient noise and reverberation";
QuestionOptions[1] = "The required loudness level of the AV system";
QuestionOptions[2] = "The optimum locations for AV system loudspeakers";
QuestionOptions[3] = "The audio system needs for the presenter and presenter area within the room";
V3Chapter13Questions[3] = new Question("What is the primary issue that the AV designer should assess when reviewing the acoustic environment at a client site?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Projected image system contrast ratio (PISCR)";
QuestionOptions[1] = "Analytical decision-making (ADM)";
QuestionOptions[2] = "Basic decision-making (BDM)";
QuestionOptions[3] = "Passive viewing";
V3Chapter13Questions[4] = new Question("A client needs a display system for a room that will be used for inspecting detailed drawings of cimputer system networks. Which of the onlin DISCAS tools should be used to make the calculations for screen size, viewer distance, and content size?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "5 feet (1.52 meters)";
QuestionOptions[1] = "6.41 feet (1.95 meters)";
QuestionOptions[2] = "7.11 feet (2.17 meters)";
QuestionOptions[3] = "8.1 feet (2.47 meters)";
V3Chapter13Questions[5] = new Question("Based on your review of the client needs, the display should consist of an HD wide-screen flat-panel display that is 4 feet hgih. How wide is the image displayed on this monitor?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ambient noise";
QuestionOptions[1] = "Audience sightlines";
QuestionOptions[2] = "Ambient light";
QuestionOptions[3] = "Projector placement";
V3Chapter13Questions[6] = new Question("Your client is interested in installing a large projection screen in a front lobby area to display images of various projects for promotional purposes. The screen will be installed directly across from a street-level entrance with several winsows and a revolving glass door. What should be the primary initial concern of the AV designer regarding the projection system?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Proposed projector location and angle";
QuestionOptions[1] = "Proposed screen material";
QuestionOptions[2] = "Ambient light levels in the room";
QuestionOptions[3] = "Distance between the projector and the screen";
V3Chapter13Questions[7] = new Question("What is the primary factor an AV designer should examine when evaluating the potential to ensure a high contrast ratio for a front-projected image within a room?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "How much power is necessary to operate the AV system components";
QuestionOptions[1] = "What non-AV equipment is on the sane distribution board as the AV equipment";
QuestionOptions[2] = "What existing outlets are available for the AV equipment";
QuestionOptions[3] = "All of the above";
V3Chapter13Questions[8] = new Question("The AV designer is evaluating the proposed AC power supply to an AV control room. What issue(s) should the AV designer consider?", QuestionOptions, QuestionOptions[3]);

//Chapter 14
let V3Chapter14Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "To determine the brightness of an image for a particular viewer";
QuestionOptions[1] = "To determine whether a viewer can see the smallest items on a screen";
QuestionOptions[2] = "To identify the most appropriate location for a projector";
QuestionOptions[3] = "To determine whether the audience has a clear view of the screen";
V3Chapter14Questions[0] = new Question("What is the purpose of a sightline study?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Use lighter-colored finishes on walls";
QuestionOptions[1] = "Use focused task lighting";
QuestionOptions[2] = "Install lighting controls such as dimmers";
QuestionOptions[3] = "Treat windows for light infiltration";
V3Chapter14Questions[1] = new Question("Which of the following is not a recommended approach to minimize ambient light levels within a room?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Minimize noise levels within the room during HVAC operation";
QuestionOptions[1] = "Provide sufficient cooling and heating for audience comfort";
QuestionOptions[2] = "Ensure sufficient cooling to maintain appropriate temperature levels for AV component operation";
QuestionOptions[3] = "Locate HVAC system controls near the AV system control to allow for adjustment during a presentation";
V3Chapter14Questions[2] = new Question("What is the primary concern the AV designer has regarding the design of the building's HVAC system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "AV systems are not affected by building codes.";
QuestionOptions[1] = "The layout and design of AV systems are usually strictly regulated via building regulations and codes.";
QuestionOptions[2] = "Building regulations and codes often specify the type of electrical wiring that must be used for specific AV installations.";
QuestionOptions[3] = "Building regulations and codes tyipcally specify that a separate technical power system be installed for AV systems.";
V3Chapter14Questions[3] = new Question("How do building regulations or codes impact the AV system design?", QuestionOptions, QuestionOptions[2]);

//Chapter 15
let V3Chapter15Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Create the computer software required to control an AV system";
QuestionOptions[1] = "Create detailed design documents depicting the AV system components and installation";
QuestionOptions[2] = "Describe the AV systems necessary to support the defined needs and the general cost of those systems";
QuestionOptions[3] = "Provide a detailed cost quote for the client to approve";
V3Chapter15Questions[0] = new Question("What is the objective of the program phase of AV system design?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identified needs of the end users";
QuestionOptions[1] = "Results fo the baseline visits";
QuestionOptions[2] = "Installation capabilities of the general contractor";
QuestionOptions[3] = "Recommendations from the client";
V3Chapter15Questions[1] = new Question("What should the specific AV system capabilities be based on?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Communicate to the decision-makers about the overall system's capabilities and budget";
QuestionOptions[1] = "Provide a detailed layout of AV components to the general contractor";
QuestionOptions[2] = "Provide a listing of specific components to be used within the AV system";
QuestionOptions[3] = "Describe the location and layout of AV components within a room";
V3Chapter15Questions[2] = new Question("What is the main objective of an AV concept design/program report?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Special issues";
QuestionOptions[1] = "Infrastructure considerations";
QuestionOptions[2] = "System descriptions";
QuestionOptions[3] = "Executive summary";
V3Chapter15Questions[3] = new Question("Which portion of the AV concept design/program report should describe the end users who were consulted to determine system requirements?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "System quote";
QuestionOptions[1] = "System estimate";
QuestionOptions[2] = "Opinion of probable cost";
QuestionOptions[3] = "System 'ballpark'";
V3Chapter15Questions[4] = new Question("Which of the following cost descriptions provides a general budget for the AV system for use within the AV concept design/program report?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Identifying required AV system components";
QuestionOptions[1] = "Purchasing and installing the AV system components";
QuestionOptions[2] = "Developiong more detailed AV system design documents and cost estimates";
QuestionOptions[3] = "Additional discussions of AV needs";
V3Chapter15Questions[5] = new Question("Once approved, what does the AV concept design/program report become the basis for?", QuestionOptions, QuestionOptions[2]);

//Chapter 16

let V3Chapter16Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "How the client is going to use the video display system";
QuestionOptions[1] = "The resolution of the video display system";
QuestionOptions[2] = "The size of video displays";
QuestionOptions[3] = "The location of screens";
V3Chapter16Questions[0] = new Question("When designing a video display system, what should be the first consideration of the AV system designer?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The AV designer is concerned with only the display systems within the room.";
QuestionOptions[1] = "The AV designer should ensure that a standard video and audio signal output is available in the control room to allow other users to connect external systems.";
QuestionOptions[2] = "The AV designer should determine the needed monitoring, feeds, and recording requirements, and ensure that they are supported by the system design.";
QuestionOptions[3] = "Accommodating monitoring and feed needs is the responsibility fo the AV installation team.";
V3Chapter16Questions[1] = new Question("The AV designer is creating a system for a client who also needs to route video and audio signals to various other locations at the site. At what level should the AV designer consider this need?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "By including a signal switcher in the system design";
QuestionOptions[1] = "By including all potential signal sources in the AV system control room";
QuestionOptions[2] = "By establishing a clear, up-front understanding of the media that the client needs to present";
QuestionOptions[3] = "By providing appropriate system inputs for each type of signal source";
V3Chapter16Questions[2] = new Question("How should the AV designer ensure that the AV system addresses the necessary display signal sources?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Minimize the bandwidth of signals transmitted within the system";
QuestionOptions[1] = "Maximize the bandwidth of signals transmitted within the system";
QuestionOptions[2] = "Select components that minimize bandwidth";
QuestionOptions[3] = "Select components the maximize the bandwidth of the entire AV system";
V3Chapter16Questions[3] = new Question("How should an AV system designer address system bandwidth?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Directivity, intelligibility, and consistency";
QuestionOptions[1] = "Intelligibility, frequency respose, and headroom";
QuestionOptions[2] = "Loudness, headroom, and frequency response";
QuestionOptions[3] = "Loudness, intelligibility, and stability";
V3Chapter16Questions[4] = new Question("What are the three main performance parameters that an audio system should be designed to achieve?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "The frequency response should be based on the type of applications the audio is intended to support.";
QuestionOptions[1] = "The designer should work to acieve a frequency response as wide as possible with the project budget.";
QuestionOptions[2] = "The audio system output frequency response should match the frequency response of the audio source components.";
QuestionOptions[3] = "The audio system frequency response should meet the industry standard of 20Hz to 20kHz.";
V3Chapter16Questions[5] = new Question("How should an AV system designer determine the require frequency response of an audio system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "DSP matrix mixer";
QuestionOptions[1] = "Echo canceler";
QuestionOptions[2] = "Crossover";
QuestionOptions[3] = "Compressor";
V3Chapter16Questions[6] = new Question("Which of the following audio processors would a system design specify to enhance the intelligibility of a videoconferencing system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "2 ohms";
QuestionOptions[1] = "4 ohms";
QuestionOptions[2] = "12 ohms";
QuestionOptions[3] = "32 ohms";
V3Chapter16Questions[7] = new Question("What is the total impedance of a system consisting of three loudspeakers, each with 4 ohms of impedance, connected in series?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Direct-coupled system";
QuestionOptions[1] = "Constant-voltage system that uses transformers";
QuestionOptions[2] = "Series/parallel wired loudspeaker system";
QuestionOptions[3] = "Low-impedance loudspeaker system";
V3Chapter16Questions[8] = new Question("In audio systems where the loudspeakers are located far from the amplifier, what type of loudspeaker system is tyipcally used?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "dB = 20log(6 meters/12 meters)";
QuestionOptions[1] = "dB = 20log(12 meters/6 meters)";
QuestionOptions[2] = "dB = 20log(6 meters x 12 meters)";
QuestionOptions[3] = "dB = 20log(6 meters = 12 meters)";
V3Chapter16Questions[9] = new Question("As a listneer moves away from a sound source, such as a loudspeaker, the sound energy drops. According to the inverse square law, which formula would you use to determine the drop in acoustic energy if the user moved from 6 to 12 meters away from a sound source?", QuestionOptions, QuestionOptions[0]);

//Chapter 17

let V3Chapter17Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Visible stray wires";
QuestionOptions[1] = "Visible solder";
QuestionOptions[2] = "Removed jacket or insulation";
QuestionOptions[3] = "Crimping";
V3Chapter17Questions[0] = new Question("Which of the following is a sign of an improperly fabricated cable termination?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Voltage test";
QuestionOptions[1] = "Continuity test";
QuestionOptions[2] = "Signal sweep test";
QuestionOptions[3] = "Isolation test";
V3Chapter17Questions[1] = new Question("Which of the following tests should be conducted to evaluate whether a termination is properly transmitting a signal?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "An IP address";
QuestionOptions[1] = "A wireless card";
QuestionOptions[2] = "A web address";
QuestionOptions[3] = "A TCP card";
V3Chapter17Questions[2] = new Question("To communicate with devices installed onto a TCP/IP network, what must each device have?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The metal rack can shield the receiver from its intended signal.";
QuestionOptions[1] = "It relies on line of sight to the signal transmitter.";
QuestionOptions[2] = "It operates on different frequencies than its receivers.";
QuestionOptions[3] = "It is sensitive to fluorescent light.";
V3Chapter17Questions[3] = new Question("What is a drawback of using a rack-mounted RF receiver?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Convection";
QuestionOptions[1] = "Pressurization";
QuestionOptions[2] = "Conditioning";
QuestionOptions[3] = "Evacuation";
V3Chapter17Questions[4] = new Question("Which of the following rack-ventilation methods uses a fan that draws air from the rack?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Separating cables according to signal strength";
QuestionOptions[1] = "Separating components according to signal type";
QuestionOptions[2] = "Running several cables carrying the same signal to separate components";
QuestionOptions[3] = "Splitting composite video signals into component RGB signals";
V3Chapter17Questions[5] = new Question("What does signal separation refer to within a rack layout?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The building's structural support or blocking";
QuestionOptions[1] = "Drywall";
QuestionOptions[2] = "Ceiling";
QuestionOptions[3] = "Any stud in the wall";
V3Chapter17Questions[6] = new Question("When mounting heavy equipment, always mount to which of the following?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Structural engineer";
QuestionOptions[1] = "AV manager";
QuestionOptions[2] = "Mechanical contractor";
QuestionOptions[3] = "Client";
V3Chapter17Questions[7] = new Question("Who should evaluate all mounting plans and advice the installation technician on difficult mounting situations?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The maximum weight of an equipment rack";
QuestionOptions[1] = "The highest intensity a sound system can produce";
QuestionOptions[2] = "The weight at which the item will structurally fail";
QuestionOptions[3] = "The tendency for an equipment rack to tip over";
V3Chapter17Questions[8] = new Question("What is the load limit?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "True";
QuestionOptions[1] = "False";
V3Chapter17Questions[9] = new Question("Roof-mounted HVAC systems may produce vibrations that cause the projector to vibrate and cause an image to appear unfocused.", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The locations within the ceiling where the conduit may be run";
QuestionOptions[1] = "The outer diameter of the conduit used for specific applications";
QuestionOptions[2] = "The amount of the inner diameter of a conduit that may be filled with cable";
QuestionOptions[3] = "Conduits must be rated as fireproof when used within ceiling (plenum) spaces";
V3Chapter17Questions[10] = new Question("To what does the permissible area of a conduit refer?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Allows the AV team to brief the presenters or performers on the capabilities of the AV system";
QuestionOptions[1] = "Ensures that the system meets building code or regulation requirements";
QuestionOptions[2] = "Helps the AV team integrate the live AV support with any broadcasting requirements";
QuestionOptions[3] = "Helps the AV installer determine the required equipment and crew resources";
V3Chapter17Questions[11] = new Question("What is the main purpose for reviewing the system design when preparing for providing AV support for a live event?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Its broadcast domain must be segmented on every switch in the network.";
QuestionOptions[1] = "You may be limited to whatever addressing scheme the client already uses.";
QuestionOptions[2] = "It increases bandwidth overhead by adding an ecryption and tunneling wrapper.";
QuestionOptions[3] = "You will need to manually set UP addresses for each device.";
V3Chapter17Questions[12] = new Question("Why can implementing a VLAN be labor-intensive?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Ensure that all microphones are behind loudspeakers";
QuestionOptions[1] = "Ensure that all microphone cables are no longer than 15 feet (4.5 meters) in length";
QuestionOptions[2] = "Ensure that all microhpone cables are taped to the floor";
QuestionOptions[3] = "Mount all microphones on nonconductive stands";
V3Chapter17Questions[13] = new Question("Which of the following objectives should the AV team target when locating microphones for a live event?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "3 meters (10 feet)";
QuestionOptions[1] = "4.5 meters (15 feet)";
QuestionOptions[2] = "6 meters (20 feet)";
QuestionOptions[3] = "9 meters (30 feet)";
V3Chapter17Questions[14] = new Question("How far away from the screen should you place a video projector with a lens ratio of 2.0 to create an image 3 meters (10 feet) wide?", QuestionOptions, QuestionOptions[2]);

//Chapter 18

let V3Chapter18Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "When preventive maintenance is provided.";
QuestionOptions[1] = "When equipment is updated";
QuestionOptions[2] = "When another company's equipment fails";
QuestionOptions[3] = "All of the above";
V3Chapter18Questions[0] = new Question("The maintenance technician for a system should document which of the following items?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A process for registering the ownership of components";
QuestionOptions[1] = "A process for documenting that the AV system conforms with international standards";
QuestionOptions[2] = "A formal process for testing the elements of the AV system to ensure that they operate as intended";
QuestionOptions[3] = "Officially \"launching\" an AV system with users within the client organization";
V3Chapter18Questions[1] = new Question("In the context of AV system installations, what is the systems performance verification, or commissioning, process?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "To systematically test all components to demonstrate that the AV system operates properly";
QuestionOptions[1] = "To allow time to \"burn in\" components to identify any potential failure points";
QuestionOptions[2] = "To document the delviery and installation of all system components to enable final billing for system installation";
QuestionOptions[3] = "To document how the user should operate the AV system";
V3Chapter18Questions[2] = new Question("What is the objective of commissioning an AV system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To identify appropriate signal levels for each component";
QuestionOptions[1] = "To document the system during the commissioning process";
QuestionOptions[2] = "To calibrate AV system components";
QuestionOptions[3] = "To gain an understanding of overall system operation that will aid in identifying sourecs of problems";
V3Chapter18Questions[3] = new Question("How does the AV technician use an understanding of system signal flow to ensure proper operation?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Provide a detailed description of system components and operation";
QuestionOptions[1] = "Provide manuals for all system components";
QuestionOptions[2] = "Focus on how to perform basic presentation functions";
QuestionOptions[3] = "Use a schematic of the system to present how the signal flows through the system";
V3Chapter18Questions[4] = new Question("When briefing end users on how to operate the AV system, the AV team should do which of the following?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Shut down the system components in any order";
QuestionOptions[1] = "Shut down system components in a specifically defined order";
QuestionOptions[2] = "Turn off all system power at once";
QuestionOptions[3] = "Turn off sources, then processing, the display components";
V3Chapter18Questions[5] = new Question("What is a proper AV system shutdown procedure?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Provide detailed maintenance records that will aid in ongoing maintenance and repair";
QuestionOptions[1] = "Provide a record for client billing purposes";
QuestionOptions[2] = "Determine why a component failed";
QuestionOptions[3] = "Determine warranty coverage of individual components";
V3Chapter18Questions[6] = new Question("What is the main reason for carefully documenting AV system preventive maintenance tasks in a maintenance log?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "To give users a higher level of confidence when operating the AV system";
QuestionOptions[1] = "To reduce service calls resulting from user errors";
QuestionOptions[2] = "To reduce the potential for damage due to improper use";
QuestionOptions[3] = "To eliminate the need for AV company maintenance and repair calls";
V3Chapter18Questions[7] = new Question("Which of the following is not an objective of training end users on the operation of the AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Manufacturer manuals for all equipment that contain instructions for its operation";
QuestionOptions[1] = "System design and confiugration, including signal paths, to enable a technician to troubleshoot and correct any problems with the system";
QuestionOptions[2] = "Configuration fo the control system, including DIP switch settings and IP addresses of individual components";
QuestionOptions[3] = "Operating instructions written for the AV knowledge level of the end user";
QuestionOptions[4] = "All of the above";
V3Chapter18Questions[8] = new Question("AV companies are typically requried to provide documentation of the AV system after a project is complete What is that documentation typically composed of?", QuestionOptions, QuestionOptions[4]);

let V3Chapter19Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The total amount that the client has paid the AV company for the project";
QuestionOptions[1] = "The total cost of purchasing the needed materials and supplies";
QuestionOptions[2] = "The amount of labor and materials the project manager has allocated to complete the project";
QuestionOptions[3] = "The amount of labor and materials the project manager used to successfully complete the project";
V3Chapter19Questions[0] = new Question("Project budget refers to which of the following?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Ask the client to agree to a CO that descirbes the changes to the project agreement and the additional costs.";
QuestionOptions[1] = "Perform the requested additional work to ensure that the client is satisfied";
QuestionOptions[2] = "Never perform any work that was not agreed to within the original work contract.";
QuestionOptions[3] = "Remove another element of the project to keep the final cost the same.";
V3Chapter19Questions[1] = new Question("How should the AV company respond if a client requests changes in the project that end up increasing the cost of completing the project?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "A task that cannot begin before another task is complete";
QuestionOptions[1] = "A task that must be completed by a specific date";
QuestionOptions[2] = "A task that will be required if specific conditions occur at the project site";
QuestionOptions[3] = "An optional task that the client can determine is needed once the project is underway";
V3Chapter19Questions[2] = new Question("What is a dependency within a project task schedule?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "The AV team should focus on the AV installation; the project manager is responsible for coordinating work at the project.";
QuestionOptions[1] = "The AV team should review the project schedule; it defines all coordination necessary for the project.";
QuestionOptions[2] = "The AV team should actively communicate with the project manager and other vendors to ensure that the AV installation is not impacted by other vendors working on the project.";
QuestionOptions[3] = "The AV team should negotiate work schedules directly with the other vendors.";
V3Chapter19Questions[3] = new Question("Which statement best describes the relationship of the AV installation team with other vendors on the site?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Modification announcement (MA)";
QuestionOptions[1] = "Construction change directive (CCD)";
QuestionOptions[2] = "Request for change (RFC)";
QuestionOptions[3] = "Progress report (PR)";
V3Chapter19Questions[4] = new Question("Which of the following documents would an AV company submit in the event that a modification in the building design impacted the AV system installation requirements?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Logic network";
QuestionOptions[1] = "Assumptions and risks";
QuestionOptions[2] = "WBS";
QuestionOptions[3] = "Gantt Chart";
V3Chapter19Questions[5] = new Question("Which of the following defines project deliverables and relates the elements of work?", QuestionOptions, QuestionOptions[2]);

//Chapter 20

let V3Chapter20Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "The AV company should identify the suppliers and vendors with the lowest current prices.";
QuestionOptions[1] = "The suplpiers and vendors often become long-term partners with the AV company in meeting the client needs.";
QuestionOptions[2] = "The AV company should work with only one supplier or vendor to procure the needed goods and services.";
QuestionOptions[3] = "The AV company client will usually specify the vendors or suppliers to support the client's project.";
V3Chapter20Questions[0] = new Question("Which of the following statements describes the typical relationship of an AV company with its suppliers and vendors?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Check in orders as they arrive.";
QuestionOptions[1] = "Ensure the proper amount of warehouse space is avilable for inventory.";
QuestionOptions[2] = "Ensure that the total value of stock and inventory does not exceed a specific amount.";
QuestionOptions[3] = "Keep track of the equipment and supplies the company has on hand, what is on order, and what is at the client site.";
V3Chapter20Questions[1] = new Question("Which of the following statements best describes how an AV manager should manage stock and inventory?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "To identify a specific component and allow an inventory system to check the component in and out of the warehouse and venue site";
QuestionOptions[1] = "To allow the scanner to identify the price of the equipment for rental customers";
QuestionOptions[2] = "To identify the brand of the equipment or components";
QuestionOptions[3] = "To identify in which room the equipment should be placed when it arrives at the venue";
V3Chapter20Questions[2] = new Question("Why does an AV company use a unique bar code, RFID tag, or other identifier on an equipment case for rental AV equipment?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Client";
QuestionOptions[1] = "AV company";
QuestionOptions[2] = "End user";
QuestionOptions[3] = "Whoever has taken control of the equipment";
V3Chapter20Questions[3] = new Question("Once equipment leaves the warehouse, who is responsible for ensuring security and preventing theft?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Properly identifying the person taking possession of the equipment from the AV company";
QuestionOptions[1] = "Ensuring that the renter knows how to properly operate the equipment";
QuestionOptions[2] = "Ensuring that the renter knows how to properly transport the equipment";
QuestionOptions[3] = "Ensuring that the reneter has hired a security guard to protect the equipment once it has arrived at the site";
V3Chapter20Questions[4] = new Question("What is a key security concern when renting AV equipment?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Take courses on state-of-the-art AV techniques at AV industry trade shows.";
QuestionOptions[1] = "Obtain and renew a professional certification.";
QuestionOptions[2] = "Obtain industry inifomration from a range of sources, including courses, seminars, publications, vendor presentations, and professional certification courses.";
QuestionOptions[3] = "Take college-level AV technology courses.";
V3Chapter20Questions[5] = new Question("Which of the following best describes the recommended approach to maintaining professional skills and knowledge?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Maintain security via the use of CCTV systems.";
QuestionOptions[1] = "Track system usage, identify system or component failures, and idenitfy tampering.";
QuestionOptions[2] = "Track AV system oepration costs.";
QuestionOptions[3] = "Track the type of program materials viewed via the AV system to ensure that inappropriate program materials are blocked.";
V3Chapter20Questions[6] = new Question("Remote-monitoring services for client sites are intended to perform which of the following?", QuestionOptions, QuestionOptions[1]);

//Chapter 21

let V3Chapter21Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "System wawrranty";
QuestionOptions[1] = "Service agreement";
QuestionOptions[2] = "Manufacturer's warranty";
QuestionOptions[3] = "Preventive warranty";
V3Chapter21Questions[0] = new Question("Which of the following types of maintenance agreements commits an AV company to providing ongoing preventive maintenance for a client system?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "System warranty";
QuestionOptions[1] = "Service agreement";
QuestionOptions[2] = "Manufacturer's warranty";
QuestionOptions[3] = "Preventive warranty";
V3Chapter21Questions[1] = new Question("When a new AV device fails within the first few weeks after installation, under which type of warranty is the repair typically addressed?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Obtain more information about the problem, such as the symptoms of the system failure";
QuestionOptions[1] = "Locate the detailed system documentation";
QuestionOptions[2] = "Travel to the client site to repair the system";
QuestionOptions[3] = "Contact the manufacturer of the component to assist in troubleshooting";
V3Chapter21Questions[2] = new Question("What is the first step that an AV technician should take when a client reports a problem with an AV system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Replacing system cabling that is causing static within the system";
QuestionOptions[1] = "Upgrading a display to a greater resolution to meet client needs";
QuestionOptions[2] = "Replacing a projector bulb that is nearing the end of its operational life";
QuestionOptions[3] = "Upgrading the programming on a control system to address newly installed components";
V3Chapter21Questions[3] = new Question("Which of the following is an example of preventive maintenance?", QuestionOptions, QuestionOptions[2]);

//Chapter 22

let V3Chapter22Questions = [];

QuestionOptions = [];
QuestionOptions[0] = "Determine the possible failure points";
QuestionOptions[1] = "Determine which components are fully operational";
QuestionOptions[2] = "Review a system diagram depciting interconnections and signal flow";
QuestionOptions[3] = "Clearly identify the failure symptoms";
V3Chapter22Questions[0] = new Question("What should be the first step in troubleshooting a failure in an AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "A system failure that affects multiple components";
QuestionOptions[1] = "A system failure that is difficult to reproduce";
QuestionOptions[2] = "A disruption in signal flow affecting the sytsem";
QuestionOptions[3] = "A failure of an interface component";
V3Chapter22Questions[1] = new Question("What is an intermittent problem?", QuestionOptions, QuestionOptions[1]);

QuestionOptions = [];
QuestionOptions[0] = "Examine the system to determine whether the problem is simple to address and gather more information";
QuestionOptions[1] = "Logically divide the system in half, and determine which half has the failure";
QuestionOptions[2] = "Replace the component that has appeared to fail";
QuestionOptions[3] = "Ask the use to further describe the nature of the problem";
V3Chapter22Questions[2] = new Question("Once the characteristics of the system failure are cleraly identified, what is the recommended next step required to return the system to normal operation?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Test each of the components in the order of signal flow";
QuestionOptions[1] = "Test each of the components beginning at the final output, working backward";
QuestionOptions[2] = "Begin with testing the major functions, and them move to the minor functions";
QuestionOptions[3] = "Logically divide the system in half, determine which portion has the failure, and then repeat for the failed half";
V3Chapter22Questions[3] = new Question("What is typically the most efficient process for localizing the faulty function within a malfunctioning AV system?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "No, because the users usually understand system operation";
QuestionOptions[1] = "No, because the users are not considered part of the system that has failed";
QuestionOptions[2] = "Yes, because users often do not understand how to properly operate the system and may have changed settings or performed other actions that cause the failure";
QuestionOptions[3] = "Yes, because user error is tyipcally considered the main cause of AV system failure";
V3Chapter22Questions[4] = new Question("When troubleshooting an AV system, should the AV technician consider user error as a source of the problem?", QuestionOptions, QuestionOptions[2]);

QuestionOptions = [];
QuestionOptions[0] = "Change the cable to the microphone";
QuestionOptions[1] = "Test the microphone with a multimeter";
QuestionOptions[2] = "Plug the microphone into a preamp and test";
QuestionOptions[3] = "Swap out the suspect microphone with a new microphone that you know is working and see wthether the system works properly";
V3Chapter22Questions[5] = new Question("What is the best method to determine whether a microphone is the source of a problem?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Brightness set too high";
QuestionOptions[1] = "Fan has failed";
QuestionOptions[2] = "Projector not preoprly positioned";
QuestionOptions[3] = "Air filters clogged with dust";
V3Chapter22Questions[6] = new Question("Which of the following is not an example of an issue that can cause a video projector to voerheat?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Amplifier failure";
QuestionOptions[1] = "Projector failure";
QuestionOptions[2] = "Computer source failure";
QuestionOptions[3] = "Cable/connector failure";
V3Chapter22Questions[7] = new Question("Which of the following is the most likely source of an AV system failure or problem?", QuestionOptions, QuestionOptions[3]);

QuestionOptions = [];
QuestionOptions[0] = "Adding compression to the microphone signal chain";
QuestionOptions[1] = "Keeping the microphone as close to the sound source as possible";
QuestionOptions[2] = "Kepeing the loudspeakers in front of and as far fro the microphones as possible";
QuestionOptions[3] = "Turning dow or muting all unused microphones";
V3Chapter22Questions[8] = new Question("Which of the following is not a method of addressing feedback within an audio system?", QuestionOptions, QuestionOptions[0]);

QuestionOptions = [];
QuestionOptions[0] = "Poor gain structure";
QuestionOptions[1] = "Insufficient compression";
QuestionOptions[2] = "Noise gate thresholds set too low";
QuestionOptions[3] = "Source output gain set too high";
V3Chapter22Questions[9] = new Question("An excessive amount of high-frequency hiss within an audio system is likely due to which of the following situations?", QuestionOptions, QuestionOptions[0]);




var V3CE03 = new Exam("V3CE03", V3Chapter3Questions);
var V3CE04 = new Exam("V3CE04", V3Chapter4Questions);
var V3CE05 = new Exam("V3CE05", V3Chapter5Questions);
var V3CE06 = new Exam("V3CE06", V3Chapter6Questions);
var V3CE07 = new Exam("V3CE07", V3Chapter7Questions);
var V3CE08 = new Exam("V3CE08", V3Chapter8Questions);
var V3CE09 = new Exam("V3CE09", V3Chapter9Questions);
var V3CE10 = new Exam("V3CE10", V3Chapter10Questions);
var V3CE11 = new Exam("V3CE11", V3Chapter11Questions);
var V3CE12 = new Exam("V3CE12", V3Chapter12Questions);
var V3CE13 = new Exam("V3CE13", V3Chapter13Questions);
var V3CE14= new Exam("V3CE14", V3Chapter14Questions);
var V3CE15 = new Exam("V3CE15", V3Chapter15Questions);
var V3CE16 = new Exam("V3CE16", V3Chapter16Questions);
var V3CE17 = new Exam("V3CE17", V3Chapter17Questions);
var V3CE18 = new Exam("V3CE18", V3Chapter18Questions);
var V3CE19 = new Exam("V3CE19", V3Chapter19Questions);
var V3CE20 = new Exam("V3CE20", V3Chapter20Questions);
var V3CE21 = new Exam("V3CE21", V3Chapter21Questions);
var V3CE22 = new Exam("V3CE22", V3Chapter22Questions);

var V2ChapterExamQuestions = [V2Chapter3Questions, V2Chapter4Questions, V2Chapter5Questions, V2Chapter6Questions, V2Chapter7Questions, V2Chapter8Questions, V2Chapter9Questions, V2Chapter10Questions, V2Chapter11Questions, V2Chapter12Questions, V2Chapter13Questions, V2Chapter14Questions, V2Chapter15Questions, V2Chapter16Questions, V2Chapter17Questions, V2Chapter18Questions, V2Chapter19Questions, V2Chapter20Questions, V2Chapter21Questions,V2Chapter22Questions, V2Chapter23Questions, V2Chapter24Questions, V2Chapter25Questions, V2Chapter26Questions];
//ChapterExamQuestions = _.flattenDepth(ChapterExamQuestions, 1);
V2ChapterExamQuestions = [].concat.apply([], V2ChapterExamQuestions);
var V2CE00 = new Exam("V2CE00", V2ChapterExamQuestions);

var V3ChapterExamQuestions = [V3Chapter3Questions, V3Chapter4Questions, V3Chapter5Questions, V3Chapter6Questions, V3Chapter7Questions, V3Chapter8Questions, V3Chapter9Questions, V3Chapter10Questions, V3Chapter11Questions, V3Chapter12Questions, V3Chapter13Questions, V3Chapter14Questions, V3Chapter15Questions, V3Chapter16Questions, V3Chapter17Questions, V3Chapter18Questions, V3Chapter19Questions, V3Chapter20Questions, V3Chapter21Questions, V3Chapter22Questions];
//V3ChapterExamQuestions = _.flattenDeep(V3ChapterExamQuestions);
V3ChapterExamQuestions = [].concat.apply([], V3ChapterExamQuestions);
var V3CE00 = new Exam("V3CE00", V3ChapterExamQuestions);

const Exams = [V2CE00,V2CE03,V2CE04,V2CE05,V2CE06,V2CE07,V2CE08,V2CE09,V2CE10,V2CE11,V2CE12,V2CE13,V2CE14,V2CE15,V2CE16,V2CE17,V2CE18,V2CE19,V2CE20,V2CE21,V2CE22,V2CE23,V2CE24,V2CE25,V2CE26,V3CE00,V3CE03,V3CE04,V3CE05,V3CE06,V3CE07,V3CE08,V3CE09,V3CE10,V3CE11,V3CE12,V3CE13,V3CE14,V3CE15,V3CE16,V3CE17,V3CE18,V3CE19,V3CE20,V3CE21,V3CE22];
const ExamTitles = ["V2CE00","V2CE03", "V2CE04","V2CE05","V2CE06", "V2CE07", "V2CE08","V2CE09","V2CE10","V2CE11","V2CE12","V2CE13","V2CE14","V2CE15","V2CE16","V2CE17","V2CE18","V2CE19","V2CE20","V2CE21","V2CE22","V2CE23","V2CE24","V2CE25","V2CE26","V3CE00","V3CE03","V3CE04","V3CE05","V3CE06","V3CE07","V3CE08","V3CE09","V3CE10","V3CE11","V3CE12","V3CE13","V3CE14","V3CE15","V3CE16","V3CE17","V3CE18","V3CE19","V3CE20","V3CE21","V3CE22"];

function init()
{
    var myData = localStorage['objectToPass'];
    localStorage.removeItem('objectToPass');
    var selectedexam = myData;
	try{
        examcompleted = false;
        examindex = ExamTitles.indexOf(selectedexam);
        console.log(selectedexam);
        console.log(examindex);
        try
        {
            Exams[examindex].takeExam();
        }
        catch(err)
        {
            console.log(err);
        }
	}
	catch(err){
		window.location.href = "index.html";
	}
}

function updateAnswer(userAnswerindex)
{
	userAnswer = Exams[examindex].questions[Exams[examindex].getCurrentQuestionIndex()].options[userAnswerindex];
	userAnswers[Exams[examindex].getCurrentQuestionIndex()] = userAnswer;
}

var selectoptions = document.getElementsByName("options");

document.addEventListener("click", init());

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
