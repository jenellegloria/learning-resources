import { useEffect, useRef } from "react";
import rawHtml from "./care-ethics-nursing.html?raw";

export default function CareEthicsNursing() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(rawHtml);
    doc.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="Care Ethics in Nursing"
    />
  );
}
