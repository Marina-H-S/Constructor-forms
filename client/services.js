services = (function() {
    return {
        quiz:{
            GET: getQuizes,
            POST: addQuiz,
            DELETE: deleteQuiz,
            PUT: function(){ /*TODO*/ }
        }
    }
    
    function getQuizes(callback) {
        console.log('getting quizes');
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
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
            if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
                var tests = xmlHttp.responseText;
                var arrTests = JSON.parse(tests);
                callback(arrTests);
            }
        }
        xmlHttp.open("DELETE", window.location.href.replace('#','') + 'quiz'+'/'+id, true);
        xmlHttp.send();
    }
})();