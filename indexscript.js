var takeexambutton = document.getElementById("BeginExam");
takeexambutton.style.display = "none";
let selectedExam = "None";
let loadedExam = "None";


function selectExam(item)
{
	selectedExam = item.id;
	document.getElementById("CurrentExam").innerHTML = `Exam Selected: Chapter Exam ${selectedExam}`;//.substring(2)
	takeexambutton.style.display = "inline-block";
	
}

function loadExam()
{
	if(loadedExam != selectedExam)
	{
		loadedExam = selectedExam;
		var myData = loadedExam;
		localStorage.setItem('objectToPass', myData);
	}
}

document.querySelectorAll(".SelectExam").forEach(item => {
	item.addEventListener('click', event => { 
		selectExam(item);
		console.log(item.getElementsByTagName("INPUT")); 
		item.getElementsByTagName("INPUT")[0].checked = true;
	})
})

takeexambutton.addEventListener('click', loadExam);

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || 
                         ( typeof window.performance != "undefined" && 
                              window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});