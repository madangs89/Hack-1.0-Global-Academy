import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

async function renderRemotion(entryFile, outputFile) {
  const bundleLocation = await bundle({
    entryPoint: entryFile,
  });

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: "Video", // MUST match LLM output
  });

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputFile,
  });
}

export default renderRemotion;