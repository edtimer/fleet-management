$(document).ready(function () {
	let currentPathname = window.location.pathname

	if (currentPathname == "") {
		$("#homePageHeader").addClass("active");
	} else if (currentPathname == "/drivers") {
		$("#driversPageHeader").addClass("active");
		$("#driversMenu").addClass("in");
		$("#driversTab").addClass("active");
	} else if (currentPathname == "/drivers/create") {
		$("#addDriverHeader").addClass("active");
		$("#driversMenu").addClass("in");
		$("#driversTab").addClass("active");
	} else if (currentPathname == "/vehicles") {
		$("#vehiclesPageHeader").addClass("active");
		$("#vehiclesMenu").addClass("in");
		$("#vehiclesTab").addClass("active");
	} else if (currentPathname == "/vehicles/trips") {
		$("#allTripsHeader").addClass("active");
		$("#vehiclesMenu").addClass("in");
		$("#vehiclesTab").addClass("active");
	} else if (currentPathname == "/vehicles/create") {
		$("#addVehicleHeader").addClass("active");
		$("#vehiclesMenu").addClass("in");
		$("#vehiclesTab").addClass("active");
	} else if (currentPathname == "/vehicles/trips/create") {
		$("#addTripHeader").addClass("active");
		$("#vehiclesMenu").addClass("in");
		$("#vehiclesTab").addClass("active");
	} else if (currentPathname == "/reports") {
		$("#reportsPageHeader").addClass("active");
		$("#reportsMenu").addClass("in");
		$("#reportsTab").addClass("active");
	} else if (currentPathname == "/users/login") {
		$("#login").addClass("active");
	} else if (currentPathname == "/users/register") {
		$("#register").addClass("active");
	}

	/*
	 * Handlebars Register page
	*/
	if (currentPathname == "/users/register") {
		let myInput = document.getElementById("registerPassword");
		let myInput2 = document.getElementById("registerPassword2");
		let letter = document.getElementById("letter");
		let capital = document.getElementById("capital");
		let number = document.getElementById("number");
		let symbol = document.getElementById("symbol");
		let length = document.getElementById("length");
		let passwordsNoMatch = document.getElementById("passwordsNoMatch");
		let registerSubmitButton = document.getElementById("registerSubmitButton");

		$('#registerPassword').password({
			shortPass: 'The password is too short 🕵️‍',
			badPass: 'Weak; try combining letters, numbers and symbols 🤨',
			goodPass: 'Medium; still needs improvement! 👨‍💻',
			strongPass: 'Yup, you made it 🙃',
			containsField: 'The password contains your username',
			enterPass: 'Type your password',
			showPercent: false,
			showText: true, // shows the text tips
			animate: true, // whether or not to animate the progress bar on input blur/focus
			animateSpeed: 'fast', // the above animation speed
			field: false, // select the match field (selector or jQuery instance) for better password checks
			fieldPartialMatch: true, // whether to check for partials in field
			minimumLength: 8 // minimum password length (below this threshold, the score is 0)
		});

		// $('#password').on('password.score', (e, score) => {
		// 	console.log('Called every time a new score is calculated (this means on every keyup)')
		// 	console.log('Current score is %d', score)
		// })

		// $('#password').on('password.text', (e, text, score) => {
		// 	console.log('Called every time the text is changed (less updated than password.score)')
		// 	console.log('Current message is %s with a score of %d', text, score)
		// })

		// When the user clicks on the password field, show the message box
		myInput.onfocus = function () {
			document.getElementById("registerMessage").style.display = "block";
		}

		// When the user clicks outside of the password field, hide the message box
		myInput.onblur = function () {
			document.getElementById("registerMessage").style.display = "none";
		}

		// When the user starts to type something inside the password field
		myInput.onkeyup = function () {
			let validPasswordScore = [0, 0, 0, 0, 0, 0];
			let validPasswordScoreSum = 0;

			// Validate lowercase letters
			let lowerCaseLetters = /[a-z]/g;
			if (myInput.value.match(lowerCaseLetters)) {
				letter.classList.remove("invalid");
				letter.classList.add("valid");
				validPasswordScore[0] = 1;
			} else {
				letter.classList.remove("valid");
				letter.classList.add("invalid");
				validPasswordScore[0] = 0;
			}

			// Validate capital letters
			let upperCaseLetters = /[A-Z]/g;
			if (myInput.value.match(upperCaseLetters)) {
				capital.classList.remove("invalid");
				capital.classList.add("valid");
				validPasswordScore[1] = 1;
			} else {
				validPasswordScore = false;
				capital.classList.remove("valid");
				capital.classList.add("invalid");
				validPasswordScore[1] = 0;
			}

			// Validate numbers
			let numbers = /[0-9]/g;
			if (myInput.value.match(numbers)) {
				number.classList.remove("invalid");
				number.classList.add("valid");
				validPasswordScore[2] = 1;
			} else {
				number.classList.remove("valid");
				number.classList.add("invalid");
				validPasswordScore[2] = 0;
			}

			// Validate symbols
			let symbols = /[$@!%*?&#^_-]/g;
			if (myInput.value.match(symbols)) {
				symbol.classList.remove("invalid");
				symbol.classList.add("valid");
				validPasswordScore[3] = 1;
			} else {
				symbol.classList.remove("valid");
				symbol.classList.add("invalid");
				validPasswordScore[3] = 0;
			}

			// Validate length
			if (myInput.value.length >= 8 && myInput.value.length <= 30) {
				length.classList.remove("invalid");
				length.classList.add("valid");
				validPasswordScore[4] = 1;
			} else {
				length.classList.remove("valid");
				length.classList.add("invalid");
				validPasswordScore[4] = 0;
			}

			if (myInput.value !== myInput2.value) {
				passwordsNoMatch.style.display = "block";
				validPasswordScore[5] = 1;
			} else {
				passwordsNoMatch.style.display = "none";
				validPasswordScore[5] = 0;
			}

			if (registerSubmitButton && validPasswordScore) {
				validPasswordScoreSum = validPasswordScore.reduce((sum, x) => sum + x);
				if (validPasswordScoreSum == 6) {
					registerSubmitButton.classList.add("disabled");
				} else {
					registerSubmitButton.classList.remove("disabled");
				}
			}
		}

		myInput2.onblur = function () {
			document.getElementById("registerMessage").style.display = "none";
		}

		myInput2.onkeyup = function () {
			document.getElementById("registerMessage").style.display = "block";

			if (myInput.value !== myInput2.value) {
				passwordsNoMatch.style.display = "block";
			} else {
				passwordsNoMatch.style.display = "none";
			}
		}
	}

	if (currentPathname == "/users/login") {
		document.getElementById("forgotPassword").onclick = function () {
			$('#forgotPasswordModal').modal("show");
		}
		// $('#forgotPasswordModal').on('shown.bs.modal', function () {
		// 	// do something
		// });
	}
});
