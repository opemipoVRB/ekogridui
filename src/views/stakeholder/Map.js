import React from 'react';
import {StaticMap} from 'react-map-gl';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import {MapboxAccessToken} from "../../constants/apiContants";
import {Row} from "reactstrap";


// Set your mapbox token here
const MAPBOX_TOKEN = MapboxAccessToken; // eslint-disable-line

// Source data CSV
const DATA_URL =
    "https://raw.githubusercontent.com/opemipoVRB/map-data/master/geodata.csv";
    // 'https://raw.githubusercontent.com/opemipoVRB/map-data/master/heatmap-data.csv';
  // 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [6.851168558562861,7.967300190288024, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.5673585496215434,7.6519710862341, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

const INITIAL_VIEW_STATE = {
  longitude: 6.851168558562861,
  latitude: 7.967300190288024,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 50};


class Map extends React.Component {
    static get defaultColorRange() {
    return colorRange;
  }


  constructor(props) {
    super(props);
    this.state = {
      elevationScale: elevationScale.min
    };
  }

  componentDidMount () {
        this.getData();

  }

  getData =()=> {
        require('d3-request').csv(DATA_URL, (error, response) => {
            if (!error) {
                const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                this.setState({data: data});
            }
        });
    };


    _renderLayers() {
    const radius = 1000, upperPercentile = 100, coverage = 1 ;
    const data = this.state.data;
    console.log("Map ", data);


    return [
      new HexagonLayer({
        id: 'heatmap',
        colorRange,
        coverage,
        data,
        elevationRange: [0, 3000],
        elevationScale: data && data.length ? 50 : 0,
        extruded: true,
        getPosition: d => d,
        onHover: this.props.onHover,
        pickable: Boolean(this.props.onHover),
        radius,
        upperPercentile,
        material,
        transitions: {
          elevationScale: 3000
        }
      })
    ];
  }

  render() {

    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;



    return (
        <div className="content">
            <Row>
                <DeckGL
                            layers={this._renderLayers()}
                            effects={[lightingEffect]}
                            initialViewState={INITIAL_VIEW_STATE}
                            controller={true}
                        >
                            <StaticMap
                                reuseMaps
                                mapStyle={mapStyle}
                                preventStyleDiffing={true}
                                mapboxApiAccessToken={MAPBOX_TOKEN}
                            />
                        </DeckGL>
            </Row>
        </div>
    );
  }

}



export default Map;