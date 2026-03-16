import { useEffect, useState } from "react";
import htmlContent from "./care-ethics-nursing.html?raw";

export default function CareEthicsNursing() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  if (!src) return null;
  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="Care Ethics in Nursing"
    />
  );
}
