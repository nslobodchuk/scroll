
function Scroll(containerEl, sectionEls /* Object with integer parameters and element values*/, graphEl, transitions /*Object with integer params and transition vals*/) {

	this.container = containerEl; 
	this.sections = sectionEls;
	this.graph = graphEl;
	this.transitions = transitions;

	var self = this;

	launchScroll(self);
}


function launchScroll(self) {

var sections = self.sections;
var graph = self.graph;
var sectionsPositions = {};
var thresholds;
var orientation;
var dimensions;
var graphWidth;
var graphHeight;
var headerBox;
var headerHeightPx;
var containerRight;
var containerLeft;
var bodyMarginPx;
var containerBorderWidthPx;
var offsetIntervals =[];
var activeIndex;
var progress;
var i;


for (i in sections) {
	var ref = sections[i];
	sections[i] = {
	el: ref,
      passed: false,
      active: false
  };

  sectionsPositions[i] = {
      top: null,
      bottom: null
     };
}

handleResize();
window.addEventListener("resize", handleResize);
window.addEventListener("scroll", handleScroll);

function handleScroll() {

 var i;
 var el;
 var bR;
 var section;

 var activeIndex_;

 for (i = 0; i<offsetIntervals.length; i++){
 	if(pageYOffset<offsetIntervals[0][0]){
 		activeIndex_=-Infinity;
 		break;
 	} else if(pageYOffset>=offsetIntervals[offsetIntervals.length-1][1]){
 		activeIndex_=Infinity;
 		break;
 	} else if (pageYOffset>=offsetIntervals[i][0]&&pageYOffset<offsetIntervals[i][1]){
 		activeIndex_ = i;
 		break;
 	} else if (i<offsetIntervals.length-1&&pageYOffset>=offsetIntervals[i][1]&&pageYOffset<offsetIntervals[i+1][0]){
 		activeIndex_ = -1;
 		break;
 	}
 }

 if (activeIndex!==activeIndex_){
 	
 	if(activeIndex_===-Infinity&&(activeIndex>-Infinity||activeIndex===undefined)){
		 	   d3.select(graph)
		   .style("position", "absolute")
		   .style("top", sections[0].el.getBoundingClientRect().top- d3.select(container).node().getBoundingClientRect().top - thresholds[1] + parseInt(headerHeightPx)+parseInt(bodyMarginPx)+"px")
		   .style("bottom", null)
		   .style("right",0)
		   .style("left",null);
 	}

 	if((activeIndex===-Infinity||activeIndex===Infinity)&&(activeIndex_>-Infinity&&activeIndex_<Infinity)){

 		 d3.select(graph).style("position", "fixed")
   .style("top", parseInt(headerHeightPx)+parseInt(bodyMarginPx)+"px")
   .style("right", document.getElementsByTagName("body")[0].getBoundingClientRect().right+ parseInt(bodyMarginPx)- containerRight+parseInt(containerBorderWidthPx)+"px");
 	}


 	if(activeIndex_===Infinity&&activeIndex<Infinity){
		 		d3.select(graph)
		   .style("position", "absolute")
		   .style("top", null)
		   .style("bottom", d3.select(container).node().getBoundingClientRect().bottom - sections[sections.length-1].el.getBoundingClientRect().top+ thresholds[0]- parseInt(bodyMarginPx)- parseInt(headerHeightPx)- graphHeight+ "px")
		   .style("right",0+"px")
		   .style("left",null);
 	}

 	if(activeIndex_>-Infinity&&activeIndex_<Infinity){
 		for(i=0; i<sections.length;i++){
 			sections[i].el.className = "section";
 		}
 		if(activeIndex_>-1){
 		 		sections[activeIndex_].el.className = "section active";
 		 		self.transitions[activeIndex_]?self.transitions[activeIndex_]():0;
 		 }
 	}

 	activeIndex=activeIndex_;
 }

	if(activeIndex===-Infinity&&progress!==0){
		progress =0;
	} else if(activeIndex===-1&&progress!==1){
 		progress =1;
 	} else if (activeIndex>-1&&activeIndex<Infinity){
 		progress = (pageYOffset - offsetIntervals[activeIndex][0])/(offsetIntervals[activeIndex][1] - offsetIntervals[activeIndex][0]);
 	} else if (activeIndex===Infinity&&progress!==1){
 		progress =1;
 	}
 
}

function getThresholds(){
 d3.select("#thresholdTop").remove();
 d3.select("#thresholdBottom").remove();

  if (orientation==="horizontal"){
   thresholds = {
    0: 0.1*(dimensions[1] - parseInt(headerHeightPx)- 2*parseInt(bodyMarginPx))+parseInt(headerHeightPx)+parseInt(bodyMarginPx), 
    1: 0.9*(dimensions[1] - parseInt(headerHeightPx)- 2*parseInt(bodyMarginPx))+parseInt(headerHeightPx)+parseInt(bodyMarginPx)
   }


    d3.select("body").append("div").attr("id","thresholdTop").style("top",thresholds[0]+"px");
    d3.select("body").append("div").attr("id","thresholdBottom").style("top",thresholds[1]+"px");

  } else if(orientation==="vertical"){
   thresholds = {
    0: 0.1*(dimensions[1]/2 - 2*parseInt(bodyMarginPx))+parseInt(bodyMarginPx)+dimensions[1]/2, 
    1: 0.9*(dimensions[1]/2 - 2*parseInt(bodyMarginPx))+parseInt(bodyMarginPx)+dimensions[1]/2
  }

  d3.select("body").append("div").attr("id","thresholdTop").style("top",thresholds[0]+"px");
  d3.select("body").append("div").attr("id","thresholdBottom").style("top",thresholds[1]+"px");

 }
 
}

function handleResize() {

headerBox = document.getElementById("header").getBoundingClientRect();

headerHeightPx = d3.select("#header").style("height");
containerRight = d3.select(container).node().getBoundingClientRect().right;
containerLeft = d3.select(container).node().getBoundingClientRect().left;
graphWidth = d3.select(graph).node().getBoundingClientRect().right - d3.select(graph).node().getBoundingClientRect().left;
bodyMarginPx = d3.select("body").style("margin-right");
containerBorderWidthPx = d3.select(container).style("border-left-width");
graphBorderWidthPx = d3.select(graph).style("border-left-width");

   d3.select("body").append("div")
.attr("id","dimensions")
.style("position", "fixed")
.style("width","100%")
.style("height","100%");

dimensions = [containerRight -containerLeft- 2*parseInt(containerBorderWidthPx), d3.select("#dimensions").node().getBoundingClientRect().bottom - d3.select("#dimensions").node().getBoundingClientRect().top];
d3.select("#dimensions").remove();
orientation = dimensions[0]>=dimensions[1]?"horizontal":"vertical";

if(orientation==="horizontal") {
      graphWidth = dimensions[0]/2;
      graphHeight = dimensions[1] - 2*parseInt(bodyMarginPx)- parseInt(headerHeightPx);
     } else if(orientation==="vertical"){
      graphWidth = dimensions[0];
      graphHeight = dimensions[1]/2 - 2*parseInt(bodyMarginPx)- parseInt(headerHeightPx);
     }

   d3.select(graph)
   .style("width", graphWidth+"px")
   .style("height", graphHeight+"px");

   var i;

   for (i in sections){
    sections[i].active=false;
    sections[i].passed=false;

   }

   if(self.transitions.resize) self.transitions.resize(graphWidth - 2*parseInt(graphBorderWidthPx), graphHeight- 2*parseInt(graphBorderWidthPx));
   
 getThresholds();

 for (i=0; i<sections.length; i++) {
 	offsetIntervals[i] = [
 	i===0?sections[i].el.getBoundingClientRect().top + pageYOffset - thresholds[1]:Math.max(sections[i].el.getBoundingClientRect().top + pageYOffset - thresholds[1], offsetIntervals[i-1][1]),
 	sections[i].el.getBoundingClientRect().top + pageYOffset - thresholds[0]];
 }

 console.log(offsetIntervals);

 handleScroll();

}
}


