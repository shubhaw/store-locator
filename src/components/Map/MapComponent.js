import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MapFunctionalComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBmBBkk3HtMdydH7UiOeZWcMUOgNAx36Cg&libraries=places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)(props => {
    console.log('Map loaded!!!');
    return (
        <GoogleMap
            defaultZoom={15}
            center={props.location}
            defaultCenter={props.location}>
            {props.isMarkerShown && <Marker position={props.location} />}
        </GoogleMap>
    )
});

export default MapFunctionalComponent;