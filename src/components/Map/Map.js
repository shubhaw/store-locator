import React from 'react';

import MapFunctionalComponent from './MapComponent';

class Map extends React.PureComponent {
    state = {
        isMarkerShown: true
    }

    componentDidMount() {

    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000);
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        return (
            <MapFunctionalComponent
                location={this.props.currentLocation}
                isMarkerShown={this.state.isMarkerShown}
                onMarkerClick={this.handleMarkerClick} />
        )
    }
}

export default Map;