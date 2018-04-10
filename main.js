var inp = document.getElementById("inp");
var createBlock = document.getElementById("list-create");
var allTests = document.getElementById("list-forms");
var test = document.getElementById("forms");
var dinamicGridTests = allTests.children[1];
var form = document.getElementById("create-form");
var addQuestion = document.getElementById("create-question");

inp.onclick = function () {
	inp.classList.remove("bg-dark");
};

test.onclick = getData;

function getData() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			var tests = xmlHttp.responseText;
			var arrTests = JSON.parse(tests);
			buildGrid(arrTests);
		}
	}
	xmlHttp.open("GET", window.location.href + 'quiz', true); // true for asynchronous 
	xmlHttp.send(null);
};

function addQuiz(quiz){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
			var tests = xmlHttp.responseText;
			var arrTests = JSON.parse(tests);
			buildGrid(arrTests);
		}
	}
	xmlHttp.open("POST", window.location.href + 'quiz', true); // true for asynchronous 
	//TODO use real quiz instead of this mock
	//xmlHttp.send(quiz);
	xmlHttp.send({
		name: "fourth test",
		createdDate: Date.now(),
		id: Math.round(Math.random()*10),
		auther:"Admin",
		completeTestCounter: Math.round(Math.random()*100)
	});
}

function buildGrid(tests) {

	//TODO sample how to check user role
	var isAdmin = auth.isInRole('admin');
	//TODO sapme how to get current user id
	var userId = auth.getUserId();

	var arrTests = tests;
	dinamicGridTests.innerHTML = '';

	for (var i = 0; i < arrTests.length; i++) {
		var row = document.createElement('div');
		row.classList.add("row");
		var number = document.createElement('div');
		number.classList.add("col-md-1");
		number.innerHTML = i + 1;
		row.appendChild(number);
		var name = document.createElement('div');
		name.classList.add("col-md-4");
		name.innerHTML = arrTests[i].name;
		row.appendChild(name);
		var date = document.createElement('div');
		date.classList.add("col-md-2");
		date.innerHTML = formatDate(arrTests[i].createdDate);
		row.appendChild(date);
		var auther = document.createElement('div');
		auther.classList.add("col-md-1");
		auther.innerHTML = arrTests[i].auther;
		row.appendChild(auther);
		var number = document.createElement('div');
		number.classList.add("col-md-1");
		number.innerHTML = arrTests[i].completeTestCounter;
		row.appendChild(number);
		var deleteForm = document.createElement('button');
		deleteForm.classList.add(arrTests[i].id);
		deleteForm.classList.add("col-md-1");
		deleteForm.innerHTML = "Delete";
		row.appendChild(deleteForm);
		dinamicGridTests.appendChild(row);
	}
};

function formatDate(time) {
	var date = new Date(time);
	var dd = date.getDate();
	if (dd < 10) dd = '0' + dd;

	var mm = date.getMonth() + 1;
	if (mm < 10) mm = '0' + mm;

	var yy = date.getFullYear() % 100;
	if (yy < 10) yy = '0' + yy;

	return dd + '.' + mm + '.' + yy;
};
addQuestion.onclick = function () {
	var div = document.createElement("div")
	
	form.appendChild(div);
	var titleQuestion = document.createElement("input");
	titleQuestion.setAttribute("placeholder","Enter question");
	titleQuestion.classList.add("col-md-10");
	div.appendChild(titleQuestion);
	div.appendChild(addOption());
	var addOptionBtn = document.createElement("button");
	addOptionBtn.innerHTML = "add option";
	form.appendChild(addOptionBtn);
	addOptionBtn.onclick = function (){
		div.appendChild(addOption());
	};
};

function addOption() {
	var option = document.createElement("input");
	option.setAttribute("placeholder","Enter option");
	option.classList.add("col-md-10");
	return option;
};
