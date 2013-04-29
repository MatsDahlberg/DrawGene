SimpleGraph = function(url, elemid, options, tableDiv) {
    $.getJSON(url, function(data3) {
	if(data3 === null){
	    return;
	}
	populateVariants(data3, tableDiv);

	var gene_start = data3.gene_start;
	var gene_end = data3.gene_end;
	var gap = (gene_end - gene_start)/100;
	gene_start = gene_start - gap;
	gene_end = gene_end + gap;
	var self = this;
	var exonHeight = 14;
	var geneY = 250;
	var cx = 1000;
	var cy = 400;
	var topExpressionY = 50;
	var botExpressionY = 200;
	chart = document.getElementById(elemid);
	options = options || {};
	options.xmax = options.xmax || 30;
	options.xmin = options.xmin || 0;
	options.ymax = options.ymax || 10;
	options.ymin = options.ymin || 0;

	padding = {
	    "top":    options.title  ? 40 : 20,
	    "right":                 30,
	    "bottom": options.xlabel ? 60 : 10,
	    "left":   options.ylabel ? 70 : 45
	};

	size = {
	    "width":  cx - padding.left - padding.right,
	    "height": cy - padding.top  - padding.bottom
	};

	// x-scale
	x = d3.scale.linear()
	    .domain([gene_start, gene_end])
	    .range([0, size.width]);

	// drag x-axis logic
	downx = Math.NaN;
	
	// y-scale (inverted domain)
	y = d3.scale.linear()
	    .domain([options.ymax, options.ymin])
	    .nice()
	    .range([0, size.height])
	    .nice();

	line1 = d3.svg.line()
	    .x(function(d, i) { return x(points[i].x); })
	    .y(function(d, i) { return y(points[i].y); })
	    .interpolate("step-after");
	var xrange =  (gene_end - gene_start),
	yrange2 = (options.ymax - options.ymin) / 2,
	yrange4 = yrange2 / 1.5,
	datacount = size.width/30;

	var points = d3.range(datacount).map(function(i) {
	    return { x: (i * xrange / datacount)+data3.gene_start, y: options.ymin + yrange4 + Math.random() * yrange2 };
	}, self);

	vis = d3.select(chart).append("svg:svg")
	    .attr("width",  cx)
	    .attr("height", cy)
	    .append("g")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	plot = vis.append("rect")
	    .attr("width", size.width)
	    .attr("height", size.height)
	    .style("fill", "white")
	    .attr("pointer-events", "all")
	    .on("mousedown.drag", plot_drag())
	    .on("touchstart.drag", plot_drag())

	vis.append("svg")
	    .attr("top", 0)
	    .attr("left", 0)
	    .attr("width", size.width)
	    .attr("height", size.height)
	    .attr("viewBox", "0 0 "+size.width+" "+size.height)
	    .attr("class", "line")
	    .append("path")
            .attr("class", "line")
            .attr("d", line1(points));

	var geneLine = vis.select("svg")
	    .append("line")
	    .attr("stroke-width", 4)
	    .attr("stroke", "green")
	    .attr("x1", 0)
	    .attr("y1", geneY)
	    .attr("x2", size.width)
	    .attr("y2",geneY)
	    .style("stroke", "green");

	var topExpression = vis.select("svg")
	    .append("line")
	    .attr("stroke-width", 1)
            .attr("stroke", "grey")
	    .attr("x1", 0)
	    .attr("y1", topExpressionY)
	    .attr("x2", size.width)
	    .attr("y2",topExpressionY)
	    .style("stroke", "grey");
	var botExpression = vis.select("svg")
	    .append("line")
	    .attr("stroke-width", 1)
            .attr("stroke", "grey")
	    .attr("x1", 0)
	    .attr("y1", botExpressionY)
	    .attr("x2", size.width)
	    .attr("y2", botExpressionY)
	    .style("stroke", "grey");

	var exons = data3.exons;
	var jsonRectangles = []
	var nrOfExons = exons.length;
	var exonWidth = 0;
	var gene_length = gene_end - gene_start;
	for(var i=0; i < nrOfExons; i++){
	    exonWidth = exons[i].stop_bp - exons[i].start_bp;
	    jsonRectangles.push({"exon_nr":i+1,
				 "exon_id":exons[i].exon_id,
				 "start_bp":exons[i].start_bp,
				 "stop_bp":exons[i].stop_bp,
				 "x":exons[i].start_bp,
				 "y":geneY-exonHeight/2,
				 "height":exonHeight,
				 "width":exonWidth,
				 "color":"black"});
	};

	var variants = data3.variants;
	var nrOfVariants = variants.length;
	var jsonVariants = []
	for(var i=0; i < nrOfVariants; i++){
	    jsonVariants.push({"start_bp":variants[i][0].start_bp,
			       "stop_bp":variants[i][0].stop_bp,
			       "ref_nt":variants[i][0].ref_nt,
			       "alt_nt":variants[i][0].alt_nt,
			       "gene_model":variants[i][0].gene_model,
			       "type":variants[i][0].type,
			       "functional_annotation":variants[i][0].functional_annotation});
	};

	// add Chart Title
	if (options.title) {
	    vis.append("text")
		.attr("class", "axis")
		.text(options.title)
		.style("font-size", 20)
		.attr("x", size.width/2)
		.attr("dy","-0.8em")
		.style("text-anchor","middle");
	}
	
	// Add the x-axis label

	if (data3.chr) {
	    vis.append("text")
		.attr("class", "axis")
		.text("Chromosome " + data3.chr)
		.style("font-size", 16)
		.attr("x", size.width/2)
		.attr("y", size.height)
		.attr("dy","2.4em")
		.style("text-anchor","middle");
	}
	
	d3.select(chart)
	    .on("mousemove.drag", mousemove())
	    .on("touchmove.drag", mousemove())
	    .on("mouseup.drag",   mouseup())
	    .on("touchend.drag",  mouseup());
	redraw()();

	 function plot_drag() {
	    return function() {
		d3.select('body').style("cursor", "move");
	    }
	 };

	function update() {
	    var self = this;
	    vis.select("path")
		.attr("stroke", "grey")
		.attr("d", line1(points));
	    var variantLine = vis.select("svg").selectAll(".variantLine1")
		.data(jsonVariants, function(d) {return d;});
	    variantLine.enter()
		.append("line");
	    var variantAttributes = variantLine
		.attr("class", "variantLine1")
		.attr("x1", function (d) { return x(d.start_bp); })
		.attr("y1", function (d) { return geneY-20; })
		.attr("x2", function (d) { return x(d.start_bp); })
		.attr("y2", function (d) { return geneY+20; })
		.attr("stroke-width", 2)
		.style("stroke", function(d)
		       { if(d.functional_annotation === "nonsynonymous SNV")
			 { return "red"; } 
			 else {return "blue";}
		       })
		.append("svg:title")
		.text(function(d) { return 'Ref nt: ' + d.ref_nt + '\nAlt nt: ' + d.alt_nt +
				    '\nStart bp: ' + d.start_bp + '\nStop bp: ' + d.stop_bp +
				    '\nGene model: ' + d.gene_model + '\nFunctional annotation: ' + d.functional_annotation +
				    '\nType: ' + d.type ;});
	    variantLine.exit().remove();

	    var rectangles = vis.select("svg").selectAll("rect")
		.data(jsonRectangles, function(d) {return d;});
	    rectangles.enter()
		.append("rect");
	    	    var rectangleAttributes = rectangles
		.attr("x", function (d) { return x(d.x); })
		.attr("y", function (d) { return d.y; })
		.attr("height", function (d) { return d.height; })
		.attr("width", function (d) { return ((d.width / (x.invert(size.width) - x.invert(0))) * size.width) +1 ; })
		.style("fill", "grey")
		.style("stroke", "grey")
		.append("svg:title")
		.text(function(d) { return d.exon_id + '\nExon nr ' + d.exon_nr + '\nStart bp '
				    + d.start_bp + '\nStop bp ' + d.stop_bp; });
	    rectangles.exit().remove();
	}

	function mousemove() {
	    var self = this;
	    return function() {
		var p = d3.svg.mouse(self.vis[0][0]),
		t = d3.event.changedTouches;

		if (!isNaN(self.downx)) {
		    d3.select('body').style("cursor", "ew-resize");
		    var rupx = self.x.invert(p[0]),
		    xaxis1 = self.x.domain()[0],
		    xaxis2 = self.x.domain()[1],
		    xextent = xaxis2 - xaxis1;
		    if (rupx != 0) {
			var changex, new_domain;
			changex = self.downx / rupx;
			new_domain = [xaxis1, xaxis1 + (xextent * changex)];
			self.x.domain(new_domain);
			redraw()();
		    }
		    d3.event.preventDefault();
		    d3.event.stopPropagation();
		};
	    }
	};

	function mouseup() {
	    var self = this;
	    return function() {
		document.onselectstart = function() { return true; };
		d3.select('body').style("cursor", "auto");
		d3.select('body').style("cursor", "auto");
		if (!isNaN(self.downx)) {
		    redraw()();
		    self.downx = Math.NaN;
		    d3.event.preventDefault();
		    d3.event.stopPropagation();
		};
	    }
	}

	function redraw() {
	    var self = this;
	    return function() {
		var nrOfxTicks = 5;
		var tx = function(d) { 
		    return "translate(" + x(d) + ",0)"; 
		},
		stroke = function(d) { 
		    return d ? "#ccc" : "#666"; 
		},
		fx = x.tickFormat(nrOfxTicks);
		
		// Regenerate x-ticks…
		var gx = self.vis.selectAll("g.x")
		    .data(self.x.ticks(nrOfxTicks), String)
		    .attr("transform", tx);

		var gxe = gx.enter().insert("g", "a")
		    .attr("class", "x")
		    .attr("transform", tx);

		gxe.append("line")
		    .attr("stroke", stroke)
		    .style("opacity", 0.65)
		    .attr("y1", 0)
		    .attr("y2", self.size.height);

		gxe.append("text")
		    .attr("class", "axis")
		    .attr("y", self.size.height)
		    .attr("dy", "1em")
		    .attr("text-anchor", "middle")
		    .text(fx)
		
		gx.exit().remove();
		self.plot.call(d3.behavior.zoom().x(self.x).on("zoom", redraw()));
		update();
	    }  
	}

	function populateVariants( data1, element ) {
	    var tbody = document.getElementById(element).getElementsByTagName("tbody")[0];
	    var variants = data1.variants;
	    var row = document.createElement("tr")
	    var header;
	    var tdTag;
	    header = document.createElement("th");
	    header.appendChild(document.createTextNode('Rank score'));
	    row.appendChild(header);
	    console.log(data1)
	    var iIndex = 1;
	    if(variants.length === 1) {
		iIndex = 0;
	    };
	    for( var idnId, i =-1; idnId = variants[iIndex][1][++i];) {
		header = document.createElement("th");
		header.appendChild(document.createTextNode(idnId.idn));
		row.appendChild(header);
	    };
	    header = document.createElement("th");
	    header.appendChild(document.createTextNode("Gene annotation"));
	    row.appendChild(header);
	    header = document.createElement("th");
	    header.appendChild(document.createTextNode("Func. annotation"));
	    row.appendChild(header);
	    header = document.createElement("th");
	    header.appendChild(document.createTextNode("Gene model"));
	    row.appendChild(header);

	    tbody.appendChild(row);
	    var thisATag;
	    var variantLink;

	    for( var variant, i =-1; variant = variants[++i];) {
		row = document.createElement("tr")
		row.className = 'mediumText';

		tdTag = document.createElement("td");
		tdTag.setAttribute("align","center");
		thisATag = document.createElement('a');
		variantLink = document.createTextNode(variant[0].rank_score);
		thisATag.setAttribute('href', encodeURI('variantDetails?data=' + String(variant[0].variantid) + '&type=' + String(options.type)));
		thisATag.appendChild(variantLink);
		tdTag.appendChild(thisATag)
		row.appendChild(tdTag)

		setupMouseOver(row, variant)
		for( var thisGT, j =-1; thisGT = variant[1][++j];) {
		    tdTag = document.createElement("td");
		    tdTag.setAttribute("align","center");
		    tdTag.appendChild(document.createTextNode(thisGT.gt));
		    row.appendChild(tdTag)
		}
		tdTag = document.createElement("td");
		tdTag.appendChild(document.createTextNode(variant[0].type));
		tdTag.setAttribute("align","center");
		row.appendChild(tdTag)
		tdTag = document.createElement("td");
		tdTag.appendChild(document.createTextNode(variant[0].functional_annotation));
		row.appendChild(tdTag)
		tdTag = document.createElement("td");
		tdTag.setAttribute("align","center");
		tdTag.appendChild(document.createTextNode(variant[0].gene_model));
		row.appendChild(tdTag)

		tbody.appendChild(row);
	    }
	};

	function setupMouseOver(row, variant){
	    row.onmouseover = function (){
		var holder = vis.select("svg")
		    .append('line')
		    .attr("class", "selectLine")
		    .attr("x1", function (d) { return x(variant[0].start_bp); })
		    .attr("y1", function (d) { return geneY-40; })
		    .attr("x2", function (d) { return x(variant[0].start_bp); })
		    .attr("y2", function (d) { return geneY+40; })
		    .attr("stroke-width", 5)
		    .style("stroke", "black")
		    .on("mouseout", function(d){vis.select("svg").selectAll(".selectLine").remove()})
		    .transition()
		    .duration(1000)
		    .attr("stroke-width", 1)
		    .style("stroke", "red")
		row.onmouseout = function(){
		    vis.select("svg").selectAll(".selectLine").remove();
		}
	    };
	};
    }
	     )};
