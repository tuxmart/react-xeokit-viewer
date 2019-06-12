import React, { Component } from "react";
import { Viewer } from "xeokit-sdk/src/viewer/Viewer";
import { GLTFLoaderPlugin } from "xeokit-sdk/src/plugins/GLTFLoaderPlugin/GLTFLoaderPlugin";
import difference from "lodash/difference";

class GLTFViewer extends Component {
    componentDidMount() {
        // Get the necessary props with some nice destructuring
        const { canvasID, models, camera } = this.props;

        // First, we instantiate the viewer with the canvasID
        this.setUpViewer(canvasID);

        // If there's any camera settings passed through props
        // let's apply them here
        if (camera) this.setCamera();

        // Then we load the necessary plugins
        this.loadPlugins(models);

        // Then we load the model(s)
        this.loadModels(models);
    }

    // Whenever the props change, this method will run
    componentDidUpdate(prevProps) {
        const currentProps = this.props;

        // Whenever the models prop changes, we want to add/remove
        // the respective models that were added to/removed from the
        // models array
        // We use lodash's difference function to compare the previous &
        // current props
        if (prevProps.models !== currentProps.models) {
            const toAdd = difference(currentProps.models, prevProps.models);
            const toRemove = difference(prevProps.models, currentProps.models);

            toAdd.forEach(el => this.gltfLoader.load(el));

            toRemove.forEach(el => {
                const elID = el.id;
                const elToRemove = this.viewer.scene.models[elID];
                elToRemove.destroy();
            });
        }
    }

    // Instantiate the viewer and store it on the component
    // instance so that any of our methods can have access to it
    setUpViewer(canvasID) {
        this.viewer = new Viewer({
            canvasId: canvasID
        });
    }

    // We store the plugins on the component instance too for the
    // same reason we did with the viewer
    loadPlugins() {
        this.gltfLoader = new GLTFLoaderPlugin(this.viewer);
    }

    loadModels(models) {
        return models.map(model => this.gltfLoader.load(model));
    }

    setCamera() {
        const camera = this.viewer.scene.camera;

        // Get camera settings from props
        const { eye, look, up, zoom } = this.props.camera;

        camera.eye = eye;
        camera.look = look;
        camera.up = up;
        camera.zoom(zoom);
    }

    render() {
        return (
            <canvas
                id={this.props.canvasID}
                width={this.props.width}
                height={this.props.height}
                className="d-block mx-auto border border-secondary m-3 mw-100"
            />
        );
    }
}

export default GLTFViewer;
