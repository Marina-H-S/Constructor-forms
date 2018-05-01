var createBlock = document.getElementById("list-create");
var allTests = document.getElementById("list-forms");
var test = document.getElementById("forms");
var dinamicGridTests = allTests.children[1];
var form = document.getElementById("create-form");
var addQuestion = document.getElementById("create-question");
var saveForm = document.getElementById("save-form");
var deletequeize = document.getElementById("delete");
var nameQueize = document.getElementById("name-quize");
var selectedQueize ={
	id:0,
	name:""
};




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
		deleteForm.onclick = function (e) {
			this.setAttribute("data-toggle","modal");
			this.setAttribute ("data-target","#exampleModal")
			selectedQueize.id = this.classList[0];
			selectedQueize.name = this.parentElement.children[0].innerHTML;
			console.log(selectedQueize.name);
			nameQueize.innerHTML = selectedQueize.name;

		};
		
		row.appendChild(deleteForm);
		dinamicGridTests.appendChild(row);
		deletequeize.onclick = function (e){
			e.preventDefault();
			services.quiz.DELETE(selectedQueize.id,deleteElem);
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
	var type = document.createElement("select");
	var radio = document.createElement("option");
	radio.setAttribute("value","radio");
	radio.innerHTML = "Radio";
	type.appendChild(radio);
	var checkBox = document.createElement("option");
	checkBox.setAttribute("value","checkBox");
	checkBox.innerHTML = "Check Box";
	type.appendChild(checkBox);
	div.appendChild(type);
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
	type.onchange = function(e){
		
		var questionType = 0;
		for (var i= 0; i<type.children.length; i++){
			var option = type.options[i];
			if (option.selected){
				questionType = option.value;
			};
	
		}
		var imgs = [];
		imgs = div.getElementsByClassName("img-size");
		for (var j =0; j<imgs.length; j++){
			var parent =imgs[j].parentElement;
			console.log(parent);
			imgs[j].remove();
			var img = document.createElement("img");

			if (questionType == "radio"){
				img.setAttribute("src","radio.png");
			};
			if (questionType == "checkBox"){
				img.setAttribute("src","checkbox.png");
			};
			img.classList.add("img-size");
			parent.appendChild(img);
		};
		
	}
};


function addOption() {
	var wrapOpt = document.createElement("div");
	wrapOpt.classList.add("input-group");
	var imgWrap = document.createElement("div");
	imgWrap.classList.add("option");
	wrapOpt.appendChild(imgWrap);
	var img = document.createElement("img");
	img.setAttribute("src","radio.png");
	img.classList.add("img-size");
	imgWrap.appendChild(img);
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

		question.name = form.children[i].children[1].children[0].value;
		var type = 0;
		for (var g=0; g<form.children[i].children[0].children.length; g++){
			var option = form.children[i].children[0].options[g];
			if (option.selected){
				type = option.value;
			};
		};
		question.type = type;
		question.optionArr= [];
		if(form.children[i].children.length < 2) continue;
		for (var j =2; j<form.children[i].children.length; j++){
			question.optionArr.push(form.children[i].children[j].children[1].value);
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



