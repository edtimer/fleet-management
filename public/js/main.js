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
			// Validate lowercase letters
			let lowerCaseLetters = /[a-z]/g;
			if (myInput.value.match(lowerCaseLetters)) {
				letter.classList.remove("invalid");
				letter.classList.add("valid");
			} else {
				letter.classList.remove("valid");
				letter.classList.add("invalid");
			}

			// Validate capital letters
			let upperCaseLetters = /[A-Z]/g;
			if (myInput.value.match(upperCaseLetters)) {
				capital.classList.remove("invalid");
				capital.classList.add("valid");
			} else {
				capital.classList.remove("valid");
				capital.classList.add("invalid");
			}

			// Validate numbers
			let numbers = /[0-9]/g;
			if (myInput.value.match(numbers)) {
				number.classList.remove("invalid");
				number.classList.add("valid");
			} else {
				number.classList.remove("valid");
				number.classList.add("invalid");
			}

			// Validate symbols
			let symbols = /[$@!%*?&#^_-]/g;
			if (myInput.value.match(symbols)) {
				symbol.classList.remove("invalid");
				symbol.classList.add("valid");
			} else {
				symbol.classList.remove("valid");
				symbol.classList.add("invalid");
			}

			// Validate length
			if (myInput.value.length >= 8 && myInput.value.length <= 30) {
				length.classList.remove("invalid");
				length.classList.add("valid");
			} else {
				length.classList.remove("valid");
				length.classList.add("invalid");
			}

			if (myInput.value !== myInput2.value) {
				passwordsNoMatch.style.display = "block";
			} else {
				passwordsNoMatch.style.display = "none";
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
