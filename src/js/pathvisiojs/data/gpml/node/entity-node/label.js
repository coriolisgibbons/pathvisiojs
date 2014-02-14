pathvisiojs.data.gpml.element.node.entityNode.label = Object.create(pathvisiojs.data.gpml.element.node.entityNode);

pathvisiojs.data.gpml.element.node.entityNode.label.Rotation = null;
pathvisiojs.data.gpml.element.node.entityNode.label.Color = null;
pathvisiojs.data.gpml.element.node.entityNode.label.FillColor = null;
pathvisiojs.data.gpml.element.node.entityNode.label.FontSize = 10;
pathvisiojs.data.gpml.element.node.entityNode.label.FontWeight = null;

pathvisiojs.data.gpml.element.node.entityNode.label.toPvjson = function(gpmlLabel, pathwayIri, callback) {
  'use strict';
  /*
  console.log('gpmlLabel');
  console.log(gpmlLabel[0][0]);
  console.log('pathwayIri');
  console.log(pathwayIri);
  console.log('callback');
  console.log(callback);
  //*/

  var defaults = {
    'Color':'000000',
    'FillColor':'Transparent',
    'FontSize':10,
    'FontWeight':'Normal',
    'LineStyle':'Solid',
  };

  var jsonLabel = {};
  jsonLabel.nodeType = "Label";
  pathvisiojs.data.gpml.element.node.entityNode.toPvjson(gpmlLabel, jsonLabel, pathvisiojs.data.gpml.element.node.entityNode.label, pathwayIri, function(jsonLabel) {
    pathvisiojs.data.gpml.text.toPvjson(gpmlLabel, pathvisiojs.data.gpml.element.node.entityNode.label, function(text) {
      if (!!text) {
        jsonLabel.text = text;
      }

      jsonLabel = pathvisiojs.data.gpml.setColorAsJson(jsonLabel,
                    gpmlLabel.select('Graphics').attr('Color'),
                    pathvisiojs.data.gpml.element.node.entityNode.label.Color);

      var gpmlBackgroundColor = gpmlLabel.select('Graphics').attr('FillColor') || defaults.FillColor;
      var jsonBackgroundColor = pathvisiojs.data.gpml.gpmlColorToCssColor(gpmlBackgroundColor, pathvisiojs.data.gpml.element.node.entityNode.label.FillColor);
      if (!!jsonBackgroundColor) {
        jsonLabel.backgroundColor = jsonBackgroundColor;
      }

      callback(jsonLabel);
    });
  });
}
