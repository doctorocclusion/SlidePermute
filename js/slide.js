function permutation(n) {
	var out = new Array(n);
	for (var i = 0; i < n; i++) {
		if (i % 2 == 0) out[i] = i / 2;
		else out[i] = n - (i + 1) / 2;
	}
	return out;
}

function cycles(perm) {
	var l = perm.length;
	var done = new Array(l);
	var cyc = new Array(l);
	var val = new Array(l);
	var todone = l;
	for (var i = 0; i < l; i++) {
		done[i] = false;
		cyc[i] = [i];
		val[i] = i;
	}
	var j = 10;
	while (todone > 0) {
		for (var i = 0; i < l; i++) { // TODO Speed up
			if (!done[i]) {
				var v = val[i];
				v = perm[v];
				if (v < i) {
					cyc[i] = undefined;
					todone--;
					done[i] = true;
					continue;
				}
				if (v == i) {
					todone--;
					done[i] = true;
					continue;
				}
				val[i] = v;
				cyc[i].push(v);
			}
		}
	}
	return cyc.filter(function(v) { return v != undefined; });
}

function orderSafe(cycles) {
	var o = 1;
	for (var i = 0; i < cycles.length; i++) {
		var cyc = cycles[i];
		o = math.lcm(o, cyc.length);
	}
	return o;
}

function orderFast(cycles) { // Not proven to return order, but testing would suggest that it does
	var o = 1;
	for (var i = 0; i < cycles.length; i++) {
		var l = cycles[i].length;
		if (l > o) o = l;
	}
	return o;
}

console.log(orderFast(cycles(permutation(8191))));