import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import React from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

class Html5QrcodePlugin extends React.Component {
		render() {
				return <div id={qrcodeRegionId} />;
		}

		componentWillUnmount() {
				// TODO(mebjas): See if there is a better way to handle
				//	promise in `componentWillUnmount`.
				this.html5QrcodeScanner.clear().catch(error => {
						console.error("Failed to clear html5QrcodeScanner. ", error);
				});
		}

		componentDidMount() {
				// Creates the configuration object for Html5QrcodeScanner.
				let config = {};
				if (this.props.fps) {
					config.fps = this.props.fps;
				}
				if (this.props.qrbox) {
					config.qrbox = this.props.qrbox;
				}
				if (this.props.aspectRatio) {
					config.aspectRatio = this.props.aspectRatio;
				}
				if (this.props.disableFlip !== undefined) {
					config.disableFlip = this.props.disableFlip;
				}
				//if (this.props.zoom) {
				//	config.zoom = this.props.zoom;
				//}
				
				config.formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
				var verbose = this.props.verbose === true;

				// Suceess callback is required.
				if (!(this.props.qrCodeSuccessCallback )) {
						// eslint-disable-next-line no-throw-literal
						throw "qrCodeSuccessCallback is required callback.";
				}

				this.html5QrcodeScanner = new Html5QrcodeScanner(
						qrcodeRegionId, config, verbose);
				this.html5QrcodeScanner.render(
						this.props.qrCodeSuccessCallback,
						this.props.qrCodeErrorCallback);
		}
};

export default Html5QrcodePlugin;
