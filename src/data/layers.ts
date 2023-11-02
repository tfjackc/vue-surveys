import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const surveyTemplate = {
  title: "Survey {cs}",
  content: "<strong>PDF:</strong> <a href={image}>View</a> <br /> <strong>Prepared For:</strong> {prepared_for} <br /> <strong>Description:</strong> {identification} <br /> <strong>Year:</strong> {rec_y}",
}

export const surveyLayer = new FeatureLayer ({
  url: "https://geo.co.crook.or.us/server/rest/services/surveyor/surveys/MapServer/0",
  popupTemplate: surveyTemplate
});
