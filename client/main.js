var createBlock = document.getElementById("list-create");
var allTests = document.getElementById("list-forms");
var test = document.getElementById("forms");
var dinamicGridTests = allTests.children[1];
var form = document.getElementById("create-form");
var addQuestion = document.getElementById("create-question");
var saveForm = document.getElementById("save-form");



test.onclick = function(){
	services.quiz.GET(buildGrid);
};
saveForm.onclick = function(){
	if (!validationForm()) {
		console.log('valid error')
	}else{
		var quiz = createObjForm();
		services.quiz.POST(quiz,buildGrid);
	}
};

function buildGrid(tests) {

	//TODO sample how to check user role
	var isAdmin = auth.isInRole('admin');
	//TODO sapme how to get current user id
	var userId = auth.getUserId();

	var arrTests = tests;
	dinamicGridTests.innerHTML = '';

	for (var i = 0; i < arrTests.length; i++) {
		var row = document.createElement('div');
		row.classList.add("row","string");
		// var number = document.createElement('div');
		// number.classList.add("col-md-1");
		// number.innerHTML = i + 1;
		// row.appendChild(number);
		var name = document.createElement('div');
		name.classList.add("col-md-4");
		name.innerHTML = arrTests[i].name;
		row.appendChild(name);
		var date = document.createElement('div');
		date.classList.add("col-md-2");
		date.innerHTML = utilities.formatDate(arrTests[i].createdDate);
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
		deleteForm.classList.add(arrTests[i].id, "btn-outline-danger","btn");
		deleteForm.innerHTML = "Delete";
		row.appendChild(deleteForm);
		dinamicGridTests.appendChild(row);
		deleteForm.onclick = function (e){
			var id = this.classList[0];
			e.preventDefault();
			services.quiz.DELETE(id,deleteElem);
		};

	};
};

function deleteElem(id){
	var elem = document.getElementsByClassName(id)[0];
	elem.parentElement.remove();
};


addQuestion.onclick = function () {
	var div = document.createElement("div");
	div.classList.add("question-blok");
	form.appendChild(div);
	var wrap = document.createElement("div");
	wrap.classList.add("input-group");
	div.appendChild(wrap);
	var titleQuestion = document.createElement("input");
	titleQuestion.setAttribute("placeholder","Enter question");
	titleQuestion.setAttribute("aria-describedby","basic-addon2");
	titleQuestion.classList.add("col-md-10", "form-control");
	wrap.appendChild(titleQuestion); 
	var btnWrap = document.createElement("div");
	btnWrap.classList.add("input-group-append");
	var addOptionBtn = document.createElement("button");
	addOptionBtn.innerHTML = "add option";
	addOptionBtn.classList.add("btn", "btn-success", "my-btn");
	btnWrap.appendChild(addOptionBtn);
	
	wrap.appendChild(btnWrap);
	div.appendChild(addOption());
	addOptionBtn.onclick = function (e){
		e.preventDefault();
		div.appendChild(addOption());
	};
	var deleteQuestionBtn = document.createElement("button");
	deleteQuestionBtn.innerHTML = "X";
	deleteQuestionBtn.classList.add("btn", "btn-danger", "my-btn")
	wrap.appendChild(deleteQuestionBtn);
	deleteQuestionBtn.onclick =function(){
		div.remove();
	}
};

function addOption() {
	var wrapOpt = document.createElement("div");
	wrapOpt.classList.add("input-group");
	var option = document.createElement("input");
	option.setAttribute("placeholder","Enter option");
	option.classList.add("col-md-10", "form-control");
	wrapOpt.appendChild(option); 
	var deleteOptionBtn = document.createElement("button");
	deleteOptionBtn.innerHTML = "X";
	deleteOptionBtn.classList.add("btn", "btn-danger", "my-btn")
	wrapOpt.appendChild(deleteOptionBtn);
	deleteOptionBtn.onclick =function(){
		wrapOpt.remove();
	}
	return wrapOpt;
};

function createObjForm(){
	var formObj ={};
	formObj.name = form.children[0].value;
	formObj.description = form.children[1].value;
	var questionsArr = [];
	for (var i =2; i<form.children.length; i++){
		var question = {};
		question.name = form.children[i].children[0].children[0].value;
		question.optionArr= [];
		if(form.children[i].children.length < 2) continue;
		for (var j =1; j<form.children[i].children.length; j++){
			question.optionArr.push(form.children[i].children[j].children[0].value);
		};
		questionsArr.push(question);
	};
	formObj.questions = questionsArr;
	formObj.id = Math.round(Math.random() * 1000);
	formObj.createdDate = Date.now();
	var userRole = auth.getRoles();
	formObj.auther = userRole[0];
	//TO DO completeTestCounter
	formObj.completeTestCounter =0; 
	console.log(formObj);
	return formObj;
};

function validationForm(){
	var isValid = true;
	var inputList = form.querySelectorAll("input");
	for (var i=0; i<inputList.length; i++){
		if(inputList[i].value.trim() === ""){
			if (!(inputList[i].previousElementSibling && inputList[i].previousElementSibling.classList.contains("error"))){
				inputList[i].insertAdjacentHTML("beforeBegin", '<div class="error">Please fill this field</div>');
				inputList[i].classList.add("input-error");
			}
			isValid = false;
		}
	}
	return isValid;

};
form.onclick = function(e){
	var target = event.target;
	if(target.tagName =="INPUT"){
		target.classList.remove("input-error");
		var sibling = target.previousElementSibling;
		if (sibling && sibling.classList && sibling.classList.contains("error")) {
			sibling.remove();
		};
	};
};


