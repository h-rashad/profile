// Sub title
var subtitle = document.getElementById("subtitle");
var typewriter = new Typewriter(subtitle, {
	loop: true,
	delay: 100,
});

typewriter
	.typeString("<strong>Programmer</strong>")
	.pauseFor(500)
	.deleteAll()
	.typeString("<strong>Software Developer</strong>")
	.pauseFor(500)
	.deleteAll()
	.typeString("<strong>Traveller</strong>")
	.pauseFor(500)
	.deleteAll()
	.pauseFor(500)
	.start();

// About
var about = document.getElementById('about');
var typewriter = new Typewriter(about, {

	strings:['About'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	


	  //intern
var experience = document.getElementById('experience');
var typewriter = new Typewriter(experience, {

	strings:['Experience'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	

//intern
var internship = document.getElementById('internship');
var typewriter = new Typewriter(internship, {

	strings:['Internship'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	
//skills
var skills = document.getElementById('skills');
var typewriter = new Typewriter(skills, {

	strings:['Skills'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	

//projects
var projects = document.getElementById('projects');
var typewriter = new Typewriter(projects, {

	strings:['Projects'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	

//paper
var paper = document.getElementById('paper');
var typewriter = new Typewriter(paper, {

	strings:['Paper Work'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	

//contact
var contact = document.getElementById('contact');
var typewriter = new Typewriter(contact, {

	strings:['Contact me'],
	
	autoStart: true,
	  loop: true,
		delay: 80,
		
	  });	

document.querySelector("#contactForm").addEventListener("submit", function (e) {
	var name = document
	.querySelector("#contactForm")
	.getElementsByTagName("input")[0].value;
	var email = document
	.querySelector("#contactForm")
	.getElementsByTagName("input")[1].value;
	var message = document
	.querySelector("#contactForm")
	.getElementsByTagName("input")[2].value;
	var message = document
	.querySelector("#contactForm")
	.getElementsByTagName("textarea")[0].value;
	e.preventDefault();
	sweetAlert("Thank you !\nYour message is sent to Developer.")			
			var templateParams={
				fname:document.getElementById("fname").value,
				mail:document.getElementById("mail").value,
				tel:document.getElementById("tel").value,
			msg:document.getElementById("msg").value,
		  };
	
		emailjs.send("rasif", "rasiftemp", templateParams).then(
			function (response) {
				console.log("SUCCESS!", response.status, response.text);
				
			}
		);
		document.getElementById('fname').value="";
			document.getElementById('mail').value="";
			document.getElementById('tel').value="";
			document.getElementById('msg').value="";
	});


