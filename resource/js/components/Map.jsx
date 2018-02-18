'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ol from 'openlayers';

import UserComponent from './User';
import { setActiveUser } from '../_core/Store';


@connect(
    state => ({
        users: state.users,
        activeUser: state.activeUser
    }),
    dispatch => ({
        onActiveUser: activeUser => dispatch(setActiveUser(activeUser))
    })
)
    
export default class MapComponent extends Component {
    
    static get propTypes() {
        return {
            users: PropTypes.array.isRequired,
            activeUser: PropTypes.object
        }
    }
    
    constructor(props) {
        super(props);
        
        this.state = this._setState(props);
        
        this.openLayers = null;
        this.openLayersPopup = null;
    }
    
    componentDidMount() {
        
        this._initMap();
        this._initPopup();
    }
    
    componentWillReceiveProps(nextProps) {
        
        this.setState(this._setState(nextProps), () => {
            this._showPopup();
            this._setPointers();
        });
    }
    
    _initMap() {
        
        const rasterLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
          });
        const view = new ol.View({
            projection: 'EPSG:3857',
            center: ol.proj.fromLonLat([37.739502, 55.659368]),
            zoom: 3,
            maxZoom: 5,
            minZoom: 3
        });
        
        this.openLayers = new ol.Map({
            layers: [rasterLayer],
            target: this.map,
            view
        });
        
        this.openLayers.on('pointermove', event => {
            var hit = event.map.hasFeatureAtPixel(event.pixel);
            event.map.getTargetElement().style.cursor = (hit ? 'pointer' : '');
        });
    }
    
    _initPopup() {
        
        this.openLayersPopup = new ol.Overlay({
            element: this.popup,
            autoPan: false
        });
        
        this.openLayers.addOverlay(this.openLayersPopup);
        
        this.openLayers.on('singleclick', this._setActiveUser.bind(this));
    }
    
    _setActiveUser(event) {
        
        const { onActiveUser } = this.props;
        
        const feature = this.openLayers.forEachFeatureAtPixel(event.pixel,(feature) => { 
            return feature; 
        });
        
        if (feature && feature.get('type') == 'click') {
            
            const { onActiveUser } = this.props;
            const geometry = feature.getGeometry();
            const coord = geometry.getCoordinates();
            const activeUser = feature.get('user');
            
            onActiveUser(activeUser);
        } else {
            
            onActiveUser(null);
        }
    }
    
    _setState(props) {
        
        const { users = [], activeUser = null } = props;
        
        return {
            users,
            activeUser,
            coordinates: this._getCoordinates(users)
        };
    }
    
    _setPointers() {
        
        const { coordinates } = this.state;
        
        for (let feature in coordinates) {
            if (feature in coordinates) {
                
                this._setPinter([coordinates[feature]]);
            }
        }
    }
    
    _setPinter(features) {
        
        const source = new ol.source.Vector({features});
        const pointLayer = new ol.layer.Vector({source});
        
        if (this.openLayers) {
            this.openLayers.addLayer(pointLayer);
        }
    }
    
    _getCoordinates(users) {
        
        let coordinates = [];
        
        users.forEach((user, index) => {
            
            const feature = this._getFeature(user);
            
            coordinates.push(feature);
        });
        
        return coordinates;
    }
    
    _getFeature(user) {
        
        const { geometry: { coordinates }, properties } = user;
        const { color } = properties;
        
        const fill = new ol.style.Fill({color});
        const stroke = new ol.style.Stroke({color});
        const image = new ol.style.Circle({radius: 5, fill, stroke});
        const style = new ol.style.Style({image});
        const geometry = new ol.geom.Point(ol.proj.fromLonLat(coordinates))
        const feature = new ol.Feature({type: 'click', geometry, user})
        
        feature.setStyle(style);
        
        return feature
    }
    
    _showPopup() {
        
        const { activeUser } = this.state;
        
        if (!activeUser) {
            return;
        }
        
        const view = this.openLayers.getView();
        const feature = this._getFeature(activeUser);
        const geometry = feature.getGeometry();
        const coordinates = geometry.getCoordinates();
        
        view.animate({
          center: coordinates,
          duration: 250,
          zoom: 5
        });
        
        this.openLayersPopup.setPosition(coordinates);
    }
    
    render() {
        
        const { users, activeUser } = this.state;
        
        return (
            <article  className="map" style={{width: '100%', height: '100%', position: 'fixed'}}>
                <div className="ol" ref={target => this.map = target} />
                <div className="popup" ref={target => this.popup = target}>
                    {activeUser !== null
                        ? <UserComponent user={activeUser} />
                        : null}
                </div>
            </article>
        );
    }
}
