console.log("🔍 DEBUG: Checking landmarks availability");
console.log("Face landmarks:", appState.faceLandmarks ? appState.faceLandmarks.length : "null");
if (appState.faceLandmarks) {
  console.log("Landmark 58 (left ear):", appState.faceLandmarks[58]);
  console.log("Landmark 288 (right ear):", appState.faceLandmarks[288]);
  console.log("Landmark 234 (fallback left):", appState.faceLandmarks[234]);
  console.log("Landmark 454 (fallback right):", appState.faceLandmarks[454]);
}
