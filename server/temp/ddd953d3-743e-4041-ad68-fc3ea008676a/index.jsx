import React from "react";
import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const durationInFrames = 900;
const fps = 30;
const width = 1920;
const height = 1080;

// Helper to define animation segments
const getSegment = (startFrame, endFrame, currentFrame) => {
  const segmentDuration = endFrame - startFrame;
  const localFrame = currentFrame - startFrame;
  return {
    isActive: currentFrame >= startFrame && currentFrame < endFrame,
    progress: interpolate(localFrame, [0, segmentDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    localFrame: Math.max(0, localFrame),
    duration: segmentDuration
  };
};


const TwoSumVisualizer = () => {
  const frame = useCurrentFrame();

  const nums = [2, 7, 11, 15];
  const target = 9;

  const arrayDisplayWidth = nums.length * 120; // Each box ~100px + margin

  const titleSegment = getSegment(0, 60, frame);
  const problemStatementSegment = getSegment(0, 150, frame); // Extends to show more
  const introduceArrayTargetSegment = getSegment(60, 210, frame); // Starts showing array/target
  const introduceHashMapSegment = getSegment(150, 270, frame); // Starts showing hash map structure

  // Iteration 1: nums[0] = 2
  const iter1Segment = getSegment(270, 480, frame); // 210 frames
  const iter1Value = nums[0];
  const iter1Index = 0;
  const iter1Complement = target - iter1Value;
  const iter1MapState = { [iter1Value]: iter1Index };

  // Iteration 2: nums[1] = 7
  const iter2Segment = getSegment(480, 780, frame); // 300 frames (more complex)
  const iter2Value = nums[1];
  const iter2Index = 1;
  const iter2Complement = target - iter2Value;
  const iter2MapStatePre = { ...iter1MapState }; // Map state before current addition/check

  const conclusionSegment = getSegment(780, 900, frame);

  // Dynamic values based on frame
  let currentMap = {};

  if (iter1Segment.isActive) {
    // Simulate adding to map near end of iter1's segment
    if (iter1Segment.progress > 0.8) {
        currentMap = { [iter1Value]: iter1Index };
    }
  } else if (iter2Segment.isActive) {
    currentMap = { ...iter1MapState }; // Map state carried from previous
  } else if (frame >= iter2Segment.endFrame) { // After iter2, map is in its final state for solution
      currentMap = { ...iter1MapState }; // Solution found, map does not update with 7:1
  }


  const mapEntries = Object.entries(currentMap);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1e1e1e", justifyContent: "center", alignItems: "center", fontFamily: "monospace" }}>
      {/* Title */}
      <div style={{
        position: "absolute",
        top: 80,
        opacity: interpolate(titleSegment.progress, [0, 0.5], [0, 1]),
        transform: `translateY(${interpolate(titleSegment.progress, [0, 1], [-20, 0])}px)`,
        color: "white",
        fontSize: 70,
        fontWeight: "bold",
      }}>
        The Two Sum Problem
      </div>

      {/* Problem Statement */}
      <div style={{
        position: "absolute",
        top: 180,
        width: width * 0.8,
        textAlign: "center",
        opacity: interpolate(problemStatementSegment.progress, [0, 0.5, 0.9, 1], [0, 1, 1, 0]),
        color: "#ccc",
        fontSize: 38,
      }}>
        Given an array of integers <span style={{color: "#88ccff"}}>nums</span> and an integer <span style={{color: "#ffcc88"}}>target</span>, return indices of the two numbers such that they add up to <span style={{color: "#ffcc88"}}>target</span>.
      </div>

      {/* Array Display */}
      <div style={{
        position: "absolute",
        top: 350,
        left: (width - arrayDisplayWidth) / 2,
        display: "flex",
        gap: 20,
        opacity: interpolate(introduceArrayTargetSegment.progress, [0.3, 0.6], [0, 1], {extrapolateRight: "clamp"}),
        transform: `translateY(${interpolate(introduceArrayTargetSegment.progress, [0, 1], [50, 0])}px)`,
      }}>
        {nums.map((num, i) => {
          const isIter1Active = iter1Segment.isActive && iter1Index === i;
          const isIter2Active = iter2Segment.isActive && iter2Index === i;
          const isSolutionHighlight = !iter2Segment.isActive && frame >= iter2Segment.endFrame && (i === iter1Index || i === iter2Index);

          return (
            <div key={i} style={{
              backgroundColor: isSolutionHighlight ? "#00e676" : (isIter1Active || isIter2Active ? "#ffeb3b" : "#444"),
              border: `2px solid ${isSolutionHighlight ? "#00e676" : (isIter1Active || isIter2Active ? "#ffeb3b" : "#666")}`,
              borderRadius: 8,
              width: 100,
              height: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: isSolutionHighlight ? "#1e1e1e" : "white",
              fontSize: 40,
              fontWeight: "bold",
              boxShadow: isSolutionHighlight ? "0 0 20px #00e676" : (isIter1Active || isIter2Active ? "0 0 15px #ffeb3b" : "none"),
              transform: `scale(${isIter1Active || isIter2Active || isSolutionHighlight ? 1.1 : 1})`,
              transition: "all 0.2s ease-out",
            }}>
              {num}
              <div style={{ fontSize: 24, fontWeight: "normal", marginTop: 5, color: isSolutionHighlight ? "#1e1e1e" : "#bbb" }}>[{i}]</div>
            </div>
          );
        })}
      </div>

      {/* Target Display */}
      <div style={{
        position: "absolute",
        top: 350,
        right: (width - arrayDisplayWidth) / 2 - 150, // Positioned right of the array
        backgroundColor: "#8855cc",
        border: "2px solid #a877ee",
        borderRadius: 8,
        width: 120,
        height: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        opacity: interpolate(introduceArrayTargetSegment.progress, [0.5, 0.8], [0, 1], {extrapolateRight: "clamp"}),
        transform: `translateY(${interpolate(introduceArrayTargetSegment.progress, [0, 1], [50, 0])}px)`,
      }}>
        <div style={{ fontSize: 20, fontWeight: "normal", marginBottom: 5 }}>Target</div>
        {target}
      </div>

      {/* Hash Map Display */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        opacity: interpolate(introduceHashMapSegment.progress, [0.3, 0.6], [0, 1]),
        transform: `translateY(${interpolate(introduceHashMapSegment.progress, [0, 1], [50, 0])}px)`,
      }}>
        <div style={{ color: "white", fontSize: 30, marginBottom: 20 }}>Hash Map:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 15, width: 800 }}>
          {mapEntries.map(([key, value], index) => {
            const isIter1Added = iter1Segment.isActive && iter1Segment.progress > 0.8 && parseInt(key) === iter1Value;
            const isIter2Lookup = iter2Segment.isActive && parseInt(key) === iter2Complement;
            const isSolutionHighlight = !iter2Segment.isActive && frame >= iter2Segment.endFrame && parseInt(key) === iter2Complement;

            return (
              <div key={key} style={{
                backgroundColor: isSolutionHighlight ? "#00e676" : (isIter2Lookup ? "#66bb6a" : (isIter1Added ? "#2196f3" : "#333")),
                border: `2px solid ${isSolutionHighlight ? "#00e676" : (isIter2Lookup ? "#66bb6a" : (isIter1Added ? "#2196f3" : "#555"))}`,
                borderRadius: 8,
                padding: "10px 20px",
                color: isSolutionHighlight ? "#1e1e1e" : "white",
                fontSize: 32,
                fontWeight: "bold",
                boxShadow: isSolutionHighlight ? "0 0 20px #00e676" : (isIter2Lookup ? "0 0 15px #66bb6a" : (isIter1Added ? "0 0 15px #2196f3" : "none")),
                transform: `scale(${isIter1Added || isIter2Lookup || isSolutionHighlight ? 1.1 : 1})`,
                transition: "all 0.3s ease-out",
                opacity: interpolate(index, [0, mapEntries.length - 1], [0.5, 1], { extrapolateLeft: "clamp" }), // Simple opacity for appearance
              }}>
                <span style={{ color: isSolutionHighlight ? "#1e1e1e" : "#88ccff" }}>{key}</span>: {value}
              </div>
            );
          })}
        </div>
      </div>

      {/* Iteration 1 Logic */}
      {iter1Segment.isActive && (
        <div style={{ position: "absolute", top: 500, right: 100, width: 600, color: "white", fontSize: 32, textAlign: "left" }}>
          <div style={{ opacity: interpolate(iter1Segment.progress, [0, 0.2], [0, 1]) }}>
            Current: nums[{iter1Index}] = <span style={{ color: "#ffeb3b" }}>{iter1Value}</span>
          </div>
          <div style={{ marginTop: 20, opacity: interpolate(iter1Segment.progress, [0.2, 0.4], [0, 1]) }}>
            Complement = Target - Current
          </div>
          <div style={{ marginTop: 10, opacity: interpolate(iter1Segment.progress, [0.4, 0.6], [0, 1]) }}>
            <span style={{ color: "#ffcc88" }}>{target}</span> - <span style={{ color: "#ffeb3b" }}>{iter1Value}</span> = <span style={{ color: "#66dd66" }}>{iter1Complement}</span>
          </div>
          <div style={{ marginTop: 20, opacity: interpolate(iter1Segment.progress, [0.6, 0.8], [0, 1]) }}>
            Is <span style={{ color: "#66dd66" }}>{iter1Complement}</span> in Hash Map? <span style={{ color: "#ff6666" }}>No</span>
          </div>
          <div style={{ marginTop: 20, opacity: interpolate(iter1Segment.progress, [0.8, 1], [0, 1]) }}>
            Add (<span style={{ color: "#88ccff" }}>{iter1Value}</span>: {iter1Index}) to Hash Map
          </div>
        </div>
      )}

      {/* Iteration 2 Logic */}
      {iter2Segment.isActive && (
        <div style={{ position: "absolute", top: 500, right: 100, width: 600, color: "white", fontSize: 32, textAlign: "left" }}>
          <div style={{ opacity: interpolate(iter2Segment.progress, [0, 0.1], [0, 1]) }}>
            Current: nums[{iter2Index}] = <span style={{ color: "#ffeb3b" }}>{iter2Value}</span>
          </div>
          <div style={{ marginTop: 20, opacity: interpolate(iter2Segment.progress, [0.1, 0.2], [0, 1]) }}>
            Complement = Target - Current
          </div>
          <div style={{ marginTop: 10, opacity: interpolate(iter2Segment.progress, [0.2, 0.3], [0, 1]) }}>
            <span style={{ color: "#ffcc88" }}>{target}</span> - <span style={{ color: "#ffeb3b" }}>{iter2Value}</span> = <span style={{ color: "#66dd66" }}>{iter2Complement}</span>
          </div>
          <div style={{ marginTop: 20, opacity: interpolate(iter2Segment.progress, [0.3, 0.5], [0, 1]) }}>
            Is <span style={{ color: "#66dd66" }}>{iter2Complement}</span> in Hash Map? <span style={{ color: "#00e676" }}>Yes!</span> (found {iter2Complement} at index {iter2MapStatePre[iter2Complement]})
          </div>
          <div style={{ marginTop: 30, opacity: interpolate(iter2Segment.progress, [0.6, 0.8], [0, 1]), fontWeight: "bold", fontSize: 40, color: "#00e676" }}>
            Solution Found: Return [{iter2MapStatePre[iter2Complement]}, {iter2Index}]
          </div>
        </div>
      )}

      {/* Solution found text, visible after iter2Segment ends, until conclusion */}
      {frame >= iter2Segment.endFrame && frame < conclusionSegment.startFrame && (
        <div style={{
          position: "absolute",
          top: 650,
          opacity: 1, // Stays visible until conclusion starts
          color: "#00e676",
          fontSize: 50,
          fontWeight: "bold",
          textAlign: "center",
          transform: `scale(${interpolate(frame, [iter2Segment.endFrame, iter2Segment.endFrame + 15], [1, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "mirror" })})`,
        }}>
          Result: [{iter2MapStatePre[iter2Complement]}, {iter2Index}]
        </div>
      )}

      {/* Conclusion: Complexity */}
      {conclusionSegment.isActive && (
        <div style={{
          position: "absolute",
          top: 400,
          color: "white",
          fontSize: 48,
          textAlign: "center",
          opacity: interpolate(conclusionSegment.progress, [0, 0.5], [0, 1]),
          transform: `translateY(${interpolate(conclusionSegment.progress, [0, 1], [50, 0])}px)`,
        }}>
          <div style={{ color: "#88ccff" }}>Time Complexity: O(n)</div>
          <div style={{ marginTop: 30, color: "#ffcc88" }}>Space Complexity: O(n)</div>
          <div style={{ marginTop: 50, fontSize: 30, color: "#ccc" }}>
            Efficiently solved using a Hash Map!
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const RemotionRoot = () => {
  return (
    <Composition
      id="Video"
      component={TwoSumVisualizer}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
  );
};

registerRoot(RemotionRoot);