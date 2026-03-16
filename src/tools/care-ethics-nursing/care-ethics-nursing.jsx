import rawHtml from "./care-ethics-nursing.html?raw";

export default function CareEthicsNursing() {
  return (
    <iframe
      srcDoc={rawHtml}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="An Ethic of Caring"
    />
  );
}
