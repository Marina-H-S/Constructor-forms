services = (function() {
    return {
        quiz:{
            GET: getQuizes,
            POST: addQuiz,
            DELETE: deleteQuiz,
            PUT: updateQuiz
        }
    }

    function updateQuiz(quiz){
        services.quiz.DELETE(quiz.id, console.log);
        services.quiz.POST(quiz, console.log);
    };
    
    function getQuizes(callback, id) {
        console.log('getting quizes');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (id && xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var tests = xmlHttp.responseText;
                var arrTests = JSON.parse(tests);
                for (var i = 0; i < arrTests.length; i++){
                    if(arrTests[i].id == id){
                        callback(arrTests[i]);
                        break;
                    }
                }
            } else if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                var tests = xmlHttp.responseText;
                var arrTests = JSON.parse(tests);
                callback(arrTests);
            }
        }
        xmlHttp.open("GET", window.location.href.replace('#','') + 'quiz', true); // true for asynchronous 
        xmlHttp.send();
    };
    
    function addQuiz(quiz,callback){
        console.log('adding quizes');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
                var tests = xmlHttp.responseText;
                var arrTests = JSON.parse(tests);
                callback(arrTests);
            }
        }
        xmlHttp.open("POST", window.location.href.replace('#','') + 'quiz', true);
        xmlHttp.send(JSON.stringify(quiz));
    }
    
    function deleteQuiz(id,callback){
        console.log('deleting quizes');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                var tests = xmlHttp.responseText;
                // var arrTests = JSON.parse(tests);
                callback(id);
            }
        }
        xmlHttp.open("DELETE", window.location.href.replace('#','') + 'quiz'+'/'+id, true);
        xmlHttp.send();
    }
})();