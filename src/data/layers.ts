import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Color from "@arcgis/core/Color";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

// -------------- surveys -----------------
export const surveyTemplate = {
  title: "Survey {cs}",
  content: "<strong>PDF:</strong> <a href={image}>View</a> <br /> <strong>Prepared For:</strong> {prepared_for} <br /> <strong>Description:</strong> {identification} <br /> <strong>Year:</strong> {rec_y}",
}

export const surveyLayer = new FeatureLayer ({
  url: "https://geo.co.crook.or.us/server/rest/services/surveyor/surveys/MapServer/0",
  popupTemplate: surveyTemplate,
  outFields:["*"],
  definitionExpression: "cs NOT IN ('2787','2424','1391','4188')"
});
// -------------- surveys -----------------

// -------------- taxlots -----------------

const simpleTaxlotRenderer = new SimpleFillSymbol({
    style: "none",
    outline: {
        width: 0.5,
        color: [0, 0, 0, 1]
    },
    color: [0, 0, 0, 0.5]
});

const taxlotRenderer = new SimpleRenderer({
    symbol: simpleTaxlotRenderer,
});

export const landGroup = new MapImageLayer({
    url: "https://geo.co.crook.or.us/server/rest/services/publicApp/landGroup/MapServer",
    sublayers: [
        {
            id: 0,
            visible: false,
        },
        {
            id: 1,
            renderer: taxlotRenderer,
            visible: true,
            popupTemplate: {
                title: "{MAPTAXLOT}",
                content: "Owner Name: {OWNER_NAME} <br /> Zone: {ZONE} <br /> Account: {ACCOUNT} <br /> PATS Link: <a href={PATS_LINK}>PATS Link</a> <br /> Tax Map Link: <a href={TAX_MAP_LINK}>Tax Map Link</a> <br /> Tax Card Link: <a href={TAX_CARD_LINK}>Tax Card Link</a>",
            },
        },
        {
            id: 3,
            visible: false
        },
        {
            id: 4,
            visible: false
        },
        {
            id: 5,
            visible: false
        },
        {
            id: 6,
            visible: false,
            opacity: 0.6
        },
        {
            id: 7,
            visible: true,
            opacity: 0.5
        }
    ],
});

export const taxlotLayer = landGroup.findSublayerById(1);
// -------------- taxlots -----------------

// -------------- graphics -----------------
export const bufferGraphic = new Graphic({
  symbol: new SimpleFillSymbol({
    color: [173, 216, 230, 0.8],
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  })
});

// export const fillSymbol = {
//   type: "simple-fill", // autocasts as new SimpleFillSymbol()
//   color: [227, 139, 79, 0.8],
//   outline: {
//     // autocasts as new SimpleLineSymbol()
//     color: [255, 255, 255],
//     width: 1
//   }
// };

export const simpleFillSymbol = new SimpleFillSymbol({
  color: new Color([153,193,241,0.4]),
  outline: new SimpleLineSymbol({
    cap: "round",
    color: new Color([119,118,123,1]),
    join: "round",
    miterLimit: 1,
    style: "solid",
    width: 1
  }),
  style: "solid",
});
// -------------- graphics -----------------
