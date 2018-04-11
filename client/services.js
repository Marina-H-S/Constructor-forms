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
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
                var tests = xmlHttp.responseText;
                var arrTests = JSON.parse(tests);
                callback(arrTests);
            }
        }
        xmlHttp.open("POST", window.location.href.replace('#','') + 'quiz', true); // true for asynchronous 
        //TODO use real quiz instead of this mock
        //xmlHttp.send(JSON.stringify(quiz));
        xmlHttp.send(JSON.stringify({
            name: "fourth test",
            createdDate: Date.now(),
            id: Math.round(Math.random()*10),
            auther:"Admin",
            completeTestCounter: Math.round(Math.random()*100)
        }));
    }
    
    function deleteQuiz(id,callback){
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