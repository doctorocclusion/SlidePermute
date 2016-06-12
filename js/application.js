function exportCSV() {
	var min = Number($("input#excsv_n_min").val());
	var max = Number($("input#excsv_n_max").val());
	var data = "";
	for (var n = min; n <= max; n++) {
		data += n + "," + orderFast(cycles(permutation(n))) + "\n";
	}
	$("textarea#exportcsv").val(data);
}
$("button#exportcsv").click(exportCSV);

function exportJSON() {
	var min = Number($("input#ex_n_min").val());
	var max = Number($("input#ex_n_max").val());
	var values = $("input#ex_values").val().split(" ");
	var data = [];
	for (var n = min; n <= max; n++) {
		var perm = permutation(n);
		var cyc = cycles(perm);
		var o = orderFast(cyc);
		var d = {};
		for (var v in values) {
			value = values[v];
			switch (value) {
				case "n":
					d.n = n;
					break;
				case "order":
					d.order = o;
					break;
				case "cycles":
					d.cycles = cyc;
					break;
				case "perm":
					d.perm = perm;
					break;
			}
		}
		data.push(d);
	}
	$("textarea#export").val(JSON.stringify(data));
}
$("button#export").click(exportJSON);

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function run() {
	var n = Number($("input#n").val());
	console.log(n);
	var perm = permutation(n);
	var cyc = cycles(perm);
	var o = orderFast(cyc);

	$('.o_n').text("n = " + n);
	$('.o_order').text("order = " + o);
	$('.o_cycles').html("cycles:\n<br>\n" + cyc.join("\n<br>\n").replaceAll(',', ' > '));
	$('.o_perm').text("permutation: " + perm.join(", "));
}
$("button#run").click(run);

run();
exportJSON();
exportCSV();