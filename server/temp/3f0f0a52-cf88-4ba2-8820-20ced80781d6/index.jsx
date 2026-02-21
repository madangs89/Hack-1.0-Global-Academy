import React from "react";
import { registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const durationInFrames = 900;
const fps = 30;
const width = 1920;
const height = 1080;

const TwoSumAnimation = () => {
  const frame = useCurrentFrame();

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    fontSize: 48,
    color: "white",
    backgroundColor: "#1a1a2e",
  };

  const titleStyle = {
    fontSize: 96,
    fontWeight: "bold",
    textAlign: "center",
  };

  const subtitleStyle = {
    fontSize: 60,
    marginTop: 20,
    textAlign: "center",
  };

  const problemTextStyle = {
    fontSize: 36,
    textAlign: "center",
  };

  const constraintsStyle = {
    fontSize: 32,
    marginTop: 20,
    color: "#e45858",
  };

  const arrayContainerStyle = {
    display: "flex",
    gap: 10,
    marginTop: 50,
    justifyContent: "center",
  };

  const arrayCellStyle = {
    width: 100,
    height: 100,
    backgroundColor: "#6246ea",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    border: "2px solid #e45858",
  };

  const arrayCellIndexStyle = {
    fontSize: 24,
    color: "#ffffff80",
  };

  const arrayCellValueStyle = {
    fontSize: 48,
    fontWeight: "bold",
  };

  const targetStyle = {
    fontSize: 48,
    marginTop: 50,
    textAlign: "center",
  };

  const logicBoxStyle = {
    marginTop: 50,
    padding: 30,
    backgroundColor: "#2e2e4a",
    borderRadius: 15,
    border: "2px solid #e45858",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    minWidth: 400,
    minHeight: 150,
    marginLeft: "auto",
    marginRight: "auto",
  };

  const mapContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 50,
    padding: 20,
    backgroundColor: "#2e2e4a",
    borderRadius: 15,
    border: "2px solid #e45858",
    minWidth: 200,
    minHeight: 100,
    alignSelf: "flex-start",
    marginLeft: 100,
  };

  const mapEntryStyle = {
    fontSize: 36,
    color: "white",
  };

  const nums1 = [2, 7, 11, 15];
  const target1 = 9;

  const nums2 = [3, 2, 4];
  const target2 = 6;

  return (
    <AbsoluteFill style={containerStyle}>

      {/* Scene 1: Title & Intro (0-60) */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [0, 30, 30, 60], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ ...titleStyle, marginTop: 300 }}>The Two Sum Problem</div>
        <div style={subtitleStyle}>Using a Hash Map for Optimal Solution</div>
      </AbsoluteFill>

      {/* Scene 2: Problem Statement & Constraints (60-150) */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [60, 90, 120, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ ...logicBoxStyle, marginTop: 250, opacity: 1, transform: "none" }}>
          <div style={{ fontSize: 48, fontWeight: "bold", marginBottom: 20 }}>Problem Statement:</div>
          <div style={problemTextStyle}>
            "Given an array of integers `nums` and an integer `target`,
            <br />
            return indices of the two numbers such that they add up to `target`."
          </div>
          <div style={constraintsStyle}>
            Constraints: Exactly one solution exists. You may not use the same element twice.
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 3: Example 1 Walkthrough (150-360) */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [150, 180, 330, 360], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ ...targetStyle, fontSize: 60, fontWeight: "bold", opacity: interpolate(frame - 150, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          Target: {target1}
        </div>
        <div style={{ ...arrayContainerStyle, opacity: interpolate(frame - 150, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {nums1.map((num, index) => (
            <div
              key={index}
              style={{
                ...arrayCellStyle,
                backgroundColor:
                  (index === 0 && frame >= 180 && frame < 270) || (index === 1 && frame >= 270 && frame < 360)
                    ? "#00b894" 
                    : "#6246ea",
              }}
            >
              <div style={arrayCellIndexStyle}>Index: {index}</div>
              <div style={arrayCellValueStyle}>{num}</div>
            </div>
          ))}
        </div>

        {/* Iteration 1.1: num = 2, index = 0 (180-270) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 50,
          opacity: interpolate(frame - 180, [0, 30, 60, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ ...logicBoxStyle, marginRight: 50, transform: "translateX(" + interpolate(frame - 180, [0, 30], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "px)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>Current Number: <span style={{ color: "#00b894", fontWeight: "bold" }}>{nums1[0]} (Index 0)</span></div>
            <div style={{ fontSize: 36, opacity: interpolate(frame - 180, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Complement: <span style={{ color: "#e45858", fontWeight: "bold" }}>{target1} - {nums1[0]} = {target1 - nums1[0]}</span>
            </div>
            <div style={{ fontSize: 36, marginTop: 10, opacity: interpolate(frame - 180, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Is <span style={{ color: "#e45858", fontWeight: "bold" }}>{target1 - nums1[0]}</span> in map? No.
            </div>
          </div>
          <div style={{ ...mapContainerStyle, opacity: interpolate(frame - 180, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>Hash Map:</div>
            <div style={mapEntryStyle}>Key: 2, Value: 0 <span style={{backgroundColor: "#a29bfe", padding: "3px 8px", borderRadius: 5, fontSize: 28, marginLeft: 10}}>Added</span></div>
          </div>
        </div>

        {/* Iteration 1.2: num = 7, index = 1 (270-360) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 50,
          opacity: interpolate(frame - 270, [0, 30, 60, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ ...logicBoxStyle, marginRight: 50, transform: "translateX(" + interpolate(frame - 270, [0, 30], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "px)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>Current Number: <span style={{ color: "#00b894", fontWeight: "bold" }}>{nums1[1]} (Index 1)</span></div>
            <div style={{ fontSize: 36, opacity: interpolate(frame - 270, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Complement: <span style={{ color: "#e45858", fontWeight: "bold" }}>{target1} - {nums1[1]} = {target1 - nums1[1]}</span>
            </div>
            <div style={{ fontSize: 36, marginTop: 10, opacity: interpolate(frame - 270, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Is <span style={{ color: "#e45858", fontWeight: "bold" }}>{target1 - nums1[1]}</span> in map? <span style={{ color: "#00b894", fontWeight: "bold" }}>Yes!</span>
            </div>
            <div style={{ fontSize: 48, marginTop: 20, opacity: interpolate(frame - 270, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Found indices: <span style={{ color: "#e45858", fontWeight: "bold" }}>[0, 1]</span>
            </div>
          </div>
          <div style={{ ...mapContainerStyle, opacity: 1 }}>
            <div style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>Hash Map:</div>
            <div style={{...mapEntryStyle, backgroundColor: (frame >= 270 && frame < 360) ? "#00b894" : "transparent", padding: "5px 10px", borderRadius: 5}}>Key: 2, Value: 0 <span style={{fontSize: 28, marginLeft: 10}}>Found</span></div>
            <div style={{...mapEntryStyle, opacity: interpolate(frame - 270, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}}>Key: 7, Value: 1 <span style={{backgroundColor: "#a29bfe", padding: "3px 8px", borderRadius: 5, fontSize: 28, marginLeft: 10}}>Added</span></div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 4: Example 2 Walkthrough (390-690) */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [390, 420, 660, 690], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ ...targetStyle, fontSize: 60, fontWeight: "bold", opacity: interpolate(frame - 390, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          Target: {target2}
        </div>
        <div style={{ ...arrayContainerStyle, opacity: interpolate(frame - 390, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {nums2.map((num, index) => (
            <div
              key={index}
              style={{
                ...arrayCellStyle,
                backgroundColor:
                  (index === 0 && frame >= 420 && frame < 510) ||
                  (index === 1 && frame >= 510 && frame < 600) ||
                  (index === 2 && frame >= 600 && frame < 690)
                    ? "#00b894" 
                    : "#6246ea",
              }}
            >
              <div style={arrayCellIndexStyle}>Index: {index}</div>
              <div style={arrayCellValueStyle}>{num}</div>
            </div>
          ))}
        </div>

        {/* Iteration 2.1: num = 3, index = 0 (420-510) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 50,
          opacity: interpolate(frame - 420, [0, 30, 60, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ ...logicBoxStyle, marginRight: 50, transform: "translateX(" + interpolate(frame - 420, [0, 30], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "px)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>Current Number: <span style={{ color: "#00b894", fontWeight: "bold" }}>{nums2[0]} (Index 0)</span></div>
            <div style={{ fontSize: 36, opacity: interpolate(frame - 420, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Complement: <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2} - {nums2[0]} = {target2 - nums2[0]}</span>
            </div>
            <div style={{ fontSize: 36, marginTop: 10, opacity: interpolate(frame - 420, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              Is <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2 - nums2[0]}</span> in map? No.\n            </div>
          </div>
          <div style={{ ...mapContainerStyle, opacity: interpolate(frame - 420, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>Hash Map:</div>
            <div style={mapEntryStyle}>Key: 3, Value: 0 <span style={{backgroundColor: "#a29bfe", padding: "3px 8px", borderRadius: 5, fontSize: 28, marginLeft: 10}}>Added</span></div>
          </div>
        </div>

        {/* Iteration 2.2: num = 2, index = 1 (510-600) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 50,
          opacity: interpolate(frame - 510, [0, 30, 60, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ ...logicBoxStyle, marginRight: 50, transform: "translateX(" + interpolate(frame - 510, [0, 30], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "px)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>Current Number: <span style={{ color: "#00b894", fontWeight: "bold" }}>{nums2[1]} (Index 1)</span></div>\n            <div style={{ fontSize: 36, opacity: interpolate(frame - 510, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>\n              Complement: <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2} - {nums2[1]} = {target2 - nums2[1]}</span>\n            </div>\n            <div style={{ fontSize: 36, marginTop: 10, opacity: interpolate(frame - 510, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>\n              Is <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2 - nums2[1]}</span> in map? No.\n            </div>\n          </div>
          <div style={{ ...mapContainerStyle, opacity: 1 }}>
            <div style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>Hash Map:</div>
            <div style={mapEntryStyle}>Key: 3, Value: 0</div>
            <div style={{...mapEntryStyle, opacity: interpolate(frame - 510, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}}>Key: 2, Value: 1 <span style={{backgroundColor: "#a29bfe", padding: "3px 8px", borderRadius: 5, fontSize: 28, marginLeft: 10}}>Added</span></div>
          </div>
        </div>

        {/* Iteration 2.3: num = 4, index = 2 (600-690) */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: 50,
          opacity: interpolate(frame - 600, [0, 30, 60, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ ...logicBoxStyle, marginRight: 50, transform: "translateX(" + interpolate(frame - 600, [0, 30], [-50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) + "px)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>Current Number: <span style={{ color: "#00b894", fontWeight: "bold" }}>{nums2[2]} (Index 2)</span></div>\n            <div style={{ fontSize: 36, opacity: interpolate(frame - 600, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>\n              Complement: <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2} - {nums2[2]} = {target2 - nums2[2]}</span>\n            </div>\n            <div style={{ fontSize: 36, marginTop: 10, opacity: interpolate(frame - 600, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>\n              Is <span style={{ color: "#e45858", fontWeight: "bold" }}>{target2 - nums2[2]}</span> in map? <span style={{ color: "#00b894", fontWeight: "bold" }}>Yes!</span>\n            </div>\n            <div style={{ fontSize: 48, marginTop: 20, opacity: interpolate(frame - 600, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>\n              Found indices: <span style={{ color: "#e45858", fontWeight: "bold" }}>[1, 2]</span>\n            </div>
          </div>
          <div style={{ ...mapContainerStyle, opacity: 1 }}>
            <div style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>Hash Map:</div>
            <div style={mapEntryStyle}>Key: 3, Value: 0</div>
            <div style={{...mapEntryStyle, backgroundColor: (frame >= 600 && frame < 690) ? "#00b894" : "transparent", padding: "5px 10px", borderRadius: 5}}>Key: 2, Value: 1 <span style={{fontSize: 28, marginLeft: 10}}>Found</span></div>
            <div style={{...mapEntryStyle, opacity: interpolate(frame - 600, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}}>Key: 4, Value: 2 <span style={{backgroundColor: "#a29bfe", padding: "3px 8px", borderRadius: 5, fontSize: 28, marginLeft: 10}}>Added</span></div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene 5: Complexity Analysis (690-900) */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [690, 720], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ ...titleStyle, fontSize: 80, marginTop: 200, opacity: interpolate(frame - 690, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>Complexity Analysis</div>
        <div style={{ ...subtitleStyle, transform: "none", marginTop: 50, opacity: interpolate(frame - 690, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#00b894" }}>Time Complexity: O(n)</div>
          <div style={{ fontSize: 36, marginTop: 20, opacity: interpolate(frame - 690, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            Each number is processed once. Hash map operations (insert, lookup) are O(1) on average.
          </div>
        </div>
        <div style={{ ...subtitleStyle, transform: "none", marginTop: 50, opacity: interpolate(frame - 690, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#a29bfe" }}>Space Complexity: O(n)</div>
          <div style={{ fontSize: 36, marginTop: 20, opacity: interpolate(frame - 690, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            In the worst case, the hash map stores up to N elements (all numbers in `nums`).
          </div>
        </div>
        <div style={{ ...subtitleStyle, transform: "none", marginTop: 50, color: "#e45858", fontSize: 50, fontWeight: "bold", opacity: interpolate(frame - 690, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          This approach is optimal!
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

const RemotionRoot = () => {
  return (
    <Composition
      id="Video"
      component={TwoSumAnimation}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
  );
};

registerRoot(RemotionRoot);