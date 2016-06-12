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
	var cyc = new Array(l);
	var val = new Array(l);
	var done = new Array(l);
	var todone = l;
	for (var i = 0; i < l; i++) {
		cyc[i] = [i];
		val[i] = i;
		done[i] = 1;
	}
	var j = 10;
	while (todone > 0) {
		cyc = cyc.filter(function (c) {
			var i = c[0];
			var v = val[i];
			v = perm[v];
			if (v < i) {
				done[i] = true;
				todone--;
				return false;
			} 
			if (v == i) {
				todone -= done[i];
				done[i] = 0;
				return true;
			}
			val[i] = v;
			c.push(v);
			return true;
		});
	}
	return cyc;
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