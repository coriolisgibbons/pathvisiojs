pathvisiojs.view.pathwayDiagram.svg.publicationXref = function(){
  'use strict';

  function getReferenceNumberForDisplay(pathway, rdfId) {
    var displayNumberForDisplay = null;
    var i = -1;
    var currentPublicationXref;
    var found = false;

    do {
      i += 1;
      currentPublicationXref = pathway.Biopax.PublicationXref[i];
      if (typeof currentPublicationXref != 'undefined'){
        if (currentPublicationXref.rdfId === rdfId) {
          found = true;
          displayNumberForDisplay = i + 1;
        }
      }
    } while (found === false && i < pathway.Biopax.PublicationXref.length);

    return displayNumberForDisplay;
  }

  // Create a string of citation numbers for display,
  // delimited by commas, and
  // replacing any consecutive series of numbers with the
  // first and last joined by a hyphen.
  function createPublicationXrefString(displayNumbers) {
    var publicationXrefString;
    if (displayNumbers.length === 1) {
      publicationXrefString = displayNumbers[0];
    }
    else {
      displayNumbers.sort(function(a, b) {
        return a - b;
      });
      var i = 0;
      publicationXrefString = displayNumbers[i].toString();

      if (displayNumbers.length > 2) {
        do {
          i += 1;

          if (displayNumbers[i - 1] + 1 !== displayNumbers[i] || displayNumbers[i] + 1 !== displayNumbers[i + 1]) {
            if (i !== 1) {
              if (displayNumbers[i - 2] + 2 === displayNumbers[i]) {
                publicationXrefString += '-' + displayNumbers[i].toString();
              }
              else {
                publicationXrefString += ', ' + displayNumbers[i].toString();
              }
            }
            else {
              publicationXrefString += ', ' + displayNumbers[i].toString();
            }
          }

        } while (i < displayNumbers.length - 2);
      }

      i += 1;

      if (displayNumbers[i - 2] + 2 === displayNumbers[i]) {
        publicationXrefString += '-' + displayNumbers[i].toString();
      }
      else {
        publicationXrefString += ', ' + displayNumbers[i].toString();
      }
    }

    return publicationXrefString;
  }

  function getPublicationXrefString(pathway, rdfIds, callback) {
    var displayNumbers = [];
    var publicationXrefString = '';
    // make sure it's an array
    rdfIds = pathvisiojs.utilities.convertToArray(rdfIds);
    rdfIds.forEach(function(rdfId) {
      var num = getReferenceNumberForDisplay(pathway, rdfId);
      if(!!num) {
        displayNumbers.push(num); 
      }	
    });
    if (displayNumbers.length > 0){
      publicationXrefString = createPublicationXrefString(displayNumbers);
    }
    callback(publicationXrefString);
  }

  function render(target, targetType, pathway, rdfIds) {
    /* targetType can be any of the following:
     * node
     * edge
     * not currently but maybe in the future: diagram (applies to the whole pathway)
    //*/

    var viewport, text;
    getPublicationXrefString(pathway, rdfIds, function(publicationXrefString) {
      if (targetType === 'node') {
	var nodeWidth = target[0][0]['__data__'].width;
	var textLength = publicationXrefString.toString().length;
	var offset = nodeWidth - textLength *3 / 2 - 2;
        target.append('text')
        .attr('class', 'citation')
        .attr('transform', function(d) {return 'translate('+offset+' -4)';})
        .text(publicationXrefString);
      }
      else {

        // TODO don't repeat svg definition
        viewport = d3.select('svg > #viewport');
        if (targetType === 'edge') {
          viewport = d3.select('svg > #viewport');
          text = viewport.append('text')
          .attr('class', 'citation')
          .attr('transform', function(d) {return 'translate(0 -10)';});

          text.append('textPath')
          .attr('xlink:xlink:href', '#' + target)
          .attr('startOffset', '50%')
          .text(publicationXrefString);

        }
        else {
          throw new Error('Pathvisiojs cannot render a citation for targets of this type: ' + targetType);
        }
      }
    })

  }

  return {
    getPublicationXrefString:getPublicationXrefString,
    render:render
  };
}();
