String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function prime(n) {
    for(var i = 2; i < n; i++) {
        if (n % i == 0) return false;
    }
    return n > 1;
}

function exportCSV() {
	var min = Number($("input#excsv_n_min").val());
	var max = Number($("input#excsv_n_max").val());
	var data = "";
	for (var n = min; n <= max; n++) {
		data += n + "," + orderSafe(cycles(permutation(n))) + "\n";
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
		var o = orderSafe(cyc);
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
				case "nprime":
					d.nprime = prime(n);
					break;
				case "oprime":
					d.oprime = prime(o);
					break;
				case "ismax":
					d.ismax = (o == n - 1);
					break;
			}
		}
		data.push(d);
	}
	$("textarea#export").val(JSON.stringify(data));
}
$("button#export").click(exportJSON);

function slideOut() {
	var n = Number($("input#slide_n").val());
	var val = new Array(n);
	for (var i = 0; i < n; i++) {
		val[i] = i;
	}
	var out = ">> " + val.join(" ");
	var perm = permutation(n);
	var o = orderSafe(cycles(perm));
	for (var i = 0; i < o; i++) {
		out += "\n>> "
		var oval = val.slice();
		for (var j = 0; j < n; j++) {
			val[j] = oval[perm[j]];
		}
		out += val.join(" ");
	}
	$("textarea#slide_out").val(out);
}
$("button#slide").click(slideOut);

function run() {
	var n = Number($("input#n").val());
	console.log(n);
	var perm = permutation(n);
	var cyc = cycles(perm);
	var o = orderSafe(cyc);
	var lens = new Array(cyc.length);
	for (var i in cyc) {
		lens[i] = cyc[i].length;
	}


	$('.o_n').text("n = " + n + " (prime: " + prime(n) + ")");
	$('.o_order').text("order (lcm) = " + o + " (n-1: " + (o == n - 1) + ", prime: " + prime(o) + ")");
	$('.o_cycles').html("cycles:\n<br>\n==> " + cyc.join("\n<br>\n==> ").replaceAll(',', ' > '));
	$('.o_cycle_lens').text("cycles sizes: " + lens.join(", ") + " (largest = " + orderFast(cyc) + ")");
	$('.o_perm').text("permutation: " + perm.join(", "));
}
$("button#run").click(run);

run();
exportJSON();
exportCSV();
slideOut();