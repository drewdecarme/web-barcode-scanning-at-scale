export const setVideoStream = async (videoNode: HTMLVideoElement) => {
  if (!("srcObject" in videoNode)) {
    return alert(
      "Your browser does not support the scanner. Please download the latest version of Chrome, Firefox, or Safari."
    );
  }
  const videoStream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment",
      aspectRatio: window.devicePixelRatio || 1,
      frameRate: 30,
      width: {
        ideal: 4096,
      },
      height: {
        ideal: 2160,
      },
    },
  });
  videoNode.srcObject = videoStream;
};
