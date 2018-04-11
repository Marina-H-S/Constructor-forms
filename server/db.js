function initData() {
	var first = {
		name: "first test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var second = {
		name: "second test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var third = {
		name: "third test",
		createdDate: Date.now(),
		id: Math.round(Math.random() * 10),
		auther: "Admin",
		completeTestCounter: Math.round(Math.random() * 100)
	};
	var tests = [];
	tests.push(first);
	tests.push(second);
	tests.push(third);

	return tests;
}

function GenerateId(){
	var max = DB.reduce(function(prev, current) {
		if (current.id > prev.id) {
			return current;
		} else {
			return prev;
		}
	});
	return max+1;
}

exports.DB = initData();